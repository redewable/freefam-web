import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const KEY = 'calendar-events';

// GET — list all upcoming events, sorted by date
export async function GET() {
  try {
    const events = await kv.get(KEY) || [];
    // Sort by date ascending
    events.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — create or update an event
// Body: { id?, title, subtitle, date, time, location, url, buttonLabel, type }
// If id is provided, updates that event. Otherwise creates a new one.
export async function POST(request) {
  try {
    const body = await request.json();
    const events = await kv.get(KEY) || [];

    if (body.id) {
      // Update existing
      const idx = events.findIndex(e => e.id === body.id);
      if (idx === -1) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      events[idx] = { ...events[idx], ...body, updatedAt: new Date().toISOString() };
    } else {
      // Create new
      const id = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      events.push({
        id,
        title: body.title || '',
        subtitle: body.subtitle || '',
        date: body.date || '',
        time: body.time || '',
        location: body.location || '',
        url: body.url || '',
        buttonLabel: body.buttonLabel || 'Details',
        type: body.type || 'upcoming', // 'upcoming' or 'info-session'
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    await kv.set(KEY, events);
    return NextResponse.json({ success: true, events });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — remove an event by id
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Event ID required' }, { status: 400 });

    const events = await kv.get(KEY) || [];
    const filtered = events.filter(e => e.id !== id);
    await kv.set(KEY, filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
