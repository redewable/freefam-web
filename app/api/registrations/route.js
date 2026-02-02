import Stripe from 'stripe';
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Get the start of the current week (Monday)
const getWeekKey = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
};

// Get the current month key
const getMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export async function GET(request) {
  try {
    // Get query params for filtering
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    
    // Fetch recent successful payments from Stripe
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      status: 'complete',
      expand: ['data.customer_details', 'data.line_items'],
    });

    // Get current period keys
    const weekKey = getWeekKey();
    const monthKey = getMonthKey();
    
    // Get check-in statuses for each session
    const checkinStatuses = {};
    for (const session of sessions.data) {
      const priceType = session.metadata?.priceType || 'single';
      
      // Check the appropriate key based on price type
      const periodKey = priceType === 'monthly' ? monthKey : weekKey;
      const keyPrefix = priceType === 'monthly' ? 'month' : 'week';
      const key = `checkin:${keyPrefix}:${periodKey}:${session.id}`;
      
      try {
        const status = await kv.get(key);
        if (status) {
          checkinStatuses[session.id] = status;
        }
      } catch (e) {
        // Key doesn't exist
      }
    }

    // Format the registrations
    const registrations = sessions.data
      .filter(session => {
        if (filter === 'all') return true;
        return session.metadata?.priceType === filter;
      })
      .map(session => ({
        id: session.id,
        name: session.metadata?.customerName || session.customer_details?.name || 'Unknown',
        email: session.customer_details?.email || 'Unknown',
        ltdId: session.metadata?.ltdId || '',
        uplinePlatinum: session.metadata?.uplinePlatinum || '',
        priceType: session.metadata?.priceType || 'single',
        source: session.metadata?.source || 'main', // Track if from BCS or main page
        amount: session.amount_total / 100,
        date: new Date(session.created * 1000).toLocaleDateString(),
        checkedIn: checkinStatuses[session.id]?.checkedIn || false,
        checkinTimestamp: checkinStatuses[session.id]?.timestamp || null,
      }));

    return NextResponse.json({ registrations });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}