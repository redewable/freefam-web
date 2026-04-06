"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/app/lib/supabase/client';

const colors = { bg: '#fafaf8', dark: '#1a1a1a', gold: '#b8956b' };

const Icons = {
  Check: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>,
  Search: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>,
  Refresh: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 4v6h6M23 20v-6h-6" /><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" /></svg>,
  Back: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>,
  Users: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>,
  TrendUp: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></svg>,
  TrendDown: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 18l-9.5-9.5-5 5L1 6" /><path d="M17 18h6v-6" /></svg>,
  Plus: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 5v14M5 12h14" /></svg>,
  Trash: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>,
  Share: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" /></svg>,
  Edit: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
  Dollar: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>,
  Calendar: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>,
  Copy: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>,
  X: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>,
  List: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>,
  Clock: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
  ChevronUp: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 15l-6-6-6 6" /></svg>,
  ChevronDown: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 9l6 6 6-6" /></svg>,
  Star: ({ style, fill }) => <svg style={style} viewBox="0 0 24 24" fill={fill || 'none'} stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" /></svg>,
};

const formatDate = (d) => new Date(d + 'T12:00:00-06:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/Chicago' });
const formatDateShort = (d) => new Date(d + 'T12:00:00-06:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'America/Chicago' });

const DEFAULT_SEGMENTS = [
  // Info Session (7:30 - 8:30)
  { key: 'host', label: 'Host', speaker: '', topic: '', time: '7:30 PM', duration: '2 min', section: 'info' },
  { key: 'plan', label: 'The Plan', speaker: '', topic: '', time: '7:32 PM', duration: '53 min', section: 'info' },
  { key: 'nextsteps', label: 'Next Steps', speaker: '', topic: '', time: '8:25 PM', duration: '5 min', section: 'info' },
  // Training (8:45 - 10:00)
  { key: 'recognition', label: 'Recognition', speaker: '', topic: '', time: '8:45 PM', duration: '20 min', section: 'training' },
  { key: 'calendar', label: 'Calendar / Upcoming Events', speaker: '', topic: '', time: '9:05 PM', duration: '4 min', section: 'training' },
  { key: 'product', label: 'Product Demo', speaker: '', topic: '', time: '9:09 PM', duration: '7 min', section: 'training' },
  { key: 'bsm', label: 'BSM', speaker: '', topic: '', time: '9:16 PM', duration: '7 min', section: 'training' },
  { key: 'training', label: 'Training Topic', speaker: '', topic: '', time: '9:23 PM', duration: '25-30 min', section: 'training' },
];

const MEETING_FLOW = [
  { time: '6:30 PM', label: 'Round Table Arrives', desc: 'Room setup begins. Doors remain closed.', section: 'prep' },
  { time: '7:00 PM', label: 'IBOs Arrive / Lineup Huddle', desc: 'Doors closed. IBOs greet guests in lobby. Quick alignment, announcements, prayer.', section: 'prep' },
  { time: '7:15 PM', label: 'Doors Open', desc: 'Guests arrive. IBOs position for warm greetings.', section: 'prep' },
  { time: '7:30 PM', label: 'Host', desc: 'Ice breaker, set expectations.', section: 'info' },
  { time: '7:32 PM', label: 'The Plan', desc: 'LTD-approved plan presentation.', section: 'info' },
  { time: '8:25 PM', label: 'Next Steps', desc: 'Follow-up info, how to get started.', section: 'info' },
  { time: '8:30 PM', label: 'Info Session Concludes', desc: '15-min break for guest follow-up and transition.', section: 'break' },
  { time: '8:45 PM', label: 'Recognition (20 min)', desc: 'Celebrate wins: new pins, PV milestones, personal victories, first-timers.', section: 'training' },
  { time: '9:05 PM', label: 'Calendar (4 min)', desc: 'Upcoming events: regional functions, webinars, local meetings, deadlines.', section: 'training' },
  { time: '9:09 PM', label: 'Product Demo (7 min)', desc: 'Highlight 1-2 products. Focus on personal story + results.', section: 'training' },
  { time: '9:16 PM', label: 'BSM (7 min)', desc: 'Business Support Materials: books, audios, functions, LTD Messaging (MAPP).', section: 'training' },
  { time: '9:23 PM', label: 'Training (25-30 min)', desc: 'Weekly topic: contacting, inviting, STP, follow-up, building depth, etc.', section: 'training' },
  { time: '10:00 PM', label: 'Dismissed', desc: 'Remind everyone of the next meeting date.', section: 'close' },
  { time: '10:00-11:00 PM', label: 'Night Owl (Optional)', desc: 'Extended fellowship and discussion.', section: 'close' },
];

const segmentColors = {
  host: { bg: 'rgba(184,149,107,0.12)', border: 'rgba(184,149,107,0.3)', color: '#b8956b' },
  plan: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)', color: '#3b82f6' },
  nextsteps: { bg: 'rgba(20,184,166,0.08)', border: 'rgba(20,184,166,0.25)', color: '#14b8a6' },
  recognition: { bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.25)', color: '#a855f7' },
  calendar: { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.25)', color: '#22c55e' },
  product: { bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.25)', color: '#f97316' },
  bsm: { bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.25)', color: '#ec4899' },
  training: { bg: 'rgba(26,26,26,0.06)', border: 'rgba(26,26,26,0.15)', color: '#1a1a1a' },
};

const INFO_KEYS = ['host', 'plan', 'nextsteps'];
const TRAINING_KEYS = ['recognition', 'calendar', 'product', 'bsm', 'training'];
const getSection = (seg) => seg.section || (INFO_KEYS.includes(seg.key) ? 'info' : 'training');

const EXPENSE_CATEGORIES = ['Conference Room', 'Supplies', 'Food & Beverage', 'Audio/Visual', 'Printing', 'Other'];

