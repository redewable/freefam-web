import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getPartnerLtdId } from '@/app/lib/partner';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Service-role client
function getServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  );
}

// GET - Fetch user's events
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const overrideLtdId = searchParams.get('ltdId'); // Leadership override

    // Get current user
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get user's profile for LTD ID
    const serviceClient = getServiceClient();
    const { data: profile } = await serviceClient
      .from('profiles')
      .select('ltd_id, full_name, role')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Determine which LTD ID to look up
    let targetLtdId = profile.ltd_id;
    if (overrideLtdId && profile.role === 'admin') {
      targetLtdId = overrideLtdId;
    }

    // Also get partner LTD ID
    const partnerLtdId = getPartnerLtdId(targetLtdId);

    // Fetch Stripe checkout sessions for this user
    const events = [];
    let hasMore = true;
    let startingAfter = null;

    while (hasMore) {
      const params = { limit: 100, status: 'complete' };
      if (startingAfter) params.starting_after = startingAfter;

      const sessions = await stripe.checkout.sessions.list(params);

      for (const session of sessions.data) {
        const meta = session.metadata || {};
        const sessionLtdId = meta.ltdId || '';

        // Match by LTD ID (either primary or partner)
        if (sessionLtdId === targetLtdId || sessionLtdId === partnerLtdId) {
          events.push({
            id: session.id,
            date: new Date(session.created * 1000).toISOString(),
            name: meta.customerName || session.customer_details?.name || 'Unknown',
            email: session.customer_details?.email || '',
            ltdId: sessionLtdId,
            amount: session.amount_total ? (session.amount_total / 100).toFixed(2) : '0.00',
            priceType: meta.priceType || 'single',
            source: meta.source || 'main',
            attended: false, // Will check below
          });
        }
      }

      hasMore = sessions.has_more;
      if (sessions.data.length > 0) {
        startingAfter = sessions.data[sessions.data.length - 1].id;
      } else {
        hasMore = false;
      }
    }

    // Check attendance from history records
    const historyKeys = await kv.keys('history:*') || [];
    for (const key of historyKeys) {
      const items = await kv.smembers(key) || [];
      for (const item of items) {
        let parsed;
        try { parsed = typeof item === 'string' ? JSON.parse(item) : item; } catch { continue; }
        const itemLtdId = parsed.ltdId || '';
        if (itemLtdId === targetLtdId || itemLtdId === partnerLtdId) {
          // Mark matching events as attended
          const meetingDate = key.replace('history:', '');
          for (const evt of events) {
            const evtDate = evt.date.split('T')[0];
            // Match if same week (within 7 days)
            const evtD = new Date(evtDate);
            const meetD = new Date(meetingDate);
            const diff = Math.abs(evtD - meetD) / (1000 * 60 * 60 * 24);
            if (diff <= 7) {
              evt.attended = true;
              evt.meetingDate = meetingDate;
            }
          }
        }
      }
    }

    // Sort newest first
    events.sort((a, b) => new Date(b.date) - new Date(a.date));

    return NextResponse.json({ events, ltdId: targetLtdId });
  } catch (error) {
    console.error('My Events error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Partner LTD ID logic imported from @/app/lib/partner
