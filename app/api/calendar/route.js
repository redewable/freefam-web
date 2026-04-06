import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const KEY = 'calendar-events';

// GET — list all events in stored order (manual sort)
export async function GET() {
  try {
    const events = await kv.get(KEY) || [];
    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — create, update, or reorder events
// Body: { id?, title, subtitle, date, time, location, url, buttonLabel, type, highlight? }
// Special: { action: 'reorder', id, direction: 'up'|'down' }
export async function POST(request) {
  try {
    const body = await request.json();
    const events = await kv.get(KEY) || [];

    // Reorder action
    if (body.action === 'reorder') {
      const idx = events.findIndex(e => e.id === body.id);
      if (idx === -1) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      // Find swap target within the same type
      const evtType = events[idx].type;
      if (body.direction === 'up') {
        for (let i = idx - 1; i >= 0; i--) {
          if (events[i].type === evtType) {
            [events[i], events[idx]] = [events[idx], events[i]];
            break;
          }
        }
      } else {
        for (let i = idx + 1; i < events.length; i++) {
          if (events[i].type === evtType) {
            [events[i], events[idx]] = [events[idx], events[i]];
            break;
          }
        }
      }
      await kv.set(KEY, events);
      return NextResponse.json({ success: true, events });
    }

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
        type: body.type || 'upcoming',
        highlight: body.highlight || false,
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
