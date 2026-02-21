import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// POST - Fix history dates that were stored in UTC instead of CST
// Moves Tuesday entries back to Monday (the actual meeting day)
export async function POST() {
  try {
    let fixed = 0;
    const errors = [];

    // Find all history keys
    const keys = await kv.keys('history:*') || [];
    const dateKeys = keys.filter(k => /^history:\d{4}-\d{2}-\d{2}$/.test(k));

    for (const key of dateKeys) {
      const dateStr = key.replace('history:', '');
      const date = new Date(dateStr + 'T12:00:00-06:00');
      const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon, 2=Tue

      // If the date is a Tuesday, it should be Monday (one day back)
      if (dayOfWeek === 2) {
        const correctDate = new Date(date);
        correctDate.setDate(correctDate.getDate() - 1);
        const correctDateStr = `${correctDate.getFullYear()}-${String(correctDate.getMonth() + 1).padStart(2, '0')}-${String(correctDate.getDate()).padStart(2, '0')}`;

        try {
          // Get existing data from wrong date
          const items = await kv.smembers(key) || [];

          if (items.length > 0) {
            const newKey = `history:${correctDateStr}`;

            // Check if correct date already has data
            const existingItems = await kv.smembers(newKey) || [];

            // Add all items to the correct date
            for (const item of items) {
              await kv.sadd(newKey, item);
            }
            await kv.expire(newKey, 365 * 24 * 60 * 60);

            // Update the dates index
            await kv.sadd('history:dates', correctDateStr);
            await kv.srem('history:dates', dateStr);

            // Delete the old wrong-date key
            await kv.del(key);

            fixed++;
          }
        } catch (e) {
          errors.push(`Error fixing ${dateStr}: ${e.message}`);
        }
      }
    }

    // Also fix any lineup dates that might be off
    const lineupKeys = await kv.keys('lineup:2*') || [];
    let lineupFixed = 0;

    for (const key of lineupKeys) {
      const dateStr = key.replace('lineup:', '');
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) continue;

      const date = new Date(dateStr + 'T12:00:00-06:00');
      const dayOfWeek = date.getDay();

      if (dayOfWeek === 2) {
        const correctDate = new Date(date);
        correctDate.setDate(correctDate.getDate() - 1);
        const correctDateStr = `${correctDate.getFullYear()}-${String(correctDate.getMonth() + 1).padStart(2, '0')}-${String(correctDate.getDate()).padStart(2, '0')}`;

        try {
          const data = await kv.get(key);
          if (data) {
            data.date = correctDateStr;
            await kv.set(`lineup:${correctDateStr}`, data);
            await kv.expire(`lineup:${correctDateStr}`, 365 * 24 * 60 * 60);
            await kv.del(key);
            await kv.sadd('lineup:dates', correctDateStr);
            await kv.srem('lineup:dates', dateStr);
            lineupFixed++;
          }
        } catch (e) {
          errors.push(`Error fixing lineup ${dateStr}: ${e.message}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      historyFixed: fixed,
      lineupFixed,
      errors: errors.length > 0 ? errors : undefined,
      message: `Fixed ${fixed} history entries and ${lineupFixed} lineup entries (Tuesday → Monday)`,
    });
  } catch (error) {
    console.error('Fix dates error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
