import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export async function POST(request) {
  try {
    if (!stripe) return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    const body = await request.json();
    const { priceType, customerEmail, customerName, ltdId, uplinePlatinum, source, spouse } = body;

    // Select the correct price ID
    let priceId;
    if (priceType === 'monthly') {
      priceId = process.env.STRIPE_PRICE_MONTHLY;
    } else if (priceType === 'monthly5') {
      priceId = process.env.STRIPE_PRICE_MONTHLY_5WK;
    } else if (priceType === 'webcast') {
      priceId = process.env.STRIPE_PRICE_WEBCAST;
    } else {
      priceId = process.env.STRIPE_PRICE_SINGLE;
    }

    // Quantity: 2 if registering spouse
    const quantity = spouse ? 2 : 1;

    // Determine return URL based on source
    const origin = request.headers.get('origin');
    const isWebcast = priceType === 'webcast';
    const returnPath = source === 'bcs' || source === 'webcast' ? '/bcs' : '';
    const successParams = isWebcast
      ? `success=true&webcast=true&session_id={CHECKOUT_SESSION_ID}`
      : `success=true&session_id={CHECKOUT_SESSION_ID}`;

    // Build metadata (Stripe metadata values must be strings, max 500 chars)
    const metadata = {
      customerName,
      ltdId,
      uplinePlatinum,
      priceType,
      source: isWebcast ? 'webcast' : (source || 'main'),
    };

    if (spouse) {
      metadata.spouseName = spouse.name;
      metadata.spouseLtdId = spouse.ltdId;
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customerEmail,
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      metadata,
      success_url: `${origin}${returnPath}?${successParams}`,
      cancel_url: `${origin}${returnPath}?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}