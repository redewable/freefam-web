import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// GET - Fetch receipt for a Stripe session
export async function GET(request) {
  try {
    if (!stripe) return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'session_id is required' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.status !== 'complete') {
      return NextResponse.json({ error: 'Receipt not found or payment incomplete.' }, { status: 404 });
    }

    const meta = session.metadata || {};

    return NextResponse.json({
      sessionId: session.id,
      date: new Date(session.created * 1000).toISOString(),
      name: meta.customerName || session.customer_details?.name || 'Unknown',
      email: session.customer_details?.email || '',
      ltdId: meta.ltdId || '',
      amount: session.amount_total ? (session.amount_total / 100).toFixed(2) : '0.00',
      priceType: meta.priceType || 'single',
      source: meta.source || 'main',
    });
  } catch (error) {
    console.error('Receipt API error:', error);
    return NextResponse.json({ error: 'Unable to load receipt.' }, { status: 500 });
  }
}
