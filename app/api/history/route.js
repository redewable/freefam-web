import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    if (date) {
      const historyKey = `history:${date}`;
      const items = await kv.smembers(historyKey) || [];
      
      const checkins = items.map(item => {
        try { return JSON.parse(item); } catch (e) { return null; }
      }).filter(Boolean);
      
      const stats = {
        total: checkins.length,
        ibos: checkins.filter(c => c.type === 'ibo' && c.priceType !== 'apprentice').length,
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
    
    const keys = await kv.keys('history:*') || [];
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
          ibos: checkins.filter(c => c.type === 'ibo' && c.priceType !== 'apprentice').length,
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
    
    return NextResponse.json({ history });
  } catch (error) {
    console.error('History error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}