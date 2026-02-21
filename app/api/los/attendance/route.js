import Stripe from 'stripe';
import { kv } from '@vercel/kv';
import { createClient } from '@/app/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Partner logic: LTD ID 6076043 <-> 60760432
    function getPartnerLtdId(ltdId) {
      if (!ltdId) return null;
      if (ltdId.endsWith('2') && ltdId.length > 1) return ltdId.slice(0, -1);
      return ltdId + '2';
    }

    // Get current user's profile
    const { data: profile } = await supabase.from('profiles').select('ltd_id, role, sponsor_id').eq('id', user.id).single();
    if (!profile) return NextResponse.json({ records: [] });

    // Get all LTD IDs in this user's LOS (self + partner + downline)
    const teamLtdIds = new Set();
    if (profile.ltd_id) {
      teamLtdIds.add(profile.ltd_id);
      const partnerLtd = getPartnerLtdId(profile.ltd_id);
      if (partnerLtd) teamLtdIds.add(partnerLtd);
    }

    // Get direct downline LTD IDs (for both user and partner)
    const sponsorIds = [user.id];

    // Find partner's user ID to include their downline too
    const partnerLtdId = getPartnerLtdId(profile.ltd_id);
    if (partnerLtdId) {
      const { data: partnerProfile } = await supabase
        .from('profiles')
        .select('id, ltd_id')
        .eq('ltd_id', partnerLtdId)
        .single();
      if (partnerProfile) sponsorIds.push(partnerProfile.id);
    }

    const { data: downline } = await supabase
      .from('profiles')
      .select('ltd_id')
      .in('sponsor_id', sponsorIds);

    (downline || []).forEach(d => {
      if (d.ltd_id) {
        teamLtdIds.add(d.ltd_id);
        // Also add each downline member's partner
        const dPartner = getPartnerLtdId(d.ltd_id);
        if (dPartner) teamLtdIds.add(dPartner);
      }
    });

    // If admin, get all profiles
    if (profile.role === 'admin') {
      const { data: allProfiles } = await supabase.from('profiles').select('ltd_id');
      (allProfiles || []).forEach(p => {
        if (p.ltd_id) {
          teamLtdIds.add(p.ltd_id);
          const pPartner = getPartnerLtdId(p.ltd_id);
          if (pPartner) teamLtdIds.add(pPartner);
        }
      });
    }

    if (teamLtdIds.size === 0) return NextResponse.json({ records: [] });

    const records = [];

    // 1. Pull from Stripe (paid registrations with ltdId)
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      let hasMore = true;
      let startingAfter = null;
      let pages = 0;

      while (hasMore && pages < 5) {
        const params = { limit: 100, status: 'complete' };
        if (startingAfter) params.starting_after = startingAfter;

        const sessions = await stripe.checkout.sessions.list(params);

        for (const session of sessions.data) {
          const ltdId = session.metadata?.ltdId;
          if (ltdId && teamLtdIds.has(ltdId)) {
            records.push({
              ltd_id: ltdId,
              name: session.metadata?.customerName || session.customer_details?.name || '',
              event_source: session.metadata?.source || 'main',
              date: new Date(session.created * 1000).toISOString(),
              checked_in: false, // will update below
              registration_id: session.id,
            });
          }
        }

        hasMore = sessions.has_more;
        if (sessions.data.length > 0) startingAfter = sessions.data[sessions.data.length - 1].id;
        pages++;
      }
    } catch (stripeErr) {
      console.error('Stripe attendance error:', stripeErr.message);
    }

    // 2. Pull from KV (free registrations - guests/apprentices with ltdId)
    try {
      const keys = await kv.keys('registration:free_*');
      if (keys && keys.length > 0) {
        const regs = await Promise.all(keys.map(key => kv.get(key)));
        for (const reg of regs) {
          if (!reg || !reg.ltdId || !teamLtdIds.has(reg.ltdId)) continue;
          records.push({
            ltd_id: reg.ltdId,
            name: reg.name || '',
            event_source: reg.source || 'main',
            date: reg.createdAt || '',
            checked_in: false,
            registration_id: reg.id,
          });
        }
      }
    } catch (kvErr) {
      console.error('KV attendance error:', kvErr.message);
    }

    // 3. Check check-in status for each record
    for (const rec of records) {
      try {
        // Derive the week key from the registration date
        const regDate = new Date(rec.date);
        const day = regDate.getDay();
        const monday = new Date(regDate);
        monday.setDate(regDate.getDate() - day + (day === 0 ? -6 : 1));
        monday.setHours(0, 0, 0, 0);
        const weekKey = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;

        const checkinKey = `checkin:week:${weekKey}:${rec.registration_id}`;
        const status = await kv.get(checkinKey);
        if (status?.checkedIn) {
          rec.checked_in = true;
        }
      } catch (e) {
        // Ignore
      }
    }

    // Sort by date descending
    records.sort((a, b) => new Date(b.date) - new Date(a.date));

    return NextResponse.json({ records });
  } catch (error) {
    console.error('Attendance error:', error);
    return NextResponse.json({ error: error.message, records: [] }, { status: 500 });
  }
}
