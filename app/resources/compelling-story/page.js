"use client";

import React from 'react';

const colors = { bg: '#fafaf8', dark: '#1a1a1a', gold: '#b8956b' };

const Icons = {
  Back: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>,
  Mic: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>,
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
    title: 'Your Discovery',
    prompt: 'How did you find this?',
    description: 'How were you introduced to the business? Who showed it to you, and what made you pay attention? This normalizes the invitation process for your prospect — they see that you were once in their shoes.',
    tips: ['Name the person who invited you', 'What caught your attention?', 'Keep it natural — not a sales pitch'],
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
          <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.5)', margin: 0, maxWidth: '440px', marginLeft: 'auto', marginRight: 'auto' }}>Your story is your most powerful tool. Learn to tell it with clarity, emotion, and purpose.</p>
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

        <div style={{ marginTop: '40px', padding: '28px', background: 'rgba(184,149,107,0.06)', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: colors.dark, marginBottom: '8px' }}>The Goal</p>
          <p style={{ fontSize: '15px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', color: 'rgba(26,26,26,0.6)', margin: '0 0 12px', lineHeight: 1.6 }}>Your story should be 2-3 minutes. Practice it until it feels natural — not scripted. The best stories make your prospect think: &ldquo;That sounds like me.&rdquo;</p>
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
