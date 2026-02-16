import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const getWeekKey = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.getFullYear(), now.getMonth(), diff);
  return monday.toISOString().split('T')[0];
};

const getTodayKey = () => new Date().toISOString().split('T')[0];

const getSecondsUntilEndOfWeek = () => {
  const now = new Date();
  const daysUntilSunday = 7 - now.getDay();
  const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSunday, 23, 59, 59);
  return Math.max(1, Math.floor((endOfWeek - now) / 1000));
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId, action, priceType, registrationData } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // All check-ins use weekly keys so they reset every Monday
    const weekKey = getWeekKey();
    const checkinKey = `checkin:week:${weekKey}:${sessionId}`;
    const todayKey = getTodayKey();
    const historyKey = `history:${todayKey}`;

    if (action === 'checkin') {
      const timestamp = new Date().toISOString();

      // 1. Save check-in status with weekly TTL
      await kv.set(checkinKey, { checkedIn: true, timestamp, priceType });
      const ttl = getSecondsUntilEndOfWeek();
      await kv.expire(checkinKey, ttl);

      // 2. Save to history for this date
      const historyEntry = {
        id: sessionId,
        name: registrationData?.name || 'Unknown',
        type: registrationData?.type || 'ibo',
        priceType: priceType || 'single',
        visitNumber: registrationData?.visitNumber || '',
        timestamp,
      };

      const historyString = JSON.stringify(historyEntry);
      await kv.sadd(historyKey, historyString);
      await kv.expire(historyKey, 365 * 24 * 60 * 60);

      // 3. Track this date in our dates index for reliable history lookup
      await kv.sadd('history:dates', todayKey);
      await kv.expire('history:dates', 365 * 24 * 60 * 60);

      return NextResponse.json({
        success: true,
        checkedIn: true,
        timestamp,
      });

    } else if (action === 'checkout') {
      // Remove check-in status
      await kv.del(checkinKey);

      // Remove from today's history
      try {
        const historyItems = await kv.smembers(historyKey) || [];
        for (const item of historyItems) {
          try {
            const parsed = typeof item === 'string' ? JSON.parse(item) : item;
            if (parsed.id === sessionId) {
              await kv.srem(historyKey, item);
              break;
            }
          } catch (e) {}
        }
      } catch (e) {
        console.log('Error removing from history:', e);
      }

      return NextResponse.json({ success: true, checkedIn: false });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET endpoint to check today's history
export async function GET() {
  try {
    const todayKey = getTodayKey();
    const historyKey = `history:${todayKey}`;

    const items = await kv.smembers(historyKey) || [];
    const parsed = items.map(item => {
      try { return typeof item === 'string' ? JSON.parse(item) : item; } catch { return item; }
    });

    return NextResponse.json({
      today: todayKey,
      historyKey,
      count: items.length,
      items: parsed,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
