"use client";

import React from 'react';

const colors = { bg: '#fafaf8', dark: '#1a1a1a', gold: '#b8956b' };

const Icons = {
  Back: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>,
  Mic: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>,
  Download: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
};

const sections = [
  {
    label: 'Part 1',
    title: 'Your Background',
    prompt: 'Where did you come from?',
    description: 'Share who you are, what you did before this business, and what life looked like. People connect with real stories — your job, your situation, your everyday life. This is the setup.',
    tips: ['Keep it relatable — don\'t glamorize or overdramatize', 'Be specific: job title, hours, frustrations', '30-60 seconds max'],
    color: 'rgba(184,149,107,0.08)',
  },
  {
    label: 'Part 2',
    title: 'Your Dissatisfaction',
    prompt: 'What were you fed up with?',
    description: 'What wasn\'t working? What was the gap between where you were and where you wanted to be? This is the emotional core of your story — the pain point that made you open to something different.',
    tips: ['Be honest about what frustrated you', 'Think: time, money, freedom, purpose', 'This is where your prospect sees themselves'],
    color: 'rgba(184,149,107,0.12)',
  },
  {
    label: 'Part 3',
    title: 'Your Search',
    prompt: 'What were you looking for?',
    description: 'Before you found this business, what were you already thinking about? Were you looking for a side income? More time? A plan B? This shows that your prospect isn\'t alone in wanting more.',
    tips: ['Show you were actively seeking change', 'Connect your search to universal desires', 'Brief — just enough to bridge the gap'],
    color: 'rgba(184,149,107,0.16)',
  },
  {
    label: 'Part 4',
    title: 'Your Discovery — WHO Showed You',
    prompt: 'Who introduced you to the business?',
    description: 'This is the most important part. WHO showed you matters. Name them. Edify them. Share what it was about that person that made you listen. Your prospect needs to see that a real, credible person cared enough to share this with you — and now you\'re doing the same for them.',
    tips: ['Always name and edify the person who showed you', 'What about THEM made you take it seriously?', 'This models the invitation process for your prospect'],
    color: 'rgba(184,149,107,0.20)',
  },
  {
    label: 'Part 5',
    title: 'Your Vision',
    prompt: 'Where are you headed?',
    description: 'What does the future look like for you because of this business? What are you building toward? This is the hope — the reason you do the work. Paint the picture of what\'s possible.',
    tips: ['Be aspirational but authentic', 'Talk about what excites you most', 'End with energy and conviction'],
    color: 'rgba(184,149,107,0.24)',
  },
];

export default function CompellingStoryPage() {
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
            <Icons.Mic style={{ width: '24px', height: '24px', color: colors.gold }} />
          </div>
          <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.gold, marginBottom: '8px' }}>Your Story</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '32px', fontWeight: 400, color: colors.dark, margin: '0 0 8px' }}>Developing Your Compelling Story</h1>
          <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.5)', margin: '0 0 20px', maxWidth: '440px', marginLeft: 'auto', marginRight: 'auto' }}>Your story is your most powerful tool. Learn to tell it with clarity, emotion, and purpose.</p>
          <a href="/compelling-story.pdf" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: colors.dark, color: colors.bg, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', border: 'none' }}>
            <Icons.Download style={{ width: '14px', height: '14px' }} /> Download PDF
          </a>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sections.map((section, i) => (
            <div key={i} style={{ background: 'white', border: '1px solid rgba(26,26,26,0.08)', overflow: 'hidden' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid rgba(26,26,26,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ width: '32px', height: '32px', background: section.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: colors.gold }}>{i + 1}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.gold, margin: '0 0 2px' }}>{section.label}</p>
                    <h3 style={{ fontSize: '17px', fontWeight: 600, color: colors.dark, margin: 0 }}>{section.title}</h3>
                  </div>
                </div>
                <p style={{ fontSize: '18px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', color: colors.dark, margin: '0 0 12px', paddingLeft: '44px' }}>&ldquo;{section.prompt}&rdquo;</p>
                <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.55)', margin: 0, lineHeight: 1.6, paddingLeft: '44px' }}>{section.description}</p>
              </div>
              <div style={{ padding: '16px 24px 16px 68px', background: 'rgba(26,26,26,0.015)' }}>
                {section.tips.map((tip, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: j < section.tips.length - 1 ? '6px' : '0' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: colors.gold, flexShrink: 0 }} />
                    <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.45)', margin: 0 }}>{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Compelling Story vs Elevator Pitch */}
        <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '24px', background: 'white', border: '1px solid rgba(26,26,26,0.08)' }}>
            <div style={{ height: '3px', background: `linear-gradient(to right, ${colors.gold}, transparent)`, marginBottom: '20px', marginTop: '-24px', marginLeft: '-24px', marginRight: '-24px' }} />
            <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.gold, marginBottom: '6px' }}>Full Version</p>
            <h3 style={{ fontSize: '17px', fontWeight: 600, color: colors.dark, margin: '0 0 10px' }}>Your Compelling Story</h3>
            <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)', margin: '0 0 12px', lineHeight: 1.6 }}>2-3 minutes. All 5 parts. Used when you have someone&apos;s full attention — a sit-down conversation, a QI setting, or when sharing your journey in depth.</p>
            <div style={{ padding: '10px 12px', background: 'rgba(184,149,107,0.06)', fontSize: '12px', color: 'rgba(26,26,26,0.45)' }}>
              Best for: QIs, one-on-ones, team meetings, sharing your testimony
            </div>
          </div>
          <div style={{ padding: '24px', background: 'white', border: '1px solid rgba(26,26,26,0.08)' }}>
            <div style={{ height: '3px', background: 'linear-gradient(to right, #6e7f8b, transparent)', marginBottom: '20px', marginTop: '-24px', marginLeft: '-24px', marginRight: '-24px' }} />
            <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6e7f8b', marginBottom: '6px' }}>Short Version</p>
            <h3 style={{ fontSize: '17px', fontWeight: 600, color: colors.dark, margin: '0 0 10px' }}>Your Elevator Pitch</h3>
            <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)', margin: '0 0 12px', lineHeight: 1.6 }}>30-60 seconds. Quick, punchy, curiosity-driven. Used in casual encounters, social events, or when time is limited. The goal is to spark interest — not close the deal.</p>
            <div style={{ padding: '10px 12px', background: 'rgba(110,127,139,0.06)', fontSize: '12px', color: 'rgba(26,26,26,0.45)' }}>
              Best for: Networking, social events, chance encounters, check-interest moments
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px', padding: '20px 24px', background: 'rgba(26,26,26,0.02)', border: '1px solid rgba(26,26,26,0.06)' }}>
          <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.5)', margin: 0, lineHeight: 1.6 }}><strong style={{ color: colors.dark }}>Know when to use which.</strong> Read the environment, the timing, and the context. A compelling story builds deep connection — an elevator pitch opens a door. Both are essential. Practice both until they feel natural.</p>
        </div>

        <div style={{ marginTop: '24px', padding: '28px', background: 'rgba(184,149,107,0.06)', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: colors.dark, marginBottom: '8px' }}>The Goal</p>
          <p style={{ fontSize: '15px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', color: 'rgba(26,26,26,0.6)', margin: 0, lineHeight: 1.6 }}>Practice until it feels natural — not scripted. The best stories make your prospect think: &ldquo;That sounds like me.&rdquo;</p>
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
