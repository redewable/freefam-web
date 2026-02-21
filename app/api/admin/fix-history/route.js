import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// Utility: get the Monday for any given date string (YYYY-MM-DD)
function getMondayForDate(dateStr) {
  const date = new Date(dateStr + 'T12:00:00-06:00');
  const day = date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.getFullYear(), date.getMonth(), diff);
  return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;
}

export async function POST(request) {
  try {
    // Get all history dates
    const allDates = new Set();

    // From the index
    const indexDates = await kv.smembers('history:dates') || [];
    indexDates.forEach(d => allDates.add(d));

    // Scan for history:* keys
    const keys = await kv.keys('history:*') || [];
    keys.forEach(k => {
      const d = k.replace('history:', '');
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) allDates.add(d);
    });

    const fixes = [];
    const newDatesIndex = new Set();

    for (const dateStr of allDates) {
      const monday = getMondayForDate(dateStr);

      if (dateStr !== monday) {
        // This date is NOT a Monday — need to migrate its data to Monday
        const sourceKey = `history:${dateStr}`;
        const targetKey = `history:${monday}`;

        const items = await kv.smembers(sourceKey) || [];

        if (items.length > 0) {
          // Move each item to the Monday key
          for (const item of items) {
            await kv.sadd(targetKey, item);
          }
          await kv.expire(targetKey, 365 * 24 * 60 * 60);

          // Remove the old key
          await kv.del(sourceKey);

          // Remove old date from index, add Monday
          await kv.srem('history:dates', dateStr);
          await kv.sadd('history:dates', monday);

          fixes.push({
            from: dateStr,
            to: monday,
            itemsMoved: items.length,
          });
        } else {
          // Empty key, just clean it up
          await kv.del(sourceKey);
          await kv.srem('history:dates', dateStr);
        }

        newDatesIndex.add(monday);
      } else {
        // Already a Monday, keep it
        newDatesIndex.add(monday);
      }
    }

    // Ensure the dates index is correct
    await kv.expire('history:dates', 365 * 24 * 60 * 60);

    // Verify final state
    const finalDates = await kv.smembers('history:dates') || [];

    return NextResponse.json({
      success: true,
      fixes,
      finalDates: finalDates.sort(),
      message: fixes.length > 0
        ? `Migrated ${fixes.length} meeting(s) to their correct Monday dates`
        : 'All meetings already on Monday dates — no changes needed',
    });
  } catch (error) {
    console.error('Fix history error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET: preview what would change without making changes
export async function GET() {
  try {
    const allDates = new Set();

    const indexDates = await kv.smembers('history:dates') || [];
    indexDates.forEach(d => allDates.add(d));

    const keys = await kv.keys('history:*') || [];
    keys.forEach(k => {
      const d = k.replace('history:', '');
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) allDates.add(d);
    });

    const preview = [];
    for (const dateStr of Array.from(allDates).sort()) {
      const monday = getMondayForDate(dateStr);
      const dayName = new Date(dateStr + 'T12:00:00-06:00').toLocaleDateString('en-US', { weekday: 'long', timeZone: 'America/Chicago' });
      const items = await kv.smembers(`history:${dateStr}`) || [];

      preview.push({
        date: dateStr,
        dayOfWeek: dayName,
        monday,
        needsFix: dateStr !== monday,
        itemCount: items.length,
      });
    }

    return NextResponse.json({ preview });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
