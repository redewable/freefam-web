import Stripe from 'stripe';
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// Use CST (America/Chicago) for all date calculations
const getCSTDate = () => {
  const now = new Date();
  return new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
};

// Returns the Monday of the current week (for week key / check-in purposes)
const getWeekStart = () => {
  const now = getCSTDate();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(now.getFullYear(), now.getMonth(), diff, 0, 0, 0);
};

// Returns the previous Tuesday at midnight — the registration visibility window
// Meeting is Monday, so we want to see anyone who registered since the day after last meeting
const getRegistrationCutoff = () => {
  const monday = getWeekStart();
  const prevTuesday = new Date(monday);
  prevTuesday.setDate(monday.getDate() - 6); // Monday minus 6 = previous Tuesday
  prevTuesday.setHours(0, 0, 0, 0);
  return prevTuesday;
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
    if (!stripe) return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';

    const weekStart = getWeekStart();
    const registrationCutoff = getRegistrationCutoff();
    const monthStart = getMonthStart();
    const weekKey = getWeekKey();

    // 1. Fetch paid registrations from Stripe
    let paidRegs = [];
    try {
      const sessions = await stripe.checkout.sessions.list({
        limit: 100,
        status: 'complete',
      });

      const rawPaid = sessions.data
        .map(session => {
          const entries = [];
          const base = {
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
          };
          entries.push(base);

          // If spouse metadata exists, create a second entry
          if (session.metadata?.spouseName) {
            entries.push({
              ...base,
              id: `${session.id}_spouse`,
              name: session.metadata.spouseName,
              ltdId: session.metadata.spouseLtdId || '',
              isSpouse: true,
            });
          }
          return entries;
        })
        .flat();

      paidRegs = rawPaid.filter(reg => {
          const created = new Date(reg.createdAt);
          // Single tickets: show if purchased since previous Tuesday
          if (reg.priceType === 'single') return created >= registrationCutoff;
          // Monthly/monthly5 tickets: show if purchased this month
          if (reg.priceType === 'monthly' || reg.priceType === 'monthly5') return created >= monthStart;
          return created >= registrationCutoff;
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
            // Show guests/apprentices registered since previous Tuesday
            const created = new Date(reg.createdAt);
            return created >= registrationCutoff;
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

    // 3. Get check-in statuses
    const allRegs = [...paidRegs, ...freeRegs];

    // Build a set of IDs that were checked in at last week's meeting
    // Using history set (365-day TTL) instead of check-in keys (which expire end-of-week)
    const prevMonday = new Date(weekStart);
    prevMonday.setDate(prevMonday.getDate() - 7);
    const prevWeekKey = `${prevMonday.getFullYear()}-${String(prevMonday.getMonth() + 1).padStart(2, '0')}-${String(prevMonday.getDate()).padStart(2, '0')}`;
    const prevHistoryKey = `history:${prevWeekKey}`;
    const prevCheckedInIds = new Set();
    try {
      const prevHistory = await kv.smembers(prevHistoryKey) || [];
      for (const item of prevHistory) {
        try {
          const parsed = typeof item === 'string' ? JSON.parse(item) : item;
          if (parsed.id) prevCheckedInIds.add(parsed.id);
        } catch (e) {}
      }
    } catch (e) {}

    for (const reg of allRegs) {
      try {
        const checkinKey = `checkin:week:${weekKey}:${reg.id}`;
        const status = await kv.get(checkinKey);
        if (status?.checkedIn) {
          reg.checkedIn = true;
          reg.checkedInAt = status.timestamp;
        } else if (status?.noShow) {
          reg.noShow = true;
        } else if (prevCheckedInIds.has(reg.id)) {
          // Was checked in at last week's meeting — don't show again
          reg.checkedInPrevWeek = true;
        }
      } catch (e) {}
    }

    // Remove anyone already checked in during the previous week's meeting
    const visibleRegs = allRegs.filter(r => !r.checkedInPrevWeek);

    // 4. Filter if needed
    let filtered = visibleRegs;
    if (filter !== 'all') {
      if (filter === 'ibo') filtered = visibleRegs.filter(r => r.type === 'ibo');
      else if (filter === 'apprentice') filtered = visibleRegs.filter(r => r.type === 'apprentice');
      else if (filter === 'guest') filtered = visibleRegs.filter(r => r.type === 'guest');
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
