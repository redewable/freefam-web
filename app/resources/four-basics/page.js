"use client";

import React from 'react';

const colors = { bg: '#fafaf8', dark: '#1a1a1a', gold: '#b8956b' };

const Icons = {
  Back: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>,
  Download: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
};

const basics = [
  {
    number: '01',
    title: 'List',
    subtitle: 'Build your names list',
    description: 'Everything starts with people. Write down everyone you know — and keep adding to it. Your list is the lifeblood of your business. The bigger the list, the bigger the opportunity. Don\'t prejudge. Don\'t filter. Just write.',
    details: [
      'Write down every name you can think of',
      'Add new names every single day',
      'Don\'t prejudge who might be interested',
      'Categories: friends, family, coworkers, acquaintances, social media connections',
    ],
    color: '#b8956b',
  },
  {
    number: '02',
    title: 'Connect',
    subtitle: 'Build genuine relationships',
    description: 'Before you ever mention the business, connect with people. Be interested in their lives. Ask questions. Build rapport. People do business with people they know, like, and trust. The connection comes before the conversation.',
    details: [
      'Reach out with genuine interest — no agenda',
      'Ask about their life, goals, frustrations',
      'Find common ground and build trust',
      'Be a friend first, a business partner second',
    ],
    color: '#7a8b6e',
  },
  {
    number: '03',
    title: 'Start the Process',
    subtitle: 'STP — move them through the framework',
    description: 'Once you\'ve connected, start the process. Follow the framework: Check Interest, Good News Call, PQI, QI1, QI2. You don\'t need to be perfect — you need to be consistent. The system does the heavy lifting. Your job is to get people into the process and keep them moving.',
    details: [
      'Minimum 2 QIs per week — that\'s the standard',
      'Use the system tools and edify your upline',
      'Follow the framework: CI → GNC → PQI → QI1 → QI2',
      'Let the process do the convincing — you do the inviting',
    ],
    color: '#6e7f8b',
  },
  {
    number: '04',
    title: 'Launch',
    subtitle: 'Get them started right',
    description: 'When someone says yes, that\'s just the beginning. A strong launch sets the tone for their entire business. Plug them into the system immediately — audios, books, meetings, and their own names list. The first 48 hours are critical.',
    details: [
      'Get them on the system within 48 hours',
      'Help them build their initial names list',
      'Introduce them to the team and their upline',
      'Set expectations and schedule their first QI',
    ],
    color: '#8b6e7a',
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
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '32px', fontWeight: 400, color: colors.dark, margin: '0 0 20px' }}>The Four Basics</h1>
          <a href="/four-basics.pdf"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: colors.dark, color: colors.bg, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', border: 'none' }}>
            <Icons.Download style={{ width: '14px', height: '14px' }} /> Download PDF
          </a>
        </div>

        {/* Visual Cycle Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {basics.map((b, i) => (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: b.color + '12', border: `1px solid ${b.color}30` }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: b.color }}>{b.number}</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: colors.dark }}>{b.title}</span>
              </div>
              {i < basics.length - 1 && (
                <svg viewBox="0 0 24 24" fill="none" stroke={colors.gold} strokeWidth="1.5" style={{ width: '16px', height: '16px', flexShrink: 0 }}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              )}
            </React.Fragment>
          ))}
          {/* Cycle arrow back */}
          <svg viewBox="0 0 24 24" fill="none" stroke={colors.gold} strokeWidth="1.5" style={{ width: '16px', height: '16px', flexShrink: 0 }}><path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 105.64-10.36L1 10" /></svg>
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {basics.map((basic, i) => (
            <div key={i} style={{ background: 'white', border: '1px solid rgba(26,26,26,0.08)', overflow: 'hidden' }}>
              <div style={{ height: '3px', background: `linear-gradient(to right, ${basic.color}, ${basic.color}40)` }} />
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <div style={{ width: '40px', height: '40px', background: basic.color + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderRadius: '50%' }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: basic.color }}>{basic.number}</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '19px', fontWeight: 600, color: colors.dark, margin: '0 0 2px' }}>{basic.title}</h3>
                    <p style={{ fontSize: '12px', color: basic.color, margin: 0, fontWeight: 500, letterSpacing: '0.02em' }}>{basic.subtitle}</p>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.55)', margin: '0 0 16px', lineHeight: 1.7 }}>{basic.description}</p>
                <div style={{ padding: '14px', background: 'rgba(26,26,26,0.02)' }}>
                  {basic.details.map((detail, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: j < basic.details.length - 1 ? '8px' : '0' }}>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: basic.color, flexShrink: 0, marginTop: '7px' }} />
                      <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.5)', margin: 0, lineHeight: 1.5 }}>{detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '32px', padding: '24px', background: 'rgba(184,149,107,0.06)', textAlign: 'center' }}>
          <p style={{ fontSize: '15px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', color: 'rgba(26,26,26,0.6)', margin: 0, lineHeight: 1.6 }}>This is a cycle, not a checklist. When you launch someone, you go right back to listing. The wheel never stops turning.</p>
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
