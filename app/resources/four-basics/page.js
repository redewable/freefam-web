"use client";

import React from 'react';

const colors = { bg: '#fafaf8', dark: '#1a1a1a', gold: '#b8956b' };

const Icons = {
  Back: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>,
};

const basics = [
  {
    number: '01',
    title: 'Show the Plan',
    subtitle: 'Minimum 2x per week',
    description: 'This is the engine of your business. Nothing happens until someone sees the plan. The more plans you show, the faster your business grows. Consistency is key — treat it like a job until it pays like a career.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '28px', height: '28px', color: colors.gold }}>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Retail Products',
    subtitle: '60%+ verified customer sales',
    description: 'Your business is built on moving products. Personal use establishes your belief, and retailing to customers creates immediate profit and long-term stability. This is what makes your business legitimate and sustainable.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '28px', height: '28px', color: colors.gold }}>
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Use the System',
    subtitle: 'Audios, books, and events',
    description: 'The LTD system is your education. Listen to audios daily, read 15+ minutes daily, and attend all functions. The system keeps you sharp, motivated, and connected. It\'s the curriculum for your entrepreneurial degree.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '28px', height: '28px', color: colors.gold }}>
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Be Accountable',
    subtitle: 'Own your results',
    description: 'Stay connected to your upline and your team. Be coachable, keep your commitments, and communicate consistently. Accountability is the bridge between goals and results. No one builds this alone.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '28px', height: '28px', color: colors.gold }}>
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
];

export default function FourBasicsPage() {
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

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.gold, marginBottom: '8px' }}>Foundation</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '32px', fontWeight: 400, color: colors.dark, margin: '0 0 8px' }}>The Four Basics</h1>
          <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.5)', margin: 0, maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>Master these four fundamentals and everything else follows</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {basics.map((basic, i) => (
            <div key={i} style={{ padding: '28px 24px', background: 'white', border: '1px solid rgba(26,26,26,0.08)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '0', left: '0', right: '0', height: '3px', background: `linear-gradient(to right, ${colors.gold}, transparent)` }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', background: 'rgba(184,149,107,0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {basic.icon}
                </div>
                <div>
                  <span style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.gold }}>{basic.number}</span>
                  <h3 style={{ fontSize: '17px', fontWeight: 600, color: colors.dark, margin: '2px 0 0' }}>{basic.title}</h3>
                </div>
              </div>
              <p style={{ fontSize: '12px', fontWeight: 500, color: colors.gold, marginBottom: '10px', letterSpacing: '0.02em' }}>{basic.subtitle}</p>
              <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.55)', margin: 0, lineHeight: 1.6 }}>{basic.description}</p>
            </div>
          ))}
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
