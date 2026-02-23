"use client";

import React from 'react';

const colors = { bg: '#fafaf8', dark: '#1a1a1a', gold: '#b8956b' };

const Icons = {
  Back: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>,
  Download: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
};

const groups = [
  {
    title: 'Grow Your Income',
    subtitle: 'The activities that drive revenue',
    color: '#b8956b',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '20px', height: '20px' }}>
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
    steps: [
      { number: 1, title: '2+ QIs Per Week', description: 'Show the plan at least twice a week. This is the heartbeat of your business — nothing grows without consistent qualifying interviews.' },
      { number: 2, title: '100% Personal Use', description: 'Use your own products every day. You can\'t sell what you don\'t believe in. Be your own best customer — it builds authenticity and conviction.' },
      { number: 3, title: '60%+ Verified Customer Sales', description: 'Maintain a strong customer base. This creates legitimate income, satisfies business requirements, and proves the products stand on their own.' },
    ],
  },
  {
    title: 'Grow Your Self',
    subtitle: 'The habits that develop you',
    color: '#7a8b6e',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '20px', height: '20px' }}>
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
    steps: [
      { number: 4, title: 'Listen to Audios Daily', description: 'Feed your mind every single day. The right voices in your ear will shape your thinking, strengthen your belief, and keep you moving forward.' },
      { number: 5, title: 'Read 15+ Minutes Daily', description: 'Invest in your personal growth. Leaders are readers. Fifteen minutes a day compounds into wisdom that transforms how you think and lead.' },
      { number: 6, title: 'Attend ALL Business Meetings', description: 'Be at every meeting, seminar, and major function. The environment shapes you. Proximity to success creates success.' },
    ],
  },
  {
    title: 'Grow Your Team',
    subtitle: 'The character that builds culture',
    color: '#6e7f8b',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '20px', height: '20px' }}>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    steps: [
      { number: 7, title: 'Be Accountable', description: 'Own your results. Track your numbers, keep your commitments, and be honest about where you are. Accountability is the foundation of trust.' },
      { number: 8, title: 'Be Coachable', description: 'Listen to your upline. Follow the system. Check your ego at the door. The people ahead of you have already paid the price — learn from their experience.' },
      { number: 9, title: 'Communicate via LTD Messaging', description: 'Stay connected through the proper channels. LTD messaging keeps the team aligned, informed, and operating as one unit.' },
    ],
  },
];

export default function CoreStepsPage() {
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
          <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.gold, marginBottom: '8px' }}>The Blueprint</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '32px', fontWeight: 400, color: colors.dark, margin: '0 0 8px' }}>9 Core Steps</h1>
          <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.5)', margin: '0 0 20px', maxWidth: '440px', marginLeft: 'auto', marginRight: 'auto' }}>Three pillars, nine commitments. Do these consistently and the results will follow.</p>
          <a href="/9-core-steps.pdf" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: colors.dark, color: colors.bg, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', border: 'none' }}>
            <Icons.Download style={{ width: '14px', height: '14px' }} /> Download PDF
          </a>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {groups.map((group, gi) => (
            <div key={gi}>
              {/* Group header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', background: group.color + '15', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: group.color, flexShrink: 0 }}>
                  {group.icon}
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, color: colors.dark, margin: '0 0 2px' }}>{group.title}</h2>
                  <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.4)', margin: 0 }}>{group.subtitle}</p>
                </div>
              </div>

              {/* Steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {group.steps.map((step, si) => (
                  <div key={si} style={{ display: 'flex', gap: '16px', padding: '20px 16px', background: 'white', borderLeft: `3px solid ${group.color}`, borderRight: '1px solid rgba(26,26,26,0.08)', borderTop: si === 0 ? '1px solid rgba(26,26,26,0.08)' : 'none', borderBottom: '1px solid rgba(26,26,26,0.06)' }}>
                    <div style={{ width: '32px', height: '32px', background: group.color + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderRadius: '4px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: group.color }}>{step.number}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 600, color: colors.dark, margin: '0 0 6px' }}>{step.title}</h3>
                      <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.55)', margin: 0, lineHeight: 1.6 }}>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '40px', padding: '28px', background: 'rgba(184,149,107,0.06)', textAlign: 'center' }}>
          <p style={{ fontSize: '15px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', color: 'rgba(26,26,26,0.6)', margin: 0, lineHeight: 1.6 }}>Nine steps. Three pillars. One commitment: do them all, every day, no matter what. The compound effect of daily discipline is unstoppable.</p>
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
