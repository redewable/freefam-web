import { kv } from '@vercel/kv';
import { createClient } from '@/app/lib/supabase/server';
import { NextResponse } from 'next/server';

// Attendance API — pulls from ACTUAL meeting history records and cross-references with LOS
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Partner logic: LTD ID 6076043 <-> 60760432
    function getPartnerLtdId(ltdId) {
      if (!ltdId) return null;
      if (ltdId.endsWith('2') && ltdId.length > 1) return ltdId.slice(0, -1);
      return ltdId + '2';
    }

    // Get current user's profile
    const { data: profile } = await supabase.from('profiles').select('ltd_id, role, sponsor_id').eq('id', user.id).single();
    if (!profile) return NextResponse.json({ records: [] });

    // Build set of all LTD IDs in this user's LOS (self + partner + full downline)
    const teamLtdIds = new Set();
    if (profile.ltd_id) {
      teamLtdIds.add(profile.ltd_id);
      const partnerLtd = getPartnerLtdId(profile.ltd_id);
      if (partnerLtd) teamLtdIds.add(partnerLtd);
    }

    // Get direct downline LTD IDs (for both user and partner)
    const sponsorIds = [user.id];
    const partnerLtdId = getPartnerLtdId(profile.ltd_id);
    if (partnerLtdId) {
      const { data: partnerProfile } = await supabase
        .from('profiles')
        .select('id, ltd_id')
        .eq('ltd_id', partnerLtdId)
        .single();
      if (partnerProfile) sponsorIds.push(partnerProfile.id);
    }

    // Get full recursive downline (not just direct)
    const { data: allProfiles } = await supabase.from('profiles').select('id, ltd_id, sponsor_id, full_name');

    // Build recursive downline by walking sponsor chain
    const childMap = new Map();
    for (const p of (allProfiles || [])) {
      if (p.sponsor_id) {
        if (!childMap.has(p.sponsor_id)) childMap.set(p.sponsor_id, []);
        childMap.get(p.sponsor_id).push(p);
      }
    }

    const collectDownline = (parentIds) => {
      const queue = [...parentIds];
      const visited = new Set(parentIds);
      while (queue.length > 0) {
        const pid = queue.shift();
        const kids = childMap.get(pid) || [];
        for (const kid of kids) {
          if (!visited.has(kid.id)) {
            visited.add(kid.id);
            if (kid.ltd_id) {
              teamLtdIds.add(kid.ltd_id);
              const kPartner = getPartnerLtdId(kid.ltd_id);
              if (kPartner) teamLtdIds.add(kPartner);
            }
            queue.push(kid.id);
          }
        }
      }
    };

    collectDownline(sponsorIds);

    // If admin, include all profiles
    if (profile.role === 'admin') {
      (allProfiles || []).forEach(p => {
        if (p.ltd_id) {
          teamLtdIds.add(p.ltd_id);
          const pPartner = getPartnerLtdId(p.ltd_id);
          if (pPartner) teamLtdIds.add(pPartner);
        }
      });
    }

    // Build name->ltdId map from profiles for matching by name
    const nameToLtdId = new Map();
    for (const p of (allProfiles || [])) {
      if (p.full_name && p.ltd_id) {
        nameToLtdId.set(p.full_name.toLowerCase().trim(), p.ltd_id);
      }
    }

    if (teamLtdIds.size === 0) return NextResponse.json({ records: [] });

    // 1. Get all actual meeting dates from history
    let meetingDates = new Set();
    try {
      const indexDates = await kv.smembers('history:dates') || [];
      indexDates.forEach(d => meetingDates.add(d));
    } catch (e) {}

    // Fallback: scan for history:* keys
    try {
      const keys = await kv.keys('history:*') || [];
      keys.forEach(k => {
        const d = k.replace('history:', '');
        if (/^\d{4}-\d{2}-\d{2}$/.test(d)) meetingDates.add(d);
      });
    } catch (e) {}

    // 2. For each meeting date, get attendees and cross-reference with LOS
    const records = [];

    for (const date of meetingDates) {
      const historyKey = `history:${date}`;
      let items = [];
      try {
        items = await kv.smembers(historyKey) || [];
      } catch (e) { continue; }

      const attendees = items.map(item => {
        try { return typeof item === 'string' ? JSON.parse(item) : item; }
        catch (e) { return null; }
      }).filter(Boolean);

      // Skip empty meetings
      if (attendees.length === 0) continue;

      // Check each attendee — try to match to a team LTD ID
      for (const att of attendees) {
        let ltdId = att.ltdId || null;

        // If no ltdId stored, try matching by name
        if (!ltdId && att.name) {
          ltdId = nameToLtdId.get(att.name.toLowerCase().trim()) || null;
        }

        // Only include if this attendee is in the user's LOS team
        if (ltdId && teamLtdIds.has(ltdId)) {
          records.push({
            ltd_id: ltdId,
            name: att.name || 'Unknown',
            type: att.type || 'ibo',
            date: date, // The actual meeting date (YYYY-MM-DD)
            checked_in: true, // They're in history = they attended
            meeting_date: date,
          });
        }
      }
    }

    // Sort by date descending
    records.sort((a, b) => new Date(b.date) - new Date(a.date));

    return NextResponse.json({ records });
  } catch (error) {
    console.error('Attendance error:', error);
    return NextResponse.json({ error: error.message, records: [] }, { status: 500 });
  }
}
