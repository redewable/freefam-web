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

      // Sort by type: guests first, then apprentices, then IBOs
      const typeOrder = { guest: 0, apprentice: 1, ibo: 2 };
      checkins.sort((a, b) => (typeOrder[a.type] || 2) - (typeOrder[b.type] || 2));

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

    // Get all history dates from both the index and key scan for reliability
    let dates = new Set();

    // Method 1: Check the dates index
    try {
      const indexDates = await kv.smembers('history:dates') || [];
      indexDates.forEach(d => dates.add(d));
    } catch (e) {
      console.error('Error reading dates index:', e);
    }

    // Method 2: Scan for history:* keys as fallback
    try {
      const keys = await kv.keys('history:*') || [];
      keys.forEach(k => {
        const d = k.replace('history:', '');
        // Only add valid date strings (YYYY-MM-DD), not 'dates'
        if (/^\d{4}-\d{2}-\d{2}$/.test(d)) dates.add(d);
      });
    } catch (e) {
      console.error('Error scanning keys:', e);
    }

    if (dates.size === 0) {
      return NextResponse.json({ history: [], message: 'No history found' });
    }

    // Sort dates newest first
    const sortedDates = Array.from(dates).sort((a, b) => new Date(b) - new Date(a));

    const history = [];

    for (const d of sortedDates.slice(0, 52)) {
      const historyKey = `history:${d}`;

      let items = [];
      try {
        items = await kv.smembers(historyKey) || [];
      } catch (e) {
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

    return NextResponse.json({ history });
  } catch (error) {
    console.error('History error:', error);
    return NextResponse.json({
      error: error.message,
      history: [],
    }, { status: 500 });
  }
}
