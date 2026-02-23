import { createClient } from '@/app/lib/supabase/server';
import { getPartnerLtdId } from '@/app/lib/partner';
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

    // Count total descendants in a built tree
    const countTreeDescendants = (nodes) => {
      let count = 0;
      for (const n of nodes) {
        count += 1;
        if (n.children) count += countTreeDescendants(n.children);
      }
      return count;
    };

    // Build a global set of all partner LTD ID pairs for quick lookup
    const partnerLtdMap = new Map(); // ltd_id -> partner profile
    for (const p of (allProfiles || [])) {
      const pLtd = getPartnerLtdId(p.ltd_id);
      if (pLtd) {
        const partnerProfile = (allProfiles || []).find(x => x.ltd_id === pLtd && x.id !== p.id);
        if (partnerProfile) {
          partnerLtdMap.set(p.ltd_id, partnerProfile);
        }
      }
    }

    // GLOBAL processed set — prevents any person from appearing more than once in the entire tree
    const globalProcessed = new Set();
    // Always exclude the current user and their partner from the tree (they're shown separately)
    globalProcessed.add(user.id);
    if (partnerId) globalProcessed.add(partnerId);

    // Recursive function to build tree — merges partner pairs, sorts by leg size
    const buildTree = (personId, depth = 0, maxDepth = 10) => {
      if (depth >= maxDepth) return [];
      const children = childrenMap.get(personId) || [];
      const result = [];

      for (const c of children) {
        if (globalProcessed.has(c.id)) continue;
        globalProcessed.add(c.id);

        // Look up partner by LTD ID
        const pNode = partnerLtdMap.get(c.ltd_id) || null;
        if (pNode && !globalProcessed.has(pNode.id)) {
          globalProcessed.add(pNode.id);
        }
        const mergedPartner = (pNode && pNode.id !== c.id) ? pNode : null;

        // Build children from both this person and their partner
        let nodeChildren = buildTree(c.id, depth + 1, maxDepth);
        if (mergedPartner) {
          const partnerKids = buildTree(mergedPartner.id, depth + 1, maxDepth);
          // Dedupe — partnerKids may have entries already in nodeChildren via globalProcessed,
          // but just in case, check by id
          const seen = new Set(nodeChildren.map(ch => ch.id));
          for (const pk of partnerKids) {
            if (!seen.has(pk.id)) { nodeChildren.push(pk); seen.add(pk.id); }
          }
        }

        // Sort children by descendants before counting
        nodeChildren.sort((a, b) => (b.totalDescendants || 0) - (a.totalDescendants || 0));
        const totalDescendants = countTreeDescendants(nodeChildren);

        // Determine husband/wife display order:
        // The person whose LTD ID does NOT end in '2' is listed first (husband)
        let primaryPerson = c;
        let partnerName = mergedPartner?.full_name || null;
        let partnerLtdId = mergedPartner?.ltd_id || null;

        if (mergedPartner && c.ltd_id && c.ltd_id.endsWith('2') && c.ltd_id.length > 1) {
          // Current person is the '2' account (wife) — swap so husband is primary
          primaryPerson = mergedPartner;
          partnerName = c.full_name;
          partnerLtdId = c.ltd_id;
        }

        result.push({
          ...primaryPerson,
          partner_name: partnerName,
          partner_ltd_id: partnerLtdId,
          children: nodeChildren,
          totalDescendants,
        });
      }

      // Sort by total descendants (biggest legs at top)
      result.sort((a, b) => b.totalDescendants - a.totalDescendants);
      return result;
    };

    // Get downline for user + partner combined — single pass with global dedup
    const userChildren = buildTree(user.id);
    const partnerChildren = partnerId ? buildTree(partnerId) : [];

    // Merge (globalProcessed already prevents duplicates)
    const downlineList = [...userChildren, ...partnerChildren];

    // Sort combined downline by total descendants (biggest legs at top)
    downlineList.sort((a, b) => (b.totalDescendants || 0) - (a.totalDescendants || 0));

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
