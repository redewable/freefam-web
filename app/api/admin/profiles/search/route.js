import { createClient } from '@/app/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET - Search profiles by LTD ID or name (for manual check-in)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q || q.trim().length < 2) {
      return NextResponse.json({ profiles: [] });
    }

    const supabase = await createClient();

    // Search by LTD ID (exact or prefix match) and by name (partial)
    const { data: byLtd } = await supabase
      .from('profiles')
      .select('id, full_name, ltd_id, role, status')
      .ilike('ltd_id', `${q.trim()}%`)
      .limit(5);

    const { data: byName } = await supabase
      .from('profiles')
      .select('id, full_name, ltd_id, role, status')
      .ilike('full_name', `%${q.trim()}%`)
      .limit(5);

    // Merge and deduplicate
    const seen = new Set();
    const profiles = [];
    for (const p of [...(byLtd || []), ...(byName || [])]) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        profiles.push(p);
      }
    }

    return NextResponse.json({ profiles: profiles.slice(0, 8) });
  } catch (error) {
    console.error('Profile search error:', error);
    return NextResponse.json({ profiles: [], error: error.message }, { status: 500 });
  }
}
