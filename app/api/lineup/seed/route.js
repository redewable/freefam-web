import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const makeSegments = ({ host, plan, nextsteps, recognition, calendar, product, bsm, trainingTopic }) => [
  { key: 'host', label: 'Welcome / Host', speaker: host || '', topic: '', time: '7:30 PM', duration: '2 min', section: 'info' },
  { key: 'plan', label: 'The Plan', speaker: plan || '', topic: '', time: '7:32 PM', duration: '53 min', section: 'info' },
  { key: 'nextsteps', label: 'Next Steps', speaker: nextsteps || host || '', topic: '', time: '8:25 PM', duration: '5 min', section: 'info' },
  { key: 'recognition', label: 'Recognition', speaker: recognition || '', topic: '', time: '8:45 PM', duration: '20 min', section: 'training' },
  { key: 'calendar', label: 'Calendar / Upcoming Events', speaker: calendar || '', topic: '', time: '9:05 PM', duration: '4 min', section: 'training' },
  { key: 'product', label: 'Product Demo', speaker: product || '', topic: '', time: '9:09 PM', duration: '7 min', section: 'training' },
  { key: 'bsm', label: 'BSM', speaker: bsm || '', topic: '', time: '9:16 PM', duration: '7 min', section: 'training' },
  { key: 'training', label: 'Training Topic', speaker: '', topic: trainingTopic || '', time: '9:23 PM', duration: '25-30 min', section: 'training' },
];

// POST - Seed lineup data from the PDF agenda
export async function POST() {
  try {
    const lineups = [
      {
        date: '2026-01-26',
        segments: makeSegments({ host: 'Adrian', plan: 'Talor', recognition: 'Adrian', calendar: 'Austin Longoria', product: 'Libby', bsm: 'Olivia Langley', trainingTopic: 'Pipelining / Goal Setting' }),
        topics: 'Pipelining / Goal Setting',
        notes: '',
        updatedAt: new Date().toISOString(),
      },
      {
        date: '2026-02-02',
        segments: makeSegments({ host: 'Adrian', plan: 'Paul', recognition: 'Adrian', calendar: 'Austin Longoria', product: 'Libby', bsm: 'Olivia Langley', trainingTopic: 'Launching New IBOs' }),
        topics: 'Launching New IBOs',
        notes: '',
        updatedAt: new Date().toISOString(),
      },
      {
        date: '2026-02-09',
        segments: makeSegments({ host: 'Adrian', plan: 'Talor', recognition: 'Adrian', calendar: 'Austin Longoria', product: 'Libby', bsm: 'Olivia Langley', trainingTopic: 'Contacting & Inviting' }),
        topics: 'Contacting & Inviting',
        notes: '',
        updatedAt: new Date().toISOString(),
      },
      {
        date: '2026-02-16',
        segments: makeSegments({ host: 'Adrian', plan: 'Paul', recognition: 'Adrian', calendar: 'Austin Longoria', product: 'Libby', bsm: 'Olivia Langley', trainingTopic: 'Team Meeting / Upcoming Events' }),
        topics: 'Team Meeting / Upcoming Events',
        notes: '',
        updatedAt: new Date().toISOString(),
      },
      {
        date: '2026-02-23',
        segments: makeSegments({ host: 'Adrian', plan: 'Paul', nextsteps: 'Adrian', recognition: 'Adrian', calendar: 'Austin Longoria', product: 'Libby', bsm: 'Olivia Langley', trainingTopic: 'Team Meeting / Upcoming Events' }),
        topics: 'Team Meeting / Upcoming Events',
        notes: 'Paul and Liz showing the plan. Team meeting and upcoming events.',
        updatedAt: new Date().toISOString(),
      },
      {
        date: '2026-03-02',
        segments: makeSegments({ host: 'Adrian', plan: 'Talor', recognition: 'Adrian', calendar: 'Austin Longoria', product: 'Libby', bsm: 'Olivia Langley', trainingTopic: 'Pipelining / Goal Setting' }),
        topics: 'Pipelining / Goal Setting',
        notes: '',
        updatedAt: new Date().toISOString(),
      },
      {
        date: '2026-03-09',
        segments: makeSegments({ host: 'Adrian', plan: 'Paul', recognition: 'Adrian', calendar: 'Austin Longoria', product: 'Libby', bsm: 'Olivia Langley', trainingTopic: 'Launching New IBOs' }),
        topics: 'Launching New IBOs',
        notes: '',
        updatedAt: new Date().toISOString(),
      },
      {
        date: '2026-03-16',
        segments: makeSegments({ host: 'Adrian', plan: 'Talor', recognition: 'Adrian', calendar: 'Austin Longoria', product: 'Libby', bsm: 'Olivia Langley', trainingTopic: 'Contacting & Inviting' }),
        topics: 'Contacting & Inviting',
        notes: '',
        updatedAt: new Date().toISOString(),
      },
      {
        date: '2026-03-23',
        segments: makeSegments({ host: 'Adrian', plan: 'Paul', recognition: 'Adrian', calendar: 'Austin Longoria', product: 'Libby', bsm: 'Olivia Langley', trainingTopic: 'Team Meeting / Upcoming Events' }),
        topics: 'Team Meeting / Upcoming Events',
        notes: '',
        updatedAt: new Date().toISOString(),
      },
    ];

    // Clean up old 2025 data that had wrong dates
    let cleaned = 0;
    try {
      const oldKeys = await kv.keys('lineup:2025*') || [];
      for (const key of oldKeys) {
        await kv.del(key);
        cleaned++;
      }
    } catch (e) { console.error('Cleanup error:', e); }

    let seeded = 0;
    for (const lineup of lineups) {
      await kv.set(`lineup:${lineup.date}`, lineup);
      await kv.expire(`lineup:${lineup.date}`, 365 * 24 * 60 * 60);
      await kv.sadd('lineup:dates', lineup.date);
      seeded++;
    }
    await kv.expire('lineup:dates', 365 * 24 * 60 * 60);

    return NextResponse.json({ success: true, seeded, cleaned, message: `Seeded ${seeded} lineups, cleaned ${cleaned} old entries` });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