// ═══════════════ LOGIN GATE ═══════════════
const LoginGate = ({ onSuccess }) => {
  const [ltdId, setLtdId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const supabase = createClient();
      const email = `${ltdId.trim()}@freedomfamily.app`;
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) { setError('Invalid LTD ID or password.'); setLoading(false); return; }

      // Check leadership access
      const res = await fetch('/api/admin/leadership-access?action=check');
      const access = await res.json();
      if (!access.hasAccess) {
        await supabase.auth.signOut();
        setError('You do not have leadership portal access.');
        setLoading(false);
        return;
      }
      onSuccess(access.level || 'viewer', access.profile);
    } catch (err) {
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '14px', background: 'white', border: '1px solid rgba(26,26,26,0.15)', outline: 'none', color: colors.dark, fontSize: '16px', boxSizing: 'border-box' };

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <nav style={{ borderBottom: '1px solid rgba(26,26,26,0.05)', padding: '14px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.dark, textDecoration: 'none' }}>Freedom Family</a>
          <span style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.gold }}>Leadership</span>
        </div>
      </nav>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <form onSubmit={submit} style={{ width: '100%', maxWidth: '320px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <p style={{ color: colors.gold, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>Leadership Portal</p>
            <h1 style={{ fontSize: '22px', color: colors.dark, fontWeight: 500, margin: 0 }}>Sign In</h1>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', display: 'block', marginBottom: '5px' }}>LTD ID</label>
              <input type="text" value={ltdId} onChange={e => setLtdId(e.target.value.replace(/\D/g, ''))} placeholder="e.g. 6076043" style={inputStyle} required autoFocus inputMode="numeric" autoComplete="username" />
            </div>
            <div>
              <label style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', display: 'block', marginBottom: '5px' }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} required autoComplete="current-password" />
            </div>
            {error && <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? 'rgba(26,26,26,0.3)' : colors.dark, color: colors.bg, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
      <footer style={{ padding: '24px 16px', borderTop: '1px solid rgba(26,26,26,0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.25)', textDecoration: 'none' }}>Freedom Family</a>
          <a href="https://www.ltdteam.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.25)', textDecoration: 'none' }}>LTD</a>
        </div>
      </footer>
    </div>
  );
};

// ═══════════════ TOAST ═══════════════
const Toast = ({ message, isVisible }) => {
  if (!isVisible) return null;
  return (
    <div style={{ position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)', zIndex: 60, padding: '12px 24px', background: colors.dark, color: colors.bg, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Icons.Check style={{ width: '14px', height: '14px', color: colors.gold }} /> {message}
    </div>
  );
};

// ═══════════════ MODAL ═══════════════
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.6)' }} onClick={onClose} />
      <div style={{ position: 'relative', width: '100%', maxWidth: '500px', background: colors.bg, maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(26,26,26,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: colors.bg, zIndex: 1 }}>
          <h3 style={{ fontSize: '16px', color: colors.dark, margin: 0, fontWeight: 500 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><Icons.X style={{ width: '18px', height: '18px', color: 'rgba(26,26,26,0.4)' }} /></button>
        </div>
        <div style={{ padding: '20px' }}>{children}</div>
      </div>
    </div>
  );
};

// ═══════════════ MAIN COMPONENT ═══════════════
export default function LeadershipPage() {
  const [auth, setAuth] = useState(false);
  const [accessLevel, setAccessLevel] = useState('viewer');
  const [authProfile, setAuthProfile] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [tab, setTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('tab') || 'overview';
    }
    return 'overview';
  });
  const [toast, setToast] = useState('');

  // User management states
  const [allProfiles, setAllProfiles] = useState([]);
  const [accessList, setAccessList] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [updatingAccess, setUpdatingAccess] = useState(null);

  // Data states
  const [regs, setRegs] = useState([]);
  const [history, setHistory] = useState([]);
  const [lineups, setLineups] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);

  // Check-in states (mirrored from admin/checkin)
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('pending');
  const [updating, setUpdating] = useState(null);
  const [fixMsg, setFixMsg] = useState(null);
  const [expandedReg, setExpandedReg] = useState(null);

  // History detail
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateCheckins, setDateCheckins] = useState([]);
  const [dateStats, setDateStats] = useState(null);

  // Settings / Webcast
  const [zoomLink, setZoomLink] = useState('');
  const [zoomLinkInput, setZoomLinkInput] = useState('');
  const [zoomSaving, setZoomSaving] = useState(false);
  const [sendingLink, setSendingLink] = useState(null);
  const [sentLinks, setSentLinks] = useState([]);
  const [expandedWebcastReg, setExpandedWebcastReg] = useState(null);

  // Event settings
  const [eventSettings, setEventSettings] = useState({ mainPresenter: '', mainDate: '', bcsPresenter: '', bcsDate: '' });
  const [eventSaving, setEventSaving] = useState(false);

  // Calendar events
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({ title: '', subtitle: '', date: '', time: '', location: '', url: '', buttonLabel: 'Details', type: 'upcoming', highlight: false });

  const reorderEvent = async (id, direction) => {
    try {
      const res = await fetch('/api/calendar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reorder', id, direction }) });
      const data = await res.json();
      if (data.success) setCalendarEvents(data.events);
    } catch (e) { console.error(e); }
  };
  const toggleHighlight = async (evt) => {
    try {
      const res = await fetch('/api/calendar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: evt.id, highlight: !evt.highlight }) });
      const data = await res.json();
      if (data.success) { setCalendarEvents(data.events); showToast(evt.highlight ? 'Highlight removed' : 'Event highlighted'); }
    } catch (e) { console.error(e); }
  };

  // Lineup editor
  const [editingLineup, setEditingLineup] = useState(null);
  const [lineupDate, setLineupDate] = useState('');
  const [lineupSegments, setLineupSegments] = useState([...DEFAULT_SEGMENTS]);
  const [lineupTopics, setLineupTopics] = useState('');
  const [lineupNotes, setLineupNotes] = useState('');

  // Expense modal
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [expenseForm, setExpenseForm] = useState({ description: '', amount: '', date: '', category: 'Conference Room', paidBy: '', account: '', notes: '' });

  // Add attendee modal
  const [showAddAttendee, setShowAddAttendee] = useState(false);
  const [attendeeForm, setAttendeeForm] = useState({ name: '', type: 'ibo', visitNumber: '', ltdId: '' });
  const [profileSuggestions, setProfileSuggestions] = useState([]);
  const [profileSearchTimeout, setProfileSearchTimeout] = useState(null);

  // Share modal
  const [shareUrl, setShareUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  // Attendance sync
  const [syncStatus, setSyncStatus] = useState(null);
  const [syncing, setSyncing] = useState(false);

  // Check if already logged in with leadership access
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const res = await fetch('/api/admin/leadership-access?action=check');
          const access = await res.json();
          if (access.hasAccess) {
            setAuth(true);
            setAccessLevel(access.level || 'viewer');
            setAuthProfile(access.profile);
          }
        }
      } catch (e) {}
      setAuthChecking(false);
    };
    checkAuth();
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  // ═══════ DATA FETCHERS ═══════
  const fetchAll = async () => {
    setLoading(true);
    const fetches = [fetchRegs(), fetchHistory(), fetchLineups(), fetchExpenses()];
    if (accessLevel === 'leadership') fetches.push(fetchUserAccess(), checkSyncStatus());
    await Promise.all(fetches);
    setLoading(false);
  };

  const fetchUserAccess = async () => {
    try {
      const res = await fetch('/api/admin/leadership-access');
      const data = await res.json();
      setAllProfiles(data.profiles || []);
      setAccessList(data.accessList || []);
    } catch (e) { console.error(e); }
  };

  const grantAccess = async (profile, level) => {
    setUpdatingAccess(profile.ltd_id);
    try {
      const res = await fetch('/api/admin/leadership-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ltdId: profile.ltd_id, level, fullName: profile.full_name }),
      });
      const data = await res.json();
      if (data.success) { showToast(`Access granted to ${profile.full_name}`); fetchUserAccess(); }
    } catch (e) { console.error(e); }
    setUpdatingAccess(null);
  };

  const revokeAccess = async (ltdId) => {
    setUpdatingAccess(ltdId);
    try {
      await fetch(`/api/admin/leadership-access?ltdId=${ltdId}`, { method: 'DELETE' });
      showToast('Access revoked');
      fetchUserAccess();
    } catch (e) { console.error(e); }
    setUpdatingAccess(null);
  };

  const fetchRegs = async () => {
    try {
      const res = await fetch('/api/registrations');
      const data = await res.json();
      setRegs(data.registrations || []);
    } catch (e) { console.error(e); }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      setHistory(data.history || []);
    } catch (e) { console.error(e); }
  };

  const fetchLineups = async () => {
    try {
      const res = await fetch('/api/lineup');
      const data = await res.json();
      setLineups(data.lineups || []);
    } catch (e) { console.error(e); }
  };

  const fetchExpenses = async () => {
    try {
      const res = await fetch('/api/expenses');
      const data = await res.json();
      setExpenses(data.expenses || []);
      setTotalExpenses(data.totalExpenses || 0);
    } catch (e) { console.error(e); }
  };

  const fetchDateDetail = async (date) => {
    try {
      const res = await fetch(`/api/history?date=${date}`);
      const data = await res.json();
      setDateCheckins(data.checkins || []);
      setDateStats(data.stats || null);
    } catch (e) {}
  };

  useEffect(() => { if (auth) fetchAll(); }, [auth]);
  useEffect(() => { if (selectedDate) fetchDateDetail(selectedDate); }, [selectedDate]);
  useEffect(() => {
    if (tab === 'settings' && auth) {
      fetch('/api/webcast').then(r => r.json()).then(data => {
        if (data.link) { setZoomLink(data.link); setZoomLinkInput(data.link); }
      }).catch(() => {});
    }
    if (tab === 'event' && auth) {
      fetch('/api/event-settings').then(r => r.json()).then(data => {
        setEventSettings(data);
      }).catch(() => {});
    }
    if (tab === 'calendar' && auth) {
      setCalendarLoading(true);
      fetch('/api/calendar').then(r => r.json()).then(data => {
        setCalendarEvents(data.events || []);
      }).catch(() => {}).finally(() => setCalendarLoading(false));
    }
  }, [tab, auth]);

  // ═══════ ACTIONS ═══════
  const updateStatus = async (reg, action) => {
    setUpdating(reg.id);
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: reg.id,
          action,
          priceType: reg.priceType,
          registrationData: { name: reg.name, type: reg.type, visitNumber: reg.visitNumber || '', ltdId: reg.ltdId || '' },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRegs(prev => prev.map(r => {
          if (r.id !== reg.id) return r;
          if (action === 'checkin') return { ...r, checkedIn: true, noShow: false };
          if (action === 'checkout') return { ...r, checkedIn: false, noShow: false };
          if (action === 'noshow') return { ...r, checkedIn: false, noShow: true };
          if (action === 'clear_noshow') return { ...r, checkedIn: false, noShow: false };
          return r;
        }));
      }
    } catch (e) { console.error(e); }
    setUpdating(null);
  };

  const removeRegistration = async (reg) => {
    if (!confirm(`Remove ${reg.name} from this week's check-in list?`)) return;
    setUpdating(reg.id);
    try {
      const res = await fetch(`/api/registrations?id=${reg.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setRegs(prev => prev.filter(r => r.id !== reg.id));
        setExpandedReg(null);
        showToast(`${reg.name} removed`);
      }
    } catch (e) { console.error(e); }
    setUpdating(null);
  };

  const sendWebcastLinkToReg = async (reg) => {
    if (!reg.email || reg.email === 'Unknown') {
      showToast('No email address available');
      return;
    }
    setSendingLink(reg.id);
    try {
      const res = await fetch('/api/webcast/send-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: reg.email, name: reg.name }),
      });
      const data = await res.json();
      if (data.success) {
        setSentLinks(prev => [...prev, reg.id]);
        showToast(`Link sent to ${reg.email}`);
      } else {
        showToast(data.error || 'Failed to send');
      }
    } catch (e) { showToast('Error sending link'); }
    setSendingLink(null);
  };

  const fixHistoryDates = async () => {
    try {
      setFixMsg('Fixing...');
      const res = await fetch('/api/admin/fix-history', { method: 'POST' });
      const data = await res.json();
      setFixMsg(data.message);
      fetchAll();
      setTimeout(() => setFixMsg(null), 4000);
    } catch (e) {
      setFixMsg('Error fixing dates');
      setTimeout(() => setFixMsg(null), 3000);
    }
  };

  const checkSyncStatus = async () => {
    try {
      const res = await fetch('/api/admin/sync-attendance');
      const data = await res.json();
      setSyncStatus(data);
    } catch (e) { console.error(e); }
  };

  const runSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/admin/sync-attendance', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(`Synced ${data.totalUpdated} records with LTD IDs`);
        setSyncStatus({ ...syncStatus, withoutLtdId: (syncStatus?.withoutLtdId || 0) - data.totalUpdated, withLtdId: (syncStatus?.withLtdId || 0) + data.totalUpdated });
      }
    } catch (e) { showToast('Sync failed'); }
    setSyncing(false);
  };

  const saveLineup = async () => {
    if (!lineupDate) return;
    try {
      const res = await fetch('/api/lineup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: lineupDate, segments: lineupSegments, topics: lineupTopics, notes: lineupNotes }),
      });
      const data = await res.json();
      if (data.success) { showToast('Lineup saved'); fetchLineups(); setEditingLineup(null); }
    } catch (e) { console.error(e); }
  };

  const deleteLineup = async (date) => {
    if (!confirm('Delete this lineup?')) return;
    try {
      await fetch(`/api/lineup?date=${date}`, { method: 'DELETE' });
      showToast('Lineup deleted');
      fetchLineups();
    } catch (e) { console.error(e); }
  };

  const shareLineup = async (date) => {
    try {
      const res = await fetch('/api/lineup', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date }),
      });
      const data = await res.json();
      if (data.token) {
        const url = `${window.location.origin}/lineup?t=${data.token}`;
        setShareUrl(url);
        setShowShareModal(true);
      }
    } catch (e) { console.error(e); }
  };

  const resetExpenseForm = () => {
    setExpenseForm({ description: '', amount: '', date: '', category: 'Conference Room', paidBy: '', account: '', notes: '' });
    setEditingExpenseId(null);
  };

  const openAddExpense = () => {
    resetExpenseForm();
    setShowExpenseModal(true);
  };

  const openEditExpense = (exp) => {
    setEditingExpenseId(exp.id);
    setExpenseForm({
      description: exp.description || '',
      amount: String(exp.amount || ''),
      date: exp.date || '',
      category: exp.category || 'Conference Room',
      paidBy: exp.paidBy || '',
      account: exp.account || '',
      notes: exp.notes || '',
    });
    setShowExpenseModal(true);
  };

  const saveExpense = async () => {
    if (!expenseForm.description || !expenseForm.amount || !expenseForm.date) return;
    try {
      if (editingExpenseId) {
        // Update existing
        const res = await fetch('/api/expenses', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingExpenseId, ...expenseForm }),
        });
        const data = await res.json();
        if (data.success) { showToast('Expense updated'); setShowExpenseModal(false); resetExpenseForm(); fetchExpenses(); }
      } else {
        // Create new
        const res = await fetch('/api/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expenseForm),
        });
        const data = await res.json();
        if (data.success) { showToast('Expense added'); setShowExpenseModal(false); resetExpenseForm(); fetchExpenses(); }
      }
    } catch (e) { console.error(e); }
  };

  const deleteExpense = async (id) => {
    if (!confirm('Delete this expense?')) return;
    try {
      await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' });
      showToast('Expense deleted');
      fetchExpenses();
    } catch (e) { console.error(e); }
  };

  const addAttendee = async () => {
    if (!attendeeForm.name || !selectedDate) return;
    try {
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add-attendee', date: selectedDate, attendee: { ...attendeeForm, ltdId: attendeeForm.ltdId || undefined } }),
      });
      const data = await res.json();
      if (data.success) { showToast('Attendee added'); setShowAddAttendee(false); setAttendeeForm({ name: '', type: 'ibo', visitNumber: '', ltdId: '' }); setProfileSuggestions([]); fetchDateDetail(selectedDate); fetchHistory(); }
    } catch (e) { console.error(e); }
  };

  const searchProfiles = async (query) => {
    if (query.trim().length < 2) { setProfileSuggestions([]); return; }
    try {
      const res = await fetch(`/api/admin/profiles/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setProfileSuggestions(data.profiles || []);
    } catch (e) { setProfileSuggestions([]); }
  };

  const handleAttendeeSearch = (value, field) => {
    setAttendeeForm(p => ({ ...p, [field]: value }));
    if (profileSearchTimeout) clearTimeout(profileSearchTimeout);
    setProfileSearchTimeout(setTimeout(() => searchProfiles(value), 300));
  };

  const selectProfile = (profile) => {
    setAttendeeForm(p => ({ ...p, name: profile.full_name || '', ltdId: profile.ltd_id || '' }));
    setProfileSuggestions([]);
  };

  const removeAttendee = async (attendeeId) => {
    if (!confirm('Remove this person from the meeting?')) return;
    try {
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove-attendee', date: selectedDate, attendee: { id: attendeeId } }),
      });
      const data = await res.json();
      if (data.success) { showToast('Attendee removed'); fetchDateDetail(selectedDate); fetchHistory(); }
    } catch (e) { console.error(e); }
  };

  const deleteMeeting = async (date) => {
    if (!confirm(`Delete meeting on ${formatDate(date)}? This will also delete the lineup.`)) return;
    try {
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete-meeting', date }),
      });
      const data = await res.json();
      if (data.success) { showToast('Meeting deleted'); setSelectedDate(null); fetchHistory(); fetchLineups(); }
    } catch (e) { console.error(e); }
  };

  const openLineupEditor = (lineup = null) => {
    if (lineup) {
      setLineupDate(lineup.date);
      // Ensure every segment has speaker/topic as strings AND section field
      // (older KV data may be missing section)
      const segs = (lineup.segments && lineup.segments.length > 0 ? lineup.segments : [...DEFAULT_SEGMENTS]).map(s => ({
        ...s,
        speaker: s.speaker || '',
        topic: s.topic || '',
        section: getSection(s),
      }));
      setLineupSegments(segs);
      setLineupTopics(lineup.topics || '');
      setLineupNotes(lineup.notes || '');
    } else {
      setLineupDate('');
      setLineupSegments([...DEFAULT_SEGMENTS].map(s => ({ ...s })));
      setLineupTopics('');
      setLineupNotes('');
    }
    setEditingLineup(lineup ? 'edit' : 'new');
  };

  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    showToast('Link copied');
  };

  if (authChecking) return (
    <div style={{ minHeight: '100vh', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <p style={{ color: 'rgba(26,26,26,0.4)' }}>Checking access...</p>
    </div>
  );

  if (!auth) return <LoginGate onSuccess={(level, profile) => {
    setAuth(true);
    setAccessLevel(level);
    setAuthProfile(profile);
    // A/V users default to webcast tab
    if (level === 'av' && tab === 'overview') setTab('settings');
  }} />;

  // ═══════ FILTER/SORT for check-in ═══════
  const getBadge = (reg) => {
    const isWc = isWebcastReg(reg);
    if (isWc) {
      const sub = reg.type?.replace('webcast-', '') || 'ibo';
      if (sub === 'guest') return { label: 'Webcast · Guest', bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' };
      if (sub === 'apprentice') return { label: 'Webcast · Appr', bg: 'rgba(168,85,247,0.1)', color: '#a855f7' };
      return { label: 'Webcast · IBO', bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' };
    }
    if (reg.type === 'guest') return { label: reg.visitNumber || 'Guest', bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' };
    if (reg.type === 'apprentice') return { label: 'Apprentice', bg: 'rgba(168,85,247,0.1)', color: '#a855f7' };
    if (reg.priceType === 'monthly' || reg.priceType === 'monthly5') return { label: 'Monthly', bg: 'rgba(184,149,107,0.15)', color: colors.gold };
    return { label: 'Weekly', bg: 'rgba(26,26,26,0.05)', color: 'rgba(26,26,26,0.6)' };
  };

  // Identify webcast registrations
  const isWebcastReg = (r) => r.source === 'webcast' || (r.type && r.type.startsWith('webcast-'));
  const webcastRegs = regs.filter(r => isWebcastReg(r));

  let filtered = regs.filter(r => {
    const s = search.toLowerCase();
    return r.name.toLowerCase().includes(s) || r.email.toLowerCase().includes(s) || (r.ltdId && r.ltdId.toLowerCase().includes(s));
  });
  if (filter !== 'all') filtered = filtered.filter(r => r.type === filter);
  filtered.sort((a, b) => {
    const getOrder = (r) => r.checkedIn ? 1 : r.noShow ? 2 : 0;
    if (sortBy === 'pending') { const diff = getOrder(a) - getOrder(b); if (diff !== 0) return diff; return a.name.localeCompare(b.name); }
    if (sortBy === 'arrived') { const diff = getOrder(b) - getOrder(a); if (diff !== 0) return diff; return a.name.localeCompare(b.name); }
    return a.name.localeCompare(b.name);
  });

  const stats = { total: filtered.length, arrived: filtered.filter(r => r.checkedIn).length, pending: filtered.filter(r => !r.checkedIn && !r.noShow).length, noShow: filtered.filter(r => r.noShow).length };

  // Revenue from Stripe paid registrations
  const totalRevenue = regs.filter(r => r.type === 'ibo' && r.amount > 0).reduce((sum, r) => sum + r.amount, 0);

  // Access level permissions:
  // leadership — Full access: check-in, lineups, finances, history, user management
  // admin — Can check in and view check-in history only. No finances, user management, or lineup
  // Access level permissions
  const isLeadership = accessLevel === 'leadership';
  const canCheckIn = accessLevel === 'leadership' || accessLevel === 'admin';
  const canViewAll = accessLevel === 'leadership' || accessLevel === 'viewer';
  const isAV = accessLevel === 'av';
  const canSeeWebcast = canCheckIn || isAV;
  const canSeeLineups = canViewAll || isAV;

  const tabs = [
    ...(!isAV ? [{ id: 'overview', label: 'Overview' }] : []),
    ...(!isAV ? [{ id: 'checkin', label: 'Check-In' }] : []),
    ...(canSeeLineups ? [{ id: 'lineups', label: 'Lineups' }] : []),
    ...(canViewAll ? [{ id: 'finances', label: 'Finances' }] : []),
    ...(!isAV ? [{ id: 'history', label: 'History' }] : []),
    ...(isLeadership ? [{ id: 'users', label: 'Users' }] : []),
    ...(isLeadership ? [{ id: 'los-builder', label: 'LOS Builder', href: '/admin/los-builder' }] : []),
    ...(canSeeWebcast ? [{ id: 'settings', label: 'Webcast' }] : []),
    ...(canCheckIn ? [{ id: 'event', label: 'Event' }] : []),
    ...(canCheckIn ? [{ id: 'calendar', label: 'Calendar' }] : []),
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setAuth(false);
    setAccessLevel('viewer');
    setAuthProfile(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ borderBottom: '1px solid rgba(26,26,26,0.05)', padding: '14px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.dark, textDecoration: 'none' }}>Freedom Family</a>
          <span style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.gold }}>Leadership</span>
        </div>
      </nav>
      {/* Nav with logout */}
      <div style={{ borderBottom: '1px solid rgba(26,26,26,0.05)', padding: '10px 16px', background: 'rgba(250,250,248,0.95)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
          {authProfile && <span style={{ fontSize: '10px', color: 'rgba(26,26,26,0.4)' }}>{authProfile.full_name}</span>}
          <span style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 6px', background: 'rgba(184,149,107,0.12)', color: colors.gold }}>{accessLevel}</span>
          <button onClick={handleLogout} style={{ fontSize: '10px', color: 'rgba(26,26,26,0.4)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', textDecoration: 'underline' }}>Logout</button>
        </div>
      </div>

      <Toast message={toast} isVisible={!!toast} />

      {/* Share Modal */}
      <Modal isOpen={showShareModal} onClose={() => setShowShareModal(false)} title="Share Lineup">
        <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.6)', marginBottom: '16px' }}>Anyone with this link can view the lineup. No password required.</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input readOnly value={shareUrl} style={{ flex: 1, padding: '10px', border: '1px solid rgba(26,26,26,0.2)', background: 'white', fontSize: '13px', boxSizing: 'border-box' }} />
          <button onClick={copyShareUrl} style={{ padding: '10px 16px', background: colors.dark, color: colors.bg, border: 'none', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Icons.Copy style={{ width: '14px', height: '14px' }} /> Copy
          </button>
        </div>
      </Modal>

      {/* Add/Edit Expense Modal */}
      <Modal isOpen={showExpenseModal} onClose={() => { setShowExpenseModal(false); resetExpenseForm(); }} title={editingExpenseId ? 'Edit Expense' : 'Add Expense'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: 'rgba(26,26,26,0.5)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Description *</label>
            <input value={expenseForm.description} onChange={e => setExpenseForm(p => ({ ...p, description: e.target.value }))} placeholder="Hotel conference room rental" style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.2)', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'rgba(26,26,26,0.5)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Amount *</label>
              <input type="number" step="0.01" value={expenseForm.amount} onChange={e => setExpenseForm(p => ({ ...p, amount: e.target.value }))} placeholder="250.00" style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.2)', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'rgba(26,26,26,0.5)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Date *</label>
              <input type="date" value={expenseForm.date} onChange={e => setExpenseForm(p => ({ ...p, date: e.target.value }))} style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.2)', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: 'rgba(26,26,26,0.5)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Category</label>
            <select value={expenseForm.category} onChange={e => setExpenseForm(p => ({ ...p, category: e.target.value }))} style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.2)', fontSize: '14px', boxSizing: 'border-box', background: 'white' }}>
              {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'rgba(26,26,26,0.5)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Paid By</label>
              <input value={expenseForm.paidBy} onChange={e => setExpenseForm(p => ({ ...p, paidBy: e.target.value }))} placeholder="Paul Hinton" style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.2)', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'rgba(26,26,26,0.5)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Account</label>
              <input value={expenseForm.account} onChange={e => setExpenseForm(p => ({ ...p, account: e.target.value }))} placeholder="Business checking" style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.2)', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: 'rgba(26,26,26,0.5)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Notes</label>
            <textarea value={expenseForm.notes} onChange={e => setExpenseForm(p => ({ ...p, notes: e.target.value }))} rows={2} placeholder="Additional notes..." style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.2)', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }} />
          </div>
          <button onClick={saveExpense} style={{ padding: '12px', background: colors.dark, color: colors.bg, border: 'none', cursor: 'pointer', fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{editingExpenseId ? 'Save Changes' : 'Add Expense'}</button>
        </div>
      </Modal>

      {/* Add Attendee Modal */}
      <Modal isOpen={showAddAttendee} onClose={() => { setShowAddAttendee(false); setProfileSuggestions([]); }} title="Add Attendee">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '11px', color: 'rgba(26,26,26,0.5)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>LTD ID or Name</label>
            <input value={attendeeForm.ltdId} onChange={e => handleAttendeeSearch(e.target.value, 'ltdId')} placeholder="Search by LTD ID or name..." inputMode="text" style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.2)', fontSize: '14px', boxSizing: 'border-box' }} />
            {profileSuggestions.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, background: 'white', border: '1px solid rgba(26,26,26,0.15)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxHeight: '200px', overflow: 'auto' }}>
                {profileSuggestions.map(p => (
                  <button key={p.id} onClick={() => selectProfile(p)} style={{ width: '100%', padding: '10px 12px', background: 'none', border: 'none', borderBottom: '1px solid rgba(26,26,26,0.06)', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '14px', fontWeight: 500, color: colors.dark, margin: 0 }}>{p.full_name}</p>
                      <p style={{ fontSize: '11px', color: 'rgba(26,26,26,0.4)', margin: 0 }}>LTD #{p.ltd_id}</p>
                    </div>
                    <span style={{ fontSize: '10px', padding: '2px 6px', background: 'rgba(26,26,26,0.05)', color: 'rgba(26,26,26,0.5)', textTransform: 'capitalize' }}>{p.role}</span>
                  </button>
                ))}
              </div>
            )}
            {attendeeForm.ltdId && attendeeForm.name && profileSuggestions.length === 0 && (
              <p style={{ fontSize: '11px', color: '#22c55e', margin: '4px 0 0' }}>Matched: {attendeeForm.name} (#{attendeeForm.ltdId})</p>
            )}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: 'rgba(26,26,26,0.5)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Name *</label>
            <input value={attendeeForm.name} onChange={e => handleAttendeeSearch(e.target.value, 'name')} placeholder="Full name" style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.2)', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: 'rgba(26,26,26,0.5)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Type</label>
            <select value={attendeeForm.type} onChange={e => setAttendeeForm(p => ({ ...p, type: e.target.value }))} style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.2)', fontSize: '14px', boxSizing: 'border-box', background: 'white' }}>
              <option value="ibo">IBO</option>
              <option value="apprentice">Apprentice</option>
              <option value="guest">Guest</option>
            </select>
          </div>
          {attendeeForm.type === 'guest' && (
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'rgba(26,26,26,0.5)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Visit Number</label>
              <select value={attendeeForm.visitNumber} onChange={e => setAttendeeForm(p => ({ ...p, visitNumber: e.target.value }))} style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.2)', fontSize: '14px', boxSizing: 'border-box', background: 'white' }}>
                <option value="1st">1st Visit</option>
                <option value="2nd">2nd Visit</option>
                <option value="3rd">3rd Visit</option>
              </select>
            </div>
          )}
          <button onClick={addAttendee} style={{ padding: '12px', background: colors.dark, color: colors.bg, border: 'none', cursor: 'pointer', fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Add Attendee</button>
        </div>
      </Modal>

      <style>{`
        @media (max-width: 640px) {
          .lead-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
          .lead-grid-3 { grid-template-columns: 1fr 1fr !important; }
          .lead-grid-2 { grid-template-columns: 1fr !important; }
          .lead-tab-bar { scrollbar-width: none; -ms-overflow-style: none; }
          .lead-tab-bar::-webkit-scrollbar { display: none; }
          .lead-tab-bar button, .lead-tab-bar a { padding: 12px 10px !important; font-size: 11px !important; }
          .lead-modal-body { padding: 16px !important; }
          .lead-modal-inner { max-width: 100% !important; margin: 0 8px !important; }
          .lead-meeting-header { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
          .lead-lineup-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 400px) {
          .lead-grid-4 { grid-template-columns: 1fr !important; }
          .lead-grid-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(26,26,26,0.1)', padding: '14px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.gold, marginBottom: '2px' }}>Leadership</p>
            <h1 style={{ fontSize: '18px', color: colors.dark, margin: 0, fontWeight: 500 }}>Admin Portal</h1>
          </div>
          <button onClick={fetchAll} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: colors.dark, color: colors.bg, border: 'none', cursor: 'pointer', fontSize: '11px' }}>
            <Icons.Refresh style={{ width: '14px', height: '14px' }} /> Refresh
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid rgba(26,26,26,0.1)', padding: '0 16px', overflowX: 'auto' }}>
        <div className="lead-tab-bar" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex' }}>
          {tabs.map(t => t.href ? (
            <a key={t.id} href={t.href}
              style={{ padding: '12px 16px', background: 'none', border: 'none', borderBottom: '2px solid transparent', color: 'rgba(26,26,26,0.4)', fontSize: '12px', fontWeight: 400, cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {t.label} <span style={{ fontSize: '10px' }}>{'\u2197'}</span>
            </a>
          ) : (
            <button key={t.id} onClick={() => { setTab(t.id); setSelectedDate(null); setEditingLineup(null); }}
              style={{ padding: '12px 16px', background: 'none', border: 'none', borderBottom: tab === t.id ? `2px solid ${colors.dark}` : '2px solid transparent', color: tab === t.id ? colors.dark : 'rgba(26,26,26,0.4)', fontSize: '12px', fontWeight: tab === t.id ? 500 : 400, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px', width: '100%', boxSizing: 'border-box' }}>
        {loading ? <p style={{ padding: '40px', textAlign: 'center', color: 'rgba(26,26,26,0.5)' }}>Loading...</p> : (

          // ═══════════════ OVERVIEW TAB ═══════════════
          tab === 'overview' ? (
            <>
              {/* Summary Cards — admin only sees registrations count, leadership & viewer see finances too */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '28px' }}>
                {[
                  { l: 'This Week', v: stats.total, c: colors.dark, sub: 'registrations' },
                  ...(canViewAll ? [
                    { l: 'Revenue', v: `$${totalRevenue.toFixed(2)}`, c: '#22c55e', sub: 'this period' },
                    { l: 'Expenses', v: `$${totalExpenses.toFixed(2)}`, c: '#ef4444', sub: 'total' },
                    { l: 'Net', v: `$${(totalRevenue - totalExpenses).toFixed(2)}`, c: (totalRevenue - totalExpenses) >= 0 ? '#22c55e' : '#ef4444', sub: 'revenue - expenses' },
                  ] : []),
                ].map((s, i) => (
                  <div key={i} style={{ padding: '18px', background: 'white', border: '1px solid rgba(26,26,26,0.1)', textAlign: 'center' }}>
                    <p style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>{s.l}</p>
                    <p style={{ fontSize: '20px', fontWeight: 600, color: s.c, margin: 0 }}>{s.v}</p>
                    <p style={{ fontSize: '9px', color: 'rgba(26,26,26,0.3)', margin: '2px 0 0' }}>{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: canViewAll ? 'repeat(auto-fit, minmax(280px, 1fr))' : '1fr', gap: '14px', marginBottom: '24px' }}>
                {/* Check-in Status */}
                <div style={{ background: 'white', border: '1px solid rgba(26,26,26,0.1)', padding: '20px' }}>
                  <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', marginBottom: '14px' }}>Check-In Status</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }} className="lead-grid-3">
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '24px', fontWeight: 600, color: colors.dark, margin: 0 }}>{stats.total}</p>
                      <p style={{ fontSize: '9px', color: 'rgba(26,26,26,0.4)', textTransform: 'uppercase' }}>Total</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '24px', fontWeight: 600, color: '#22c55e', margin: 0 }}>{stats.arrived}</p>
                      <p style={{ fontSize: '9px', color: 'rgba(26,26,26,0.4)', textTransform: 'uppercase' }}>Arrived</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '24px', fontWeight: 600, color: colors.gold, margin: 0 }}>{stats.pending}</p>
                      <p style={{ fontSize: '9px', color: 'rgba(26,26,26,0.4)', textTransform: 'uppercase' }}>Pending</p>
                    </div>
                  </div>
                </div>

                {/* Upcoming Lineup — only for leadership & viewer */}
                {canViewAll && (
                  <div style={{ background: 'white', border: '1px solid rgba(26,26,26,0.1)', padding: '20px' }}>
                    <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', marginBottom: '14px' }}>Next Lineup</p>
                    {lineups.length > 0 ? (
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: colors.dark, marginBottom: '8px' }}>{formatDateShort(lineups[0].date)}</p>
                        {(lineups[0].segments || []).slice(0, 4).map((seg, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
                            <span style={{ color: 'rgba(26,26,26,0.5)' }}>{seg.label}</span>
                            <span style={{ color: colors.dark, fontWeight: 500 }}>{seg.speaker || 'TBD'}</span>
                          </div>
                        ))}
                        {lineups[0].segments?.length > 4 && <p style={{ fontSize: '11px', color: 'rgba(26,26,26,0.3)', marginTop: '4px' }}>+{lineups[0].segments.length - 4} more</p>}
                      </div>
                    ) : (
                      <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.4)' }}>No lineups created yet</p>
                    )}
                  </div>
                )}
              </div>

              {/* Recent Meetings */}
              <div style={{ background: 'white', border: '1px solid rgba(26,26,26,0.1)', padding: '20px' }}>
                <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', marginBottom: '14px' }}>Meeting History</p>
                {history.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {history.slice(0, 5).map((m, i) => {
                      const lineup = lineups.find(l => l.date === m.date);
                      return (
                        <div key={m.date} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(26,26,26,0.02)', border: '1px solid rgba(26,26,26,0.06)' }}>
                          <div>
                            <p style={{ fontSize: '13px', fontWeight: 500, color: colors.dark, margin: 0 }}>{formatDateShort(m.date)}</p>
                            {lineup && <p style={{ fontSize: '10px', color: 'rgba(26,26,26,0.4)', margin: '2px 0 0' }}>Lineup: {lineup.segments?.find(s => s.key === 'training')?.topic || lineup.topics || '—'}</p>}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {lineup && <Icons.List style={{ width: '12px', height: '12px', color: colors.gold }} />}
                            <span style={{ fontSize: '14px', fontWeight: 600, color: colors.dark }}>{m.total}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.4)' }}>No meetings recorded yet</p>
                )}
              </div>
            </>

          // ═══════════════ CHECK-IN TAB ═══════════════
          ) : tab === 'checkin' ? (
            <>
              <div className="lead-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px' }}>
                {[{ l: 'Total', v: stats.total, c: colors.dark }, { l: 'Arrived', v: stats.arrived, c: '#22c55e' }, { l: 'Pending', v: stats.pending, c: colors.gold }, { l: 'No Show', v: stats.noShow, c: '#ef4444' }].map((s, i) => (
                  <div key={i} style={{ padding: '12px 6px', background: 'white', border: '1px solid rgba(26,26,26,0.1)', textAlign: 'center' }}>
                    <p style={{ fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>{s.l}</p>
                    <p style={{ fontSize: '22px', fontWeight: 600, color: s.c, margin: 0 }}>{s.v}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                <div style={{ position: 'relative' }}>
                  <Icons.Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'rgba(26,26,26,0.3)' }} />
                  <input type="text" placeholder="Search name, email, or LTD ID..." value={search} onChange={e => setSearch(e.target.value)}
                    style={{ width: '100%', padding: '10px 10px 10px 40px', border: '1px solid rgba(26,26,26,0.2)', background: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {['all', 'ibo', 'apprentice', 'guest'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 10px', border: filter === f ? `1px solid ${colors.dark}` : '1px solid rgba(26,26,26,0.2)', background: filter === f ? colors.dark : 'white', color: filter === f ? colors.bg : colors.dark, fontSize: '11px', cursor: 'pointer', textTransform: 'capitalize' }}>{f}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {[{ id: 'pending', l: 'Pending' }, { id: 'arrived', l: 'Arrived' }, { id: 'alpha', l: 'A-Z' }].map(s => (
                    <button key={s.id} onClick={() => setSortBy(s.id)} style={{ padding: '7px 10px', border: sortBy === s.id ? `1px solid ${colors.dark}` : '1px solid rgba(26,26,26,0.2)', background: sortBy === s.id ? colors.dark : 'white', color: sortBy === s.id ? colors.bg : colors.dark, fontSize: '10px', cursor: 'pointer' }}>{s.l}</button>
                  ))}
                </div>
              </div>
              {filtered.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <Icons.Users style={{ width: '32px', height: '32px', color: 'rgba(26,26,26,0.2)', margin: '0 auto 12px' }} />
                  <p style={{ color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>No registrations this week</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {filtered.map(reg => {
                    const badge = getBadge(reg);
                    const rowBg = reg.checkedIn ? 'rgba(34,197,94,0.06)' : reg.noShow ? 'rgba(239,68,68,0.06)' : 'white';
                    const rowBorder = reg.checkedIn ? '1px solid rgba(34,197,94,0.2)' : reg.noShow ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(26,26,26,0.1)';
                    const isUpdating = updating === reg.id;
                    const isExpanded = expandedReg === reg.id;
                    return (
                      <div key={reg.id} style={{ background: rowBg, border: rowBorder }}>
                        <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setExpandedReg(isExpanded ? null : reg.id)}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '14px', fontWeight: 500, color: colors.dark, margin: '0 0 1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{reg.name}</p>
                            <p style={{ fontSize: '11px', color: 'rgba(26,26,26,0.5)', margin: 0 }}>{reg.ltdId || reg.email?.split('@')[0]}</p>
                          </div>
                          <div style={{ padding: '3px 8px', background: badge.bg, fontSize: '9px', fontWeight: 600, color: badge.color, textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0 }}>{badge.label}</div>
                          {canCheckIn ? (
                            reg.checkedIn ? (
                              <button onClick={(e) => { e.stopPropagation(); updateStatus(reg, 'checkout'); }} disabled={isUpdating}
                                style={{ padding: '6px 12px', background: '#22c55e', border: '1px solid #22c55e', color: 'white', fontSize: '10px', fontWeight: 600, cursor: 'pointer', opacity: isUpdating ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', flexShrink: 0 }}>
                                <Icons.Check style={{ width: '12px', height: '12px' }} />Arrived
                              </button>
                            ) : reg.noShow ? (
                              <button onClick={(e) => { e.stopPropagation(); updateStatus(reg, 'clear_noshow'); }} disabled={isUpdating}
                                style={{ padding: '6px 12px', background: '#ef4444', border: '1px solid #ef4444', color: 'white', fontSize: '10px', fontWeight: 600, cursor: 'pointer', opacity: isUpdating ? 0.5 : 1, textTransform: 'uppercase', flexShrink: 0 }}>
                                No Show
                              </button>
                            ) : (
                              <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                                <button onClick={(e) => { e.stopPropagation(); updateStatus(reg, 'checkin'); }} disabled={isUpdating}
                                  style={{ padding: '6px 10px', background: 'transparent', border: '1px solid rgba(26,26,26,0.3)', color: colors.dark, fontSize: '10px', fontWeight: 600, cursor: 'pointer', opacity: isUpdating ? 0.5 : 1, textTransform: 'uppercase' }}>
                                  In
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); updateStatus(reg, 'noshow'); }} disabled={isUpdating}
                                  style={{ padding: '6px 8px', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: '10px', fontWeight: 600, cursor: 'pointer', opacity: isUpdating ? 0.5 : 1, textTransform: 'uppercase' }}>
                                  NS
                                </button>
                              </div>
                            )
                          ) : (
                            <span style={{ padding: '4px 8px', fontSize: '9px', textTransform: 'uppercase', fontWeight: 600, flexShrink: 0, color: reg.checkedIn ? '#22c55e' : reg.noShow ? '#ef4444' : 'rgba(26,26,26,0.4)', background: reg.checkedIn ? 'rgba(34,197,94,0.08)' : reg.noShow ? 'rgba(239,68,68,0.08)' : 'rgba(26,26,26,0.05)' }}>
                              {reg.checkedIn ? 'Arrived' : reg.noShow ? 'No Show' : 'Pending'}
                            </span>
                          )}
                        </div>
                        {isExpanded && (
                          <div style={{ padding: '0 12px 12px', borderTop: '1px solid rgba(26,26,26,0.06)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '10px' }}>
                              {reg.name && <div><p style={{ fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>Name</p><p style={{ fontSize: '13px', color: colors.dark, margin: 0 }}>{reg.name}</p></div>}
                              {reg.email && <div><p style={{ fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>Email</p><p style={{ fontSize: '13px', color: colors.dark, margin: 0, wordBreak: 'break-all' }}>{reg.email}</p></div>}
                              {reg.ltdId && <div><p style={{ fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>LTD ID</p><p style={{ fontSize: '13px', color: colors.dark, margin: 0 }}>{reg.ltdId}</p></div>}
                              {reg.uplinePlatinum && <div><p style={{ fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>Upline Platinum</p><p style={{ fontSize: '13px', color: colors.dark, margin: 0 }}>{reg.uplinePlatinum}</p></div>}
                              {reg.invitedBy && <div><p style={{ fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>Invited By</p><p style={{ fontSize: '13px', color: colors.dark, margin: 0 }}>{reg.invitedBy}</p></div>}
                              {reg.visitNumber && <div><p style={{ fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>Visit</p><p style={{ fontSize: '13px', color: colors.dark, margin: 0 }}>{reg.visitNumber}</p></div>}
                              {reg.type && <div><p style={{ fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>Type</p><p style={{ fontSize: '13px', color: colors.dark, margin: 0, textTransform: 'capitalize' }}>{reg.type}{reg.isSpouse ? ' (Spouse)' : ''}</p></div>}
                              {reg.source && <div><p style={{ fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>Source</p><p style={{ fontSize: '13px', color: colors.dark, margin: 0, textTransform: 'capitalize' }}>{reg.source}</p></div>}
                              {reg.amount > 0 && <div><p style={{ fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>Paid</p><p style={{ fontSize: '13px', color: colors.dark, margin: 0 }}>${reg.amount}</p></div>}
                              {reg.date && <div><p style={{ fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>Registered</p><p style={{ fontSize: '13px', color: colors.dark, margin: 0 }}>{reg.date}</p></div>}
                            </div>
                            {canCheckIn && (
                              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(26,26,26,0.06)' }}>
                                {isWebcastReg(reg) && (
                                  <button onClick={(e) => { e.stopPropagation(); sendWebcastLinkToReg(reg); }}
                                    disabled={sendingLink === reg.id || sentLinks.includes(reg.id)}
                                    style={{ flex: 1, padding: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', background: sentLinks.includes(reg.id) ? 'rgba(34,197,94,0.1)' : colors.dark, color: sentLinks.includes(reg.id) ? '#22c55e' : colors.bg, border: 'none', cursor: sendingLink === reg.id || sentLinks.includes(reg.id) ? 'default' : 'pointer', opacity: sendingLink === reg.id ? 0.5 : 1 }}>
                                    {sentLinks.includes(reg.id) ? '✓ Link Sent' : sendingLink === reg.id ? 'Sending...' : 'Send Webcast Link'}
                                  </button>
                                )}
                                <button onClick={(e) => { e.stopPropagation(); removeRegistration(reg); }}
                                  disabled={updating === reg.id}
                                  style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', opacity: updating === reg.id ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Icons.Trash style={{ width: '12px', height: '12px' }} /> Remove
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>

          // ═══════════════ LINEUPS TAB ═══════════════
          ) : tab === 'lineups' ? (
            editingLineup ? (
              // Lineup Editor
              <div>
                <button onClick={() => setEditingLineup(null)} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'rgba(26,26,26,0.5)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px', padding: '4px 0' }}>
                  <Icons.Back style={{ width: '16px', height: '16px' }} /> All Lineups
                </button>

                <h2 style={{ fontSize: '18px', color: colors.dark, margin: '0 0 16px', fontWeight: 500 }}>{editingLineup === 'new' ? 'Create Lineup' : 'Edit Lineup'}</h2>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'rgba(26,26,26,0.5)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Meeting Date *</label>
                  <input type="date" value={lineupDate} onChange={e => setLineupDate(e.target.value)} style={{ padding: '10px', border: '1px solid rgba(26,26,26,0.2)', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>

                {/* Info Session Section */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.gold, margin: 0, fontWeight: 600 }}>Info Session</p>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(184,149,107,0.3)' }} />
                    <p style={{ fontSize: '10px', color: 'rgba(26,26,26,0.4)', margin: 0 }}>7:30 – 8:30 PM</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {lineupSegments.filter(s => getSection(s) === 'info').map((seg) => {
                      const i = lineupSegments.indexOf(seg);
                      const sc = segmentColors[seg.key] || segmentColors.training;
                      return (
                        <div key={seg.key} style={{ padding: '14px', background: sc.bg, border: `1px solid ${sc.border}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <p style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: sc.color, margin: 0, fontWeight: 600 }}>{seg.label}</p>
                            <p style={{ fontSize: '10px', color: 'rgba(26,26,26,0.35)', margin: 0 }}>{seg.time} · {seg.duration}</p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', marginBottom: '3px' }}>Speaker</label>
                              <input value={seg.speaker || ''} onChange={e => { const ns = [...lineupSegments]; ns[i] = { ...ns[i], speaker: e.target.value }; setLineupSegments(ns); }} placeholder="Speaker name" style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.15)', fontSize: '14px', boxSizing: 'border-box', background: 'white' }} />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', marginBottom: '3px' }}>Topic</label>
                              <input value={seg.topic || ''} onChange={e => { const ns = [...lineupSegments]; ns[i] = { ...ns[i], topic: e.target.value }; setLineupSegments(ns); }} placeholder="Topic (optional)" style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.15)', fontSize: '14px', boxSizing: 'border-box', background: 'white' }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Break */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', padding: '12px 14px', background: 'rgba(26,26,26,0.03)', border: '1px dashed rgba(26,26,26,0.15)' }}>
                  <Icons.Clock style={{ width: '14px', height: '14px', color: 'rgba(26,26,26,0.3)' }} />
                  <p style={{ fontSize: '11px', color: 'rgba(26,26,26,0.4)', margin: 0 }}>8:30 PM — Info Session concludes. 15-min break for guest follow-up.</p>
                </div>

                {/* Training Section */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.dark, margin: 0, fontWeight: 600 }}>Training</p>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(26,26,26,0.15)' }} />
                    <p style={{ fontSize: '10px', color: 'rgba(26,26,26,0.4)', margin: 0 }}>8:45 – 10:00 PM</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {lineupSegments.filter(s => getSection(s) === 'training').map((seg) => {
                      const i = lineupSegments.indexOf(seg);
                      const sc = segmentColors[seg.key] || segmentColors.training;
                      return (
                        <div key={seg.key} style={{ padding: '14px', background: sc.bg, border: `1px solid ${sc.border}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <p style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: sc.color, margin: 0, fontWeight: 600 }}>{seg.label}</p>
                            <p style={{ fontSize: '10px', color: 'rgba(26,26,26,0.35)', margin: 0 }}>{seg.time} · {seg.duration}</p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', marginBottom: '3px' }}>Speaker</label>
                              <input value={seg.speaker || ''} onChange={e => { const ns = [...lineupSegments]; ns[i] = { ...ns[i], speaker: e.target.value }; setLineupSegments(ns); }} placeholder="Speaker name" style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.15)', fontSize: '14px', boxSizing: 'border-box', background: 'white' }} />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', marginBottom: '3px' }}>Topic</label>
                              <input value={seg.topic || ''} onChange={e => { const ns = [...lineupSegments]; ns[i] = { ...ns[i], topic: e.target.value }; setLineupSegments(ns); }} placeholder="Topic (optional)" style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.15)', fontSize: '14px', boxSizing: 'border-box', background: 'white' }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Dismissal */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', padding: '10px 12px', background: 'rgba(26,26,26,0.03)', border: '1px dashed rgba(26,26,26,0.15)' }}>
                  <Icons.Check style={{ width: '14px', height: '14px', color: '#22c55e' }} />
                  <p style={{ fontSize: '11px', color: 'rgba(26,26,26,0.4)', margin: 0 }}>10:00 PM — Formal dismissal. 10:00–11:00 PM Night Owl (optional).</p>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'rgba(26,26,26,0.5)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Training Topics</label>
                  <textarea value={lineupTopics} onChange={e => setLineupTopics(e.target.value)} rows={3} placeholder="Pipelining, Goal Setting, etc." style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.2)', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }} />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'rgba(26,26,26,0.5)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Notes</label>
                  <textarea value={lineupNotes} onChange={e => setLineupNotes(e.target.value)} rows={2} placeholder="Additional notes..." style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.2)', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }} />
                </div>

                <button onClick={saveLineup} style={{ padding: '14px 32px', background: colors.dark, color: colors.bg, border: 'none', cursor: 'pointer', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Save Lineup</button>
              </div>
            ) : (
              // Lineup List
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '18px', color: colors.dark, margin: 0, fontWeight: 500 }}>Meeting Lineups</h2>
                  {isLeadership && (
                    <button onClick={() => openLineupEditor()} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: colors.dark, color: colors.bg, border: 'none', cursor: 'pointer', fontSize: '12px' }}>
                      <Icons.Plus style={{ width: '14px', height: '14px' }} /> New Lineup
                    </button>
                  )}
                </div>

                {lineups.length === 0 ? (
                  <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <Icons.Calendar style={{ width: '32px', height: '32px', color: 'rgba(26,26,26,0.2)', margin: '0 auto 12px' }} />
                    <p style={{ color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>No lineups created yet</p>
                    <p style={{ color: 'rgba(26,26,26,0.3)', fontSize: '12px' }}>Create your first meeting lineup</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {lineups.map(lineup => (
                      <div key={lineup.date} style={{ background: 'white', border: '1px solid rgba(26,26,26,0.1)' }}>
                        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(26,26,26,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <p style={{ fontSize: '15px', fontWeight: 500, color: colors.dark, margin: '0 0 2px' }}>{formatDate(lineup.date)}</p>
                            {lineup.topics && <p style={{ fontSize: '11px', color: 'rgba(26,26,26,0.4)', margin: 0 }}>Training: {lineup.topics}</p>}
                          </div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => shareLineup(lineup.date)} style={{ padding: '6px 10px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: '#3b82f6', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Share style={{ width: '12px', height: '12px' }} /> Share</button>
                            {isLeadership && <button onClick={() => openLineupEditor(lineup)} style={{ padding: '6px 10px', background: 'rgba(26,26,26,0.05)', border: '1px solid rgba(26,26,26,0.15)', color: colors.dark, fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Edit style={{ width: '12px', height: '12px' }} /> Edit</button>}
                            <button onClick={() => deleteLineup(lineup.date)} style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Trash style={{ width: '12px', height: '12px' }} /> Delete</button>
                          </div>
                        </div>
                        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          {(lineup.segments || []).map((seg, i, arr) => {
                            const sc = segmentColors[seg.key] || segmentColors.training;
                            const segSec = getSection(seg);
                            const prevSection = i > 0 ? getSection(arr[i - 1]) : null;
                            const showSectionHeader = segSec !== prevSection;
                            return (
                              <React.Fragment key={i}>
                                {showSectionHeader && (
                                  <p style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: segSec === 'info' ? colors.gold : 'rgba(26,26,26,0.35)', margin: i === 0 ? '0 0 2px' : '6px 0 2px', fontWeight: 600 }}>
                                    {segSec === 'info' ? 'Info Session (7:30–8:30)' : 'Training (8:45–10:00)'}
                                  </p>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', padding: '3px 0' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {seg.time && <span style={{ fontSize: '10px', color: 'rgba(26,26,26,0.3)', fontVariantNumeric: 'tabular-nums', minWidth: '52px' }}>{seg.time}</span>}
                                    <span style={{ color: sc.color, fontWeight: 500, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{seg.label}</span>
                                  </div>
                                  <span style={{ color: colors.dark }}>{seg.speaker || <span style={{ color: 'rgba(26,26,26,0.3)' }}>TBD</span>}{seg.topic ? ` — ${seg.topic}` : ''}</span>
                                </div>
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )

          // ═══════════════ FINANCES TAB ═══════════════
          ) : tab === 'finances' ? (
            <>
              {/* Financial Summary */}
              <div className="lead-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
                <div style={{ padding: '16px', background: 'white', border: '1px solid rgba(34,197,94,0.2)', textAlign: 'center' }}>
                  <p style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#22c55e', marginBottom: '4px' }}>Revenue</p>
                  <p style={{ fontSize: '24px', fontWeight: 600, color: '#22c55e', margin: 0 }}>${totalRevenue.toFixed(2)}</p>
                  <p style={{ fontSize: '10px', color: 'rgba(26,26,26,0.3)', margin: '2px 0 0' }}>from Stripe</p>
                </div>
                <div style={{ padding: '16px', background: 'white', border: '1px solid rgba(239,68,68,0.2)', textAlign: 'center' }}>
                  <p style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ef4444', marginBottom: '4px' }}>Expenses</p>
                  <p style={{ fontSize: '24px', fontWeight: 600, color: '#ef4444', margin: 0 }}>${totalExpenses.toFixed(2)}</p>
                  <p style={{ fontSize: '10px', color: 'rgba(26,26,26,0.3)', margin: '2px 0 0' }}>{expenses.length} entries</p>
                </div>
                <div style={{ padding: '16px', background: 'white', border: `1px solid ${(totalRevenue - totalExpenses) >= 0 ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`, textAlign: 'center' }}>
                  <p style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>Net</p>
                  <p style={{ fontSize: '24px', fontWeight: 600, color: (totalRevenue - totalExpenses) >= 0 ? '#22c55e' : '#ef4444', margin: 0 }}>${(totalRevenue - totalExpenses).toFixed(2)}</p>
                </div>
              </div>

              {/* Expenses List */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', margin: 0 }}>Expenses</p>
                {isLeadership && (
                  <button onClick={openAddExpense} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: colors.dark, color: colors.bg, border: 'none', cursor: 'pointer', fontSize: '11px' }}>
                    <Icons.Plus style={{ width: '12px', height: '12px' }} /> Add Expense
                  </button>
                )}
              </div>

              {expenses.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', background: 'white', border: '1px solid rgba(26,26,26,0.1)' }}>
                  <Icons.Dollar style={{ width: '28px', height: '28px', color: 'rgba(26,26,26,0.2)', margin: '0 auto 8px' }} />
                  <p style={{ color: 'rgba(26,26,26,0.5)', fontSize: '13px' }}>No expenses recorded yet</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {expenses.map(exp => (
                    <div key={exp.id} style={{ display: 'flex', alignItems: 'center', padding: '12px', background: 'white', border: '1px solid rgba(26,26,26,0.1)', gap: '12px' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px', flexWrap: 'wrap' }}>
                          <p style={{ fontSize: '14px', fontWeight: 500, color: colors.dark, margin: 0 }}>{exp.description}</p>
                          <span style={{ fontSize: '9px', padding: '2px 6px', background: 'rgba(26,26,26,0.05)', color: 'rgba(26,26,26,0.5)', textTransform: 'uppercase' }}>{exp.category}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'rgba(26,26,26,0.4)', flexWrap: 'wrap' }}>
                          <span>{formatDateShort(exp.date)}</span>
                          {exp.paidBy && <span>Paid by: {exp.paidBy}</span>}
                          {exp.account && <span>Acct: {exp.account}</span>}
                          {exp.notes && <span style={{ fontStyle: 'italic' }}>{exp.notes}</span>}
                        </div>
                      </div>
                      <p style={{ fontSize: '16px', fontWeight: 600, color: '#ef4444', margin: 0, whiteSpace: 'nowrap' }}>${parseFloat(exp.amount).toFixed(2)}</p>
                      {isLeadership && (
                        <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                          <button onClick={() => openEditExpense(exp)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                            <Icons.Edit style={{ width: '14px', height: '14px', color: 'rgba(26,26,26,0.3)' }} />
                          </button>
                          <button onClick={() => deleteExpense(exp.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                            <Icons.Trash style={{ width: '14px', height: '14px', color: 'rgba(26,26,26,0.3)' }} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Revenue Breakdown */}
              <div style={{ marginTop: '24px' }}>
                <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', marginBottom: '12px' }}>Revenue (Stripe Payments This Period)</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {regs.filter(r => r.amount > 0).map(reg => (
                    <div key={reg.id} style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'white', border: '1px solid rgba(26,26,26,0.08)', gap: '10px' }}>
                      <p style={{ flex: 1, fontSize: '13px', color: colors.dark, margin: 0 }}>{reg.name}</p>
                      <span style={{ fontSize: '10px', padding: '2px 6px', background: reg.priceType === 'monthly' ? 'rgba(184,149,107,0.15)' : 'rgba(26,26,26,0.05)', color: reg.priceType === 'monthly' ? colors.gold : 'rgba(26,26,26,0.5)' }}>{reg.priceType === 'monthly' ? 'Monthly' : 'Weekly'}</span>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#22c55e', margin: 0 }}>${reg.amount.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>

          // ═══════════════ HISTORY TAB ═══════════════
          ) : tab === 'history' ? (
            selectedDate ? (
              // Meeting Detail with edit capabilities
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <button onClick={() => setSelectedDate(null)} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'rgba(26,26,26,0.5)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}>
                    <Icons.Back style={{ width: '16px', height: '16px' }} /> All Meetings
                  </button>
                  {isLeadership && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => setShowAddAttendee(true)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', background: colors.dark, color: colors.bg, border: 'none', cursor: 'pointer', fontSize: '11px' }}>
                        <Icons.Plus style={{ width: '12px', height: '12px' }} /> Add Person
                      </button>
                      <button onClick={() => deleteMeeting(selectedDate)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', cursor: 'pointer', fontSize: '11px' }}>
                        <Icons.Trash style={{ width: '12px', height: '12px' }} /> Delete Meeting
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '20px', color: colors.dark, margin: '0 0 4px', fontWeight: 500 }}>{formatDate(selectedDate)}</h2>
                  <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.5)', margin: 0 }}>{dateStats?.total || dateCheckins.length} people checked in</p>
                </div>

                {/* Show lineup if exists */}
                {(() => {
                  const lineup = lineups.find(l => l.date === selectedDate);
                  if (!lineup) return null;
                  return (
                    <div style={{ background: 'white', border: '1px solid rgba(184,149,107,0.25)', marginBottom: '16px', padding: '14px 16px' }}>
                      <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.gold, marginBottom: '10px' }}>Lineup</p>
                      {(lineup.segments || []).map((seg, i) => {
                        const sc = segmentColors[seg.key] || segmentColors.training;
                        return (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '3px 0' }}>
                            <span style={{ color: sc.color, fontWeight: 500 }}>{seg.label}</span>
                            <span style={{ color: colors.dark }}>{seg.speaker || '—'}{seg.topic ? ` — ${seg.topic}` : ''}</span>
                          </div>
                        );
                      })}
                      {lineup.topics && <p style={{ fontSize: '11px', color: 'rgba(26,26,26,0.5)', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(26,26,26,0.06)' }}>Training: {lineup.topics}</p>}
                    </div>
                  );
                })()}

                {/* Stats */}
                <div className="lead-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ padding: '14px', background: 'white', border: '1px solid rgba(26,26,26,0.1)', textAlign: 'center' }}>
                    <p style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>IBOs</p>
                    <p style={{ fontSize: '24px', fontWeight: 600, color: colors.dark, margin: 0 }}>{dateStats?.ibos || 0}</p>
                  </div>
                  <div style={{ padding: '14px', background: 'white', border: '1px solid rgba(168,85,247,0.2)', textAlign: 'center' }}>
                    <p style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a855f7', marginBottom: '4px' }}>Apprentices</p>
                    <p style={{ fontSize: '24px', fontWeight: 600, color: '#a855f7', margin: 0 }}>{dateStats?.apprentices || 0}</p>
                  </div>
                  <div style={{ padding: '14px', background: 'white', border: '1px solid rgba(59,130,246,0.2)', textAlign: 'center' }}>
                    <p style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3b82f6', marginBottom: '4px' }}>Guests</p>
                    <p style={{ fontSize: '24px', fontWeight: 600, color: '#3b82f6', margin: 0 }}>{dateStats?.guests?.total || 0}</p>
                  </div>
                </div>

                {/* Attendee List with remove buttons */}
                {[
                  { type: 'guest', label: 'Guests', color: '#3b82f6', items: dateCheckins.filter(c => c.type === 'guest') },
                  { type: 'apprentice', label: 'Apprentices', color: '#a855f7', items: dateCheckins.filter(c => c.type === 'apprentice') },
                  { type: 'ibo', label: 'IBOs', color: colors.dark, items: dateCheckins.filter(c => c.type === 'ibo') },
                ].filter(s => s.items.length > 0).map(section => (
                  <div key={section.type} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: section.color, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{section.label}</p>
                      <div style={{ flex: 1, height: '1px', background: 'rgba(26,26,26,0.08)' }} />
                      <p style={{ fontSize: '11px', color: 'rgba(26,26,26,0.4)', margin: 0 }}>{section.items.length}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {section.items.map((c, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'white', border: '1px solid rgba(26,26,26,0.08)', gap: '10px' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '14px', color: colors.dark, margin: 0 }}>{c.name}</p>
                            {c.ltdId && <p style={{ fontSize: '10px', color: 'rgba(26,26,26,0.35)', margin: '1px 0 0' }}>LTD #{c.ltdId}</p>}
                          </div>
                          {c.visitNumber && <span style={{ fontSize: '10px', fontWeight: 600, color: '#3b82f6', padding: '2px 6px', background: 'rgba(59,130,246,0.1)' }}>{c.visitNumber}</span>}
                          {c.priceType === 'monthly' && c.type === 'ibo' && <span style={{ fontSize: '10px', fontWeight: 600, color: colors.gold, padding: '2px 6px', background: 'rgba(184,149,107,0.15)' }}>Monthly</span>}
                          {c.manual && <span style={{ fontSize: '9px', color: 'rgba(26,26,26,0.3)', padding: '2px 6px', background: 'rgba(26,26,26,0.04)' }}>Manual</span>}
                          {isLeadership && (
                            <button onClick={() => removeAttendee(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
                              <Icons.X style={{ width: '14px', height: '14px', color: 'rgba(26,26,26,0.3)' }} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              // History List
              <>
                {isLeadership && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
                    {fixMsg && <span style={{ fontSize: '11px', color: '#22c55e' }}>{fixMsg}</span>}
                    {syncStatus && syncStatus.withoutLtdId > 0 && (
                      <span style={{ fontSize: '10px', color: 'rgba(26,26,26,0.4)' }}>
                        {syncStatus.withoutLtdId} records unlinked
                      </span>
                    )}
                    <button onClick={runSync} disabled={syncing} style={{ padding: '8px 14px', background: syncing ? 'rgba(26,26,26,0.1)' : 'rgba(59,130,246,0.08)', color: syncing ? 'rgba(26,26,26,0.4)' : '#3b82f6', border: `1px solid ${syncing ? 'rgba(26,26,26,0.15)' : 'rgba(59,130,246,0.25)'}`, cursor: syncing ? 'not-allowed' : 'pointer', fontSize: '11px' }}>
                      {syncing ? 'Syncing...' : 'Sync LTD IDs'}
                    </button>
                    <button onClick={fixHistoryDates} style={{ padding: '8px 14px', background: 'transparent', color: colors.gold, border: `1px solid ${colors.gold}`, cursor: 'pointer', fontSize: '11px' }}>
                      Fix Dates
                    </button>
                  </div>
                )}
                {history.length > 0 && (
                  <div style={{ background: 'white', border: '1px solid rgba(26,26,26,0.1)', padding: '20px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', margin: 0 }}>Overview</p>
                      <p style={{ fontSize: '11px', color: 'rgba(26,26,26,0.4)', margin: 0 }}>{history.length} meeting{history.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '16px' }}>
                      <div><p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>Avg</p><p style={{ fontSize: '20px', fontWeight: 600, color: colors.dark, margin: 0 }}>{Math.round(history.reduce((s, h) => s + h.total, 0) / history.length)}</p></div>
                      <div><p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>Best</p><p style={{ fontSize: '20px', fontWeight: 600, color: '#22c55e', margin: 0 }}>{Math.max(...history.map(h => h.total))}</p></div>
                      <div><p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#3b82f6', margin: '0 0 2px' }}>Guests</p><p style={{ fontSize: '20px', fontWeight: 600, color: '#3b82f6', margin: 0 }}>{history.reduce((s, h) => s + (h.guests?.total || 0), 0)}</p></div>
                      <div><p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>Total</p><p style={{ fontSize: '20px', fontWeight: 600, color: colors.dark, margin: 0 }}>{history.reduce((s, h) => s + h.total, 0)}</p></div>
                    </div>
                  </div>
                )}

                {history.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <Icons.Users style={{ width: '32px', height: '32px', color: 'rgba(26,26,26,0.2)', margin: '0 auto 12px' }} />
                    <p style={{ color: 'rgba(26,26,26,0.5)' }}>No meeting history yet</p>
                  </div>
                ) : (
                  history.map((meeting, i) => {
                    const guestTotal = (meeting.guests?.first || 0) + (meeting.guests?.second || 0) + (meeting.guests?.third || 0);
                    const trend = history[i + 1] ? meeting.total - history[i + 1].total : null;
                    const lineup = lineups.find(l => l.date === meeting.date);
                    const speakerSummary = lineup?.segments?.filter(s => s.speaker).map(s => ({ label: s.label, speaker: s.speaker, topic: s.topic })) || [];

                    return (
                      <div key={meeting.date} onClick={() => setSelectedDate(meeting.date)} style={{ background: 'white', border: '1px solid rgba(26,26,26,0.1)', cursor: 'pointer', marginBottom: '14px' }}>
                        <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid rgba(26,26,26,0.06)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                            <div>
                              <p style={{ fontSize: '15px', fontWeight: 600, color: colors.dark, margin: '0 0 3px' }}>{formatDate(meeting.date)}</p>
                              {lineup && <p style={{ fontSize: '12px', color: colors.gold, margin: 0 }}>Training: {lineup.segments?.find(s => s.key === 'training')?.topic || lineup.topics || '—'}</p>}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                              {trend !== null && trend !== 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: trend > 0 ? '#22c55e' : '#ef4444' }}>
                                  {trend > 0 ? <Icons.TrendUp style={{ width: '14px', height: '14px' }} /> : <Icons.TrendDown style={{ width: '14px', height: '14px' }} />}
                                  {trend > 0 ? '+' : ''}{trend}
                                </div>
                              )}
                              {lineup && <Icons.List style={{ width: '14px', height: '14px', color: colors.gold }} />}
                              <div style={{ background: colors.dark, color: colors.bg, padding: '5px 14px', fontSize: '17px', fontWeight: 700 }}>{meeting.total}</div>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: speakerSummary.length > 0 ? '1px solid rgba(26,26,26,0.06)' : 'none' }}>
                          <div style={{ padding: '12px 10px', textAlign: 'center', borderRight: '1px solid rgba(26,26,26,0.06)' }}><p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(26,26,26,0.4)', margin: '0 0 3px' }}>IBOs</p><p style={{ fontSize: '18px', fontWeight: 600, color: colors.dark, margin: 0 }}>{meeting.ibos}</p></div>
                          <div style={{ padding: '12px 10px', textAlign: 'center', borderRight: '1px solid rgba(26,26,26,0.06)' }}><p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a855f7', margin: '0 0 3px' }}>Apprentices</p><p style={{ fontSize: '18px', fontWeight: 600, color: '#a855f7', margin: 0 }}>{meeting.apprentices}</p></div>
                          <div style={{ padding: '12px 10px', textAlign: 'center', borderRight: '1px solid rgba(26,26,26,0.06)' }}><p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#3b82f6', margin: '0 0 3px' }}>Guests</p><p style={{ fontSize: '18px', fontWeight: 600, color: '#3b82f6', margin: 0 }}>{guestTotal}</p></div>
                          <div style={{ padding: '12px 10px', textAlign: 'center' }}><p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(26,26,26,0.4)', margin: '0 0 3px' }}>Total</p><p style={{ fontSize: '18px', fontWeight: 600, color: colors.dark, margin: 0 }}>{meeting.total}</p></div>
                        </div>
                        {speakerSummary.length > 0 && (
                          <div style={{ padding: '12px 20px' }}>
                            <p style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.35)', margin: '0 0 8px' }}>Speakers</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px' }}>
                              {speakerSummary.map((s, si) => {
                                const sc = segmentColors[lineup.segments.find(seg => seg.label === s.label)?.key] || segmentColors.training;
                                return (
                                  <div key={si} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
                                    <span style={{ color: sc.color, fontWeight: 600, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label.split('/')[0].trim().split(' ').slice(0,2).join(' ')}</span>
                                    <span style={{ color: colors.dark }}>{s.speaker}</span>
                                    {s.topic && <span style={{ color: 'rgba(26,26,26,0.35)', fontSize: '10px' }}>({s.topic})</span>}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </>
            )
          // ═══════════════ USERS TAB ═══════════════
          ) : tab === 'users' && isLeadership ? (
            <>
              <h2 style={{ fontSize: '18px', color: colors.dark, margin: '0 0 16px', fontWeight: 500 }}>User Access Management</h2>
              <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.5)', marginBottom: '20px' }}>
                Control who can access the Leadership Portal and what level of access they have.
              </p>

              {/* All Members — unified list with inline access controls */}
              <div>
                <div style={{ position: 'relative', marginBottom: '12px' }}>
                  <Icons.Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'rgba(26,26,26,0.3)' }} />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    placeholder="Search by name or LTD ID..."
                    style={{ width: '100%', padding: '10px 10px 10px 40px', border: '1px solid rgba(26,26,26,0.2)', background: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '500px', overflow: 'auto' }}>
                  {allProfiles
                    .filter(p => {
                      if (!userSearch) return true;
                      const q = userSearch.toLowerCase();
                      return (p.full_name || '').toLowerCase().includes(q) || (p.ltd_id || '').toLowerCase().includes(q);
                    })
                    .sort((a, b) => {
                      // Sort: users with access first, then alphabetical
                      const aAccess = a.role === 'admin' || accessList.some(x => x.ltdId === a.ltd_id);
                      const bAccess = b.role === 'admin' || accessList.some(x => x.ltdId === b.ltd_id);
                      if (aAccess && !bAccess) return -1;
                      if (!aAccess && bAccess) return 1;
                      return (a.full_name || '').localeCompare(b.full_name || '');
                    })
                    .map(p => {
                      const isBuiltIn = p.role === 'admin';
                      const accessEntry = accessList.find(a => a.ltdId === p.ltd_id);
                      const currentLevel = isBuiltIn ? 'leadership' : accessEntry?.level || null;
                      return (
                        <div key={p.id} style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', background: currentLevel ? 'rgba(34,197,94,0.03)' : 'white', border: currentLevel ? '1px solid rgba(34,197,94,0.15)' : '1px solid rgba(26,26,26,0.08)', gap: '8px', flexWrap: 'wrap' }}>
                          <div style={{ flex: 1, minWidth: '120px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <p style={{ fontSize: '13px', fontWeight: 500, color: colors.dark, margin: 0 }}>{p.full_name || 'Unnamed'}</p>
                            </div>
                            {p.ltd_id && <p style={{ fontSize: '10px', color: 'rgba(26,26,26,0.3)', margin: '1px 0 0' }}>#{p.ltd_id}</p>}
                          </div>
                          {isBuiltIn ? (
                            /* Built-in admin — always leadership, can't change */
                            <span style={{ fontSize: '9px', padding: '3px 8px', background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Leadership (built-in)
                            </span>
                          ) : currentLevel ? (
                            /* Has granted access — show level buttons with active one highlighted */
                            <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                              {['leadership', 'admin', 'av', 'viewer'].map(level => (
                                <button
                                  key={level}
                                  onClick={() => { if (level !== currentLevel) grantAccess(p, level); }}
                                  disabled={updatingAccess === p.ltd_id}
                                  style={{
                                    padding: '4px 8px', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em',
                                    background: level === currentLevel ? 'rgba(34,197,94,0.12)' : 'transparent',
                                    border: level === currentLevel ? '1px solid rgba(34,197,94,0.35)' : '1px solid rgba(26,26,26,0.1)',
                                    color: level === currentLevel ? '#22c55e' : 'rgba(26,26,26,0.35)',
                                    fontWeight: level === currentLevel ? 600 : 400,
                                    cursor: level === currentLevel ? 'default' : 'pointer',
                                    opacity: updatingAccess === p.ltd_id ? 0.5 : 1,
                                  }}
                                >
                                  {level}
                                </button>
                              ))}
                              <button
                                onClick={() => revokeAccess(p.ltd_id)}
                                disabled={updatingAccess === p.ltd_id}
                                style={{ padding: '4px 6px', background: 'none', border: 'none', cursor: 'pointer', opacity: updatingAccess === p.ltd_id ? 0.3 : 0.4 }}
                                title="Revoke access"
                              >
                                <Icons.X style={{ width: '12px', height: '12px', color: '#ef4444' }} />
                              </button>
                            </div>
                          ) : (
                            /* No access — show grant buttons */
                            <div style={{ display: 'flex', gap: '3px' }}>
                              {['leadership', 'admin', 'av', 'viewer'].map(level => (
                                <button
                                  key={level}
                                  onClick={() => grantAccess(p, level)}
                                  disabled={updatingAccess === p.ltd_id}
                                  style={{
                                    padding: '4px 8px', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em',
                                    background: 'transparent', border: '1px solid rgba(26,26,26,0.12)',
                                    color: 'rgba(26,26,26,0.35)', cursor: 'pointer',
                                    opacity: updatingAccess === p.ltd_id ? 0.5 : 1,
                                  }}
                                >
                                  {level}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  }
                </div>

                {/* Access Level Legend */}
                <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(26,26,26,0.02)', border: '1px solid rgba(26,26,26,0.06)' }}>
                  <p style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.35)', marginBottom: '8px' }}>Access Levels</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: 'rgba(26,26,26,0.5)' }}>
                    <p style={{ margin: 0 }}><strong style={{ color: colors.dark }}>Leadership</strong> — Full access: check-in, lineups, finances, history, user management</p>
                    <p style={{ margin: 0 }}><strong style={{ color: colors.dark }}>Admin</strong> — Can check in and view check-in history. No finances, user management, or lineup</p>
                    <p style={{ margin: 0 }}><strong style={{ color: colors.dark }}>Viewer</strong> — Read-only access to all data</p>
                    <p style={{ margin: 0, marginTop: '4px', fontStyle: 'italic', fontSize: '11px' }}>Members without any granted access level cannot see the leadership portal.</p>
                  </div>
                </div>
              </div>
            </>
          // ═══════════════ SETTINGS TAB ═══════════════
          ) : tab === 'settings' && canSeeWebcast ? (
            <>
              <h2 style={{ fontSize: '18px', color: colors.dark, margin: '0 0 16px', fontWeight: 500 }}>Webcast</h2>

              {/* Webcast Zoom Link */}
              <div style={{ background: 'white', border: '1px solid rgba(26,26,26,0.08)', padding: '20px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <svg style={{ width: '18px', height: '18px', color: '#3b82f6' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
                  <h3 style={{ fontSize: '15px', fontWeight: 500, color: colors.dark, margin: 0 }}>Webcast Zoom Link</h3>
                </div>
                <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.5)', marginBottom: '12px', lineHeight: 1.5 }}>
                  Set the Zoom meeting link for webcast ticket holders. This link is shown after purchase and in their My Events page.
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="url"
                    placeholder="https://us06web.zoom.us/j/..."
                    value={zoomLinkInput}
                    onChange={(e) => setZoomLinkInput(e.target.value)}
                    style={{ flex: 1, padding: '10px', border: '1px solid rgba(26,26,26,0.15)', background: 'white', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                  />
                  <button
                    onClick={async () => {
                      if (!zoomLinkInput.trim()) return;
                      setZoomSaving(true);
                      try {
                        const res = await fetch('/api/webcast', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ link: zoomLinkInput.trim() }),
                        });
                        if (res.ok) {
                          setZoomLink(zoomLinkInput.trim());
                          setToast('Zoom link saved!');
                        }
                      } catch (e) { console.error(e); }
                      setZoomSaving(false);
                    }}
                    disabled={zoomSaving || !zoomLinkInput.trim()}
                    style={{
                      padding: '10px 16px', fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase',
                      background: zoomSaving || !zoomLinkInput.trim() ? 'rgba(26,26,26,0.15)' : colors.dark,
                      color: zoomSaving || !zoomLinkInput.trim() ? 'rgba(26,26,26,0.4)' : colors.bg,
                      border: 'none', cursor: zoomSaving || !zoomLinkInput.trim() ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {zoomSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
                {zoomLink && (
                  <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <p style={{ fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#22c55e', margin: 0, fontWeight: 600 }}>Current Link</p>
                      <button
                        onClick={async () => {
                          if (navigator.share) {
                            try {
                              await navigator.share({ title: 'Webcast Zoom Link', text: 'Join the webcast:', url: zoomLink });
                            } catch (e) {
                              if (e.name !== 'AbortError') { navigator.clipboard.writeText(zoomLink); setToast('Link copied!'); }
                            }
                          } else {
                            navigator.clipboard.writeText(zoomLink);
                            setToast('Link copied!');
                          }
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', fontSize: '11px', color: '#3b82f6', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', cursor: 'pointer' }}
                      >
                        <svg style={{ width: '12px', height: '12px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" /></svg>
                        Share
                      </button>
                    </div>
                    <p style={{ fontSize: '12px', color: colors.dark, margin: 0, wordBreak: 'break-all' }}>{zoomLink}</p>
                  </div>
                )}
              </div>

              {/* Webcast Registrations */}
              <div style={{ background: 'white', border: '1px solid rgba(26,26,26,0.08)', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg style={{ width: '18px', height: '18px', color: '#3b82f6' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
                    <h3 style={{ fontSize: '15px', fontWeight: 500, color: colors.dark, margin: 0 }}>Registrations</h3>
                  </div>
                  <span style={{ fontSize: '12px', color: 'rgba(26,26,26,0.4)' }}>{webcastRegs.length} registered</span>
                </div>
                {webcastRegs.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.4)', textAlign: 'center', padding: '20px 0' }}>No webcast registrations this week</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {webcastRegs.map(reg => {
                      const isSending = sendingLink === reg.id;
                      const isSent = sentLinks.includes(reg.id);
                      const webcastType = reg.type?.replace('webcast-', '') || 'ibo';
                      const badge = webcastType === 'guest' ? { label: 'Guest', bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' }
                        : webcastType === 'apprentice' ? { label: 'Apprentice', bg: 'rgba(168,85,247,0.1)', color: '#a855f7' }
                        : { label: 'IBO', bg: 'rgba(184,149,107,0.15)', color: colors.gold };
                      const isWcExpanded = expandedWebcastReg === reg.id;
                      return (
                        <div key={reg.id} style={{ background: isSent ? 'rgba(34,197,94,0.04)' : 'white', border: isSent ? '1px solid rgba(34,197,94,0.15)' : '1px solid rgba(26,26,26,0.1)' }}>
                          <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setExpandedWebcastReg(isWcExpanded ? null : reg.id)}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: '14px', fontWeight: 500, color: colors.dark, margin: '0 0 1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{reg.name}</p>
                              <p style={{ fontSize: '11px', color: 'rgba(26,26,26,0.5)', margin: 0 }}>{reg.email}</p>
                            </div>
                            <div style={{ padding: '3px 8px', background: badge.bg, fontSize: '9px', fontWeight: 600, color: badge.color, textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0 }}>{badge.label}</div>
                            {zoomLink ? (
                              <button
                                disabled={isSending}
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  setSendingLink(reg.id);
                                  try {
                                    // Try to email the link via API
                                    const res = await fetch('/api/webcast/send-link', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ email: reg.email, name: reg.name }),
                                    });
                                    const data = await res.json();
                                    if (data.success) {
                                      setSentLinks(prev => [...prev, reg.id]);
                                      setToast(`Link emailed to ${reg.email}`);
                                    } else {
                                      // Fallback to native share / clipboard
                                      const shareText = `Hi ${reg.name.split(' ')[0]}! Here's your webcast link for tonight's meeting:`;
                                      if (navigator.share) {
                                        try {
                                          await navigator.share({ title: 'Webcast Link', text: shareText, url: zoomLink });
                                          setSentLinks(prev => [...prev, reg.id]);
                                        } catch (shareErr) {
                                          if (shareErr.name !== 'AbortError') {
                                            navigator.clipboard.writeText(`${shareText}\n${zoomLink}`);
                                            setSentLinks(prev => [...prev, reg.id]);
                                            setToast('Link copied!');
                                          }
                                        }
                                      } else {
                                        navigator.clipboard.writeText(`${shareText}\n${zoomLink}`);
                                        setSentLinks(prev => [...prev, reg.id]);
                                        setToast('Link copied!');
                                      }
                                    }
                                  } catch (err) {
                                    setToast('Error sending link');
                                  }
                                  setSendingLink(null);
                                }}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', flexShrink: 0, cursor: 'pointer',
                                  background: isSent ? '#22c55e' : 'rgba(59,130,246,0.08)',
                                  color: isSent ? 'white' : '#3b82f6',
                                  border: isSent ? '1px solid #22c55e' : '1px solid rgba(59,130,246,0.15)',
                                }}
                              >
                                {isSent ? (
                                  <><Icons.Check style={{ width: '12px', height: '12px' }} />Sent</>
                                ) : (
                                  <><svg style={{ width: '12px', height: '12px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 2L11 13" /><path d="M22 2L15 22l-4-9-9-4z" /></svg>Send</>
                                )}
                              </button>
                            ) : (
                              <span style={{ fontSize: '9px', color: 'rgba(26,26,26,0.3)', textTransform: 'uppercase' }}>No link set</span>
                            )}
                          </div>
                          {isWcExpanded && (
                            <div style={{ padding: '0 12px 12px', borderTop: '1px solid rgba(26,26,26,0.06)' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '10px' }}>
                                {reg.name && <div><p style={{ fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>Name</p><p style={{ fontSize: '13px', color: colors.dark, margin: 0 }}>{reg.name}</p></div>}
                                {reg.email && <div><p style={{ fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>Email</p><p style={{ fontSize: '13px', color: colors.dark, margin: 0, wordBreak: 'break-all' }}>{reg.email}</p></div>}
                                {reg.ltdId && <div><p style={{ fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>LTD ID</p><p style={{ fontSize: '13px', color: colors.dark, margin: 0 }}>{reg.ltdId}</p></div>}
                                {reg.uplinePlatinum && <div><p style={{ fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>Upline Platinum</p><p style={{ fontSize: '13px', color: colors.dark, margin: 0 }}>{reg.uplinePlatinum}</p></div>}
                                {reg.invitedBy && <div><p style={{ fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>Invited By</p><p style={{ fontSize: '13px', color: colors.dark, margin: 0 }}>{reg.invitedBy}</p></div>}
                                {reg.visitNumber && <div><p style={{ fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>Visit</p><p style={{ fontSize: '13px', color: colors.dark, margin: 0 }}>{reg.visitNumber}</p></div>}
                                <div><p style={{ fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>Type</p><p style={{ fontSize: '13px', color: colors.dark, margin: 0, textTransform: 'capitalize' }}>{webcastType}{reg.isSpouse ? ' (Spouse)' : ''}</p></div>
                                {reg.amount > 0 && <div><p style={{ fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>Paid</p><p style={{ fontSize: '13px', color: colors.dark, margin: 0 }}>${reg.amount}</p></div>}
                                {reg.date && <div><p style={{ fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>Registered</p><p style={{ fontSize: '13px', color: colors.dark, margin: 0 }}>{reg.date}</p></div>}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : tab === 'event' && canCheckIn ? (
            <>
              <h2 style={{ fontSize: '18px', color: colors.dark, margin: '0 0 16px', fontWeight: 500 }}>Event Details</h2>
              <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.5)', marginBottom: '20px', lineHeight: 1.5 }}>
                Update the presenter, date, and pricing for the registration pages. Changes take effect immediately.
              </p>

              {/* Main Page */}
              <div style={{ background: 'white', border: '1px solid rgba(26,26,26,0.08)', padding: '20px', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: colors.dark, margin: '0 0 14px' }}>Home Page</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>Presenter Name</label>
                    <input type="text" placeholder="e.g. Talor Byington" value={eventSettings.mainPresenter} onChange={(e) => setEventSettings(s => ({ ...s, mainPresenter: e.target.value }))}
                      style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.15)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>Date</label>
                    <input type="date" value={eventSettings.mainDateRaw || ''} onChange={(e) => {
                      const raw = e.target.value;
                      const formatted = raw ? new Date(raw + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '';
                      setEventSettings(s => ({ ...s, mainDateRaw: raw, mainDate: formatted }));
                    }}
                      style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.15)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                    {eventSettings.mainDate && <p style={{ fontSize: '12px', color: colors.gold, margin: '6px 0 0' }}>{eventSettings.mainDate}</p>}
                  </div>
                </div>
              </div>

              {/* BCS Page */}
              <div style={{ background: 'white', border: '1px solid rgba(26,26,26,0.08)', padding: '20px', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: colors.dark, margin: '0 0 14px' }}>BCS Page</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>Presenter Name</label>
                    <input type="text" placeholder="e.g. Talor Byington" value={eventSettings.bcsPresenter} onChange={(e) => setEventSettings(s => ({ ...s, bcsPresenter: e.target.value }))}
                      style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.15)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>Date</label>
                    <input type="date" value={eventSettings.bcsDateRaw || ''} onChange={(e) => {
                      const raw = e.target.value;
                      const formatted = raw ? new Date(raw + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '';
                      setEventSettings(s => ({ ...s, bcsDateRaw: raw, bcsDate: formatted }));
                    }}
                      style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.15)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                    {eventSettings.bcsDate && <p style={{ fontSize: '12px', color: colors.gold, margin: '6px 0 0' }}>{eventSettings.bcsDate}</p>}
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div style={{ background: 'white', border: '1px solid rgba(26,26,26,0.08)', padding: '20px', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: colors.dark, margin: '0 0 14px' }}>Pricing</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>Single Week ($)</label>
                      <input type="number" min="0" step="1" value={eventSettings.singlePrice ?? 12} onChange={(e) => setEventSettings(s => ({ ...s, singlePrice: Number(e.target.value) }))}
                        style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.15)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>Webcast ($)</label>
                      <input type="number" min="0" step="1" value={eventSettings.webcastPrice ?? 5} onChange={(e) => setEventSettings(s => ({ ...s, webcastPrice: Number(e.target.value) }))}
                        style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.15)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>Monthly Price ($)</label>
                      <input type="number" min="0" step="1" value={eventSettings.monthlyPrice ?? 50} onChange={(e) => setEventSettings(s => ({ ...s, monthlyPrice: Number(e.target.value) }))}
                        style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.15)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>Monthly Weeks</label>
                      <input type="number" min="1" max="6" step="1" value={eventSettings.monthlyWeeks ?? 5} onChange={(e) => setEventSettings(s => ({ ...s, monthlyWeeks: Number(e.target.value) }))}
                        style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.15)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  </div>

                  {/* Reduced Monthly (catch-up) */}
                  <div style={{ borderTop: '1px solid rgba(26,26,26,0.06)', paddingTop: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: colors.dark, margin: 0 }}>Reduced Monthly Option</p>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '11px', color: 'rgba(26,26,26,0.5)' }}>
                        <input type="checkbox" checked={(eventSettings.monthlyReducedPrice || 0) > 0}
                          onChange={(e) => setEventSettings(s => ({ ...s, monthlyReducedPrice: e.target.checked ? (s.monthlyReducedPrice || 40) : 0 }))}
                          style={{ width: '14px', height: '14px', accentColor: colors.gold }} />
                        Enable
                      </label>
                    </div>
                    <p style={{ fontSize: '11px', color: 'rgba(26,26,26,0.4)', margin: '0 0 10px', lineHeight: 1.4 }}>
                      For individuals who already paid for part of the month (e.g. double pay). Shows as a third option on the registration page.
                    </p>
                    {(eventSettings.monthlyReducedPrice || 0) > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>Price ($)</label>
                            <input type="number" min="0" step="1" value={eventSettings.monthlyReducedPrice} onChange={(e) => setEventSettings(s => ({ ...s, monthlyReducedPrice: Number(e.target.value) }))}
                              style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.15)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>Weeks</label>
                            <input type="number" min="1" max="5" step="1" value={eventSettings.monthlyReducedWeeks || 3} onChange={(e) => setEventSettings(s => ({ ...s, monthlyReducedWeeks: Number(e.target.value) }))}
                              style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.15)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                          </div>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>Label (shown to registrant)</label>
                          <input type="text" placeholder="e.g. 3 weeks (catch-up)" value={eventSettings.monthlyReducedLabel || ''} onChange={(e) => setEventSettings(s => ({ ...s, monthlyReducedLabel: e.target.value }))}
                            style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.15)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={async () => {
                  setEventSaving(true);
                  try {
                    const res = await fetch('/api/event-settings', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(eventSettings),
                    });
                    if (res.ok) setToast('Event details saved!');
                  } catch (e) { console.error(e); }
                  setEventSaving(false);
                }}
                disabled={eventSaving}
                style={{
                  width: '100%', padding: '14px', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600,
                  background: eventSaving ? 'rgba(26,26,26,0.15)' : colors.dark,
                  color: eventSaving ? 'rgba(26,26,26,0.4)' : colors.bg,
                  border: 'none', cursor: eventSaving ? 'not-allowed' : 'pointer',
                }}
              >
                {eventSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : tab === 'calendar' && canCheckIn ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', color: colors.dark, margin: 0, fontWeight: 500 }}>Upcoming Events</h2>
                <button onClick={() => { setEditingEvent(null); setEventForm({ title: '', subtitle: '', date: '', time: '', location: '', url: '', buttonLabel: 'Details', type: 'upcoming', highlight: false }); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: colors.dark, color: colors.bg, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>
                  <Icons.Plus style={{ width: '14px', height: '14px' }} />New Event
                </button>
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.5)', marginBottom: '20px', lineHeight: 1.5 }}>
                Manage the events shown in the &quot;Upcoming Events&quot; and &quot;Other Info Sessions&quot; sections on the home page.
              </p>

              {/* Add / Edit Form */}
              {(editingEvent !== undefined && editingEvent !== 'none') || editingEvent === null ? (
                <div style={{ background: 'white', border: '1px solid rgba(26,26,26,0.08)', padding: '20px', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, color: colors.dark, margin: '0 0 14px' }}>
                    {editingEvent ? 'Edit Event' : 'Add New Event'}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>Event Title *</label>
                      <input type="text" placeholder="e.g. HFT, Team Meeting, Spring Leadership" value={eventForm.title}
                        onChange={(e) => setEventForm(f => ({ ...f, title: e.target.value }))}
                        style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.15)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>Subtitle / Speaker</label>
                      <input type="text" placeholder="e.g. Joel Weinberg STP" value={eventForm.subtitle}
                        onChange={(e) => setEventForm(f => ({ ...f, subtitle: e.target.value }))}
                        style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.15)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>Date *</label>
                        <input type="date" value={eventForm.date}
                          onChange={(e) => setEventForm(f => ({ ...f, date: e.target.value }))}
                          style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.15)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                        {eventForm.date && <p style={{ fontSize: '11px', color: colors.gold, margin: '4px 0 0' }}>{formatDate(eventForm.date)}</p>}
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>Time</label>
                        <input type="text" placeholder="e.g. 1:00 PM" value={eventForm.time}
                          onChange={(e) => setEventForm(f => ({ ...f, time: e.target.value }))}
                          style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.15)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>Location</label>
                      <input type="text" placeholder="e.g. Holiday Inn – Galleria, Houston, TX" value={eventForm.location}
                        onChange={(e) => setEventForm(f => ({ ...f, location: e.target.value }))}
                        style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.15)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>Link / URL</label>
                        <input type="url" placeholder="https://..." value={eventForm.url}
                          onChange={(e) => setEventForm(f => ({ ...f, url: e.target.value }))}
                          style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.15)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>Button Label</label>
                        <input type="text" placeholder="e.g. Details, Register, More Info" value={eventForm.buttonLabel}
                          onChange={(e) => setEventForm(f => ({ ...f, buttonLabel: e.target.value }))}
                          style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.15)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: eventForm.highlight ? 'rgba(184,149,107,0.06)' : 'rgba(26,26,26,0.02)', border: eventForm.highlight ? `1px solid ${colors.gold}` : '1px solid rgba(26,26,26,0.08)', cursor: 'pointer' }}
                      onClick={() => setEventForm(f => ({ ...f, highlight: !f.highlight }))}>
                      <Icons.Star style={{ width: '16px', height: '16px', color: eventForm.highlight ? colors.gold : 'rgba(26,26,26,0.25)' }} fill={eventForm.highlight ? colors.gold : 'none'} />
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 500, color: eventForm.highlight ? colors.gold : 'rgba(26,26,26,0.5)', margin: 0 }}>Highlight this event</p>
                        <p style={{ fontSize: '11px', color: 'rgba(26,26,26,0.35)', margin: '2px 0 0' }}>Emphasized styling on the home page — gold accent, larger text</p>
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>Section</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {[{ id: 'upcoming', label: 'Upcoming Event' }, { id: 'info-session', label: 'Info Session Link' }].map(opt => (
                          <button key={opt.id} onClick={() => setEventForm(f => ({ ...f, type: opt.id }))}
                            style={{ flex: 1, padding: '10px', fontSize: '12px', border: eventForm.type === opt.id ? `1px solid ${colors.gold}` : '1px solid rgba(26,26,26,0.15)',
                              background: eventForm.type === opt.id ? 'rgba(184,149,107,0.08)' : 'white', color: eventForm.type === opt.id ? colors.gold : 'rgba(26,26,26,0.5)',
                              cursor: 'pointer', fontWeight: eventForm.type === opt.id ? 500 : 400 }}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <button
                        onClick={async () => {
                          if (!eventForm.title || !eventForm.date) return;
                          try {
                            const payload = editingEvent ? { ...eventForm, id: editingEvent } : eventForm;
                            const res = await fetch('/api/calendar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                            const data = await res.json();
                            if (data.success) {
                              setCalendarEvents(data.events);
                              setEditingEvent('none');
                              setEventForm({ title: '', subtitle: '', date: '', time: '', location: '', url: '', buttonLabel: 'Details', type: 'upcoming' });
                              showToast(editingEvent ? 'Event updated!' : 'Event added!');
                            }
                          } catch (e) { console.error(e); }
                        }}
                        disabled={!eventForm.title || !eventForm.date}
                        style={{ flex: 1, padding: '12px', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600,
                          background: (!eventForm.title || !eventForm.date) ? 'rgba(26,26,26,0.15)' : colors.dark,
                          color: (!eventForm.title || !eventForm.date) ? 'rgba(26,26,26,0.4)' : colors.bg,
                          border: 'none', cursor: (!eventForm.title || !eventForm.date) ? 'not-allowed' : 'pointer' }}>
                        {editingEvent ? 'Update Event' : 'Add Event'}
                      </button>
                      {(editingEvent || editingEvent === null) && (
                        <button onClick={() => { setEditingEvent('none'); setEventForm({ title: '', subtitle: '', date: '', time: '', location: '', url: '', buttonLabel: 'Details', type: 'upcoming', highlight: false }); }}
                          style={{ padding: '12px 20px', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'white', color: 'rgba(26,26,26,0.5)', border: '1px solid rgba(26,26,26,0.15)', cursor: 'pointer' }}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Upcoming Events list */}
              {calendarLoading ? (
                <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(26,26,26,0.4)', padding: '40px 0' }}>Loading events...</p>
              ) : calendarEvents.filter(e => e.type === 'upcoming').length === 0 && calendarEvents.filter(e => e.type === 'info-session').length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Icons.Calendar style={{ width: '32px', height: '32px', color: 'rgba(26,26,26,0.15)', margin: '0 auto 12px' }} />
                  <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.4)' }}>No events yet. Click &quot;New Event&quot; to add one.</p>
                </div>
              ) : (
                <>
                  {calendarEvents.filter(e => e.type === 'upcoming').length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.gold, marginBottom: '10px' }}>Upcoming Events</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {calendarEvents.filter(e => e.type === 'upcoming').map((evt, i, arr) => (
                          <div key={evt.id} style={{ background: evt.highlight ? 'rgba(184,149,107,0.04)' : 'white', border: evt.highlight ? `1px solid ${colors.gold}` : '1px solid rgba(26,26,26,0.08)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {/* Reorder arrows */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0 }}>
                              <button onClick={() => reorderEvent(evt.id, 'up')} disabled={i === 0}
                                style={{ padding: '2px', background: 'none', border: 'none', cursor: i === 0 ? 'default' : 'pointer', opacity: i === 0 ? 0.2 : 0.5 }}>
                                <Icons.ChevronUp style={{ width: '14px', height: '14px' }} />
                              </button>
                              <button onClick={() => reorderEvent(evt.id, 'down')} disabled={i === arr.length - 1}
                                style={{ padding: '2px', background: 'none', border: 'none', cursor: i === arr.length - 1 ? 'default' : 'pointer', opacity: i === arr.length - 1 ? 0.2 : 0.5 }}>
                                <Icons.ChevronDown style={{ width: '14px', height: '14px' }} />
                              </button>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                <p style={{ fontSize: '15px', fontWeight: 500, color: colors.dark, margin: 0 }}>{evt.title}</p>
                                {evt.highlight && <Icons.Star style={{ width: '12px', height: '12px', color: colors.gold }} fill={colors.gold} />}
                              </div>
                              {evt.subtitle && <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.5)', margin: '0 0 2px' }}>{evt.subtitle}</p>}
                              <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.4)', margin: 0 }}>
                                {evt.date ? formatDate(evt.date) : ''}{evt.time ? ` · ${evt.time}` : ''}
                                {evt.location ? ` — ${evt.location}` : ''}
                              </p>
                            </div>
                            <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                              <button onClick={() => toggleHighlight(evt)} title={evt.highlight ? 'Remove highlight' : 'Highlight event'}
                                style={{ padding: '6px', background: 'none', border: '1px solid rgba(26,26,26,0.1)', cursor: 'pointer' }}>
                                <Icons.Star style={{ width: '14px', height: '14px', color: evt.highlight ? colors.gold : 'rgba(26,26,26,0.25)' }} fill={evt.highlight ? colors.gold : 'none'} />
                              </button>
                              <button onClick={() => {
                                setEditingEvent(evt.id);
                                setEventForm({ title: evt.title, subtitle: evt.subtitle || '', date: evt.date || '', time: evt.time || '', location: evt.location || '', url: evt.url || '', buttonLabel: evt.buttonLabel || 'Details', type: evt.type || 'upcoming', highlight: evt.highlight || false });
                              }} style={{ padding: '6px', background: 'none', border: '1px solid rgba(26,26,26,0.1)', cursor: 'pointer' }}>
                                <Icons.Edit style={{ width: '14px', height: '14px', color: 'rgba(26,26,26,0.4)' }} />
                              </button>
                              <button onClick={async () => {
                                if (!confirm('Remove this event?')) return;
                                try {
                                  const res = await fetch(`/api/calendar?id=${evt.id}`, { method: 'DELETE' });
                                  if (res.ok) { setCalendarEvents(prev => prev.filter(e => e.id !== evt.id)); showToast('Event removed'); }
                                } catch (e) { console.error(e); }
                              }} style={{ padding: '6px', background: 'none', border: '1px solid rgba(26,26,26,0.1)', cursor: 'pointer' }}>
                                <Icons.Trash style={{ width: '14px', height: '14px', color: 'rgba(220,38,38,0.5)' }} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {calendarEvents.filter(e => e.type === 'info-session').length > 0 && (
                    <div>
                      <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.gold, marginBottom: '10px' }}>Other Info Sessions</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {calendarEvents.filter(e => e.type === 'info-session').map((evt, i, arr) => (
                          <div key={evt.id} style={{ background: 'white', border: '1px solid rgba(26,26,26,0.08)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0 }}>
                              <button onClick={() => reorderEvent(evt.id, 'up')} disabled={i === 0}
                                style={{ padding: '2px', background: 'none', border: 'none', cursor: i === 0 ? 'default' : 'pointer', opacity: i === 0 ? 0.2 : 0.5 }}>
                                <Icons.ChevronUp style={{ width: '14px', height: '14px' }} />
                              </button>
                              <button onClick={() => reorderEvent(evt.id, 'down')} disabled={i === arr.length - 1}
                                style={{ padding: '2px', background: 'none', border: 'none', cursor: i === arr.length - 1 ? 'default' : 'pointer', opacity: i === arr.length - 1 ? 0.2 : 0.5 }}>
                                <Icons.ChevronDown style={{ width: '14px', height: '14px' }} />
                              </button>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: '14px', fontWeight: 500, color: colors.dark, margin: '0 0 2px' }}>{evt.title}</p>
                              <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.4)', margin: 0 }}>{evt.location || evt.subtitle || ''}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                              <button onClick={() => {
                                setEditingEvent(evt.id);
                                setEventForm({ title: evt.title, subtitle: evt.subtitle || '', date: evt.date || '', time: evt.time || '', location: evt.location || '', url: evt.url || '', buttonLabel: evt.buttonLabel || 'Details', type: evt.type || 'info-session', highlight: evt.highlight || false });
                              }} style={{ padding: '6px', background: 'none', border: '1px solid rgba(26,26,26,0.1)', cursor: 'pointer' }}>
                                <Icons.Edit style={{ width: '14px', height: '14px', color: 'rgba(26,26,26,0.4)' }} />
                              </button>
                              <button onClick={async () => {
                                if (!confirm('Remove this info session?')) return;
                                try {
                                  const res = await fetch(`/api/calendar?id=${evt.id}`, { method: 'DELETE' });
                                  if (res.ok) { setCalendarEvents(prev => prev.filter(e => e.id !== evt.id)); showToast('Info session removed'); }
                                } catch (e) { console.error(e); }
                              }} style={{ padding: '6px', background: 'none', border: '1px solid rgba(26,26,26,0.1)', cursor: 'pointer' }}>
                                <Icons.Trash style={{ width: '14px', height: '14px', color: 'rgba(220,38,38,0.5)' }} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          ) : null
        )}
      </main>
      <footer style={{ padding: '24px 16px', borderTop: '1px solid rgba(26,26,26,0.05)', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.25)', textDecoration: 'none' }}>Freedom Family</a>
          <a href="https://www.ltdteam.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.25)', textDecoration: 'none' }}>LTD</a>
        </div>
      </footer>
    </div>
  );
}
