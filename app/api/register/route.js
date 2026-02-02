import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const getWeekKey = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.getFullYear(), now.getMonth(), diff);
  return monday.toISOString().split('T')[0];
};

const getMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const getTodayKey = () => new Date().toISOString().split('T')[0];

const getSecondsUntilEndOfWeek = () => {
  const now = new Date();
  const daysUntilSunday = 7 - now.getDay();
  const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSunday, 23, 59, 59);
  return Math.max(1, Math.floor((endOfWeek - now) / 1000));
};

const getSecondsUntilEndOfMonth = () => {
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return Math.max(1, Math.floor((endOfMonth - now) / 1000));
};

export async function POST(request) {
  try {
    const { sessionId, action, priceType, registrationData } = await request.json();
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const isMonthly = priceType === 'monthly';
    const periodKey = isMonthly ? getMonthKey() : getWeekKey();
    const keyPrefix = isMonthly ? 'month' : 'week';
    const key = `checkin:${keyPrefix}:${periodKey}:${sessionId}`;
    const todayKey = getTodayKey();
    const historyKey = `history:${todayKey}`;
    
    if (action === 'checkin') {
      const timestamp = new Date().toISOString();
      await kv.set(key, { checkedIn: true, timestamp, priceType });
      
      const ttl = isMonthly ? getSecondsUntilEndOfMonth() : getSecondsUntilEndOfWeek();
      await kv.expire(key, ttl);
      
      if (registrationData) {
        await kv.sadd(historyKey, JSON.stringify({
          id: sessionId,
          name: registrationData.name || 'Unknown',
          type: registrationData.type || 'ibo',
          priceType,
          visitNumber: registrationData.visitNumber || '',
          timestamp,
        }));
        await kv.expire(historyKey, 365 * 24 * 60 * 60);
      }
      
      return NextResponse.json({ success: true, checkedIn: true, timestamp });
      
    } else if (action === 'checkout') {
      await kv.del(key);
      
      try {
        const historyItems = await kv.smembers(historyKey) || [];
        for (const item of historyItems) {
          const parsed = JSON.parse(item);
          if (parsed.id === sessionId) {
            await kv.srem(historyKey, item);
            break;
          }
        }
      } catch (e) {}
      
      return NextResponse.json({ success: true, checkedIn: false });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}