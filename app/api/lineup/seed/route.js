import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// POST - Seed lineup data from the PDF agenda
export async function POST() {
  try {
    const lineups = [
      {
        date: '2025-01-26',
        segments: [
          { key: 'host', label: 'Host / MC', speaker: 'Adrian', topic: '' },
          { key: 'plan', label: 'The Plan', speaker: 'Talor', topic: '' },
          { key: 'recognition', label: 'Recognition', speaker: 'Adrian', topic: '' },
          { key: 'calendar', label: 'Calendar / Upcoming Events', speaker: 'Austin Longoria', topic: '' },
          { key: 'product', label: 'Product Demo', speaker: 'Libby', topic: '' },
          { key: 'bsm', label: 'BSM / Book of the Month', speaker: 'Olivia Langley', topic: '' },
          { key: 'training', label: 'Training', speaker: '', topic: 'Pipelining / Goal Setting' },
        ],
        topics: 'Pipelining / Goal Setting',
        notes: '',
        updatedAt: new Date().toISOString(),
      },
      {
        date: '2025-02-02',
        segments: [
          { key: 'host', label: 'Host / MC', speaker: 'Adrian', topic: '' },
          { key: 'plan', label: 'The Plan', speaker: 'Paul', topic: '' },
          { key: 'recognition', label: 'Recognition', speaker: 'Adrian', topic: '' },
          { key: 'calendar', label: 'Calendar / Upcoming Events', speaker: 'Austin Longoria', topic: '' },
          { key: 'product', label: 'Product Demo', speaker: 'Libby', topic: '' },
          { key: 'bsm', label: 'BSM / Book of the Month', speaker: 'Olivia Langley', topic: '' },
          { key: 'training', label: 'Training', speaker: '', topic: 'Launching New IBOs' },
        ],
        topics: 'Launching New IBOs',
        notes: '',
        updatedAt: new Date().toISOString(),
      },
      {
        date: '2025-02-09',
        segments: [
          { key: 'host', label: 'Host / MC', speaker: 'Adrian', topic: '' },
          { key: 'plan', label: 'The Plan', speaker: 'Talor', topic: '' },
          { key: 'recognition', label: 'Recognition', speaker: 'Adrian', topic: '' },
          { key: 'calendar', label: 'Calendar / Upcoming Events', speaker: 'Austin Longoria', topic: '' },
          { key: 'product', label: 'Product Demo', speaker: 'Libby', topic: '' },
          { key: 'bsm', label: 'BSM / Book of the Month', speaker: 'Olivia Langley', topic: '' },
          { key: 'training', label: 'Training', speaker: '', topic: 'Contacting & Inviting' },
        ],
        topics: 'Contacting & Inviting',
        notes: '',
        updatedAt: new Date().toISOString(),
      },
      {
        date: '2025-02-16',
        segments: [
          { key: 'host', label: 'Host / MC', speaker: 'Adrian', topic: '' },
          { key: 'plan', label: 'The Plan', speaker: 'Paul', topic: '' },
          { key: 'recognition', label: 'Recognition', speaker: 'Adrian', topic: '' },
          { key: 'calendar', label: 'Calendar / Upcoming Events', speaker: 'Austin Longoria', topic: '' },
          { key: 'product', label: 'Product Demo', speaker: 'Libby', topic: '' },
          { key: 'bsm', label: 'BSM / Book of the Month', speaker: 'Olivia Langley', topic: '' },
          { key: 'training', label: 'Training', speaker: '', topic: 'Team Meeting / Upcoming Events' },
        ],
        topics: 'Team Meeting / Upcoming Events',
        notes: '',
        updatedAt: new Date().toISOString(),
      },
      {
        date: '2025-02-23',
        segments: [
          { key: 'host', label: 'Host / MC', speaker: 'Adrian', topic: '' },
          { key: 'plan', label: 'The Plan', speaker: 'Paul', topic: '' },
          { key: 'recognition', label: 'Recognition', speaker: 'Adrian', topic: '' },
          { key: 'calendar', label: 'Calendar / Upcoming Events', speaker: 'Austin Longoria', topic: '' },
          { key: 'product', label: 'Product Demo', speaker: 'Libby', topic: '' },
          { key: 'bsm', label: 'BSM / Book of the Month', speaker: 'Olivia Langley', topic: '' },
          { key: 'training', label: 'Training', speaker: '', topic: 'Team Meeting / Upcoming Events' },
        ],
        topics: 'Team Meeting / Upcoming Events',
        notes: 'Paul and Liz showing the plan. Team meeting and upcoming events.',
        updatedAt: new Date().toISOString(),
      },
      {
        date: '2025-03-02',
        segments: [
          { key: 'host', label: 'Host / MC', speaker: 'Adrian', topic: '' },
          { key: 'plan', label: 'The Plan', speaker: 'Talor', topic: '' },
          { key: 'recognition', label: 'Recognition', speaker: 'Adrian', topic: '' },
          { key: 'calendar', label: 'Calendar / Upcoming Events', speaker: 'Austin Longoria', topic: '' },
          { key: 'product', label: 'Product Demo', speaker: 'Libby', topic: '' },
          { key: 'bsm', label: 'BSM / Book of the Month', speaker: 'Olivia Langley', topic: '' },
          { key: 'training', label: 'Training', speaker: '', topic: 'Pipelining / Goal Setting' },
        ],
        topics: 'Pipelining / Goal Setting',
        notes: '',
        updatedAt: new Date().toISOString(),
      },
      {
        date: '2025-03-09',
        segments: [
          { key: 'host', label: 'Host / MC', speaker: 'Adrian', topic: '' },
          { key: 'plan', label: 'The Plan', speaker: 'Paul', topic: '' },
          { key: 'recognition', label: 'Recognition', speaker: 'Adrian', topic: '' },
          { key: 'calendar', label: 'Calendar / Upcoming Events', speaker: 'Austin Longoria', topic: '' },
          { key: 'product', label: 'Product Demo', speaker: 'Libby', topic: '' },
          { key: 'bsm', label: 'BSM / Book of the Month', speaker: 'Olivia Langley', topic: '' },
          { key: 'training', label: 'Training', speaker: '', topic: 'Launching New IBOs' },
        ],
        topics: 'Launching New IBOs',
        notes: '',
        updatedAt: new Date().toISOString(),
      },
      {
        date: '2025-03-16',
        segments: [
          { key: 'host', label: 'Host / MC', speaker: 'Adrian', topic: '' },
          { key: 'plan', label: 'The Plan', speaker: 'Talor', topic: '' },
          { key: 'recognition', label: 'Recognition', speaker: 'Adrian', topic: '' },
          { key: 'calendar', label: 'Calendar / Upcoming Events', speaker: 'Austin Longoria', topic: '' },
          { key: 'product', label: 'Product Demo', speaker: 'Libby', topic: '' },
          { key: 'bsm', label: 'BSM / Book of the Month', speaker: 'Olivia Langley', topic: '' },
          { key: 'training', label: 'Training', speaker: '', topic: 'Contacting & Inviting' },
        ],
        topics: 'Contacting & Inviting',
        notes: '',
        updatedAt: new Date().toISOString(),
      },
      {
        date: '2025-03-23',
        segments: [
          { key: 'host', label: 'Host / MC', speaker: 'Adrian', topic: '' },
          { key: 'plan', label: 'The Plan', speaker: 'Paul', topic: '' },
          { key: 'recognition', label: 'Recognition', speaker: 'Adrian', topic: '' },
          { key: 'calendar', label: 'Calendar / Upcoming Events', speaker: 'Austin Longoria', topic: '' },
          { key: 'product', label: 'Product Demo', speaker: 'Libby', topic: '' },
          { key: 'bsm', label: 'BSM / Book of the Month', speaker: 'Olivia Langley', topic: '' },
          { key: 'training', label: 'Training', speaker: '', topic: 'Team Meeting / Upcoming Events' },
        ],
        topics: 'Team Meeting / Upcoming Events',
        notes: '',
        updatedAt: new Date().toISOString(),
      },
    ];

    let seeded = 0;
    for (const lineup of lineups) {
      await kv.set(`lineup:${lineup.date}`, lineup);
      await kv.expire(`lineup:${lineup.date}`, 365 * 24 * 60 * 60);
      await kv.sadd('lineup:dates', lineup.date);
      seeded++;
    }
    await kv.expire('lineup:dates', 365 * 24 * 60 * 60);

    return NextResponse.json({ success: true, seeded, message: `Seeded ${seeded} lineups from PDF agenda` });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
