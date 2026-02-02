import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { priceType, customerEmail, customerName, ltdId, uplinePlatinum, source } = body;

    // Select the correct price ID
    const priceId = priceType === 'monthly' 
      ? process.env.STRIPE_PRICE_MONTHLY 
      : process.env.STRIPE_PRICE_SINGLE;

    // Determine return URL based on source
    const origin = request.headers.get('origin');
    const returnPath = source === 'bcs' ? '/bcs' : '';

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        customerName,
        ltdId,
        uplinePlatinum,
        priceType,
        source: source || 'main',
      },
      success_url: `${origin}${returnPath}?success=true&session_id={CHECKOUT_SESSION_ID}`,
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