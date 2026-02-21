"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const colors = { bg: '#fafaf8', dark: '#1a1a1a', gold: '#b8956b' };

const formatDate = (d) => new Date(d + 'T12:00:00-06:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/Chicago' });

const INFO_KEYS = ['host', 'plan', 'nextsteps'];
const getSection = (seg) => seg.section || (INFO_KEYS.includes(seg.key) ? 'info' : 'training');

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

  const segments = lineup.segments || [];
  const infoSegments = segments.filter(s => getSection(s) === 'info');
  const trainingSegments = segments.filter(s => getSection(s) === 'training');

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ borderBottom: '1px solid rgba(26,26,26,0.05)', padding: '14px 16px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.dark }}>Freedom Family</span>
          <span style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.gold }}>Lineup</span>
        </div>
      </nav>
      <header style={{ borderBottom: '1px solid rgba(26,26,26,0.1)', padding: '20px 16px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '20px', color: colors.dark, margin: '0 0 4px', fontWeight: 500 }}>Meeting Lineup</h1>
        <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.5)', margin: 0 }}>{formatDate(date)}</p>
      </header>

      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Full Meeting Flow */}
        <div style={{ marginBottom: '24px', padding: '16px', background: 'white', border: '1px solid rgba(26,26,26,0.1)' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', marginBottom: '14px' }}>Meeting Flow</p>

          {/* Prep */}
          <p style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.3)', margin: '0 0 6px', fontWeight: 600 }}>Prep</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px', fontSize: '13px' }}>
            <div style={{ display: 'flex', gap: '12px' }}><span style={{ color: 'rgba(26,26,26,0.4)', minWidth: '62px', fontVariantNumeric: 'tabular-nums' }}>6:30 PM</span><span style={{ color: colors.dark }}>Round Table Arrives</span></div>
            <div style={{ display: 'flex', gap: '12px' }}><span style={{ color: 'rgba(26,26,26,0.4)', minWidth: '62px', fontVariantNumeric: 'tabular-nums' }}>7:00 PM</span><span style={{ color: colors.dark }}>IBOs Arrive / Lineup Huddle</span></div>
            <div style={{ display: 'flex', gap: '12px' }}><span style={{ color: 'rgba(26,26,26,0.4)', minWidth: '62px', fontVariantNumeric: 'tabular-nums' }}>7:15 PM</span><span style={{ color: colors.dark }}>Doors Open — Guests Arrive</span></div>
          </div>

          <div style={{ height: '1px', background: 'rgba(26,26,26,0.06)', margin: '0 0 14px' }} />

          {/* Info Session */}
          <p style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.gold, margin: '0 0 6px', fontWeight: 600 }}>Info Session · 7:30 – 8:30 PM</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px', fontSize: '13px' }}>
            <div style={{ display: 'flex', gap: '12px' }}><span style={{ color: 'rgba(26,26,26,0.4)', minWidth: '62px', fontVariantNumeric: 'tabular-nums' }}>7:30 PM</span><span style={{ color: colors.dark }}>Welcome / Ice Breaker</span></div>
            <div style={{ display: 'flex', gap: '12px' }}><span style={{ color: 'rgba(26,26,26,0.4)', minWidth: '62px', fontVariantNumeric: 'tabular-nums' }}>7:32 PM</span><span style={{ color: colors.dark }}>The Plan</span></div>
            <div style={{ display: 'flex', gap: '12px' }}><span style={{ color: 'rgba(26,26,26,0.4)', minWidth: '62px', fontVariantNumeric: 'tabular-nums' }}>8:25 PM</span><span style={{ color: colors.dark }}>Next Steps</span></div>
            <div style={{ display: 'flex', gap: '12px', color: 'rgba(26,26,26,0.35)', fontStyle: 'italic' }}><span style={{ minWidth: '62px', fontVariantNumeric: 'tabular-nums' }}>8:30 PM</span><span>Break — guest follow-up</span></div>
          </div>

          <div style={{ height: '1px', background: 'rgba(26,26,26,0.06)', margin: '0 0 14px' }} />

          {/* Training */}
          <p style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.dark, margin: '0 0 6px', fontWeight: 600 }}>Training · 8:45 – 10:00 PM</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px', fontSize: '13px' }}>
            <div style={{ display: 'flex', gap: '12px' }}><span style={{ color: 'rgba(26,26,26,0.4)', minWidth: '62px', fontVariantNumeric: 'tabular-nums' }}>8:45 PM</span><span style={{ color: colors.dark }}>Recognition <span style={{ color: 'rgba(26,26,26,0.3)', fontSize: '11px' }}>(20 min)</span></span></div>
            <div style={{ display: 'flex', gap: '12px' }}><span style={{ color: 'rgba(26,26,26,0.4)', minWidth: '62px', fontVariantNumeric: 'tabular-nums' }}>9:05 PM</span><span style={{ color: colors.dark }}>Calendar <span style={{ color: 'rgba(26,26,26,0.3)', fontSize: '11px' }}>(4 min)</span></span></div>
            <div style={{ display: 'flex', gap: '12px' }}><span style={{ color: 'rgba(26,26,26,0.4)', minWidth: '62px', fontVariantNumeric: 'tabular-nums' }}>9:09 PM</span><span style={{ color: colors.dark }}>Product Demo <span style={{ color: 'rgba(26,26,26,0.3)', fontSize: '11px' }}>(7 min)</span></span></div>
            <div style={{ display: 'flex', gap: '12px' }}><span style={{ color: 'rgba(26,26,26,0.4)', minWidth: '62px', fontVariantNumeric: 'tabular-nums' }}>9:16 PM</span><span style={{ color: colors.dark }}>BSM <span style={{ color: 'rgba(26,26,26,0.3)', fontSize: '11px' }}>(7 min)</span></span></div>
            <div style={{ display: 'flex', gap: '12px' }}><span style={{ color: 'rgba(26,26,26,0.4)', minWidth: '62px', fontVariantNumeric: 'tabular-nums' }}>9:23 PM</span><span style={{ color: colors.dark }}>Training <span style={{ color: 'rgba(26,26,26,0.3)', fontSize: '11px' }}>(25-30 min)</span></span></div>
          </div>

          <div style={{ height: '1px', background: 'rgba(26,26,26,0.06)', margin: '0 0 10px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
            <div style={{ display: 'flex', gap: '12px' }}><span style={{ color: '#22c55e', minWidth: '62px', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>10:00</span><span style={{ color: colors.dark, fontWeight: 500 }}>Dismissed</span></div>
            <div style={{ display: 'flex', gap: '12px', color: 'rgba(26,26,26,0.35)' }}><span style={{ minWidth: '62px', fontVariantNumeric: 'tabular-nums' }}>10-11</span><span>Night Owl (optional)</span></div>
          </div>
        </div>

        {/* Speaker Lineup */}
        {infoSegments.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.gold, margin: 0, fontWeight: 600 }}>Info Session Lineup</p>
              <div style={{ flex: 1, height: '1px', background: 'rgba(184,149,107,0.3)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {infoSegments.map((seg, i) => {
                const sc = segmentColors[seg.key] || segmentColors.training;
                return (
                  <div key={i} style={{ padding: '12px 16px', background: sc.bg, border: `1px solid ${sc.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <p style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: sc.color, margin: 0, fontWeight: 600 }}>{seg.label}</p>
                          <span style={{ fontSize: '10px', color: 'rgba(26,26,26,0.3)' }}>{seg.time} · {seg.duration}</span>
                        </div>
                        <p style={{ fontSize: '15px', color: colors.dark, margin: 0, fontWeight: 500 }}>{seg.speaker || 'TBD'}</p>
                        {seg.topic && <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)', margin: '3px 0 0', fontStyle: 'italic' }}>{seg.topic}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {trainingSegments.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.dark, margin: 0, fontWeight: 600 }}>Training Lineup</p>
              <div style={{ flex: 1, height: '1px', background: 'rgba(26,26,26,0.15)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {trainingSegments.map((seg, i) => {
                const sc = segmentColors[seg.key] || segmentColors.training;
                return (
                  <div key={i} style={{ padding: '12px 16px', background: sc.bg, border: `1px solid ${sc.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <p style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: sc.color, margin: 0, fontWeight: 600 }}>{seg.label}</p>
                          <span style={{ fontSize: '10px', color: 'rgba(26,26,26,0.3)' }}>{seg.time} · {seg.duration}</span>
                        </div>
                        <p style={{ fontSize: '15px', color: colors.dark, margin: 0, fontWeight: 500 }}>{seg.speaker || 'TBD'}</p>
                        {seg.topic && <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)', margin: '3px 0 0', fontStyle: 'italic' }}>{seg.topic}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Topics / Notes */}
        {lineup.topics && (
          <div style={{ marginTop: '16px', padding: '16px', background: 'white', border: '1px solid rgba(26,26,26,0.1)' }}>
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

        {/* Speaker Reminders */}
        <div style={{ marginTop: '24px', padding: '20px', background: 'white', border: `1px solid rgba(184,149,107,0.25)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.gold, margin: 0, fontWeight: 600 }}>Speaker Reminders</p>
            <div style={{ flex: 1, height: '1px', background: 'rgba(184,149,107,0.25)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px', color: 'rgba(26,26,26,0.7)', lineHeight: 1.6 }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ color: colors.gold, fontWeight: 600, minWidth: '18px' }}>1.</span>
              <p style={{ margin: 0 }}><span style={{ fontWeight: 500, color: colors.dark }}>Slideshow content</span> must be sent to <a href="mailto:elfreefamilia@gmail.com" style={{ color: colors.gold, textDecoration: 'none', borderBottom: '1px solid rgba(184,149,107,0.4)' }}>elfreefamilia@gmail.com</a> by <span style={{ fontWeight: 500, color: colors.dark }}>Monday at 10:00 AM</span>.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ color: colors.gold, fontWeight: 600, minWidth: '18px' }}>2.</span>
              <p style={{ margin: 0 }}><span style={{ fontWeight: 500, color: colors.dark }}>Know your order.</span> Be clear on who is before you and who follows you. You are responsible for edifying the next speaker as you bring them up.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ color: colors.gold, fontWeight: 600, minWidth: '18px' }}>3.</span>
              <p style={{ margin: 0 }}><span style={{ fontWeight: 500, color: colors.dark }}>Respect the clock.</span> A speaking timer will be running on the AV table. Stay within your allotted time — it keeps the entire meeting on track.</p>
            </div>
          </div>
        </div>

        {/* Venue Info */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: 'rgba(26,26,26,0.3)' }}>Embassy Suites, College Station TX</p>
          <p style={{ fontSize: '11px', color: 'rgba(26,26,26,0.3)' }}>Dress: Business Professional</p>
        </div>
      </main>
      <footer style={{ padding: '24px 16px', borderTop: '1px solid rgba(26,26,26,0.05)', marginTop: 'auto' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.25)' }}>Freedom Family</span>
          <span style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.25)' }}>LTD</span>
        </div>
      </footer>
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
