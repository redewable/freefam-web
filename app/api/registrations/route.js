import Stripe from 'stripe';
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Use CST (America/Chicago) for all date calculations
const getCSTDate = () => {
  const now = new Date();
  return new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
};

const getWeekStart = () => {
  const now = getCSTDate();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(now.getFullYear(), now.getMonth(), diff, 0, 0, 0);
};

const getMonthStart = () => {
  const now = getCSTDate();
  return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
};

const getWeekKey = () => {
  const monday = getWeekStart();
  return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';

    const weekStart = getWeekStart();
    const monthStart = getMonthStart();
    const weekKey = getWeekKey();

    // 1. Fetch paid registrations from Stripe
    let paidRegs = [];
    try {
      const sessions = await stripe.checkout.sessions.list({
        limit: 100,
        status: 'complete',
      });

      paidRegs = sessions.data
        .map(session => ({
          id: session.id,
          name: session.metadata?.customerName || session.customer_details?.name || 'Unknown',
          email: session.customer_details?.email || 'Unknown',
          ltdId: session.metadata?.ltdId || '',
          uplinePlatinum: session.metadata?.uplinePlatinum || '',
          priceType: session.metadata?.priceType || 'single',
          type: 'ibo',
          source: session.metadata?.source || 'main',
          amount: session.amount_total / 100,
          date: new Date(session.created * 1000).toLocaleDateString(),
          createdAt: new Date(session.created * 1000).toISOString(),
          checkedIn: false,
          visitNumber: '',
        }))
        .filter(reg => {
          const created = new Date(reg.createdAt);
          // Single tickets: only show if purchased this week
          if (reg.priceType === 'single') return created >= weekStart;
          // Monthly tickets: show if purchased this month
          if (reg.priceType === 'monthly') return created >= monthStart;
          return created >= weekStart;
        });
    } catch (stripeError) {
      console.error('Stripe error:', stripeError.message);
    }

    // 2. Fetch free registrations from KV (guests & apprentices)
    let freeRegs = [];
    try {
      const keys = await kv.keys('registration:free_*');

      if (keys && keys.length > 0) {
        const registrations = await Promise.all(
          keys.map(key => kv.get(key))
        );

        freeRegs = registrations
          .filter(reg => reg !== null)
          .filter(reg => {
            // Only show guests/apprentices registered this week
            const created = new Date(reg.createdAt);
            return created >= weekStart;
          })
          .map(reg => ({
            id: reg.id,
            name: reg.name,
            email: reg.email,
            ltdId: reg.ltdId || '',
            uplinePlatinum: reg.uplinePlatinum || '',
            priceType: reg.type,
            type: reg.type,
            invitedBy: reg.invitedBy || '',
            visitNumber: reg.visitNumber || '',
            source: reg.source || 'main',
            amount: 0,
            date: new Date(reg.createdAt).toLocaleDateString(),
            createdAt: reg.createdAt,
            checkedIn: false,
          }));
      }
    } catch (kvError) {
      console.error('KV error:', kvError.message);
    }

    // 3. Get check-in statuses (all use weekly keys now)
    const allRegs = [...paidRegs, ...freeRegs];

    for (const reg of allRegs) {
      try {
        const checkinKey = `checkin:week:${weekKey}:${reg.id}`;
        const status = await kv.get(checkinKey);
        if (status?.checkedIn) {
          reg.checkedIn = true;
          reg.checkedInAt = status.timestamp;
        } else if (status?.noShow) {
          reg.noShow = true;
        }
      } catch (e) {
        // Ignore check-in fetch errors
      }
    }

    // 4. Filter if needed
    let filtered = allRegs;
    if (filter !== 'all') {
      if (filter === 'ibo') filtered = allRegs.filter(r => r.type === 'ibo');
      else if (filter === 'apprentice') filtered = allRegs.filter(r => r.type === 'apprentice');
      else if (filter === 'guest') filtered = allRegs.filter(r => r.type === 'guest');
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({
      registrations: filtered,
      debug: {
        paidCount: paidRegs.length,
        freeCount: freeRegs.length,
        totalCount: filtered.length,
        weekStart: weekStart.toISOString(),
        weekKey,
      }
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json({ error: error.message, registrations: [] }, { status: 500 });
  }
}
