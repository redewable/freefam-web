import { createClient } from '@/app/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Get current user's profile from the view
    const { data: currentUser, error: userErr } = await supabase
      .from('los_tree')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userErr || !currentUser) {
      return NextResponse.json({ user: null, upline: [], downline: [] });
    }

    // Build upline chain (walk up sponsor_id, max 10 levels)
    const upline = [];
    let sponsorId = currentUser.sponsor_id;
    let safety = 0;
    while (sponsorId && safety < 10) {
      const { data: sponsor } = await supabase
        .from('los_tree')
        .select('*')
        .eq('id', sponsorId)
        .single();

      if (!sponsor) break;
      upline.unshift(sponsor); // add to beginning so top-level is first
      sponsorId = sponsor.sponsor_id;
      safety++;
    }

    // Get direct downline
    const { data: downline } = await supabase
      .from('los_tree')
      .select('*')
      .eq('sponsor_id', user.id)
      .order('full_name', { ascending: true });

    return NextResponse.json({
      user: currentUser,
      upline: upline || [],
      downline: downline || [],
    });
  } catch (error) {
    console.error('LOS error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
