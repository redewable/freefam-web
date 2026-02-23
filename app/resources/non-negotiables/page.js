"use client";

import React from 'react';

const colors = { bg: '#fafaf8', dark: '#1a1a1a', gold: '#b8956b' };

const items = [
  "We attend ALL team meetings, seminars, and major events — we are TEAM players",
  "We are on LTD system — audios daily, books, and CDs flowing",
  "We show the plan a minimum of 2x per week — that's how we grow",
  "We maintain 100% personal use of our own products",
  "We maintain 60%+ verified customer sales",
  "We communicate through LTD messaging — keeping our team connected",
  "We are coachable — we seek counsel and apply what we learn",
  "We are accountable — we own our results and keep our commitments",
  "We edify our upline, downline, and crossline — we build each other up",
  "We never pass negative — we protect the culture",
];

const Icons = {
  Back: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>,
  Shield: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
};

export default function NonNegotiablesPage() {
  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ borderBottom: '1px solid rgba(26,26,26,0.05)', padding: '14px 16px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.dark, textDecoration: 'none' }}>Freedom Family</a>
          <span style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.gold }}>Resources</span>
        </div>
      </nav>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 20px', width: '100%', boxSizing: 'border-box', flex: 1 }}>
        <a href="/resources" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'rgba(26,26,26,0.5)', textDecoration: 'none', marginBottom: '24px' }}>
          <Icons.Back style={{ width: '14px', height: '14px' }} /> Back to Resources
        </a>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '48px', height: '48px', margin: '0 auto 16px', background: 'rgba(184,149,107,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icons.Shield style={{ width: '24px', height: '24px', color: colors.gold }} />
          </div>
          <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.gold, marginBottom: '8px' }}>Team Culture</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '32px', fontWeight: 400, color: colors.dark, margin: '0 0 8px' }}>TEAM ISI Non-Negotiables</h1>
          <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.5)', margin: 0, maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>The standards we hold ourselves to — no exceptions, no excuses</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '20px 16px', borderBottom: i < items.length - 1 ? '1px solid rgba(26,26,26,0.06)' : 'none', background: 'white', borderLeft: '1px solid rgba(26,26,26,0.08)', borderRight: '1px solid rgba(26,26,26,0.08)', borderTop: i === 0 ? '1px solid rgba(26,26,26,0.08)' : 'none' }}>
              <div style={{ width: '28px', height: '28px', background: 'rgba(184,149,107,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderRadius: '50%' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: colors.gold }}>{String(i + 1).padStart(2, '0')}</span>
              </div>
              <p style={{ fontSize: '15px', color: colors.dark, margin: 0, lineHeight: 1.5 }}>{item}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '32px', padding: '24px', background: 'rgba(184,149,107,0.06)', textAlign: 'center' }}>
          <p style={{ fontSize: '16px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', color: colors.dark, margin: 0, lineHeight: 1.6 }}>&ldquo;We don&apos;t rise to the level of our goals — we fall to the level of our standards.&rdquo;</p>
        </div>
      </main>

      <footer style={{ padding: '24px 16px', borderTop: '1px solid rgba(26,26,26,0.05)', marginTop: 'auto' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.25)', textDecoration: 'none' }}>Freedom Family</a>
          <a href="https://www.ltdteam.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.25)', textDecoration: 'none' }}>LTD</a>
        </div>
      </footer>
    </div>
  );
}
