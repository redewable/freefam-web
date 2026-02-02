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
    let paidRegs = [];
    try {
      const sessions = await stripe.checkout.sessions.list({
        limit: 100,
        status: 'complete',
      });
      
      paidRegs = sessions.data.map(session => ({
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
      }));
    } catch (stripeError) {
      console.error('Stripe error:', stripeError.message);
    }

    // 2. Fetch free registrations from KV
    let freeRegs = [];
    try {
      // Get all keys that match registration:free_*
      const keys = await kv.keys('registration:free_*');
      console.log('Found registration keys:', keys);
      
      if (keys && keys.length > 0) {
        // Fetch all registrations in parallel
        const registrations = await Promise.all(
          keys.map(key => kv.get(key))
        );
        
        freeRegs = registrations
          .filter(reg => reg !== null)
          .map(reg => ({
            id: reg.id,
            name: reg.name,
            email: reg.email,
            ltdId: reg.ltdId || '',
            uplinePlatinum: reg.uplinePlatinum || '',
            priceType: reg.type, // guest or apprentice
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
      
      console.log('Free registrations found:', freeRegs.length);
    } catch (kvError) {
      console.error('KV error:', kvError.message);
    }

    // 3. Get check-in statuses
    const weekKey = getWeekKey();
    const monthKey = getMonthKey();
    
    // Update check-in status for all registrations
    const allRegs = [...paidRegs, ...freeRegs];
    
    for (const reg of allRegs) {
      try {
        const isMonthly = reg.priceType === 'monthly';
        const periodKey = isMonthly ? monthKey : weekKey;
        const keyPrefix = isMonthly ? 'month' : 'week';
        const key = `checkin:${keyPrefix}:${periodKey}:${reg.id}`;
        
        const status = await kv.get(key);
        if (status?.checkedIn) {
          reg.checkedIn = true;
          reg.checkedInAt = status.timestamp;
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
      }
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json({ error: error.message, registrations: [] }, { status: 500 });
  }
}