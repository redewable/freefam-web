"use client";

import React from 'react';

const colors = { bg: '#fafaf8', dark: '#1a1a1a', gold: '#b8956b' };

const Icons = {
  Back: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>,
  Target: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
};

const phases = [
  {
    label: 'Phase 1',
    title: 'Check Interest',
    description: 'Find out if someone is open. Don\'t prejudge — just ask. A simple, casual conversation to gauge curiosity.',
    accent: '#b8956b',
  },
  {
    label: 'Phase 2',
    title: 'Good News Call',
    description: 'Connect them with your upline. Let the credibility of the team do the heavy lifting. This is a quick, high-energy call to build belief.',
    accent: '#b8956b',
  },
  {
    label: 'Phase 3',
    title: 'PQI — Pre-Qualifying Interview',
    description: 'Before showing the plan, set the stage. Learn about their dreams, frustrations, and openness. This is about asking great questions and listening.',
    accent: '#b8956b',
  },
  {
    label: 'Phase 4',
    title: 'QI 1 — First Qualifying Interview',
    description: 'Show the plan. Walk them through the business model, the opportunity, and the vision. Let the plan speak — you just deliver it with conviction.',
    accent: '#b8956b',
  },
  {
    label: 'Phase 5',
    title: 'QI 2 — Second Qualifying Interview',
    description: 'Follow up, answer questions, and address concerns. This is where you solidify understanding and move toward a decision. The fortune is in the follow-up.',
    accent: '#b8956b',
  },
];

export default function QIPhilosophyPage() {
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
          <div style={{ width: '48px', height: '48px', margin: '0 auto 16px', background: 'rgba(184,149,107,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icons.Target style={{ width: '24px', height: '24px', color: colors.gold }} />
          </div>
          <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.gold, marginBottom: '8px' }}>The Process</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '32px', fontWeight: 400, color: colors.dark, margin: '0 0 8px' }}>The QI Philosophy</h1>
          <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.5)', margin: 0, maxWidth: '440px', marginLeft: 'auto', marginRight: 'auto' }}>A systematic approach to qualifying and inviting — moving people from curiosity to commitment</p>
        </div>

        {/* Visual Flow */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0' }}>
          {/* Vertical line connector */}
          <div style={{ position: 'absolute', left: '19px', top: '28px', bottom: '28px', width: '2px', background: `linear-gradient(to bottom, ${colors.gold}40, ${colors.gold}, ${colors.gold}40)`, zIndex: 0 }} />

          {phases.map((phase, i) => (
            <div key={i} style={{ display: 'flex', gap: '20px', position: 'relative', zIndex: 1, marginBottom: i < phases.length - 1 ? '8px' : '0' }}>
              {/* Circle marker */}
              <div style={{ width: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: '20px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: colors.gold, border: `3px solid ${colors.bg}`, boxShadow: `0 0 0 2px ${colors.gold}` }} />
              </div>

              {/* Content card */}
              <div style={{ flex: 1, padding: '20px', background: 'white', border: '1px solid rgba(26,26,26,0.08)', marginBottom: '0' }}>
                <p style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.gold, marginBottom: '4px' }}>{phase.label}</p>
                <h3 style={{ fontSize: '17px', fontWeight: 600, color: colors.dark, margin: '0 0 8px' }}>{phase.title}</h3>
                <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.55)', margin: 0, lineHeight: 1.6 }}>{phase.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '40px', padding: '24px', background: 'rgba(184,149,107,0.06)', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: colors.dark, marginBottom: '6px' }}>Remember</p>
          <p style={{ fontSize: '15px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', color: 'rgba(26,26,26,0.6)', margin: 0, lineHeight: 1.6 }}>The goal is not to convince — it&apos;s to sort. Find the people who are looking for what you have.</p>
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
