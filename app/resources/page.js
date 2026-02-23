"use client";

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { createClient } from '@/app/lib/supabase/client';

const RadialTree = lazy(() => import('./radial-tree'));

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
  Plus: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 5v14M5 12h14" /></svg>,
  Copy: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>,
  Calendar: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>,
  Check: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>,
  Home: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><path d="M9 22V12h6v10" /></svg>,
  Search: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>,
  XCircle: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></svg>,
};

const typeIcons = { document: Icons.File, media: Icons.Music, video: Icons.Video, tool: Icons.Tool };
const typeColors = {
  document: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', color: '#3b82f6' },
  media: { bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.2)', color: '#ec4899' },
  video: { bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.2)', color: '#a855f7' },
  tool: { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', color: '#22c55e' },
};

// ═══════════════ INVITE MODAL ═══════════════
const InviteModal = ({ isOpen, onClose }) => {
  const [ltdId, setLtdId] = useState('');
  const [role, setRole] = useState('sponsor');
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ltdId: ltdId.trim() || null, role }),
      });
      const data = await res.json();
      if (data.invite) {
        const link = `${window.location.origin}/resources/signup?token=${data.invite.token}`;
        setInviteLink(link);
      }
    } catch (err) {
      console.error('Invite error:', err);
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Freedom Family - Join Our Team',
          text: 'You\'re invited to join Freedom Family! Create your account here:',
          url: inviteLink,
        });
      } catch (err) {
        // User cancelled or share failed — fall back to copy
        if (err.name !== 'AbortError') handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleClose = () => {
    setLtdId('');
    setRole('sponsor');
    setInviteLink('');
    setCopied(false);
    onClose();
  };

  if (!isOpen) return null;

  const inputStyle = {
    width: '100%', padding: '12px', background: 'white',
    border: '1px solid rgba(26,26,26,0.15)', outline: 'none',
    color: colors.dark, fontSize: '14px', boxSizing: 'border-box',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={handleClose}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.4)', backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'relative', background: colors.bg, maxWidth: '420px', width: '100%', padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '24px', color: colors.dark, fontWeight: 400, margin: '0 0 6px' }}>Invite a Team Member</h2>
        <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.45)', margin: '0 0 24px' }}>Generate a signup link to share</p>

        {!inviteLink ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', display: 'block', marginBottom: '6px' }}>Their LTD ID <span style={{ fontSize: '9px', color: 'rgba(26,26,26,0.3)', textTransform: 'none', letterSpacing: 'normal' }}>(optional)</span></label>
              <input type="text" value={ltdId} onChange={e => setLtdId(e.target.value.replace(/\D/g, ''))} placeholder="e.g. 2118394" style={inputStyle} inputMode="numeric" />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button onClick={handleClose} style={{ flex: 1, padding: '14px', background: 'transparent', border: '1px solid rgba(26,26,26,0.12)', color: 'rgba(26,26,26,0.5)', fontSize: '12px', letterSpacing: '0.05em', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleCreate} disabled={loading} style={{ flex: 1, padding: '14px', background: colors.dark, color: colors.bg, border: 'none', fontSize: '12px', letterSpacing: '0.05em', cursor: 'pointer' }}>
                {loading ? 'Creating...' : 'Generate Link'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: `1px solid ${colors.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icons.Check style={{ width: '16px', height: '16px', color: colors.gold }} />
              </div>
              <p style={{ fontSize: '14px', color: colors.dark, margin: 0, fontWeight: 500 }}>Invite link created!</p>
            </div>
            <div style={{ padding: '12px', background: 'rgba(26,26,26,0.03)', border: '1px solid rgba(26,26,26,0.08)', fontSize: '12px', color: 'rgba(26,26,26,0.6)', wordBreak: 'break-all', marginBottom: '16px', lineHeight: 1.5 }}>
              {inviteLink}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleCopy} style={{ flex: 1, padding: '14px', background: 'transparent', border: '1px solid rgba(26,26,26,0.12)', color: 'rgba(26,26,26,0.5)', fontSize: '12px', letterSpacing: '0.05em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Icons.Copy style={{ width: '14px', height: '14px' }} />
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button onClick={handleShare} style={{ flex: 1, padding: '14px', background: colors.dark, color: colors.bg, border: 'none', fontSize: '12px', letterSpacing: '0.05em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <svg style={{ width: '14px', height: '14px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" /></svg>
                Share
              </button>
            </div>
            <p style={{ fontSize: '11px', color: 'rgba(26,26,26,0.35)', margin: '12px 0 0', textAlign: 'center' }}>Link expires in 30 days</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════ LOS TREE COMPONENT ═══════════════
const LOSTree = ({ userId, profile }) => {
  const [tree, setTree] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAttendance, setShowAttendance] = useState(false);
  const [losView, setLosView] = useState('list'); // 'list' | 'radial'

  useEffect(() => {
    Promise.all([
      fetch('/api/los').then(r => r.json()),
      fetch('/api/los/attendance').then(r => r.json()).catch(() => ({ records: [] })),
    ]).then(([treeData, attendanceData]) => {
      setTree(treeData);
      setAttendance(attendanceData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [userId]);

  if (loading) return <p style={{ color: 'rgba(26,26,26,0.4)', fontSize: '14px' }}>Loading LOS...</p>;
  if (!tree || !tree.user) return <p style={{ color: 'rgba(26,26,26,0.4)', fontSize: '14px' }}>No LOS data available.</p>;

  // Gather all LOS member LTD IDs for attendance matching
  const getAllLosMembers = (downline) => {
    const members = [];
    const walk = (nodes) => {
      for (const n of nodes) {
        members.push({ name: n.full_name, ltd_id: n.ltd_id, partner_name: n.partner_name, partner_ltd_id: n.partner_ltd_id });
        if (n.children) walk(n.children);
      }
    };
    walk(downline || []);
    return members;
  };

  // Attendance Dashboard sub-component
  const AttendanceDashboard = ({ attendance, tree }) => {
    const [expandedMeeting, setExpandedMeeting] = useState({});
    const records = attendance?.records || [];
    const losMembers = getAllLosMembers(tree.downline);

    // Group records by actual meeting date
    const byDate = {};
    for (const rec of records) {
      const dateKey = rec.meeting_date || rec.date;
      if (!dateKey) continue;
      if (!byDate[dateKey]) byDate[dateKey] = [];
      byDate[dateKey].push(rec);
    }

    // Sort meeting dates newest first
    const meetingDates = Object.keys(byDate).sort((a, b) => new Date(b) - new Date(a));

    if (meetingDates.length === 0) return null;

    return (
      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.35)', marginBottom: '4px' }}>Meeting Attendance</p>
        {meetingDates.map(dateKey => {
          const meetingRecords = byDate[dateKey];
          const isExpanded = expandedMeeting[dateKey];

          // Build set of LTD IDs that attended this meeting
          const attendedLtdIds = new Set(meetingRecords.map(r => r.ltd_id));

          // Cross-reference with LOS — couples count as one unit
          const present = [];
          const missing = [];
          for (const m of losMembers) {
            const wasPresent = attendedLtdIds.has(m.ltd_id) || (m.partner_ltd_id && attendedLtdIds.has(m.partner_ltd_id));
            const displayName = m.partner_name ? `${m.name} & ${m.partner_name}` : m.name;
            if (wasPresent) {
              present.push(displayName);
            } else {
              missing.push(displayName);
            }
          }

          const totalAttended = meetingRecords.length;
          const meetingLabel = new Date(dateKey + 'T12:00:00-06:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'America/Chicago' });

          return (
            <div key={dateKey} style={{ background: 'white', border: '1px solid rgba(26,26,26,0.08)' }}>
              <button
                onClick={() => setExpandedMeeting(prev => ({ ...prev, [dateKey]: !prev[dateKey] }))}
                style={{
                  width: '100%', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: colors.dark }}>{meetingLabel}</span>
                  {present.length > 0 && (
                    <span style={{ fontSize: '10px', padding: '2px 8px', background: 'rgba(34,197,94,0.1)', color: '#22c55e', borderRadius: '2px' }}>
                      {present.length} present
                    </span>
                  )}
                  {missing.length > 0 && (
                    <span style={{ fontSize: '10px', padding: '2px 8px', background: 'rgba(239,68,68,0.06)', color: '#ef4444', borderRadius: '2px' }}>
                      {missing.length} missing
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: colors.dark }}>{totalAttended}</span>
                  <span style={{ fontSize: '11px', color: 'rgba(26,26,26,0.3)' }}>total</span>
                  <Icons.ChevronDown style={{ width: '14px', height: '14px', color: 'rgba(26,26,26,0.3)', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
              </button>
              {isExpanded && (
                <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(26,26,26,0.06)' }}>
                  {present.length > 0 && (
                    <div style={{ marginTop: '12px' }}>
                      <p style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#22c55e', marginBottom: '6px', fontWeight: 600 }}>Present from LOS ({present.length})</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {present.map((name, i) => (
                          <span key={i} style={{ fontSize: '11px', padding: '3px 8px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', color: colors.dark }}>{name}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {missing.length > 0 && (
                    <div style={{ marginTop: '12px' }}>
                      <p style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ef4444', marginBottom: '6px', fontWeight: 600 }}>Missing from LOS ({missing.length})</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {missing.map((name, i) => (
                          <span key={i} style={{ fontSize: '11px', padding: '3px 8px', background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)', color: 'rgba(26,26,26,0.5)' }}>{name}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const PersonCard = ({ person, isCurrentUser, isSponsor }) => {
    const roleBadge = {
      admin: { bg: 'rgba(184,149,107,0.15)', color: colors.gold, label: 'Admin' },
      sponsor: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', label: 'Sponsor' },
      member: { bg: 'rgba(26,26,26,0.06)', color: 'rgba(26,26,26,0.5)', label: 'Member' },
    };
    const badge = roleBadge[person.role] || roleBadge.member;

    // Find attendance for this person
    const personAttendance = attendance?.records?.filter(r => r.ltd_id === person.ltd_id) || [];

    return (
      <div style={{
        padding: '16px 20px',
        background: isCurrentUser ? 'rgba(184,149,107,0.06)' : 'white',
        border: isCurrentUser ? `1px solid rgba(184,149,107,0.3)` : '1px solid rgba(26,26,26,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {person.direct_downline_count > 0 && (
              <span style={{ fontSize: '12px', color: 'rgba(26,26,26,0.4)' }}>{person.direct_downline_count} downline</span>
            )}
            {showAttendance && personAttendance.length > 0 && (
              <span style={{ fontSize: '11px', padding: '2px 8px', background: 'rgba(34,197,94,0.1)', color: '#22c55e', borderRadius: '2px' }}>
                {personAttendance.length} event{personAttendance.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        {/* Attendance detail */}
        {showAttendance && personAttendance.length > 0 && (
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(26,26,26,0.06)' }}>
            {personAttendance.map((rec, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
                <span style={{ fontSize: '11px', color: 'rgba(26,26,26,0.5)' }}>{rec.event_source === 'bcs' ? 'BCS' : 'Info Session'}</span>
                <span style={{ fontSize: '11px', color: 'rgba(26,26,26,0.35)' }}>{new Date(rec.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span style={{ fontSize: '10px', padding: '1px 6px', background: rec.checked_in ? 'rgba(34,197,94,0.1)' : 'rgba(26,26,26,0.04)', color: rec.checked_in ? '#22c55e' : 'rgba(26,26,26,0.35)', borderRadius: '2px' }}>
                  {rec.checked_in ? 'Attended' : 'Registered'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const DownlineTree = ({ people, showAttendance, attendance, depth }) => {
    const [expanded, setExpanded] = useState({});
    const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {people.map(person => {
          const hasChildren = person.children && person.children.length > 0;
          const isExpanded = expanded[person.id];
          const personAttendance = attendance?.records?.filter(r => r.ltd_id === person.ltd_id || (person.partner_ltd_id && r.ltd_id === person.partner_ltd_id)) || [];
          const roleBadge = {
            admin: { bg: 'rgba(184,149,107,0.15)', color: colors.gold, label: 'Admin' },
            sponsor: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', label: 'Sponsor' },
            member: { bg: 'rgba(26,26,26,0.06)', color: 'rgba(26,26,26,0.5)', label: 'Member' },
          };
          const badge = roleBadge[person.role] || roleBadge.member;
          const displayName = person.partner_name
            ? `${person.full_name || 'Unnamed'} & ${person.partner_name}`
            : (person.full_name || 'Unnamed');
          const legCount = person.totalDescendants || 0;

          return (
            <div key={person.id}>
              <div style={{
                padding: '14px 16px',
                paddingLeft: `${16 + depth * 20}px`,
                background: 'white',
                border: '1px solid rgba(26,26,26,0.08)',
                display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                {hasChildren && (
                  <button onClick={() => toggle(person.id)} style={{
                    width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(26,26,26,0.04)', border: '1px solid rgba(26,26,26,0.1)',
                    borderRadius: '4px', cursor: 'pointer', flexShrink: 0, padding: 0,
                    transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s',
                  }}>
                    <Icons.ChevronDown style={{ width: '12px', height: '12px', color: 'rgba(26,26,26,0.4)' }} />
                  </button>
                )}
                {!hasChildren && depth > 0 && (
                  <div style={{ width: '22px', flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: colors.dark, margin: 0 }}>{displayName}</p>
                    {person.partner_name && (
                      <svg style={{ width: '12px', height: '12px', color: 'rgba(184,149,107,0.5)', flexShrink: 0 }} viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '10px', padding: '1px 6px', background: badge.bg, color: badge.color, borderRadius: '2px' }}>{badge.label}</span>
                    {person.ltd_id && <span style={{ fontSize: '10px', color: 'rgba(26,26,26,0.3)' }}>#{person.ltd_id}</span>}
                    {(hasChildren || legCount > 0) && (
                      <span style={{ fontSize: '10px', color: colors.gold, fontWeight: 600 }}>
                        {person.children?.length || 0}/{legCount}
                      </span>
                    )}
                  </div>
                </div>
                {showAttendance && personAttendance.length > 0 && (
                  <span style={{ fontSize: '10px', padding: '2px 6px', background: 'rgba(34,197,94,0.1)', color: '#22c55e', borderRadius: '2px', flexShrink: 0 }}>
                    {personAttendance.length}
                  </span>
                )}
              </div>
              {hasChildren && isExpanded && (
                <DownlineTree people={person.children} showAttendance={showAttendance} attendance={attendance} depth={depth + 1} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Calculate total team size
  const totalTeamSize = (() => {
    const count = (nodes) => {
      let c = 0;
      for (const n of (nodes || [])) { c += 1; if (n.children) c += count(n.children); }
      return c;
    };
    return count(tree.downline || []);
  })();

  return (
    <div>
      {/* View Toggle */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
        <button onClick={() => setLosView('list')} style={{
          padding: '8px 14px', fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase',
          border: 'none', cursor: 'pointer',
          background: losView === 'list' ? colors.dark : 'rgba(26,26,26,0.06)',
          color: losView === 'list' ? colors.bg : 'rgba(26,26,26,0.5)',
        }}>
          <span style={{ marginRight: '6px' }}>{'\u2630'}</span>List
        </button>
        <button onClick={() => setLosView('radial')} style={{
          padding: '8px 14px', fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase',
          border: 'none', cursor: 'pointer',
          background: losView === 'radial' ? colors.dark : 'rgba(26,26,26,0.06)',
          color: losView === 'radial' ? colors.bg : 'rgba(26,26,26,0.5)',
        }}>
          <span style={{ marginRight: '6px' }}>{'\u25B3'}</span>Drawing
        </button>
      </div>

      {/* Drawing View */}
      {losView === 'radial' && (
        <Suspense fallback={<p style={{ color: 'rgba(26,26,26,0.4)', fontSize: '14px' }}>Loading drawing...</p>}>
          <RadialTree tree={tree} />
        </Suspense>
      )}

      {/* List View */}
      {losView === 'list' && <>
      {/* Upline — compact display */}
      {tree.upline && tree.upline.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.35)', marginBottom: '8px' }}>Upline</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {tree.upline.map((person, i) => (
              <div key={person.id} style={{
                padding: '10px 16px', background: 'white', border: '1px solid rgba(26,26,26,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: colors.dark, margin: 0 }}>{person.full_name || 'Unnamed'}</p>
                  {i === tree.upline.length - 1 && (
                    <span style={{ fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: colors.gold, fontWeight: 600 }}>Sponsor</span>
                  )}
                </div>
                {person.ltd_id && <span style={{ fontSize: '10px', color: 'rgba(26,26,26,0.3)' }}>#{person.ltd_id}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* You + Partner */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          padding: '16px 20px',
          background: 'rgba(184,149,107,0.06)',
          border: `1px solid rgba(184,149,107,0.3)`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <span style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.gold, fontWeight: 600 }}>You</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(184,149,107,0.2)' }} />
            {totalTeamSize > 0 && (
              <span style={{ fontSize: '10px', color: 'rgba(26,26,26,0.4)' }}>{totalTeamSize} in team</span>
            )}
          </div>
          {tree.partner ? (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {[tree.user, tree.partner].map(person => (
                <div key={person.id} style={{ flex: '1 1 180px', minWidth: 0 }}>
                  <p style={{ fontSize: '15px', fontWeight: 500, color: colors.dark, margin: '0 0 4px' }}>{person.full_name || 'Unnamed'}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '10px', padding: '2px 6px', background: 'rgba(184,149,107,0.15)', color: colors.gold, borderRadius: '2px' }}>{person.role === 'admin' ? 'Admin' : person.role === 'sponsor' ? 'Sponsor' : 'Member'}</span>
                    {person.ltd_id && <span style={{ fontSize: '10px', color: 'rgba(26,26,26,0.35)' }}>#{person.ltd_id}</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <p style={{ fontSize: '15px', fontWeight: 500, color: colors.dark, margin: '0 0 4px' }}>{tree.user.full_name || 'Unnamed'}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '10px', padding: '2px 6px', background: 'rgba(184,149,107,0.15)', color: colors.gold, borderRadius: '2px' }}>{tree.user.role === 'admin' ? 'Admin' : tree.user.role === 'sponsor' ? 'Sponsor' : 'Member'}</span>
                {tree.user.ltd_id && <span style={{ fontSize: '10px', color: 'rgba(26,26,26,0.35)' }}>#{tree.user.ltd_id}</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Downline */}
      {tree.downline && tree.downline.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.35)', marginBottom: '8px' }}>
            Your Team — {tree.downline.length} leg{tree.downline.length !== 1 ? 's' : ''}
          </p>
          <DownlineTree people={tree.downline} showAttendance={showAttendance} attendance={attendance} depth={0} />
        </div>
      )}

      {/* Attendance Section — below the tree */}
      {attendance?.records?.length > 0 && (
        <div style={{ marginTop: '8px' }}>
          <button onClick={() => setShowAttendance(!showAttendance)} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 16px', background: showAttendance ? 'rgba(184,149,107,0.08)' : 'white',
            border: showAttendance ? `1px solid rgba(184,149,107,0.25)` : '1px solid rgba(26,26,26,0.1)',
            cursor: 'pointer', fontSize: '12px', color: showAttendance ? colors.gold : 'rgba(26,26,26,0.5)',
            width: '100%', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icons.Calendar style={{ width: '14px', height: '14px' }} />
              {showAttendance ? 'Hide Attendance' : 'Show Team Attendance'}
            </div>
            <Icons.ChevronDown style={{ width: '14px', height: '14px', transform: showAttendance ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
          {showAttendance && <AttendanceDashboard attendance={attendance} tree={tree} />}
        </div>
      )}
      </>}
    </div>
  );
};

// ═══════════════ GATED PREVIEW ═══════════════
const GatedPreview = ({ title, description, previewItems }) => (
  <div>
    <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '28px', color: colors.dark, fontWeight: 400, margin: '0 0 24px' }}>{title}</h1>
    <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(184,149,107,0.04)', border: '1px dashed rgba(184,149,107,0.3)' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(184,149,107,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.gold} strokeWidth="1.5">
          <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      </div>
      <p style={{ fontSize: '16px', fontWeight: 500, color: colors.dark, marginBottom: '8px' }}>Setting Up Your Account</p>
      <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.5)', maxWidth: '360px', margin: '0 auto 24px', lineHeight: 1.6 }}>
        {description}
      </p>
      <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.gold, marginBottom: '20px' }}>Preview of what you will see</p>
    </div>

    {/* Preview mockup */}
    <div style={{ marginTop: '16px', opacity: 0.45, pointerEvents: 'none', filter: 'blur(1px)' }}>
      {previewItems.map((item, i) => (
        <div key={i} style={{
          padding: '14px 16px', marginBottom: '4px',
          background: 'white', border: '1px solid rgba(26,26,26,0.06)',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(26,26,26,0.06)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: '12px', width: item.w1 || '140px', background: 'rgba(26,26,26,0.1)', marginBottom: '6px' }} />
            <div style={{ height: '10px', width: item.w2 || '80px', background: 'rgba(26,26,26,0.05)' }} />
          </div>
          <div style={{ height: '10px', width: '50px', background: 'rgba(26,26,26,0.05)' }} />
        </div>
      ))}
    </div>
  </div>
);

// ═══════════════ MY EVENTS TAB ═══════════════
const MyEventsTab = ({ profile }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    fetch('/api/my-events')
      .then(r => {
        if (!r.ok) throw new Error(r.status === 401 ? 'Please sign in again.' : 'Could not load events.');
        return r.json();
      })
      .then(data => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch((err) => {
        setFetchError(err.message || 'Unable to load events. Please try again later.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ color: 'rgba(26,26,26,0.4)', fontSize: '14px' }}>Loading events...</p>;

  if (fetchError) return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <p style={{ color: '#ef4444', fontSize: '14px', marginBottom: '8px' }}>{fetchError}</p>
      <button onClick={() => { setFetchError(''); setLoading(true); window.location.reload(); }}
        style={{ padding: '8px 16px', background: colors.dark, color: colors.bg, border: 'none', cursor: 'pointer', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Try Again
      </button>
    </div>
  );

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/Chicago',
  });

  return (
    <div>
      <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '28px', color: colors.dark, fontWeight: 400, margin: '0 0 24px' }}>My Events</h1>

      {events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Icons.Calendar style={{ width: '32px', height: '32px', color: 'rgba(26,26,26,0.15)', margin: '0 auto 16px' }} />
          <p style={{ color: 'rgba(26,26,26,0.4)', fontSize: '14px', marginBottom: '4px' }}>No events yet.</p>
          <p style={{ color: 'rgba(26,26,26,0.3)', fontSize: '12px' }}>Your ticket purchases will appear here once synced with your LTD ID.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {events.map(evt => (
            <div key={evt.id} style={{
              padding: '16px 20px', background: 'white',
              border: '1px solid rgba(26,26,26,0.08)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: colors.dark, margin: 0 }}>
                      {evt.source === 'bcs' ? 'Business Coaching Session' : 'Info Session / Training'}
                    </p>
                    {evt.attended && (
                      <span style={{ fontSize: '10px', padding: '2px 8px', background: 'rgba(34,197,94,0.1)', color: '#22c55e', fontWeight: 500 }}>
                        Attended
                      </span>
                    )}
                    {!evt.attended && (
                      <span style={{ fontSize: '10px', padding: '2px 8px', background: 'rgba(26,26,26,0.04)', color: 'rgba(26,26,26,0.4)' }}>
                        Registered
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(26,26,26,0.45)' }}>{formatDate(evt.date)}</span>
                    <span style={{ fontSize: '11px', padding: '2px 6px', background: evt.priceType === 'monthly' ? 'rgba(184,149,107,0.12)' : 'rgba(26,26,26,0.04)', color: evt.priceType === 'monthly' ? colors.gold : 'rgba(26,26,26,0.45)' }}>
                      {evt.priceType === 'monthly' ? 'Monthly' : 'Weekly'}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                  <span style={{ fontSize: '18px', fontWeight: 500, color: colors.dark, fontVariantNumeric: 'tabular-nums' }}>${evt.amount}</span>
                  <a
                    href={`/receipt?session_id=${evt.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '6px 12px', fontSize: '11px',
                      color: colors.gold, border: `1px solid rgba(184,149,107,0.3)`,
                      textDecoration: 'none', letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Receipt
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {events.length > 0 && (
        <div style={{ marginTop: '20px', padding: '16px 20px', background: 'rgba(184,149,107,0.04)', border: '1px solid rgba(184,149,107,0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>{events.length} total event{events.length !== 1 ? 's' : ''}</p>
              <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.4)', margin: 0 }}>{events.filter(e => e.attended).length} attended</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.35)', margin: '0 0 2px' }}>Total Spent</p>
              <p style={{ fontSize: '20px', fontWeight: 500, color: colors.dark, margin: 0, fontVariantNumeric: 'tabular-nums' }}>
                ${events.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0).toFixed(2)}
              </p>
            </div>
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
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);

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
      fetch('/api/resources').then(r => r.json()).then(data => setResources(data.resources || [])).catch(() => setResources([]));

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

  const isAdminOrSponsor = profile?.role === 'admin' || profile?.role === 'sponsor';
  const isPlaced = !!(profile?.sponsor_id) || profile?.role === 'admin';

  const tabs = [
    { id: 'library', label: 'Library', icon: Icons.Book },
    { id: 'los', label: 'My LOS', icon: Icons.Users },
    { id: 'events', label: 'My Events', icon: Icons.Calendar },
    { id: 'activity', label: 'Activity', icon: Icons.Clock },
  ];

  // Flexible search: split query into words, match against title, description, category, type
  const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const matchesSearch = (r) => {
    if (searchTerms.length === 0) return true;
    const haystack = `${r.title || ''} ${r.description || ''} ${r.category || ''} ${r.type || ''}`.toLowerCase();
    return searchTerms.every(term => haystack.includes(term));
  };

  // Built-in shared docs that live outside the DB
  const sharedDocs = [
    { id: '_booklist', title: 'First Year Book List', description: '13 essential reads for your journey', type: 'document', category: 'Shared Documents', url: '/resources/books', isSharedDoc: true },
    { id: '_nonneg', title: 'TEAM ISI Non-Negotiables', description: 'The standards we hold ourselves to', type: 'document', category: 'Team Culture', url: '/resources/non-negotiables', isSharedDoc: true },
    { id: '_qi', title: 'The QI Philosophy', description: 'From curiosity to commitment — the qualifying process', type: 'document', category: 'The Process', url: '/resources/qi-philosophy', isSharedDoc: true },
    { id: '_fourbasics', title: 'The Four Basics', description: 'Master these fundamentals and everything else follows', type: 'document', category: 'Foundation', url: '/resources/four-basics', isSharedDoc: true },
    { id: '_story', title: 'Developing Your Compelling Story', description: 'Tell your story with clarity, emotion, and purpose', type: 'document', category: 'Skills', url: '/resources/compelling-story', isSharedDoc: true },
    { id: '_coresteps', title: '9 Core Steps', description: 'Three pillars, nine commitments — the daily blueprint', type: 'document', category: 'The Blueprint', url: '/resources/core-steps', isSharedDoc: true },
  ];

  const allItems = [...sharedDocs, ...resources];
  const filteredResources = allItems
    .filter(r => filterType === 'all' || r.type === filterType)
    .filter(matchesSearch);

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
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap');
        @media (max-width: 480px) {
          .resource-tab-bar { gap: 0 !important; }
          .resource-tab-bar button { padding: 12px 10px !important; font-size: 10px !important; gap: 4px !important; }
          .resource-filter-bar { overflow-x: auto; -webkit-overflow-scrolling: touch; flex-wrap: nowrap !important; scrollbar-width: none; }
          .resource-filter-bar::-webkit-scrollbar { display: none; }
          .resource-filter-bar button { flex-shrink: 0; white-space: nowrap; }
          .resource-header-row { flex-direction: column !important; align-items: flex-start !important; }
          .resource-header-row h1 { font-size: 24px !important; }
        }
        input:focus-visible, select:focus-visible, button:focus-visible { outline: 2px solid #b8956b !important; outline-offset: -1px; }
      `}</style>

      {/* Header */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(250,250,248,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(26,26,26,0.05)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '12px 16px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <a href="/" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.dark, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icons.Home style={{ width: '12px', height: '12px' }} />
              Freedom Family
            </a>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(26,26,26,0.4)', fontSize: '11px', padding: '4px' }}>
              <Icons.Logout style={{ width: '14px', height: '14px' }} />
              <span>Logout</span>
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.gold, fontWeight: 500 }}>Resources</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(26,26,26,0.5)' }}>{profile?.full_name || 'Member'}</span>
              {profile?.ltd_id && <span style={{ fontSize: '10px', color: 'rgba(26,26,26,0.3)' }}>#{profile.ltd_id}</span>}
            </div>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid rgba(26,26,26,0.05)' }}>
        <div className="resource-tab-bar" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 16px', display: 'flex', gap: '0' }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '12px 14px',
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '11px', letterSpacing: '0.05em',
                color: tab === t.id ? colors.dark : 'rgba(26,26,26,0.4)',
                borderBottom: tab === t.id ? `2px solid ${colors.gold}` : '2px solid transparent',
                marginBottom: '-1px',
              }}
            >
              <t.icon style={{ width: '13px', height: '13px' }} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 16px' }}>
        {/* LIBRARY TAB */}
        {tab === 'library' && (
          <div>
            <div className="resource-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '28px', color: colors.dark, fontWeight: 400, margin: 0 }}>Resource Library</h1>
              <div className="resource-filter-bar" style={{ display: 'flex', gap: '6px' }}>
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

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <Icons.Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: 'rgba(26,26,26,0.3)', pointerEvents: 'none' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources..."
                style={{
                  width: '100%', padding: '12px 40px 12px 40px', background: 'white',
                  border: '1px solid rgba(26,26,26,0.1)', outline: 'none',
                  color: colors.dark, fontSize: '14px', boxSizing: 'border-box',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}
                >
                  <Icons.XCircle style={{ width: '16px', height: '16px', color: 'rgba(26,26,26,0.3)' }} />
                </button>
              )}
            </div>

            {filteredResources.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <p style={{ color: 'rgba(26,26,26,0.3)', fontSize: '13px' }}>More resources coming soon</p>
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
                      const tc = resource.isSharedDoc
                        ? { bg: 'rgba(184,149,107,0.1)', border: 'rgba(184,149,107,0.2)', color: colors.gold }
                        : (typeColors[resource.type] || typeColors.document);
                      const TypeIcon = resource.isSharedDoc ? Icons.Book : (typeIcons[resource.type] || Icons.File);
                      const isInternal = resource.isSharedDoc || (resource.url && resource.url.startsWith('/'));
                      return (
                        <a
                          key={resource.id}
                          href={resource.url || '#'}
                          target={isInternal ? undefined : '_blank'}
                          rel={isInternal ? undefined : 'noopener noreferrer'}
                          onClick={() => { if (!resource.isSharedDoc) logResourceView(resource.id); }}
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
                          {resource.url && !isInternal && <Icons.ExternalLink style={{ width: '14px', height: '14px', color: 'rgba(26,26,26,0.2)', flexShrink: 0 }} />}
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
          isPlaced ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '28px', color: colors.dark, fontWeight: 400, margin: 0 }}>Line of Sponsorship</h1>
                {isAdminOrSponsor && (
                  <button onClick={() => setInviteOpen(true)} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 18px', background: colors.dark, color: colors.bg,
                    border: 'none', fontSize: '11px', letterSpacing: '0.08em',
                    textTransform: 'uppercase', cursor: 'pointer',
                  }}>
                    <Icons.Plus style={{ width: '14px', height: '14px' }} />
                    Invite Member
                  </button>
                )}
              </div>
              <LOSTree userId={user?.id} profile={profile} />
            </div>
          ) : (
            <GatedPreview
              title="Line of Sponsorship"
              description="Your leadership team is setting up the organization tree. Once you are placed in the LOS, you will see your full upline, downline, and team structure here."
              previewItems={[
                { w1: '160px', w2: '90px' },
                { w1: '130px', w2: '70px' },
                { w1: '140px', w2: '100px' },
                { w1: '110px', w2: '60px' },
                { w1: '150px', w2: '85px' },
              ]}
            />
          )
        )}

        {/* MY EVENTS TAB */}
        {tab === 'events' && (
          isPlaced ? (
            <MyEventsTab profile={profile} />
          ) : (
            <GatedPreview
              title="My Events"
              description="Once your account is linked with your ticket purchases, you will see your complete event history, attendance records, and downloadable receipts here."
              previewItems={[
                { w1: '180px', w2: '60px' },
                { w1: '170px', w2: '75px' },
                { w1: '160px', w2: '55px' },
              ]}
            />
          )
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href="/" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.25)', textDecoration: 'none' }}>Home</a>
            <a href="/bcs" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.25)', textDecoration: 'none' }}>BCS</a>
          </div>
          <a href="https://www.ltdteam.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.25)', textDecoration: 'none' }}>LTD</a>
        </div>
      </footer>

      <InviteModal isOpen={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  );
}
