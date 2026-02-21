import { createClient } from '@/app/lib/supabase/server';
import { NextResponse } from 'next/server';

// Partner logic: LTD ID 6076043 <-> 60760432
// If ID ends with '2' and has more than 1 digit, partner is ID without trailing '2'
// Otherwise partner is ID + '2'
function getPartnerLtdId(ltdId) {
  if (!ltdId) return null;
  if (ltdId.endsWith('2') && ltdId.length > 1) {
    return ltdId.slice(0, -1);
  }
  return ltdId + '2';
}

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
      return NextResponse.json({ user: null, upline: [], downline: [], partner: null });
    }

    // Check for partner account
    const partnerLtdId = getPartnerLtdId(currentUser.ltd_id);
    let partner = null;
    let partnerId = null;

    if (partnerLtdId) {
      const { data: partnerData } = await supabase
        .from('los_tree')
        .select('*')
        .eq('ltd_id', partnerLtdId)
        .single();

      if (partnerData) {
        partner = partnerData;
        partnerId = partnerData.id;
      }
    }

    // Build upline chain (walk up sponsor_id, max 10 levels)
    // Use current user or partner's sponsor_id (whichever has one)
    const upline = [];
    let sponsorId = currentUser.sponsor_id;

    // If no sponsor, check if partner has one
    if (!sponsorId && partner) {
      sponsorId = partner.sponsor_id;
    }

    let safety = 0;
    while (sponsorId && safety < 10) {
      // Skip partner in upline (they're shown separately)
      if (partnerId && sponsorId === partnerId) {
        // Partner's sponsor becomes our next upline
        const { data: partnerProfile } = await supabase
          .from('los_tree')
          .select('sponsor_id')
          .eq('id', partnerId)
          .single();
        sponsorId = partnerProfile?.sponsor_id || null;
        safety++;
        continue;
      }

      const { data: sponsor } = await supabase
        .from('los_tree')
        .select('*')
        .eq('id', sponsorId)
        .single();

      if (!sponsor) break;
      upline.unshift(sponsor);
      sponsorId = sponsor.sponsor_id;
      safety++;
    }

    // Get direct downline for both user AND partner (merged, deduplicated)
    const downlineIds = new Set();
    const downlineList = [];

    // User's downline
    const { data: userDownline } = await supabase
      .from('los_tree')
      .select('*')
      .eq('sponsor_id', user.id)
      .order('full_name', { ascending: true });

    for (const d of (userDownline || [])) {
      // Skip partner from downline (they're shown separately)
      if (partnerId && d.id === partnerId) continue;
      if (!downlineIds.has(d.id)) {
        downlineIds.add(d.id);
        downlineList.push(d);
      }
    }

    // Partner's downline
    if (partnerId) {
      const { data: partnerDownline } = await supabase
        .from('los_tree')
        .select('*')
        .eq('sponsor_id', partnerId)
        .order('full_name', { ascending: true });

      for (const d of (partnerDownline || [])) {
        // Skip current user from partner's downline
        if (d.id === user.id) continue;
        if (!downlineIds.has(d.id)) {
          downlineIds.add(d.id);
          downlineList.push(d);
        }
      }
    }

    // Sort combined downline by name
    downlineList.sort((a, b) => (a.full_name || '').localeCompare(b.full_name || ''));

    return NextResponse.json({
      user: currentUser,
      partner: partner,
      upline: upline || [],
      downline: downlineList,
    });
  } catch (error) {
    console.error('LOS error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
