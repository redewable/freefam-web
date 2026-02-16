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
};

const PasswordGate = ({ onSuccess }) => {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);
  const submit = (e) => { e.preventDefault(); if (pw.toLowerCase() === 'diamond') { sessionStorage.setItem('admin_auth', 'true'); onSuccess(); } else { setError(true); setPw(''); } };
  return (
    <div style={{ minHeight: '100vh', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <form onSubmit={submit} style={{ width: '100%', maxWidth: '300px', textAlign: 'center' }}>
        <p style={{ color: colors.gold, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>Admin</p>
        <h1 style={{ fontSize: '22px', color: colors.dark, marginBottom: '24px', fontWeight: 500 }}>Enter Password</h1>
        <input type="password" value={pw} onChange={(e) => { setPw(e.target.value); setError(false); }} placeholder="Password" autoFocus
          style={{ width: '100%', padding: '14px', border: error ? '1px solid #ef4444' : '1px solid rgba(26,26,26,0.2)', background: 'white', fontSize: '16px', textAlign: 'center', marginBottom: '12px', boxSizing: 'border-box' }} />
        {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>Incorrect</p>}
        <button type="submit" style={{ width: '100%', padding: '14px', background: colors.dark, color: colors.bg, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>Enter</button>
      </form>
    </div>
  );
};

const formatDate = (d) => new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
const formatDateShort = (d) => new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const getBadge = (reg) => {
  if (reg.type === 'guest') return { label: reg.visitNumber || 'Guest', bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' };
  if (reg.type === 'apprentice') return { label: 'Apprentice', bg: 'rgba(168,85,247,0.1)', color: '#a855f7' };
  if (reg.priceType === 'monthly') return { label: 'Monthly', bg: 'rgba(184,149,107,0.15)', color: colors.gold };
  return { label: 'Weekly', bg: 'rgba(26,26,26,0.05)', color: 'rgba(26,26,26,0.6)' };
};

// History: Meeting Card
const MeetingCard = ({ meeting, prevMeeting, onClick }) => {
  const guestTotal = (meeting.guests?.first || 0) + (meeting.guests?.second || 0) + (meeting.guests?.third || 0);
  const trend = prevMeeting ? meeting.total - prevMeeting.total : null;

  return (
    <div onClick={onClick} style={{ background: 'white', border: '1px solid rgba(26,26,26,0.1)', cursor: 'pointer', transition: 'border-color 0.2s', marginBottom: '12px' }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid rgba(26,26,26,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: colors.dark, margin: '0 0 2px' }}>{formatDate(meeting.date)}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {trend !== null && trend !== 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '11px', color: trend > 0 ? '#22c55e' : '#ef4444' }}>
                {trend > 0 ? <Icons.TrendUp style={{ width: '12px', height: '12px' }} /> : <Icons.TrendDown style={{ width: '12px', height: '12px' }} />}
                {trend > 0 ? '+' : ''}{trend}
              </div>
            )}
            <div style={{ background: colors.dark, color: colors.bg, padding: '4px 12px', fontSize: '16px', fontWeight: 700 }}>
              {meeting.total}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid rgba(26,26,26,0.06)' }}>
        <div style={{ padding: '10px', textAlign: 'center', borderRight: '1px solid rgba(26,26,26,0.06)' }}>
          <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>IBOs</p>
          <p style={{ fontSize: '18px', fontWeight: 600, color: colors.dark, margin: 0 }}>{meeting.ibos}</p>
        </div>
        <div style={{ padding: '10px', textAlign: 'center', borderRight: '1px solid rgba(26,26,26,0.06)' }}>
          <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a855f7', margin: '0 0 2px' }}>Apprentices</p>
          <p style={{ fontSize: '18px', fontWeight: 600, color: '#a855f7', margin: 0 }}>{meeting.apprentices}</p>
        </div>
        <div style={{ padding: '10px', textAlign: 'center', borderRight: '1px solid rgba(26,26,26,0.06)' }}>
          <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#3b82f6', margin: '0 0 2px' }}>Guests</p>
          <p style={{ fontSize: '18px', fontWeight: 600, color: '#3b82f6', margin: 0 }}>{guestTotal}</p>
        </div>
        <div style={{ padding: '10px', textAlign: 'center' }}>
          <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>Total</p>
          <p style={{ fontSize: '18px', fontWeight: 600, color: colors.dark, margin: 0 }}>{meeting.total}</p>
        </div>
      </div>

      {/* Guest Breakdown */}
      {guestTotal > 0 && (
        <div style={{ padding: '10px 16px', display: 'flex', gap: '12px', fontSize: '11px', color: 'rgba(26,26,26,0.5)' }}>
          {meeting.guests?.first > 0 && <span><span style={{ color: '#3b82f6', fontWeight: 600 }}>{meeting.guests.first}</span> 1st visit</span>}
          {meeting.guests?.second > 0 && <span><span style={{ color: '#3b82f6', fontWeight: 600 }}>{meeting.guests.second}</span> 2nd visit</span>}
          {meeting.guests?.third > 0 && <span><span style={{ color: '#3b82f6', fontWeight: 600 }}>{meeting.guests.third}</span> 3rd visit</span>}
        </div>
      )}
    </div>
  );
};

// History: Detail View
const MeetingDetail = ({ date, checkins, stats, onBack }) => {
  const typeOrder = { guest: 0, apprentice: 1, ibo: 2 };
  const sorted = [...checkins].sort((a, b) => (typeOrder[a.type] || 2) - (typeOrder[b.type] || 2));

  const sections = [
    { type: 'guest', label: 'Guests', color: '#3b82f6', items: sorted.filter(c => c.type === 'guest') },
    { type: 'apprentice', label: 'Apprentices', color: '#a855f7', items: sorted.filter(c => c.type === 'apprentice') },
    { type: 'ibo', label: 'IBOs', color: colors.dark, items: sorted.filter(c => c.type === 'ibo') },
  ].filter(s => s.items.length > 0);

  return (
    <>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'rgba(26,26,26,0.5)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px', padding: '4px 0' }}>
        <Icons.Back style={{ width: '16px', height: '16px' }} /> All Meetings
      </button>

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', color: colors.dark, margin: '0 0 4px', fontWeight: 500 }}>{formatDate(date)}</h2>
        <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.5)', margin: 0 }}>{stats?.total || checkins.length} people checked in</p>
      </div>

      {/* Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
        <div style={{ padding: '14px', background: 'white', border: '1px solid rgba(26,26,26,0.1)', textAlign: 'center' }}>
          <p style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>IBOs</p>
          <p style={{ fontSize: '24px', fontWeight: 600, color: colors.dark, margin: 0 }}>{stats?.ibos || 0}</p>
        </div>
        <div style={{ padding: '14px', background: 'white', border: '1px solid rgba(168,85,247,0.2)', textAlign: 'center' }}>
          <p style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a855f7', marginBottom: '4px' }}>Apprentices</p>
          <p style={{ fontSize: '24px', fontWeight: 600, color: '#a855f7', margin: 0 }}>{stats?.apprentices || 0}</p>
        </div>
        <div style={{ padding: '14px', background: 'white', border: '1px solid rgba(59,130,246,0.2)', textAlign: 'center' }}>
          <p style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3b82f6', marginBottom: '4px' }}>Guests</p>
          <p style={{ fontSize: '24px', fontWeight: 600, color: '#3b82f6', margin: 0 }}>{stats?.guests?.total || 0}</p>
        </div>
      </div>

      {/* Attendee List by Section */}
      {sections.map(section => (
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
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};


export default function CheckinPage() {
  const [auth, setAuth] = useState(false);
  const [tab, setTab] = useState('checkin');
  const [regs, setRegs] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateCheckins, setDateCheckins] = useState([]);
  const [dateStats, setDateStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('pending');
  const [updating, setUpdating] = useState(null);

  useEffect(() => { if (sessionStorage.getItem('admin_auth') === 'true') setAuth(true); }, []);

  const fetchRegs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/registrations');
      const data = await res.json();
      setRegs(data.registrations || []);
    } catch (e) {
      console.error('Fetch error:', e);
    }
    setLoading(false);
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      setHistory(data.history || []);
    } catch (e) {
      console.error('History fetch error:', e);
    }
  };

  const fetchDateDetail = async (date) => {
    try {
      const res = await fetch(`/api/history?date=${date}`);
      const data = await res.json();
      setDateCheckins(data.checkins || []);
      setDateStats(data.stats || null);
    } catch (e) {}
  };

  useEffect(() => { if (auth) { fetchRegs(); fetchHistory(); } }, [auth]);
  useEffect(() => { if (selectedDate) fetchDateDetail(selectedDate); }, [selectedDate]);

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
          registrationData: {
            name: reg.name,
            type: reg.type,
            visitNumber: reg.visitNumber || '',
          },
        }),
      });
      const data = await res.json();
      if (data.success) setRegs(prev => prev.map(r => r.id === reg.id ? { ...r, checkedIn: data.checkedIn } : r));
    } catch (e) {
      console.error('Check-in error:', e);
    }
    setUpdating(null);
  };

  if (!auth) return <PasswordGate onSuccess={() => setAuth(true)} />;

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

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <header style={{ borderBottom: '1px solid rgba(26,26,26,0.1)', padding: '14px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.gold, marginBottom: '2px' }}>Admin</p>
            <h1 style={{ fontSize: '18px', color: colors.dark, margin: 0, fontWeight: 500 }}>Check-In</h1>
          </div>
          <button onClick={() => { fetchRegs(); fetchHistory(); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: colors.dark, color: colors.bg, border: 'none', cursor: 'pointer', fontSize: '11px' }}>
            <Icons.Refresh style={{ width: '14px', height: '14px' }} />Refresh
          </button>
        </div>
      </header>

      <div style={{ borderBottom: '1px solid rgba(26,26,26,0.1)', padding: '0 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex' }}>
          {['checkin', 'history'].map(t => (
            <button key={t} onClick={() => { setTab(t); setSelectedDate(null); if (t === 'history') fetchHistory(); }}
              style={{ padding: '12px 20px', background: 'none', border: 'none', borderBottom: tab === t ? `2px solid ${colors.dark}` : '2px solid transparent', color: tab === t ? colors.dark : 'rgba(26,26,26,0.4)', fontSize: '13px', fontWeight: tab === t ? 500 : 400, cursor: 'pointer' }}>
              {t === 'checkin' ? 'Check-In' : 'Meeting History'}
            </button>
          ))}
        </div>
      </div>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
        {tab === 'checkin' ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
              {[{ l: 'Total', v: stats.total, c: colors.dark }, { l: 'Arrived', v: stats.arrived, c: '#22c55e' }, { l: 'Pending', v: stats.pending, c: colors.gold }].map((s, i) => (
                <div key={i} style={{ padding: '14px', background: 'white', border: '1px solid rgba(26,26,26,0.1)', textAlign: 'center' }}>
                  <p style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>{s.l}</p>
                  <p style={{ fontSize: '24px', fontWeight: 600, color: s.c, margin: 0 }}>{s.v}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
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

            {loading ? <p style={{ padding: '40px', textAlign: 'center', color: 'rgba(26,26,26,0.5)' }}>Loading...</p> : filtered.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <Icons.Users style={{ width: '32px', height: '32px', color: 'rgba(26,26,26,0.2)', margin: '0 auto 12px' }} />
                <p style={{ color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>No registrations this week</p>
                <p style={{ color: 'rgba(26,26,26,0.3)', fontSize: '12px' }}>People will appear here as they register</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {filtered.map(reg => {
                  const badge = getBadge(reg);
                  return (
                    <div key={reg.id} style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', background: reg.checkedIn ? 'rgba(34,197,94,0.06)' : 'white', border: reg.checkedIn ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(26,26,26,0.1)', gap: '10px' }}>
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
        ) : selectedDate ? (
          <MeetingDetail
            date={selectedDate}
            checkins={dateCheckins}
            stats={dateStats}
            onBack={() => setSelectedDate(null)}
          />
        ) : (
          <>
            {/* History Overview with Trend Summary */}
            {history.length > 0 && (
              <div style={{ background: 'white', border: '1px solid rgba(26,26,26,0.1)', padding: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', margin: 0 }}>Overview</p>
                  <p style={{ fontSize: '11px', color: 'rgba(26,26,26,0.4)', margin: 0 }}>{history.length} meeting{history.length !== 1 ? 's' : ''} tracked</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  <div>
                    <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>Avg Attendance</p>
                    <p style={{ fontSize: '20px', fontWeight: 600, color: colors.dark, margin: 0 }}>{Math.round(history.reduce((s, h) => s + h.total, 0) / history.length)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>Best Meeting</p>
                    <p style={{ fontSize: '20px', fontWeight: 600, color: '#22c55e', margin: 0 }}>{Math.max(...history.map(h => h.total))}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#3b82f6', margin: '0 0 2px' }}>Total Guests</p>
                    <p style={{ fontSize: '20px', fontWeight: 600, color: '#3b82f6', margin: 0 }}>{history.reduce((s, h) => s + (h.guests?.total || 0), 0)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>Total People</p>
                    <p style={{ fontSize: '20px', fontWeight: 600, color: colors.dark, margin: 0 }}>{history.reduce((s, h) => s + h.total, 0)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Meeting Cards */}
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <Icons.Users style={{ width: '32px', height: '32px', color: 'rgba(26,26,26,0.2)', margin: '0 auto 12px' }} />
                <p style={{ color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>No meeting history yet</p>
                <p style={{ color: 'rgba(26,26,26,0.3)', fontSize: '12px' }}>Check-in data will appear here after each meeting</p>
              </div>
            ) : (
              history.map((meeting, i) => (
                <MeetingCard
                  key={meeting.date}
                  meeting={meeting}
                  prevMeeting={history[i + 1] || null}
                  onClick={() => setSelectedDate(meeting.date)}
                />
              ))
            )}
          </>
        )}
      </main>
    </div>
  );
}
