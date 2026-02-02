import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    // If specific date requested, return that date's check-ins
    if (date) {
      const historyKey = `history:${date}`;
      const items = await kv.smembers(historyKey) || [];
      
      const checkins = items.map(item => {
        try { return typeof item === 'string' ? JSON.parse(item) : item; } 
        catch (e) { return null; }
      }).filter(Boolean);
      
      const stats = {
        total: checkins.length,
        ibos: checkins.filter(c => c.type === 'ibo').length,
        apprentices: checkins.filter(c => c.type === 'apprentice').length,
        guests: {
          total: checkins.filter(c => c.type === 'guest').length,
          first: checkins.filter(c => c.type === 'guest' && c.visitNumber === '1st').length,
          second: checkins.filter(c => c.type === 'guest' && c.visitNumber === '2nd').length,
          third: checkins.filter(c => c.type === 'guest' && c.visitNumber === '3rd').length,
        },
      };
      
      return NextResponse.json({ date, checkins, stats });
    }
    
    // Get all history keys - this is the exact same method that works in debug
    let keys = [];
    try {
      keys = await kv.keys('history:*') || [];
    } catch (e) {
      console.error('Error getting keys:', e);
      return NextResponse.json({ history: [], error: 'Failed to get keys: ' + e.message });
    }
    
    if (!keys || keys.length === 0) {
      return NextResponse.json({ history: [], message: 'No history keys found' });
    }
    
    // Sort dates newest first
    const dates = keys
      .map(k => k.replace('history:', ''))
      .sort((a, b) => new Date(b) - new Date(a));
    
    const history = [];
    
    for (const d of dates.slice(0, 52)) {
      const historyKey = `history:${d}`;
      
      let items = [];
      try {
        items = await kv.smembers(historyKey) || [];
      } catch (e) {
        console.error(`Error getting ${historyKey}:`, e);
        continue;
      }
      
      const checkins = items.map(item => {
        try { return typeof item === 'string' ? JSON.parse(item) : item; } 
        catch (e) { return null; }
      }).filter(Boolean);
      
      if (checkins.length > 0) {
        history.push({
          date: d,
          total: checkins.length,
          ibos: checkins.filter(c => c.type === 'ibo').length,
          apprentices: checkins.filter(c => c.type === 'apprentice').length,
          guests: {
            total: checkins.filter(c => c.type === 'guest').length,
            first: checkins.filter(c => c.type === 'guest' && c.visitNumber === '1st').length,
            second: checkins.filter(c => c.type === 'guest' && c.visitNumber === '2nd').length,
            third: checkins.filter(c => c.type === 'guest' && c.visitNumber === '3rd').length,
          },
        });
      }
    }
    
    return NextResponse.json({ 
      history,
      debug: {
        keysFound: keys,
        datesCount: dates.length,
        historyCount: history.length,
      }
    });
  } catch (error) {
    console.error('History error:', error);
    return NextResponse.json({ 
      error: error.message, 
      history: [],
      stack: error.stack 
    }, { status: 500 });
  }
}