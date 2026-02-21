"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/app/lib/supabase/client';

const colors = { bg: '#fafaf8', dark: '#1a1a1a', gold: '#b8956b' };

const Icons = {
  Logout: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>,
  Book: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>,
  Video: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>,
  File: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>,
  Tool: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>,
  Music: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>,
  Users: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>,
  Clock: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
  ExternalLink: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>,
  ChevronDown: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 9l6 6 6-6" /></svg>,
};

const typeIcons = { document: Icons.File, media: Icons.Music, video: Icons.Video, tool: Icons.Tool };
const typeColors = {
  document: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', color: '#3b82f6' },
  media: { bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.2)', color: '#ec4899' },
  video: { bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.2)', color: '#a855f7' },
  tool: { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', color: '#22c55e' },
};

// ═══════════════ LOS TREE COMPONENT ═══════════════
const LOSTree = ({ userId }) => {
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/los')
      .then(r => r.json())
      .then(data => { setTree(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [userId]);

  if (loading) return <p style={{ color: 'rgba(26,26,26,0.4)', fontSize: '14px' }}>Loading LOS...</p>;
  if (!tree || !tree.user) return <p style={{ color: 'rgba(26,26,26,0.4)', fontSize: '14px' }}>No LOS data available.</p>;

  const PersonCard = ({ person, isCurrentUser, isSponsor }) => {
    const roleBadge = {
      admin: { bg: 'rgba(184,149,107,0.15)', color: colors.gold, label: 'Admin' },
      sponsor: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', label: 'Sponsor' },
      member: { bg: 'rgba(26,26,26,0.06)', color: 'rgba(26,26,26,0.5)', label: 'Member' },
    };
    const badge = roleBadge[person.role] || roleBadge.member;

    return (
      <div style={{
        padding: '16px 20px',
        background: isCurrentUser ? 'rgba(184,149,107,0.06)' : 'white',
        border: isCurrentUser ? `1px solid rgba(184,149,107,0.3)` : '1px solid rgba(26,26,26,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
      }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <p style={{ fontSize: '15px', fontWeight: 500, color: colors.dark, margin: 0 }}>{person.full_name || 'Unnamed'}</p>
            {isCurrentUser && <span style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.gold, fontWeight: 600 }}>You</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', padding: '2px 8px', background: badge.bg, color: badge.color, borderRadius: '2px' }}>{badge.label}</span>
            {person.ltd_id && <span style={{ fontSize: '11px', color: 'rgba(26,26,26,0.35)' }}>LTD #{person.ltd_id}</span>}
            {isSponsor && <span style={{ fontSize: '11px', color: 'rgba(26,26,26,0.35)' }}>Your Sponsor</span>}
          </div>
        </div>
        {person.direct_downline_count > 0 && (
          <span style={{ fontSize: '12px', color: 'rgba(26,26,26,0.4)' }}>{person.direct_downline_count} downline</span>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Upline Chain */}
      {tree.upline && tree.upline.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.35)', marginBottom: '8px' }}>Upline</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {tree.upline.map((person, i) => (
              <div key={person.id}>
                <PersonCard person={person} isSponsor={i === 0} />
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
                  <div style={{ width: '1px', height: '16px', background: 'rgba(26,26,26,0.1)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current User */}
      <div style={{ marginBottom: '16px' }}>
        <PersonCard person={tree.user} isCurrentUser />
      </div>

      {/* Downline */}
      {tree.downline && tree.downline.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0', marginBottom: '8px' }}>
            <div style={{ width: '1px', height: '16px', background: 'rgba(184,149,107,0.3)' }} />
          </div>
          <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.35)', marginBottom: '8px' }}>Your Team ({tree.downline.length})</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {tree.downline.map(person => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════ MAIN DASHBOARD ═══════════════
export default function ResourcesDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState('library');
  const [resources, setResources] = useState([]);
  const [activity, setActivity] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/resources/login'; return; }
      setUser(user);

      // Fetch profile
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(prof);

      // Log page view
      fetch('/api/resources/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'page_view', pagePath: '/resources' }),
      });

      // Fetch resources
      fetch('/api/resources').then(r => r.json()).then(data => setResources(data.resources || []));

      // Fetch activity
      const { data: logs } = await supabase
        .from('access_logs')
        .select('*, resources(title, type)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      setActivity(logs || []);

      setLoading(false);
    };
    init();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/resources/login';
  };

  const logResourceView = (resourceId) => {
    fetch('/api/resources/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'view', resourceId }),
    });
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <p style={{ color: 'rgba(26,26,26,0.5)' }}>Loading...</p>
    </div>
  );

  const tabs = [
    { id: 'library', label: 'Library', icon: Icons.Book },
    { id: 'los', label: 'My LOS', icon: Icons.Users },
    { id: 'activity', label: 'Activity', icon: Icons.Clock },
  ];

  const filteredResources = filterType === 'all' ? resources : resources.filter(r => r.type === filterType);
  const grouped = {};
  filteredResources.forEach(r => {
    const cat = r.category || 'General';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(r);
  });

  const formatTime = (ts) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap');`}</style>

      {/* Header */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(250,250,248,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(26,26,26,0.05)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a href="/" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.dark, textDecoration: 'none' }}>Freedom Family</a>
            <span style={{ fontSize: '10px', color: 'rgba(26,26,26,0.2)' }}>/</span>
            <span style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.gold }}>Resources</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '12px', color: 'rgba(26,26,26,0.5)' }}>{profile?.full_name || user?.email}</span>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(26,26,26,0.4)', fontSize: '11px' }}>
              <Icons.Logout style={{ width: '14px', height: '14px' }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid rgba(26,26,26,0.05)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px', display: 'flex', gap: '0' }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '14px 20px',
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '12px', letterSpacing: '0.05em',
                color: tab === t.id ? colors.dark : 'rgba(26,26,26,0.4)',
                borderBottom: tab === t.id ? `2px solid ${colors.gold}` : '2px solid transparent',
                marginBottom: '-1px',
              }}
            >
              <t.icon style={{ width: '14px', height: '14px' }} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }}>
        {/* LIBRARY TAB */}
        {tab === 'library' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '28px', color: colors.dark, fontWeight: 400, margin: 0 }}>Resource Library</h1>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[{ id: 'all', label: 'All' }, { id: 'document', label: 'Docs' }, { id: 'media', label: 'Media' }, { id: 'video', label: 'Video' }, { id: 'tool', label: 'Tools' }].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFilterType(f.id)}
                    style={{
                      padding: '6px 14px', fontSize: '11px', letterSpacing: '0.05em',
                      background: filterType === f.id ? colors.dark : 'transparent',
                      color: filterType === f.id ? colors.bg : 'rgba(26,26,26,0.5)',
                      border: filterType === f.id ? 'none' : '1px solid rgba(26,26,26,0.12)',
                      cursor: 'pointer',
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredResources.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <Icons.Book style={{ width: '32px', height: '32px', color: 'rgba(26,26,26,0.15)', margin: '0 auto 16px' }} />
                <p style={{ color: 'rgba(26,26,26,0.4)', fontSize: '14px' }}>No resources yet. Check back soon!</p>
              </div>
            ) : (
              Object.entries(grouped).map(([category, items]) => (
                <div key={category} style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.gold, margin: 0, fontWeight: 600 }}>{category}</p>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(184,149,107,0.2)' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {items.map(resource => {
                      const tc = typeColors[resource.type] || typeColors.document;
                      const TypeIcon = typeIcons[resource.type] || Icons.File;
                      return (
                        <a
                          key={resource.id}
                          href={resource.url || '#'}
                          target={resource.url ? '_blank' : undefined}
                          rel="noopener noreferrer"
                          onClick={() => logResourceView(resource.id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '16px',
                            padding: '16px 20px', background: 'white',
                            border: '1px solid rgba(26,26,26,0.08)',
                            textDecoration: 'none', cursor: 'pointer',
                          }}
                        >
                          <div style={{ width: '40px', height: '40px', background: tc.bg, border: `1px solid ${tc.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <TypeIcon style={{ width: '18px', height: '18px', color: tc.color }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '15px', fontWeight: 500, color: colors.dark, margin: '0 0 3px' }}>{resource.title}</p>
                            {resource.description && <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.45)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{resource.description}</p>}
                          </div>
                          {resource.url && <Icons.ExternalLink style={{ width: '14px', height: '14px', color: 'rgba(26,26,26,0.2)', flexShrink: 0 }} />}
                        </a>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* LOS TAB */}
        {tab === 'los' && (
          <div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '28px', color: colors.dark, fontWeight: 400, margin: '0 0 24px' }}>Line of Sponsorship</h1>
            <LOSTree userId={user?.id} />
          </div>
        )}

        {/* ACTIVITY TAB */}
        {tab === 'activity' && (
          <div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '28px', color: colors.dark, fontWeight: 400, margin: '0 0 24px' }}>Your Activity</h1>
            {activity.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <Icons.Clock style={{ width: '32px', height: '32px', color: 'rgba(26,26,26,0.15)', margin: '0 auto 16px' }} />
                <p style={{ color: 'rgba(26,26,26,0.4)', fontSize: '14px' }}>No activity yet. Start exploring resources!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {activity.map((log) => (
                  <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', background: 'white', border: '1px solid rgba(26,26,26,0.06)' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: log.action === 'view' ? colors.gold : log.action === 'page_view' ? 'rgba(26,26,26,0.2)' : '#3b82f6', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '13px', color: colors.dark, margin: 0 }}>
                        {log.action === 'page_view' ? `Visited ${log.page_path || '/resources'}` :
                         log.action === 'view' ? `Viewed ${log.resources?.title || 'a resource'}` :
                         log.action === 'download' ? `Downloaded ${log.resources?.title || 'a resource'}` :
                         `${log.action} ${log.resources?.title || ''}`}
                      </p>
                    </div>
                    <span style={{ fontSize: '11px', color: 'rgba(26,26,26,0.3)', flexShrink: 0 }}>{formatTime(log.created_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <footer style={{ padding: '32px 20px', borderTop: '1px solid rgba(26,26,26,0.05)', marginTop: '40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.25)', textDecoration: 'none' }}>Freedom Family</a>
          <span style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.25)' }}>LTD</span>
        </div>
      </footer>
    </div>
  );
}
