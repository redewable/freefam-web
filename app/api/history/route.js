import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    console.log('History request, date:', date);
    
    if (date) {
      const historyKey = `history:${date}`;
      console.log('Fetching specific date:', historyKey);
      
      const items = await kv.smembers(historyKey) || [];
      console.log('Items found:', items.length);
      
      const checkins = items.map(item => {
        try { return JSON.parse(item); } catch (e) { return null; }
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
    
    // Get all history keys
    const keys = await kv.keys('history:*') || [];
    console.log('All history keys:', keys);
    
    const dates = keys.map(k => k.replace('history:', '')).sort((a, b) => new Date(b) - new Date(a));
    
    const history = [];
    for (const d of dates.slice(0, 52)) {
      const historyKey = `history:${d}`;
      const items = await kv.smembers(historyKey) || [];
      
      const checkins = items.map(item => {
        try { return JSON.parse(item); } catch (e) { return null; }
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
    
    console.log('Returning history:', history.length, 'dates');
    
    return NextResponse.json({ 
      history,
      debug: {
        keysFound: keys.length,
        datesProcessed: dates.length,
      }
    });
  } catch (error) {
    console.error('History error:', error);
    return NextResponse.json({ error: error.message, history: [] }, { status: 500 });
  }
}