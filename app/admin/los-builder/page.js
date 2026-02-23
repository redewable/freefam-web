"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/app/lib/supabase/client';
import { getPartnerLtdId } from '@/app/lib/partner';

const colors = { bg: '#fafaf8', dark: '#1a1a1a', gold: '#b8956b' };

// Merge partner pairs
function mergePartners(profiles) {
  const merged = [];
  const seen = new Set();
  for (const p of profiles) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    const partnerLtd = getPartnerLtdId(p.ltd_id);
    const partner = partnerLtd ? profiles.find(x => x.ltd_id === partnerLtd && !seen.has(x.id)) : null;
    if (partner) {
      seen.add(partner.id);
      // Husband first (non-'2' LTD ID)
      const isPrimary = !(p.ltd_id && p.ltd_id.endsWith('2') && p.ltd_id.length > 1);
      merged.push({
        primary: isPrimary ? p : partner,
        secondary: isPrimary ? partner : p,
      });
    } else {
      merged.push({ primary: p, secondary: null });
    }
  }
  return merged;
}

// Build tree from flat profiles
function buildTree(profiles, rootId) {
  const childrenMap = new Map();
  for (const p of profiles) {
    if (p.sponsor_id) {
      if (!childrenMap.has(p.sponsor_id)) childrenMap.set(p.sponsor_id, []);
      childrenMap.get(p.sponsor_id).push(p);
    }
  }

  const globalSeen = new Set();
  const build = (parentId, depth = 0) => {
    if (depth > 12) return [];
    const children = childrenMap.get(parentId) || [];
    const result = [];
    for (const c of children) {
      if (globalSeen.has(c.id)) continue;
      globalSeen.add(c.id);
      const partnerLtd = getPartnerLtdId(c.ltd_id);
      const partner = partnerLtd ? profiles.find(x => x.ltd_id === partnerLtd && !globalSeen.has(x.id)) : null;
      if (partner) globalSeen.add(partner.id);

      // Merge partner children
      let nodeChildren = build(c.id, depth + 1);
      if (partner) {
        nodeChildren = nodeChildren.concat(build(partner.id, depth + 1));
      }
      nodeChildren.sort((a, b) => b.totalDescendants - a.totalDescendants);

      const countDesc = (nodes) => nodes.reduce((sum, n) => sum + 1 + countDesc(n.children), 0);
      const totalDescendants = countDesc(nodeChildren);

      // Husband first
      let primary = c;
      let sec = partner;
      if (partner && c.ltd_id && c.ltd_id.endsWith('2') && c.ltd_id.length > 1) {
        primary = partner;
        sec = c;
      }

      result.push({ ...primary, partner: sec, children: nodeChildren, totalDescendants });
    }
    result.sort((a, b) => b.totalDescendants - a.totalDescendants);
    return result;
  };

  // Find root user
  const root = profiles.find(p => p.id === rootId);
  if (!root) return [];
  globalSeen.add(root.id);
  const partnerLtd = getPartnerLtdId(root?.ltd_id);
  const rootPartner = partnerLtd ? profiles.find(x => x.ltd_id === partnerLtd) : null;
  if (rootPartner) globalSeen.add(rootPartner.id);

  let rootChildren = build(root.id, 0);
  if (rootPartner) rootChildren = rootChildren.concat(build(rootPartner.id, 0));
  rootChildren.sort((a, b) => b.totalDescendants - a.totalDescendants);

  return rootChildren;
}

