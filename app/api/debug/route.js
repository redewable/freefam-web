import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const getTodayKey = () => new Date().toISOString().split('T')[0];

export async function GET() {
  try {
    const todayKey = getTodayKey();
    
    // Get all keys
    const regKeys = await kv.keys('registration:*');
    const historyKeys = await kv.keys('history:*');
    const checkinKeys = await kv.keys('checkin:*');
    
    // Get today's history specifically
    const todayHistoryKey = `history:${todayKey}`;
    let todayHistory = [];
    try {
      const items = await kv.smembers(todayHistoryKey);
      todayHistory = (items || []).map(item => {
        try { return JSON.parse(item); } catch { return item; }
      });
    } catch (e) {
      console.log('Error getting today history:', e);
    }
    
    // Get all history data
    const allHistory = {};
    for (const key of historyKeys || []) {
      try {
        const items = await kv.smembers(key);
        allHistory[key] = (items || []).map(item => {
          try { return JSON.parse(item); } catch { return item; }
        });
      } catch (e) {
        allHistory[key] = `Error: ${e.message}`;
      }
    }
    
    return NextResponse.json({
      today: todayKey,
      keys: {
        registrations: regKeys || [],
        history: historyKeys || [],
        checkins: checkinKeys || [],
      },
      todayHistory,
      allHistory,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { action } = await request.json();
    const todayKey = getTodayKey();
    const historyKey = `history:${todayKey}`;
    
    if (action === 'test-history') {
      // Test adding to history directly
      const testEntry = JSON.stringify({
        id: 'test_' + Date.now(),
        name: 'Test Person',
        type: 'guest',
        priceType: 'guest',
        visitNumber: '1st',
        timestamp: new Date().toISOString(),
      });
      
      console.log('Adding to history:', historyKey, testEntry);
      await kv.sadd(historyKey, testEntry);
      await kv.expire(historyKey, 365 * 24 * 60 * 60);
      
      // Verify
      const items = await kv.smembers(historyKey);
      
      return NextResponse.json({ 
        success: true, 
        historyKey,
        itemCount: items?.length || 0,
        items: items || [],
      });
    }
    
    if (action === 'clear-history') {
      const keys = await kv.keys('history:*');
      for (const key of keys || []) {
        await kv.del(key);
      }
      return NextResponse.json({ success: true, deleted: keys?.length || 0 });
    }
    
    if (action === 'test-registration') {
      const id = `free_test_${Date.now()}`;
      const registration = {
        id,
        name: 'Test Guest',
        email: 'test@example.com',
        type: 'guest',
        invitedBy: 'Test Inviter',
        visitNumber: '1st',
        source: 'debug',
        createdAt: new Date().toISOString(),
      };
      
      await kv.set(`registration:${id}`, registration);
      const saved = await kv.get(`registration:${id}`);
      
      return NextResponse.json({ success: true, id, saved: !!saved });
    }
    
    return NextResponse.json({ error: 'Unknown action. Try: test-history, test-registration, clear-history' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}