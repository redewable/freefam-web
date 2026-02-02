import Stripe from 'stripe';
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(request) {
  try {
    // Get query params for filtering
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all'; // 'all', 'single', 'monthly'
    
    // Fetch recent successful payments from Stripe
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      status: 'complete',
      expand: ['data.customer_details', 'data.line_items'],
    });

    // Get all check-in statuses from KV
    const checkinKeys = await kv.keys('checkin:*');
    const checkinStatuses = {};
    for (const key of checkinKeys) {
      const sessionId = key.replace('checkin:', '');
      checkinStatuses[sessionId] = await kv.get(key);
    }

    // Format the registrations
    const registrations = sessions.data
      .filter(session => {
        // Filter by price type if specified
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
        amount: session.amount_total / 100,
        date: new Date(session.created * 1000).toLocaleDateString(),
        checkedIn: checkinStatuses[session.id] || false,
        checkedInAt: checkinStatuses[session.id]?.timestamp || null,
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