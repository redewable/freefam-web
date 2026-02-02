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
};

export default function CheckinPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(null);
  const [sortBy, setSortBy] = useState('alpha'); // 'alpha' or 'recent'

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

  const toggleCheckin = async (sessionId, currentStatus, priceType) => {
    setUpdating(sessionId);
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          action: currentStatus ? 'checkout' : 'checkin',
          priceType,
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

  // Filter and sort
  const filtered = registrations
    .filter(r => {
      const searchLower = search.toLowerCase();
      return (
        r.name.toLowerCase().includes(searchLower) ||
        r.email.toLowerCase().includes(searchLower) ||
        (r.ltdId && r.ltdId.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'alpha') {
        return a.name.localeCompare(b.name);
      }
      return new Date(b.date) - new Date(a.date);
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
      <header style={{ borderBottom: '1px solid rgba(26,26,26,0.1)', padding: '16px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.gold, marginBottom: '2px' }}>Admin</p>
            <h1 style={{ fontSize: '20px', color: colors.dark, margin: 0, fontWeight: 500 }}>Check-In</h1>
          </div>
          <button
            onClick={fetchRegistrations}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: colors.dark, color: colors.bg, border: 'none', cursor: 'pointer', fontSize: '12px' }}
          >
            <Icons.Refresh style={{ width: '14px', height: '14px' }} />
            Refresh
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
        {/* Stats - 2x2 grid on mobile */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
          {[
            { label: 'Total', value: stats.total, color: colors.dark },
            { label: 'In', value: stats.checkedIn, color: '#22c55e' },
            { label: 'Single', value: stats.single, color: colors.gold },
            { label: 'Monthly', value: stats.monthly, color: colors.gold },
          ].map((stat, i) => (
            <div key={i} style={{ padding: '12px 8px', background: 'white', border: '1px solid rgba(26,26,26,0.1)', textAlign: 'center' }}>
              <p style={{ fontSize: '9px', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>{stat.label}</p>
              <p style={{ fontSize: '24px', fontWeight: 600, color: stat.color, margin: 0 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Icons.Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'rgba(26,26,26,0.3)' }} />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 40px', border: '1px solid rgba(26,26,26,0.2)', background: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['all', 'single', 'monthly'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '8px 12px',
                  border: filter === f ? `1px solid ${colors.dark}` : '1px solid rgba(26,26,26,0.2)',
                  background: filter === f ? colors.dark : 'white',
                  color: filter === f ? colors.bg : colors.dark,
                  fontSize: '12px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  flex: 1,
                }}
              >
                {f === 'all' ? 'All' : f === 'single' ? 'Single' : 'Monthly'}
              </button>
            ))}
            <button
              onClick={() => setSortBy(sortBy === 'alpha' ? 'recent' : 'alpha')}
              style={{
                padding: '8px 12px',
                border: '1px solid rgba(26,26,26,0.2)',
                background: 'white',
                color: colors.dark,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              {sortBy === 'alpha' ? 'A-Z' : 'New'}
            </button>
          </div>
        </div>

        {/* Registration List */}
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(26,26,26,0.5)' }}>
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(26,26,26,0.5)' }}>
            No registrations found
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {filtered.map(reg => (
              <div
                key={reg.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 12px',
                  background: reg.checkedIn ? 'rgba(34, 197, 94, 0.08)' : 'white',
                  border: reg.checkedIn ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(26,26,26,0.1)',
                  gap: '10px',
                }}
              >
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: colors.dark, margin: '0 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{reg.name}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(26,26,26,0.5)', margin: 0 }}>{reg.ltdId || reg.email.split('@')[0]}</p>
                </div>

                {/* Badge */}
                <div style={{
                  padding: '3px 6px',
                  background: reg.priceType === 'monthly' ? 'rgba(184, 149, 107, 0.15)' : 'rgba(26,26,26,0.05)',
                  fontSize: '9px',
                  fontWeight: 600,
                  color: reg.priceType === 'monthly' ? colors.gold : 'rgba(26,26,26,0.5)',
                  textTransform: 'uppercase',
                }}>
                  {reg.priceType === 'monthly' ? 'Mo' : 'Wk'}
                </div>

                {/* Check-in button */}
                <button
                  onClick={() => toggleCheckin(reg.id, reg.checkedIn, reg.priceType)}
                  disabled={updating === reg.id}
                  style={{
                    padding: '6px 12px',
                    background: reg.checkedIn ? '#22c55e' : 'transparent',
                    border: reg.checkedIn ? '1px solid #22c55e' : '1px solid rgba(26,26,26,0.3)',
                    color: reg.checkedIn ? 'white' : colors.dark,
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    opacity: updating === reg.id ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    borderRadius: '2px',
                  }}
                >
                  {reg.checkedIn ? (
                    <>
                      <Icons.Check style={{ width: '12px', height: '12px' }} />
                      IN
                    </>
                  ) : (
                    'CHECK IN'
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer note */}
        <p style={{ marginTop: '20px', fontSize: '11px', color: 'rgba(26,26,26,0.4)', textAlign: 'center' }}>
          Single tickets reset weekly · Monthly tickets reset at month end
        </p>
      </main>
    </div>
  );
}