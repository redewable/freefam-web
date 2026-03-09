import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const KEY = 'event-settings';

export async function GET() {
  try {
    const settings = await kv.get(KEY);
    return NextResponse.json(settings || {
      mainPresenter: '',
      mainDate: '',
      bcsPresenter: '',
      bcsDate: '',
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { mainPresenter, mainDate, bcsPresenter, bcsDate } = body;
    const settings = { mainPresenter, mainDate, bcsPresenter, bcsDate, updatedAt: new Date().toISOString() };
    await kv.set(KEY, settings);
    return NextResponse.json({ success: true, ...settings });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
