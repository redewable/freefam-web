"use client";

import React, { useState, useEffect } from 'react';

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
};

const formatDate = (d) => new Date(d + 'T12:00:00-06:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/Chicago' });
const formatDateShort = (d) => new Date(d + 'T12:00:00-06:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'America/Chicago' });

const DEFAULT_SEGMENTS = [
  // Info Session (7:30 - 8:30)
  { key: 'host', label: 'Welcome / Host', speaker: '', topic: '', time: '7:30 PM', duration: '2 min', section: 'info' },
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
  { time: '7:30 PM', label: 'Welcome', desc: 'Ice breaker, set expectations.', section: 'info' },
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

// ═══════════════ PASSWORD GATE ═══════════════
const PasswordGate = ({ onSuccess }) => {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);
  const submit = (e) => { e.preventDefault(); if (pw.toLowerCase() === 'freedom') { sessionStorage.setItem('leadership_auth', 'true'); onSuccess(); } else { setError(true); setPw(''); } };
  return (
    <div style={{ minHeight: '100vh', background: colors.bg, display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <nav style={{ borderBottom: '1px solid rgba(26,26,26,0.05)', padding: '14px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.dark, textDecoration: 'none' }}>Freedom Family</a>
          <span style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.gold }}>Leadership</span>
        </div>
      </nav>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <form onSubmit={submit} style={{ width: '100%', maxWidth: '300px', textAlign: 'center' }}>
        <p style={{ color: colors.gold, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>Leadership</p>
        <h1 style={{ fontSize: '22px', color: colors.dark, marginBottom: '24px', fontWeight: 500 }}>Enter Password</h1>
        <input type="password" value={pw} onChange={(e) => { setPw(e.target.value); setError(false); }} placeholder="Password" autoFocus
          style={{ width: '100%', padding: '14px', border: error ? '1px solid #ef4444' : '1px solid rgba(26,26,26,0.2)', background: 'white', fontSize: '16px', textAlign: 'center', marginBottom: '12px', boxSizing: 'border-box' }} />
        {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>Incorrect</p>}
        <button type="submit" style={{ width: '100%', padding: '14px', background: colors.dark, color: colors.bg, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>Enter</button>
      </form>
      </div>
      <footer style={{ padding: '24px 16px', borderTop: '1px solid rgba(26,26,26,0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.25)', textDecoration: 'none' }}>Freedom Family</a>
          <span style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.25)' }}>LTD</span>
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
  const [tab, setTab] = useState('overview');
  const [toast, setToast] = useState('');

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

  // History detail
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateCheckins, setDateCheckins] = useState([]);
  const [dateStats, setDateStats] = useState(null);

  // Lineup editor
  const [editingLineup, setEditingLineup] = useState(null);
  const [lineupDate, setLineupDate] = useState('');
  const [lineupSegments, setLineupSegments] = useState([...DEFAULT_SEGMENTS]);
  const [lineupTopics, setLineupTopics] = useState('');
  const [lineupNotes, setLineupNotes] = useState('');

  // Expense modal
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ description: '', amount: '', date: '', category: 'Conference Room', paidBy: '', account: '', notes: '' });

  // Add attendee modal
  const [showAddAttendee, setShowAddAttendee] = useState(false);
  const [attendeeForm, setAttendeeForm] = useState({ name: '', type: 'ibo', visitNumber: '' });

  // Share modal
  const [shareUrl, setShareUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => { if (sessionStorage.getItem('leadership_auth') === 'true') setAuth(true); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  // ═══════ DATA FETCHERS ═══════
  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchRegs(), fetchHistory(), fetchLineups(), fetchExpenses()]);
    setLoading(false);
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

  // ═══════ ACTIONS ═══════
  const toggleCheckin = async (reg) => {
    setUpdating(reg.id);
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: reg.id,
          action: reg.checkedIn ? 'checkout' : 'checkin',
          priceType: reg.priceType,
          registrationData: { name: reg.name, type: reg.type, visitNumber: reg.visitNumber || '' },
        }),
      });
      const data = await res.json();
      if (data.success) setRegs(prev => prev.map(r => r.id === reg.id ? { ...r, checkedIn: data.checkedIn } : r));
    } catch (e) { console.error(e); }
    setUpdating(null);
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

  const addExpense = async () => {
    if (!expenseForm.description || !expenseForm.amount || !expenseForm.date) return;
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseForm),
      });
      const data = await res.json();
      if (data.success) { showToast('Expense added'); setShowExpenseModal(false); setExpenseForm({ description: '', amount: '', date: '', category: 'Conference Room', paidBy: '', account: '', notes: '' }); fetchExpenses(); }
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
        body: JSON.stringify({ action: 'add-attendee', date: selectedDate, attendee: attendeeForm }),
      });
      const data = await res.json();
      if (data.success) { showToast('Attendee added'); setShowAddAttendee(false); setAttendeeForm({ name: '', type: 'ibo', visitNumber: '' }); fetchDateDetail(selectedDate); fetchHistory(); }
    } catch (e) { console.error(e); }
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

  if (!auth) return <PasswordGate onSuccess={() => setAuth(true)} />;

  // ═══════ FILTER/SORT for check-in ═══════
  const getBadge = (reg) => {
    if (reg.type === 'guest') return { label: reg.visitNumber || 'Guest', bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' };
    if (reg.type === 'apprentice') return { label: 'Apprentice', bg: 'rgba(168,85,247,0.1)', color: '#a855f7' };
    if (reg.priceType === 'monthly') return { label: 'Monthly', bg: 'rgba(184,149,107,0.15)', color: colors.gold };
    return { label: 'Weekly', bg: 'rgba(26,26,26,0.05)', color: 'rgba(26,26,26,0.6)' };
  };

  let filtered = regs.filter(r => {
    const s = search.toLowerCase();
    return r.name.toLowerCase().includes(s) || r.email.toLowerCase().includes(s) || (r.ltdId && r.ltdId.toLowerCase().includes(s));
  });
  if (filter !== 'all') filtered = filtered.filter(r => r.type === filter);
  filtered.sort((a, b) => {
    if (sortBy === 'pending') { if (a.checkedIn !== b.checkedIn) return a.checkedIn ? 1 : -1; return a.name.localeCompare(b.name); }
    if (sortBy === 'arrived') { if (a.checkedIn !== b.checkedIn) return a.checkedIn ? -1 : 1; return a.name.localeCompare(b.name); }
    return a.name.localeCompare(b.name);
  });

  const stats = { total: filtered.length, arrived: filtered.filter(r => r.checkedIn).length, pending: filtered.filter(r => !r.checkedIn).length };

  // Revenue from Stripe paid registrations
  const totalRevenue = regs.filter(r => r.type === 'ibo' && r.amount > 0).reduce((sum, r) => sum + r.amount, 0);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'checkin', label: 'Check-In' },
    { id: 'lineups', label: 'Lineups' },
    { id: 'finances', label: 'Finances' },
    { id: 'history', label: 'History' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ borderBottom: '1px solid rgba(26,26,26,0.05)', padding: '14px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.dark, textDecoration: 'none' }}>Freedom Family</a>
          <span style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.gold }}>Leadership</span>
        </div>
      </nav>
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

      {/* Add Expense Modal */}
      <Modal isOpen={showExpenseModal} onClose={() => setShowExpenseModal(false)} title="Add Expense">
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
          <button onClick={addExpense} style={{ padding: '12px', background: colors.dark, color: colors.bg, border: 'none', cursor: 'pointer', fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Add Expense</button>
        </div>
      </Modal>

      {/* Add Attendee Modal */}
      <Modal isOpen={showAddAttendee} onClose={() => setShowAddAttendee(false)} title="Add Attendee">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: 'rgba(26,26,26,0.5)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Name *</label>
            <input value={attendeeForm.name} onChange={e => setAttendeeForm(p => ({ ...p, name: e.target.value }))} placeholder="Full name" style={{ width: '100%', padding: '10px', border: '1px solid rgba(26,26,26,0.2)', fontSize: '14px', boxSizing: 'border-box' }} />
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
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSelectedDate(null); setEditingLineup(null); }}
              style={{ padding: '12px 16px', background: 'none', border: 'none', borderBottom: tab === t.id ? `2px solid ${colors.dark}` : '2px solid transparent', color: tab === t.id ? colors.dark : 'rgba(26,26,26,0.4)', fontSize: '12px', fontWeight: tab === t.id ? 500 : 400, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', width: '100%', boxSizing: 'border-box' }}>
        {loading ? <p style={{ padding: '40px', textAlign: 'center', color: 'rgba(26,26,26,0.5)' }}>Loading...</p> : (

          // ═══════════════ OVERVIEW TAB ═══════════════
          tab === 'overview' ? (
            <>
              {/* Financial Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '28px' }}>
                {[
                  { l: 'This Week', v: stats.total, c: colors.dark, sub: 'registrations' },
                  { l: 'Revenue', v: `$${totalRevenue.toFixed(2)}`, c: '#22c55e', sub: 'this period' },
                  { l: 'Expenses', v: `$${totalExpenses.toFixed(2)}`, c: '#ef4444', sub: 'total' },
                  { l: 'Net', v: `$${(totalRevenue - totalExpenses).toFixed(2)}`, c: (totalRevenue - totalExpenses) >= 0 ? '#22c55e' : '#ef4444', sub: 'revenue - expenses' },
                ].map((s, i) => (
                  <div key={i} style={{ padding: '18px', background: 'white', border: '1px solid rgba(26,26,26,0.1)', textAlign: 'center' }}>
                    <p style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>{s.l}</p>
                    <p style={{ fontSize: '20px', fontWeight: 600, color: s.c, margin: 0 }}>{s.v}</p>
                    <p style={{ fontSize: '9px', color: 'rgba(26,26,26,0.3)', margin: '2px 0 0' }}>{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                {/* Check-in Status */}
                <div style={{ background: 'white', border: '1px solid rgba(26,26,26,0.1)', padding: '20px' }}>
                  <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', marginBottom: '14px' }}>Check-In Status</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
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

                {/* Upcoming Lineup */}
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
                {[{ l: 'Total', v: stats.total, c: colors.dark }, { l: 'Arrived', v: stats.arrived, c: '#22c55e' }, { l: 'Pending', v: stats.pending, c: colors.gold }].map((s, i) => (
                  <div key={i} style={{ padding: '18px', background: 'white', border: '1px solid rgba(26,26,26,0.1)', textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '6px' }}>{s.l}</p>
                    <p style={{ fontSize: '28px', fontWeight: 600, color: s.c, margin: 0 }}>{s.v}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div style={{ position: 'relative' }}>
                  <Icons.Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'rgba(26,26,26,0.3)' }} />
                  <input type="text" placeholder="Search name, email, or LTD ID..." value={search} onChange={e => setSearch(e.target.value)}
                    style={{ width: '100%', padding: '10px 10px 10px 40px', border: '1px solid rgba(26,26,26,0.2)', background: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {['all', 'ibo', 'apprentice', 'guest'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 12px', border: filter === f ? `1px solid ${colors.dark}` : '1px solid rgba(26,26,26,0.2)', background: filter === f ? colors.dark : 'white', color: filter === f ? colors.bg : colors.dark, fontSize: '11px', cursor: 'pointer', textTransform: 'capitalize' }}>{f}</button>
                  ))}
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
                    {[{ id: 'pending', l: 'Pending First' }, { id: 'arrived', l: 'Arrived First' }, { id: 'alpha', l: 'A-Z' }].map(s => (
                      <button key={s.id} onClick={() => setSortBy(s.id)} style={{ padding: '8px 10px', border: sortBy === s.id ? `1px solid ${colors.dark}` : '1px solid rgba(26,26,26,0.2)', background: sortBy === s.id ? colors.dark : 'white', color: sortBy === s.id ? colors.bg : colors.dark, fontSize: '10px', cursor: 'pointer' }}>{s.l}</button>
                    ))}
                  </div>
                </div>
              </div>
              {filtered.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <Icons.Users style={{ width: '32px', height: '32px', color: 'rgba(26,26,26,0.2)', margin: '0 auto 12px' }} />
                  <p style={{ color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>No registrations this week</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filtered.map(reg => {
                    const badge = getBadge(reg);
                    return (
                      <div key={reg.id} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', background: reg.checkedIn ? 'rgba(34,197,94,0.06)' : 'white', border: reg.checkedIn ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(26,26,26,0.1)', gap: '14px' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: '14px', fontWeight: 500, color: colors.dark, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{reg.name}</p>
                          <p style={{ fontSize: '11px', color: 'rgba(26,26,26,0.5)', margin: 0 }}>{reg.ltdId || reg.email?.split('@')[0]}</p>
                        </div>
                        <div style={{ padding: '3px 8px', background: badge.bg, fontSize: '9px', fontWeight: 600, color: badge.color, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{badge.label}</div>
                        <button onClick={() => toggleCheckin(reg)} disabled={updating === reg.id}
                          style={{ padding: '6px 14px', background: reg.checkedIn ? '#22c55e' : 'transparent', border: reg.checkedIn ? '1px solid #22c55e' : '1px solid rgba(26,26,26,0.3)', color: reg.checkedIn ? 'white' : colors.dark, fontSize: '10px', fontWeight: 600, cursor: 'pointer', opacity: updating === reg.id ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase' }}>
                          {reg.checkedIn ? <><Icons.Check style={{ width: '12px', height: '12px' }} />Arrived</> : 'Check In'}
                        </button>
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
                  <button onClick={() => openLineupEditor()} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: colors.dark, color: colors.bg, border: 'none', cursor: 'pointer', fontSize: '12px' }}>
                    <Icons.Plus style={{ width: '14px', height: '14px' }} /> New Lineup
                  </button>
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
                            <button onClick={() => openLineupEditor(lineup)} style={{ padding: '6px 10px', background: 'rgba(26,26,26,0.05)', border: '1px solid rgba(26,26,26,0.15)', color: colors.dark, fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Edit style={{ width: '12px', height: '12px' }} /> Edit</button>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
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
                <button onClick={() => setShowExpenseModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: colors.dark, color: colors.bg, border: 'none', cursor: 'pointer', fontSize: '11px' }}>
                  <Icons.Plus style={{ width: '12px', height: '12px' }} /> Add Expense
                </button>
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                          <p style={{ fontSize: '14px', fontWeight: 500, color: colors.dark, margin: 0 }}>{exp.description}</p>
                          <span style={{ fontSize: '9px', padding: '2px 6px', background: 'rgba(26,26,26,0.05)', color: 'rgba(26,26,26,0.5)', textTransform: 'uppercase' }}>{exp.category}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'rgba(26,26,26,0.4)' }}>
                          <span>{formatDateShort(exp.date)}</span>
                          {exp.paidBy && <span>Paid by: {exp.paidBy}</span>}
                          {exp.account && <span>Account: {exp.account}</span>}
                        </div>
                      </div>
                      <p style={{ fontSize: '16px', fontWeight: 600, color: '#ef4444', margin: 0, whiteSpace: 'nowrap' }}>${parseFloat(exp.amount).toFixed(2)}</p>
                      <button onClick={() => deleteExpense(exp.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                        <Icons.Trash style={{ width: '14px', height: '14px', color: 'rgba(26,26,26,0.3)' }} />
                      </button>
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
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => setShowAddAttendee(true)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', background: colors.dark, color: colors.bg, border: 'none', cursor: 'pointer', fontSize: '11px' }}>
                      <Icons.Plus style={{ width: '12px', height: '12px' }} /> Add Person
                    </button>
                    <button onClick={() => deleteMeeting(selectedDate)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', cursor: 'pointer', fontSize: '11px' }}>
                      <Icons.Trash style={{ width: '12px', height: '12px' }} /> Delete Meeting
                    </button>
                  </div>
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
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
                          <p style={{ flex: 1, fontSize: '14px', color: colors.dark, margin: 0 }}>{c.name}</p>
                          {c.visitNumber && <span style={{ fontSize: '10px', fontWeight: 600, color: '#3b82f6', padding: '2px 6px', background: 'rgba(59,130,246,0.1)' }}>{c.visitNumber}</span>}
                          {c.priceType === 'monthly' && c.type === 'ibo' && <span style={{ fontSize: '10px', fontWeight: 600, color: colors.gold, padding: '2px 6px', background: 'rgba(184,149,107,0.15)' }}>Monthly</span>}
                          {c.manual && <span style={{ fontSize: '9px', color: 'rgba(26,26,26,0.3)', padding: '2px 6px', background: 'rgba(26,26,26,0.04)' }}>Manual</span>}
                          <button onClick={() => removeAttendee(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
                            <Icons.X style={{ width: '14px', height: '14px', color: 'rgba(26,26,26,0.3)' }} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              // History List
              <>
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
          ) : null
        )}
      </main>
      <footer style={{ padding: '24px 16px', borderTop: '1px solid rgba(26,26,26,0.05)', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.25)', textDecoration: 'none' }}>Freedom Family</a>
          <span style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.25)' }}>LTD</span>
        </div>
      </footer>
    </div>
  );
}
