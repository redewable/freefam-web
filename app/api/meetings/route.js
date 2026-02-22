import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// POST - Manual meeting edits (add/remove attendees, delete meetings)
export async function POST(request) {
  try {
    const body = await request.json();
    const { action, date, attendee } = body;

    if (!action || !date) {
      return NextResponse.json({ error: 'Action and date required' }, { status: 400 });
    }

    const historyKey = `history:${date}`;

    if (action === 'add-attendee') {
      if (!attendee || !attendee.name) {
        return NextResponse.json({ error: 'Attendee name required' }, { status: 400 });
      }

      const entry = {
        id: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        name: attendee.name,
        type: attendee.type || 'ibo',
        priceType: attendee.priceType || 'manual',
        visitNumber: attendee.visitNumber || '',
        ltdId: attendee.ltdId || '',
        timestamp: new Date().toISOString(),
        manual: true,
      };

      await kv.sadd(historyKey, JSON.stringify(entry));
      await kv.expire(historyKey, 365 * 24 * 60 * 60);
      await kv.sadd('history:dates', date);
      await kv.expire('history:dates', 365 * 24 * 60 * 60);

      return NextResponse.json({ success: true, entry });

    } else if (action === 'remove-attendee') {
      if (!attendee || !attendee.id) {
        return NextResponse.json({ error: 'Attendee ID required' }, { status: 400 });
      }

      const items = await kv.smembers(historyKey) || [];
      for (const item of items) {
        try {
          const parsed = typeof item === 'string' ? JSON.parse(item) : item;
          if (parsed.id === attendee.id) {
            await kv.srem(historyKey, item);
            break;
          }
        } catch (e) {}
      }

      return NextResponse.json({ success: true });

    } else if (action === 'delete-meeting') {
      await kv.del(historyKey);
      await kv.srem('history:dates', date);

      // Also delete associated lineup
      await kv.del(`lineup:${date}`);
      await kv.srem('lineup:dates', date);

      return NextResponse.json({ success: true });

    } else if (action === 'create-meeting') {
      // Create an empty meeting for a date (so it appears in history)
      await kv.sadd('history:dates', date);
      await kv.expire('history:dates', 365 * 24 * 60 * 60);

      // Initialize with empty set if not exists
      const existing = await kv.smembers(historyKey);
      if (!existing || existing.length === 0) {
        // Add a placeholder and remove it to initialize the set
        const placeholder = JSON.stringify({ id: '__init__', placeholder: true });
        await kv.sadd(historyKey, placeholder);
        await kv.srem(historyKey, placeholder);
        await kv.expire(historyKey, 365 * 24 * 60 * 60);
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Meeting edit error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
