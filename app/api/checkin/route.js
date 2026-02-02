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
    const body = await request.json();
    const { sessionId, action, priceType, registrationData } = body;
    
    console.log('=== CHECK-IN REQUEST ===');
    console.log('Body:', JSON.stringify(body));
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const isMonthly = priceType === 'monthly';
    const periodKey = isMonthly ? getMonthKey() : getWeekKey();
    const keyPrefix = isMonthly ? 'month' : 'week';
    const checkinKey = `checkin:${keyPrefix}:${periodKey}:${sessionId}`;
    const todayKey = getTodayKey();
    const historyKey = `history:${todayKey}`;
    
    console.log('Keys:', { checkinKey, historyKey, todayKey });
    
    if (action === 'checkin') {
      const timestamp = new Date().toISOString();
      
      // 1. Save check-in status
      await kv.set(checkinKey, { checkedIn: true, timestamp, priceType });
      const ttl = isMonthly ? getSecondsUntilEndOfMonth() : getSecondsUntilEndOfWeek();
      await kv.expire(checkinKey, ttl);
      console.log('Saved checkin status');
      
      // 2. Save to history
      const historyEntry = {
        id: sessionId,
        name: registrationData?.name || 'Unknown',
        type: registrationData?.type || 'ibo',
        priceType: priceType || 'single',
        visitNumber: registrationData?.visitNumber || '',
        timestamp,
      };
      
      const historyString = JSON.stringify(historyEntry);
      console.log('Saving to history:', historyKey, historyString);
      
      const addResult = await kv.sadd(historyKey, historyString);
      console.log('sadd result:', addResult);
      
      await kv.expire(historyKey, 365 * 24 * 60 * 60);
      
      // 3. Verify it was saved
      const verify = await kv.smembers(historyKey);
      console.log('History after save:', verify?.length, 'items');
      
      return NextResponse.json({ 
        success: true, 
        checkedIn: true, 
        timestamp,
        debug: {
          historyKey,
          entrySaved: addResult,
          totalInHistory: verify?.length || 0,
        }
      });
      
    } else if (action === 'checkout') {
      // Remove check-in status
      await kv.del(checkinKey);
      
      // Remove from history
      try {
        const historyItems = await kv.smembers(historyKey) || [];
        for (const item of historyItems) {
          try {
            const parsed = JSON.parse(item);
            if (parsed.id === sessionId) {
              await kv.srem(historyKey, item);
              console.log('Removed from history:', sessionId);
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

// GET endpoint to check today's history directly
export async function GET() {
  try {
    const todayKey = getTodayKey();
    const historyKey = `history:${todayKey}`;
    
    const items = await kv.smembers(historyKey) || [];
    const parsed = items.map(item => {
      try { return JSON.parse(item); } catch { return item; }
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