import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const ZOOM_LINK_KEY = 'webcast:zoom-link';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const sessionId = searchParams.get('session_id');
    const email = searchParams.get('email');

    let verified = false;

    // 1. Token-based lookup
    if (token) {
      const tokenData = await kv.get(`webcast-token:${token}`);
      if (tokenData) verified = true;
    }

    // 2. Stripe session_id lookup (paid webcast IBOs)
    if (!verified && sessionId) {
      const Stripe = (await import('stripe')).default;
      if (process.env.STRIPE_SECRET_KEY) {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        try {
          const session = await stripe.checkout.sessions.retrieve(sessionId);
          if (session && session.payment_status === 'paid') {
            // Check if it's a webcast purchase by metadata or line items
            const source = session.metadata?.source;
            if (source === 'webcast') {
              verified = true;
            } else {
              // Fallback: check line items for webcast price
              const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
              const webcastPrice = process.env.STRIPE_PRICE_WEBCAST;
              if (webcastPrice && lineItems.data.some(li => li.price?.id === webcastPrice)) {
                verified = true;
              }
            }
          }
        } catch (e) {
          // Invalid session ID
        }
      }
    }

    // 3. Email-based lookup
    if (!verified && email) {
      const normalizedEmail = email.toLowerCase().trim();
      const tokens = await kv.get(`webcast-email:${normalizedEmail}`);
      if (tokens && tokens.length > 0) {
        verified = true;
      }
    }

    if (!verified) {
      return NextResponse.json({ link: null, error: 'Not found' }, { status: 404 });
    }

    // Retrieve the current Zoom link
    const link = await kv.get(ZOOM_LINK_KEY);
    return NextResponse.json({ link: link || null });
  } catch (error) {
    console.error('Webcast verify error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
