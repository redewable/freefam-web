import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const KEY = 'event-settings';

const DEFAULTS = {
  mainPresenter: '',
  mainDate: '',
  bcsPresenter: '',
  bcsDate: '',
  // Pricing (in dollars)
  singlePrice: 12,
  monthlyPrice: 50,
  monthlyWeeks: 5,
  monthlyReducedPrice: 0,   // 0 = disabled
  monthlyReducedWeeks: 0,
  monthlyReducedLabel: '',   // e.g. "3-Week Monthly (Catch-Up)"
  webcastPrice: 5,
};

export async function GET() {
  try {
    const settings = await kv.get(KEY);
    return NextResponse.json({ ...DEFAULTS, ...settings });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    // Merge with existing settings so partial updates work
    const existing = await kv.get(KEY) || {};
    const settings = { ...existing, ...body, updatedAt: new Date().toISOString() };
    await kv.set(KEY, settings);
    return NextResponse.json({ success: true, ...settings });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