export default function LOSBuilderPage() {
  const [auth, setAuth] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [unplaced, setUnplaced] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [mode, setMode] = useState('staging'); // 'staging' | 'flat'
  const [search, setSearch] = useState('');
  const [treeSearch, setTreeSearch] = useState('');
  const [expanded, setExpanded] = useState(new Set());
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [rootUserId, setRootUserId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  // Auth check
  useEffect(() => {
    const check = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const res = await fetch('/api/admin/leadership-access?action=check');
          const access = await res.json();
          if (access.hasAccess && access.level === 'leadership') {
            setAuth(true);
            // Find the root user (the logged-in user or an admin)
            setRootUserId(user.id);
          }
        }
      } catch (e) {
        console.error('LOS Builder auth check failed:', e);
      }
      setAuthChecking(false);
    };
    check();
  }, []);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/los-builder');
      const data = await res.json();
      setProfiles(data.profiles || []);
      setUnplaced(data.unplaced || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { if (auth) fetchData(); }, [auth, fetchData]);

  // Place user
  const placeUser = async (userId, sponsorId) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/los-builder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newSponsorId: sponsorId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('User placed successfully');
        await fetchData();
      } else {
        showToast(data.error || 'Failed to place user');
      }
    } catch (e) { showToast('Error placing user'); }
    setSaving(false);
  };

  // Unplace user (move back to staging)
  const unplaceUser = async (userId) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/los-builder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newSponsorId: null }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('User moved to unplaced');
        await fetchData();
      }
    } catch (e) { showToast('Error'); }
    setSaving(false);
  };

  // Delete user
  const deleteUser = async (userId, unlock) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/los-builder?userId=${userId}&unlock=${unlock}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('User removed');
        await fetchData();
      }
    } catch (e) { showToast('Error'); }
    setSaving(false);
    setConfirmDelete(null);
  };

  // DnD handlers
  const onDragStart = (e, userId) => {
    setDragging(userId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', userId);
  };

  const onDragOver = (e, targetId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (targetId !== dragging) setDragOver(targetId);
  };

  const onDragLeave = () => setDragOver(null);

  const onDrop = async (e, sponsorId) => {
    e.preventDefault();
    const userId = e.dataTransfer.getData('text/plain');
    setDragging(null);
    setDragOver(null);
    if (userId && userId !== sponsorId) {
      await placeUser(userId, sponsorId);
    }
  };

  const toggleExpand = (id) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    const all = new Set();
    profiles.forEach(p => all.add(p.id));
    setExpanded(all);
  };

  // Build tree data
  const placed = profiles.filter(p => p.sponsor_id);
  const tree = rootUserId ? buildTree(profiles, rootUserId) : [];

  // Merge unplaced into partner pairs
  const unplacedPairs = mergePartners(unplaced);
  const filteredUnplaced = unplacedPairs.filter(pair => {
    const s = search.toLowerCase();
    if (!s) return true;
    const p = pair.primary;
    const sec = pair.secondary;
    return (p.full_name || '').toLowerCase().includes(s)
      || (p.ltd_id || '').includes(s)
      || (sec?.full_name || '').toLowerCase().includes(s)
      || (sec?.ltd_id || '').includes(s);
  });

  // For flat mode: all profiles as partner pairs
  const allPairs = mergePartners(profiles);
  const filteredAll = allPairs.filter(pair => {
    const s = search.toLowerCase();
    if (!s) return true;
    return (pair.primary.full_name || '').toLowerCase().includes(s)
      || (pair.primary.ltd_id || '').includes(s)
      || (pair.secondary?.full_name || '').toLowerCase().includes(s)
      || (pair.secondary?.ltd_id || '').includes(s);
  });

  // Styles
  const inputStyle = {
    width: '100%', padding: '10px 12px', background: 'white',
    border: '1px solid rgba(26,26,26,0.15)', outline: 'none',
    color: colors.dark, fontSize: '14px', boxSizing: 'border-box',
  };

  if (authChecking) return (
    <div style={{ minHeight: '100vh', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <p style={{ color: 'rgba(26,26,26,0.4)' }}>Checking access...</p>
    </div>
  );

  if (!auth) return (
    <div style={{ minHeight: '100vh', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: colors.dark, fontSize: '18px', marginBottom: '8px' }}>Leadership Access Required</p>
        <p style={{ color: 'rgba(26,26,26,0.5)', fontSize: '14px' }}>You need leadership-level access to use the LOS Builder.</p>
        <a href="/admin/leadership" style={{ color: colors.gold, fontSize: '14px', textDecoration: 'none', borderBottom: '1px solid rgba(184,149,107,0.4)' }}>Back to Portal</a>
      </div>
    </div>
  );

  // Tree node component
  const TreeNode = ({ node, depth = 0 }) => {
    const isExpanded = expanded.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isDragTarget = dragOver === node.id;
    const matchesSearch = treeSearch && (
      (node.full_name || '').toLowerCase().includes(treeSearch.toLowerCase())
      || (node.ltd_id || '').includes(treeSearch)
      || (node.partner?.full_name || '').toLowerCase().includes(treeSearch.toLowerCase())
    );

    return (
      <div style={{ marginLeft: depth > 0 ? '24px' : 0 }}>
        <div
          draggable
          onDragStart={(e) => onDragStart(e, node.id)}
          onDragOver={(e) => onDragOver(e, node.id)}
          onDragLeave={onDragLeave}
          onDrop={(e) => onDrop(e, node.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 12px', marginBottom: '2px',
            background: isDragTarget ? 'rgba(34,197,94,0.1)' : matchesSearch ? 'rgba(184,149,107,0.1)' : 'white',
            border: `1px solid ${isDragTarget ? 'rgba(34,197,94,0.4)' : matchesSearch ? 'rgba(184,149,107,0.3)' : 'rgba(26,26,26,0.08)'}`,
            cursor: 'grab',
            transition: 'all 0.15s ease',
          }}
        >
          {/* Expand toggle */}
          <button
            onClick={() => toggleExpand(node.id)}
            style={{
              width: '20px', height: '20px', background: 'none', border: 'none', cursor: 'pointer',
              color: hasChildren ? colors.dark : 'rgba(26,26,26,0.15)', fontSize: '12px', padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {hasChildren ? (isExpanded ? '\u25BC' : '\u25B6') : '\u2022'}
          </button>

          {/* Drag handle */}
          <span style={{ color: 'rgba(26,26,26,0.2)', cursor: 'grab', fontSize: '14px', userSelect: 'none' }}>{'\u2261'}</span>

          {/* Name + partner */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: colors.dark }}>{node.full_name}</span>
              {node.partner && (
                <span style={{ fontSize: '12px', color: 'rgba(26,26,26,0.4)' }}>&amp; {node.partner.full_name}</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <span style={{ fontSize: '11px', color: 'rgba(26,26,26,0.35)', fontVariantNumeric: 'tabular-nums' }}>{node.ltd_id}</span>
              {hasChildren && (
                <span style={{ fontSize: '10px', color: 'rgba(26,26,26,0.3)', background: 'rgba(26,26,26,0.04)', padding: '1px 5px' }}>
                  {node.totalDescendants} in leg
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <button
            onClick={() => unplaceUser(node.id)}
            title="Move to unplaced"
            style={{
              background: 'none', border: '1px solid rgba(26,26,26,0.1)', cursor: 'pointer',
              color: 'rgba(26,26,26,0.3)', padding: '4px 8px', fontSize: '11px',
            }}
            onMouseEnter={(e) => { e.target.style.color = '#ef4444'; e.target.style.borderColor = '#ef4444'; }}
            onMouseLeave={(e) => { e.target.style.color = 'rgba(26,26,26,0.3)'; e.target.style.borderColor = 'rgba(26,26,26,0.1)'; }}
          >
            Unplace
          </button>
        </div>

        {/* Children */}
        {isExpanded && hasChildren && (
          <div style={{ borderLeft: '1px solid rgba(26,26,26,0.08)', marginLeft: '10px' }}>
            {node.children.map(child => (
              <TreeNode key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap');`}</style>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid rgba(26,26,26,0.08)', padding: '14px 20px', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href="/admin/leadership" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.dark, textDecoration: 'none' }}>
              {'\u2190'} Leadership Portal
            </a>
          </div>
          <span style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.gold }}>LOS Builder</span>
        </div>
      </nav>

      {/* Header */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(26,26,26,0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '28px', color: colors.dark, fontWeight: 400, margin: '0 0 8px' }}>
            Line of Sponsorship Builder
          </h1>
          <p style={{ color: 'rgba(26,26,26,0.45)', fontSize: '14px', margin: 0 }}>
            Drag and drop to place team members in the organization tree.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '24px', marginTop: '16px', fontSize: '13px' }}>
            <span style={{ color: 'rgba(26,26,26,0.5)' }}>
              <span style={{ fontWeight: 600, color: colors.dark }}>{profiles.length}</span> total members
            </span>
            <span style={{ color: 'rgba(26,26,26,0.5)' }}>
              <span style={{ fontWeight: 600, color: unplaced.length > 0 ? '#f59e0b' : '#22c55e' }}>{unplaced.length}</span> unplaced
            </span>
            <span style={{ color: 'rgba(26,26,26,0.5)' }}>
              <span style={{ fontWeight: 600, color: colors.dark }}>{placed.length}</span> placed
            </span>
          </div>

          {/* Mode toggle */}
          <div style={{ display: 'flex', gap: '4px', marginTop: '16px' }}>
            <button
              onClick={() => setMode('staging')}
              style={{
                padding: '8px 16px', fontSize: '12px', letterSpacing: '0.05em',
                textTransform: 'uppercase', border: 'none', cursor: 'pointer',
                background: mode === 'staging' ? colors.dark : 'rgba(26,26,26,0.06)',
                color: mode === 'staging' ? colors.bg : 'rgba(26,26,26,0.5)',
              }}
            >
              Staging {'\u2192'} Tree
            </button>
            <button
              onClick={() => setMode('flat')}
              style={{
                padding: '8px 16px', fontSize: '12px', letterSpacing: '0.05em',
                textTransform: 'uppercase', border: 'none', cursor: 'pointer',
                background: mode === 'flat' ? colors.dark : 'rgba(26,26,26,0.06)',
                color: mode === 'flat' ? colors.bg : 'rgba(26,26,26,0.5)',
              }}
            >
              Flat List
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(26,26,26,0.4)' }}>Loading team data...</div>
        ) : mode === 'staging' ? (
          /* ═══ STAGING MODE ═══ */
          <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '20px', alignItems: 'start' }}>
            {/* Left: Unplaced pool */}
            <div style={{ position: 'sticky', top: '20px' }}>
              <div style={{ background: 'white', border: '1px solid rgba(26,26,26,0.1)' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(26,26,26,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', margin: 0 }}>
                    Unplaced ({unplaced.length})
                  </p>
                  {unplaced.length === 0 && (
                    <span style={{ fontSize: '11px', color: '#22c55e' }}>{'\u2713'} All placed</span>
                  )}
                </div>

                <div style={{ padding: '8px' }}>
                  <input
                    type="text"
                    placeholder="Search unplaced..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ ...inputStyle, fontSize: '13px', padding: '8px 10px' }}
                  />
                </div>

                <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '4px 8px 8px' }}>
                  {filteredUnplaced.length === 0 ? (
                    <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.3)', textAlign: 'center', padding: '20px 0' }}>
                      {search ? 'No matches' : 'Everyone is placed!'}
                    </p>
                  ) : filteredUnplaced.map(pair => (
                    <div
                      key={pair.primary.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, pair.primary.id)}
                      style={{
                        padding: '10px 12px', marginBottom: '4px',
                        background: dragging === pair.primary.id ? 'rgba(184,149,107,0.1)' : 'rgba(26,26,26,0.02)',
                        border: '1px solid rgba(26,26,26,0.06)',
                        cursor: 'grab',
                        opacity: dragging === pair.primary.id ? 0.5 : 1,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: colors.dark }}>{pair.primary.full_name}</span>
                        {pair.secondary && (
                          <span style={{ fontSize: '12px', color: 'rgba(26,26,26,0.4)' }}>&amp; {pair.secondary.full_name}</span>
                        )}
                      </div>
                      <span style={{ fontSize: '11px', color: 'rgba(26,26,26,0.35)', fontVariantNumeric: 'tabular-nums' }}>{pair.primary.ltd_id}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Tree */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <input
                  type="text"
                  placeholder="Search tree..."
                  value={treeSearch}
                  onChange={(e) => setTreeSearch(e.target.value)}
                  style={{ ...inputStyle, maxWidth: '240px', fontSize: '13px', padding: '8px 10px' }}
                />
                <button onClick={expandAll} style={{
                  padding: '8px 12px', fontSize: '11px', background: 'rgba(26,26,26,0.04)',
                  border: '1px solid rgba(26,26,26,0.1)', cursor: 'pointer', color: 'rgba(26,26,26,0.5)',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  Expand All
                </button>
                <button onClick={() => setExpanded(new Set())} style={{
                  padding: '8px 12px', fontSize: '11px', background: 'rgba(26,26,26,0.04)',
                  border: '1px solid rgba(26,26,26,0.1)', cursor: 'pointer', color: 'rgba(26,26,26,0.5)',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  Collapse All
                </button>
              </div>

              {/* Root drop zone (for placing directly under the logged-in user) */}
              <div
                onDragOver={(e) => onDragOver(e, rootUserId)}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(e, rootUserId)}
                style={{
                  padding: '12px 16px', marginBottom: '8px',
                  background: dragOver === rootUserId ? 'rgba(34,197,94,0.1)' : 'rgba(184,149,107,0.06)',
                  border: `1px dashed ${dragOver === rootUserId ? '#22c55e' : 'rgba(184,149,107,0.3)'}`,
                  textAlign: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: '12px', color: dragOver === rootUserId ? '#22c55e' : colors.gold }}>
                  {dragOver === rootUserId ? 'Drop here to place as direct downline' : 'Your Organization (drop here for direct placement)'}
                </span>
              </div>

              {tree.length === 0 && placed.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(26,26,26,0.3)', fontSize: '14px' }}>
                  Drag members from the unplaced pool and drop them here to build your tree.
                </div>
              ) : (
                tree.map(node => <TreeNode key={node.id} node={node} depth={0} />)
              )}
            </div>
          </div>
        ) : (
          /* ═══ FLAT LIST MODE ═══ */
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Search all members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ ...inputStyle, maxWidth: '320px', fontSize: '13px', padding: '8px 10px' }}
              />
              <span style={{ fontSize: '12px', color: 'rgba(26,26,26,0.4)' }}>
                Drag a person onto another to set them as downline
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {filteredAll.map(pair => {
                const p = pair.primary;
                const isUnplaced = !p.sponsor_id;
                const isDragTarget = dragOver === p.id;
                const sponsor = p.sponsor_id ? profiles.find(x => x.id === p.sponsor_id) : null;

                return (
                  <div
                    key={p.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, p.id)}
                    onDragOver={(e) => onDragOver(e, p.id)}
                    onDragLeave={onDragLeave}
                    onDrop={(e) => onDrop(e, p.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '10px 16px',
                      background: isDragTarget ? 'rgba(34,197,94,0.1)' : isUnplaced ? 'rgba(245,158,11,0.04)' : 'white',
                      border: `1px solid ${isDragTarget ? 'rgba(34,197,94,0.4)' : isUnplaced ? 'rgba(245,158,11,0.15)' : 'rgba(26,26,26,0.08)'}`,
                      cursor: 'grab',
                      opacity: dragging === p.id ? 0.5 : 1,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ color: 'rgba(26,26,26,0.2)', cursor: 'grab', fontSize: '14px', userSelect: 'none' }}>{'\u2261'}</span>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: colors.dark }}>{p.full_name}</span>
                        {pair.secondary && (
                          <span style={{ fontSize: '12px', color: 'rgba(26,26,26,0.4)' }}>&amp; {pair.secondary.full_name}</span>
                        )}
                        {isUnplaced && (
                          <span style={{ fontSize: '10px', padding: '2px 6px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontWeight: 500 }}>UNPLACED</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                        <span style={{ fontSize: '11px', color: 'rgba(26,26,26,0.35)', fontVariantNumeric: 'tabular-nums' }}>{p.ltd_id}</span>
                        {sponsor && (
                          <span style={{ fontSize: '11px', color: 'rgba(26,26,26,0.3)' }}>
                            under {sponsor.full_name}
                          </span>
                        )}
                      </div>
                    </div>

                    {!isUnplaced && (
                      <button
                        onClick={() => unplaceUser(p.id)}
                        style={{
                          background: 'none', border: '1px solid rgba(26,26,26,0.1)', cursor: 'pointer',
                          color: 'rgba(26,26,26,0.3)', padding: '4px 8px', fontSize: '11px',
                        }}
                      >
                        Unplace
                      </button>
                    )}

                    <button
                      onClick={() => setConfirmDelete(p)}
                      style={{
                        background: 'none', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer',
                        color: 'rgba(239,68,68,0.5)', padding: '4px 8px', fontSize: '11px',
                      }}
                    >
                      {'\u2715'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{ background: 'white', padding: '24px', maxWidth: '400px', width: '90%' }}>
            <h3 style={{ fontSize: '16px', color: colors.dark, margin: '0 0 8px', fontWeight: 500 }}>
              Remove {confirmDelete.full_name}?
            </h3>
            <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.6)', marginBottom: '20px' }}>
              This will permanently delete this user account.
              {confirmDelete.direct_downline_count > 0 && ` They have ${confirmDelete.direct_downline_count} direct downline member(s).`}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {confirmDelete.direct_downline_count > 0 && (
                <button
                  onClick={() => deleteUser(confirmDelete.id, true)}
                  disabled={saving}
                  style={{
                    padding: '12px', background: '#ef4444', color: 'white',
                    border: 'none', cursor: 'pointer', fontSize: '13px',
                  }}
                >
                  Delete &amp; Unlock Downline
                </button>
              )}
              <button
                onClick={() => deleteUser(confirmDelete.id, false)}
                disabled={saving}
                style={{
                  padding: '12px', background: colors.dark, color: colors.bg,
                  border: 'none', cursor: 'pointer', fontSize: '13px',
                }}
              >
                {confirmDelete.direct_downline_count > 0 ? 'Delete (Keep Downline Placement)' : 'Delete User'}
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{
                  padding: '12px', background: 'rgba(26,26,26,0.04)', color: 'rgba(26,26,26,0.6)',
                  border: '1px solid rgba(26,26,26,0.1)', cursor: 'pointer', fontSize: '13px',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          background: colors.dark, color: colors.bg, padding: '12px 24px',
          fontSize: '13px', zIndex: 1000,
        }}>
          {toast}
        </div>
      )}

      {/* Saving overlay */}
      {saving && (
        <div style={{
          position: 'fixed', top: '60px', right: '20px',
          background: 'white', border: '1px solid rgba(26,26,26,0.1)',
          padding: '8px 16px', fontSize: '12px', color: 'rgba(26,26,26,0.5)',
          zIndex: 1000,
        }}>
          Saving...
        </div>
      )}
    </div>
  );
}
