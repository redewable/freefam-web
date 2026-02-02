"use client";

import React, { useState, useEffect } from 'react';

const colors = {
  bg: '#fafaf8',
  dark: '#1a1a1a',
  gold: '#b8956b',
};

// Icons
const Icons = {
  Check: ({ style }) => (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  Search: ({ style }) => (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  ),
  Refresh: ({ style }) => (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 4v6h6M23 20v-6h-6" />
      <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
    </svg>
  ),
  User: ({ style }) => (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

export default function CheckinPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(null);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/registrations?filter=${filter}`);
      const data = await res.json();
      setRegistrations(data.registrations || []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRegistrations();
  }, [filter]);

  const toggleCheckin = async (sessionId, currentStatus) => {
    setUpdating(sessionId);
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          action: currentStatus ? 'checkout' : 'checkin',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRegistrations(prev =>
          prev.map(r =>
            r.id === sessionId ? { ...r, checkedIn: data.checkedIn } : r
          )
        );
      }
    } catch (error) {
      console.error('Error updating check-in:', error);
    }
    setUpdating(null);
  };

  // Filter by search
  const filtered = registrations.filter(r => {
    const searchLower = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(searchLower) ||
      r.email.toLowerCase().includes(searchLower) ||
      r.ltdId.toLowerCase().includes(searchLower)
    );
  });

  // Stats
  const stats = {
    total: filtered.length,
    checkedIn: filtered.filter(r => r.checkedIn).length,
    single: filtered.filter(r => r.priceType === 'single').length,
    monthly: filtered.filter(r => r.priceType === 'monthly').length,
  };

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(26,26,26,0.1)', padding: '20px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: colors.gold, marginBottom: '4px' }}>Admin</p>
            <h1 style={{ fontSize: '24px', color: colors.dark, margin: 0, fontWeight: 500 }}>Check-In</h1>
          </div>
          <button
            onClick={fetchRegistrations}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: colors.dark, color: colors.bg, border: 'none', cursor: 'pointer', fontSize: '13px' }}
          >
            <Icons.Refresh style={{ width: '16px', height: '16px' }} />
            Refresh
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Total Registered', value: stats.total, color: colors.dark },
            { label: 'Checked In', value: stats.checkedIn, color: '#22c55e' },
            { label: 'Single ($12)', value: stats.single, color: colors.gold },
            { label: 'Monthly ($40)', value: stats.monthly, color: colors.gold },
          ].map((stat, i) => (
            <div key={i} style={{ padding: '20px', background: 'white', border: '1px solid rgba(26,26,26,0.1)' }}>
              <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '8px' }}>{stat.label}</p>
              <p style={{ fontSize: '32px', fontWeight: 600, color: stat.color, margin: 0 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Icons.Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: 'rgba(26,26,26,0.3)' }} />
            <input
              type="text"
              placeholder="Search by name, email, or LTD ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 44px', border: '1px solid rgba(26,26,26,0.2)', background: 'white', fontSize: '14px', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'single', 'monthly'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '12px 20px',
                  border: filter === f ? `1px solid ${colors.dark}` : '1px solid rgba(26,26,26,0.2)',
                  background: filter === f ? colors.dark : 'white',
                  color: filter === f ? colors.bg : colors.dark,
                  fontSize: '13px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Registration List */}
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(26,26,26,0.5)' }}>
            Loading registrations...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(26,26,26,0.5)' }}>
            No registrations found
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filtered.map(reg => (
              <div
                key={reg.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px 20px',
                  background: reg.checkedIn ? 'rgba(34, 197, 94, 0.08)' : 'white',
                  border: reg.checkedIn ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(26,26,26,0.1)',
                  gap: '16px',
                }}
              >
                {/* Check-in button */}
                <button
                  onClick={() => toggleCheckin(reg.id, reg.checkedIn)}
                  disabled={updating === reg.id}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: reg.checkedIn ? '2px solid #22c55e' : '2px solid rgba(26,26,26,0.2)',
                    background: reg.checkedIn ? '#22c55e' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    opacity: updating === reg.id ? 0.5 : 1,
                  }}
                >
                  {reg.checkedIn && <Icons.Check style={{ width: '24px', height: '24px', color: 'white' }} />}
                </button>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '16px', fontWeight: 500, color: colors.dark, margin: '0 0 4px 0' }}>{reg.name}</p>
                  <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.5)', margin: 0 }}>{reg.email}</p>
                </div>

                {/* LTD ID */}
                <div style={{ textAlign: 'right', minWidth: '100px' }}>
                  <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px 0' }}>LTD ID</p>
                  <p style={{ fontSize: '14px', color: colors.dark, margin: 0 }}>{reg.ltdId || '—'}</p>
                </div>

                {/* Price Type */}
                <div style={{
                  padding: '6px 12px',
                  background: reg.priceType === 'monthly' ? 'rgba(184, 149, 107, 0.15)' : 'rgba(26,26,26,0.05)',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: reg.priceType === 'monthly' ? colors.gold : 'rgba(26,26,26,0.6)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {reg.priceType === 'monthly' ? 'Monthly' : 'Single'}
                </div>

                {/* Amount */}
                <div style={{ minWidth: '60px', textAlign: 'right' }}>
                  <p style={{ fontSize: '16px', fontWeight: 500, color: colors.dark, margin: 0 }}>${reg.amount}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}