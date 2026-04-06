import Stripe from 'stripe';
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export async function POST(request) {
  try {
    if (!stripe) return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    const body = await request.json();
    const { priceType, customerEmail, customerName, ltdId, uplinePlatinum, source, spouse, dynamicAmount } = body;

    // Fetch event settings for dynamic pricing
    let eventSettings = null;
    try {
      eventSettings = await kv.get('event-settings');
    } catch (e) {}

    // Build line item — use dynamic price_data if amount provided, else fall back to env price IDs
    let lineItem;
    if (dynamicAmount && dynamicAmount > 0) {
      // Dynamic pricing from event settings
      const labelMap = {
        single: 'Single Week Registration',
        monthly: 'Monthly Registration',
        monthly5: 'Monthly Registration (5 weeks)',
        monthlyReduced: eventSettings?.monthlyReducedLabel || 'Monthly Registration (Reduced)',
        webcast: 'Webcast Registration',
      };
      lineItem = {
        price_data: {
          currency: 'usd',
          product_data: {
            name: labelMap[priceType] || 'Registration',
          },
          unit_amount: Math.round(dynamicAmount * 100), // Convert dollars to cents
        },
        quantity: spouse ? 2 : 1,
      };
    } else {
      // Legacy: use fixed Stripe price IDs from env
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
      lineItem = {
        price: priceId,
        quantity: spouse ? 2 : 1,
      };
    }

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
      line_items: [lineItem],
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
