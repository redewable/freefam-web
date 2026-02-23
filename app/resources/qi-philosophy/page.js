"use client";

import React from 'react';

const colors = { bg: '#fafaf8', dark: '#1a1a1a', gold: '#b8956b' };

const Icons = {
  Back: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>,
  Download: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
  Heart: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>,
};

const principles = [
  {
    title: 'It\'s About Them, Not You',
    description: 'The QI is not a presentation — it\'s a conversation. Your job is to listen, understand their situation, and connect the business to their needs. Ask questions. Be genuinely curious about their life, their dreams, and what\'s not working.',
  },
  {
    title: 'Sort, Don\'t Convince',
    description: 'You\'re not trying to talk someone into the business. You\'re looking for people who are already looking for something more. Some will see it, some won\'t. Your job is to find the ones who are ready — not to drag people across the finish line.',
  },
  {
    title: 'Posture With Care',
    description: 'Confidence is not arrogance. You have something valuable — own that. But lead with empathy, not pressure. The best posture is simply believing in what you have and not needing their approval to keep building.',
  },
  {
    title: 'The Fortune Is in the Follow-Up',
    description: 'Most people don\'t say yes the first time. That doesn\'t mean no — it means not yet. Consistent, caring follow-up is what separates builders from hobbyists. Stay in touch, add value, and trust the process.',
  },
  {
    title: 'Edify and Use the System',
    description: 'You don\'t have to be the expert. Edify your upline, lean on the tools, and let the system do the heavy lifting. The QI works because the framework works — trust it, follow it, and teach others to do the same.',
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
            <Icons.Heart style={{ width: '24px', height: '24px', color: colors.gold }} />
          </div>
          <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.gold, marginBottom: '8px' }}>Mindset</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '32px', fontWeight: 400, color: colors.dark, margin: '0 0 8px' }}>The QI Philosophy</h1>
          <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.5)', margin: '0 0 20px', maxWidth: '440px', marginLeft: 'auto', marginRight: 'auto' }}>The qualifying interview isn&apos;t just a step — it&apos;s a philosophy. How you approach it determines everything.</p>
          <a href="/qi-philosophy.pdf" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: colors.dark, color: colors.bg, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', border: 'none' }}>
            <Icons.Download style={{ width: '14px', height: '14px' }} /> Download PDF
          </a>
        </div>

        {/* Core Philosophy Statement */}
        <div style={{ padding: '32px 24px', background: 'rgba(184,149,107,0.06)', marginBottom: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: '20px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', color: colors.dark, margin: 0, lineHeight: 1.6 }}>&ldquo;A QI is not something you do <em>to</em> someone. It&apos;s something you do <em>for</em> someone.&rdquo;</p>
        </div>

        {/* Principles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {principles.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '24px 16px', borderBottom: i < principles.length - 1 ? '1px solid rgba(26,26,26,0.06)' : 'none', background: 'white', borderLeft: `3px solid ${colors.gold}`, borderRight: '1px solid rgba(26,26,26,0.08)', borderTop: i === 0 ? '1px solid rgba(26,26,26,0.08)' : 'none' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.dark, margin: '0 0 8px' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.55)', margin: 0, lineHeight: 1.7 }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '32px', padding: '24px', background: 'rgba(184,149,107,0.06)', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: colors.dark, marginBottom: '6px' }}>The Bottom Line</p>
          <p style={{ fontSize: '15px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', color: 'rgba(26,26,26,0.6)', margin: 0, lineHeight: 1.6 }}>Treat every QI like you&apos;re sitting across from your best friend. Care about the person. Share what you have. And let the results take care of themselves.</p>
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
