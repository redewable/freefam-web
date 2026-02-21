"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const colors = { bg: '#fafaf8', dark: '#1a1a1a', gold: '#b8956b' };

const formatDate = (d) => new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

const segmentColors = {
  host: { bg: 'rgba(184,149,107,0.12)', border: 'rgba(184,149,107,0.3)', color: '#b8956b' },
  plan: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)', color: '#3b82f6' },
  recognition: { bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.25)', color: '#a855f7' },
  calendar: { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.25)', color: '#22c55e' },
  product: { bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.25)', color: '#f97316' },
  bsm: { bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.25)', color: '#ec4899' },
  training: { bg: 'rgba(26,26,26,0.06)', border: 'rgba(26,26,26,0.15)', color: '#1a1a1a' },
};

function LineupContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('t');
  const [lineup, setLineup] = useState(null);
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      fetch(`/api/lineup?token=${token}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) setError('This lineup link is no longer available.');
          else { setLineup(data.lineup); setDate(data.date); }
          setLoading(false);
        })
        .catch(() => { setError('Unable to load lineup.'); setLoading(false); });
    } else {
      setError('No lineup specified.');
      setLoading(false);
    }
  }, [token]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <p style={{ color: 'rgba(26,26,26,0.5)' }}>Loading lineup...</p>
    </div>
  );

  if (error || !lineup) return (
    <div style={{ minHeight: '100vh', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ fontSize: '18px', color: colors.dark, marginBottom: '8px' }}>Lineup Not Found</p>
        <p style={{ color: 'rgba(26,26,26,0.5)', fontSize: '14px' }}>{error || 'This lineup may have been removed.'}</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <header style={{ borderBottom: '1px solid rgba(26,26,26,0.1)', padding: '20px 16px', textAlign: 'center' }}>
        <p style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: colors.gold, marginBottom: '4px' }}>Freedom Family</p>
        <h1 style={{ fontSize: '20px', color: colors.dark, margin: '0 0 4px', fontWeight: 500 }}>Meeting Lineup</h1>
        <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.5)', margin: 0 }}>{formatDate(date)}</p>
      </header>

      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Schedule */}
        <div style={{ marginBottom: '24px', padding: '16px', background: 'white', border: '1px solid rgba(26,26,26,0.1)' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', marginBottom: '12px' }}>Schedule</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: colors.dark }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(26,26,26,0.5)' }}>7:00 PM</span><span>IBOs Arrive / Setup</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(26,26,26,0.5)' }}>7:15 PM</span><span>Pre-Meeting (IBOs Only)</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(26,26,26,0.5)' }}>7:30 PM</span><span>Guests Arrive</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(26,26,26,0.5)' }}>8:00 PM</span><span>Info Session Begins</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(26,26,26,0.5)' }}>9:00 PM</span><span>Training Session (IBOs Only)</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(26,26,26,0.5)' }}>10:00 PM</span><span>Dismissed</span></div>
          </div>
        </div>

        {/* Lineup Segments */}
        <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', marginBottom: '12px' }}>Lineup</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(lineup.segments || []).map((seg, i) => {
            const sc = segmentColors[seg.key] || segmentColors.training;
            return (
              <div key={i} style={{ padding: '14px 16px', background: sc.bg, border: `1px solid ${sc.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: sc.color, marginBottom: '4px', fontWeight: 600 }}>{seg.label}</p>
                  <p style={{ fontSize: '15px', color: colors.dark, margin: 0, fontWeight: 500 }}>{seg.speaker || 'TBD'}</p>
                  {seg.topic && <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.5)', margin: '4px 0 0' }}>{seg.topic}</p>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Topics / Notes */}
        {lineup.topics && (
          <div style={{ marginTop: '24px', padding: '16px', background: 'white', border: '1px solid rgba(26,26,26,0.1)' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', marginBottom: '8px' }}>Training Topics</p>
            <p style={{ fontSize: '14px', color: colors.dark, lineHeight: 1.6, margin: 0 }}>{lineup.topics}</p>
          </div>
        )}

        {lineup.notes && (
          <div style={{ marginTop: '12px', padding: '16px', background: 'white', border: '1px solid rgba(26,26,26,0.1)' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', marginBottom: '8px' }}>Notes</p>
            <p style={{ fontSize: '14px', color: colors.dark, lineHeight: 1.6, margin: 0 }}>{lineup.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: 'rgba(26,26,26,0.3)' }}>Embassy Suites, College Station TX</p>
          <p style={{ fontSize: '11px', color: 'rgba(26,26,26,0.3)' }}>Dress: Business Professional</p>
        </div>
      </main>
    </div>
  );
}

export default function LineupPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#fafaf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <p style={{ color: 'rgba(26,26,26,0.5)' }}>Loading...</p>
      </div>
    }>
      <LineupContent />
    </Suspense>
  );
}
