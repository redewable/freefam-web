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

    // Get FULL recursive downline for both user AND partner
    // First, get all profiles that could be in our tree (for efficiency)
    const { data: allProfiles } = await supabase
      .from('los_tree')
      .select('*')
      .order('full_name', { ascending: true });

    const profileMap = new Map();
    for (const p of (allProfiles || [])) {
      profileMap.set(p.id, p);
    }

    // Build children map (sponsor_id → list of children)
    const childrenMap = new Map();
    for (const p of (allProfiles || [])) {
      if (p.sponsor_id) {
        if (!childrenMap.has(p.sponsor_id)) childrenMap.set(p.sponsor_id, []);
        childrenMap.get(p.sponsor_id).push(p);
      }
    }

    // Recursive function to build tree
    const buildTree = (personId, depth = 0, maxDepth = 10) => {
      if (depth >= maxDepth) return [];
      const children = childrenMap.get(personId) || [];
      return children
        .filter(c => c.id !== partnerId && c.id !== user.id) // Skip partner and self
        .map(c => ({
          ...c,
          children: buildTree(c.id, depth + 1, maxDepth),
        }))
        .sort((a, b) => (a.full_name || '').localeCompare(b.full_name || ''));
    };

    // Get downline for user + partner combined
    const userChildren = buildTree(user.id);
    const partnerChildren = partnerId ? buildTree(partnerId) : [];

    // Merge and deduplicate (in case of overlap)
    const downlineIds = new Set();
    const downlineList = [];

    const addToList = (items) => {
      for (const item of items) {
        if (!downlineIds.has(item.id)) {
          downlineIds.add(item.id);
          downlineList.push(item);
        }
      }
    };

    addToList(userChildren);
    addToList(partnerChildren);

    // Sort combined downline by name
    downlineList.sort((a, b) => (a.full_name || '').localeCompare(b.full_name || ''));

    // Visibility rules:
    // - Upline members: downline can only see name and LTD ID
    // - Downline members: upline sees all data
    const stripUpline = (person) => ({
      id: person.id,
      full_name: person.full_name,
      ltd_id: person.ltd_id,
      // Strip everything else: role, status, sponsor_id, sponsor_ltd_id, sponsor_name, etc.
    });

    return NextResponse.json({
      user: currentUser,
      partner: partner,
      upline: (upline || []).map(stripUpline),
      downline: downlineList,
    });
  } catch (error) {
    console.error('LOS error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
