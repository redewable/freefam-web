import Stripe from 'stripe';
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getWeekKey = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.getFullYear(), now.getMonth(), diff);
  return monday.toISOString().split('T')[0];
};

const getMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    
    // 1. Fetch paid registrations from Stripe
    let sessions = { data: [] };
    try {
      sessions = await stripe.checkout.sessions.list({
        limit: 100,
        status: 'complete',
      });
    } catch (e) {
      console.error('Stripe error:', e);
    }

    // 2. Fetch free registrations from KV using keys pattern
    const freeRegistrations = [];
    try {
      const keys = await kv.keys('registration:free_*');
      console.log('Found free registration keys:', keys);
      for (const key of keys) {
        const reg = await kv.get(key);
        if (reg) {
          console.log('Found registration:', reg);
          freeRegistrations.push(reg);
        }
      }
    } catch (e) {
      console.error('KV keys error:', e);
      // Fallback to list method
      try {
        const freeIds = await kv.lrange('registrations:list', 0, -1) || [];
        console.log('Fallback - found IDs:', freeIds);
        for (const id of freeIds) {
          const reg = await kv.get(`registration:${id}`);
          if (reg) freeRegistrations.push(reg);
        }
      } catch (e2) {
        console.error('KV list error:', e2);
      }
    }

    // 3. Get check-in statuses
    const weekKey = getWeekKey();
    const monthKey = getMonthKey();
    const checkinStatuses = {};

    for (const session of sessions.data) {
      const priceType = session.metadata?.priceType || 'single';
      const periodKey = priceType === 'monthly' ? monthKey : weekKey;
      const keyPrefix = priceType === 'monthly' ? 'month' : 'week';
      const key = `checkin:${keyPrefix}:${periodKey}:${session.id}`;
      try {
        const status = await kv.get(key);
        if (status) checkinStatuses[session.id] = status;
      } catch (e) {}
    }

    for (const reg of freeRegistrations) {
      const key = `checkin:week:${weekKey}:${reg.id}`;
      try {
        const status = await kv.get(key);
        if (status) checkinStatuses[reg.id] = status;
      } catch (e) {}
    }

    // 4. Format paid registrations
    const paidRegs = sessions.data.map(session => ({
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
      checkedIn: checkinStatuses[session.id]?.checkedIn || false,
      checkedInAt: checkinStatuses[session.id]?.timestamp || null,
    }));

    // 5. Format free registrations
    const freeRegs = freeRegistrations.map(reg => ({
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
      checkedIn: checkinStatuses[reg.id]?.checkedIn || false,
      checkedInAt: checkinStatuses[reg.id]?.timestamp || null,
    }));

    let all = [...paidRegs, ...freeRegs];
    console.log('Total registrations:', all.length, 'Paid:', paidRegs.length, 'Free:', freeRegs.length);

    if (filter !== 'all') {
      if (filter === 'ibo') all = all.filter(r => r.type === 'ibo');
      else if (filter === 'apprentice') all = all.filter(r => r.type === 'apprentice');
      else if (filter === 'guest') all = all.filter(r => r.type === 'guest');
    }

    all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({ registrations: all });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}