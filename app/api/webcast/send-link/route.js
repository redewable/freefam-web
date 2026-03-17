import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import { sendWebcastLink } from '@/app/lib/email';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const zoomLink = await kv.get('webcast:zoom-link');
    if (!zoomLink) {
      return NextResponse.json({ error: 'No Zoom link configured' }, { status: 404 });
    }

    const result = await sendWebcastLink({ to: email, name: name || '', zoomLink });

    return NextResponse.json({
      success: result.success,
      reason: result.reason || null,
    });
  } catch (error) {
    console.error('Send webcast link error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
