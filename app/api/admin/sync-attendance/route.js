import Stripe from 'stripe';
import { kv } from '@vercel/kv';
import { createClient } from '@/app/lib/supabase/server';
import { NextResponse } from 'next/server';

// Sync attendance history records with LTD IDs from Stripe and Supabase profiles
// This allows retroactive pairing of check-ins with LOS members
export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // 1. Build a map of Stripe session IDs → ltdId from Stripe
    const stripeMap = new Map(); // sessionId -> { ltdId, name }
    let hasMore = true;
    let startingAfter = null;
    let pages = 0;

    while (hasMore && pages < 10) {
      const params = { limit: 100, status: 'complete' };
      if (startingAfter) params.starting_after = startingAfter;
      const sessions = await stripe.checkout.sessions.list(params);

      for (const session of sessions.data) {
        const ltdId = session.metadata?.ltdId;
        if (ltdId) {
          stripeMap.set(session.id, {
            ltdId,
            name: session.metadata?.customerName || session.customer_details?.name || '',
          });
        }
      }

      hasMore = sessions.has_more;
      if (sessions.data.length > 0) startingAfter = sessions.data[sessions.data.length - 1].id;
      pages++;
    }

    // 2. Build a map of names → ltdId from Supabase profiles (for matching manual entries)
    const { data: allProfiles } = await supabase.from('profiles').select('full_name, ltd_id');
    const nameToLtd = new Map();
    for (const p of (allProfiles || [])) {
      if (p.full_name && p.ltd_id) {
        nameToLtd.set(p.full_name.toLowerCase().trim(), p.ltd_id);
      }
    }

    // 3. Also build KV free registration map
    const freeRegMap = new Map();
    try {
      const keys = await kv.keys('registration:free_*');
      if (keys && keys.length > 0) {
        const regs = await Promise.all(keys.map(key => kv.get(key)));
        for (const reg of regs) {
          if (reg && reg.id && reg.ltdId) {
            freeRegMap.set(reg.id, { ltdId: reg.ltdId, name: reg.name || '' });
          }
        }
      }
    } catch (e) {
      console.error('Error loading free registrations:', e);
    }

    // 4. Get all history dates
    let dates = new Set();
    try {
      const indexDates = await kv.smembers('history:dates') || [];
      indexDates.forEach(d => dates.add(d));
    } catch (e) {}

    try {
      const keys = await kv.keys('history:*') || [];
      keys.forEach(k => {
        const d = k.replace('history:', '');
        if (/^\d{4}-\d{2}-\d{2}$/.test(d)) dates.add(d);
      });
    } catch (e) {}

    let totalUpdated = 0;
    let totalScanned = 0;
    const details = [];

    // 5. Process each history date
    for (const date of dates) {
      const historyKey = `history:${date}`;
      const items = await kv.smembers(historyKey) || [];
      let dateUpdated = 0;

      for (const item of items) {
        totalScanned++;
        let parsed;
        try {
          parsed = typeof item === 'string' ? JSON.parse(item) : item;
        } catch (e) { continue; }

        // Skip if already has ltdId
        if (parsed.ltdId) continue;

        let ltdId = null;

        // Try Stripe lookup first
        if (parsed.id && stripeMap.has(parsed.id)) {
          ltdId = stripeMap.get(parsed.id).ltdId;
        }
        // Try free registration lookup
        else if (parsed.id && freeRegMap.has(parsed.id)) {
          ltdId = freeRegMap.get(parsed.id).ltdId;
        }
        // Try name match as fallback
        else if (parsed.name) {
          ltdId = nameToLtd.get(parsed.name.toLowerCase().trim()) || null;
        }

        if (ltdId) {
          // Remove old entry, add updated one with ltdId
          const updatedEntry = { ...parsed, ltdId };
          await kv.srem(historyKey, item);
          await kv.sadd(historyKey, JSON.stringify(updatedEntry));
          totalUpdated++;
          dateUpdated++;
        }
      }

      if (dateUpdated > 0) {
        await kv.expire(historyKey, 365 * 24 * 60 * 60);
        details.push({ date, updated: dateUpdated });
      }
    }

    return NextResponse.json({
      success: true,
      totalScanned,
      totalUpdated,
      stripeSessions: stripeMap.size,
      freeRegistrations: freeRegMap.size,
      profiles: nameToLtd.size,
      dates: dates.size,
      details,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET — check sync status (how many records are missing ltdId)
export async function GET() {
  try {
    let dates = new Set();
    try {
      const indexDates = await kv.smembers('history:dates') || [];
      indexDates.forEach(d => dates.add(d));
    } catch (e) {}

    let totalRecords = 0;
    let withLtdId = 0;
    let withoutLtdId = 0;

    for (const date of dates) {
      const historyKey = `history:${date}`;
      const items = await kv.smembers(historyKey) || [];

      for (const item of items) {
        totalRecords++;
        try {
          const parsed = typeof item === 'string' ? JSON.parse(item) : item;
          if (parsed.ltdId) withLtdId++;
          else withoutLtdId++;
        } catch (e) {
          withoutLtdId++;
        }
      }
    }

    return NextResponse.json({
      totalRecords,
      withLtdId,
      withoutLtdId,
      syncPercentage: totalRecords > 0 ? Math.round((withLtdId / totalRecords) * 100) : 100,
      dates: dates.size,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
