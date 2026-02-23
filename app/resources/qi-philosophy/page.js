"use client";

import React from 'react';

const colors = { bg: '#fafaf8', dark: '#1a1a1a', gold: '#b8956b' };

const Icons = {
  Back: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>,
  Download: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
};

const principles = [
  {
    number: 1,
    title: '100% Success',
    description: 'When you adopt this philosophy, every QI is a success — because the outcome is never about getting a yes. It\'s about sorting, showing, and moving forward. You succeed every time you run the process.',
  },
  {
    number: 2,
    title: 'Separate Lookers from Non-Lookers',
    description: 'Your job is not to convince anyone. It\'s to find out who\'s already looking. Some people are open, some aren\'t. Sort quickly and move on.',
  },
  {
    number: 3,
    title: 'Pull, Don\'t Push',
    description: 'Attract people with curiosity and genuine interest — never chase, beg, or pressure. If you have to push someone into the business, you\'ll have to push them through the business.',
  },
  {
    number: 4,
    title: 'Filter, Don\'t Funnel',
    description: 'You\'re filtering for the right people, not funneling everyone through. Quality over quantity. Not everyone belongs — and that\'s okay.',
  },
  {
    number: 5,
    title: 'Show and Go, Don\'t Beg and Sell',
    description: 'Show the plan, deliver it with confidence, and move on. Don\'t beg anyone to see it. Don\'t sell them on why they should care. Show it and let the plan do the work.',
  },
  {
    number: 6,
    title: 'Pressure on Them, Not on You',
    description: 'The decision is theirs, not yours. You deliver the information — they decide what to do with it. Take the pressure off yourself and put the ball in their court.',
  },
  {
    number: 7,
    title: 'Tell Them Everything, or Tell Them Nothing',
    description: 'Don\'t play games or drip information. Either give them the full picture so they can make an informed decision, or don\'t start the conversation at all. Transparency builds trust.',
  },
  {
    number: 8,
    title: 'You Need Me, I Don\'t Need You',
    description: 'This isn\'t arrogance — it\'s posture. You have something valuable. Believe that. The right people will recognize it. You\'re offering an opportunity, not asking for a favor.',
  },
  {
    number: 9,
    title: 'You Need People, Not One Person',
    description: 'Never put all your hopes on one prospect. Your business is built on volume and consistency. Keep your pipeline full and never depend on any single outcome.',
  },
  {
    number: 10,
    title: 'Activity Based, Not Results Based',
    description: 'Focus on what you can control: the number of plans you show, the calls you make, the people you connect with. Do the activity and the results will follow. You can\'t control outcomes — but you can control effort.',
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
          <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.gold, marginBottom: '8px' }}>Mindset</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '32px', fontWeight: 400, color: colors.dark, margin: '0 0 20px' }}>The QI Philosophy</h1>
          <a href="/qi-philosophy.pdf"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: colors.dark, color: colors.bg, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', border: 'none' }}>
            <Icons.Download style={{ width: '14px', height: '14px' }} /> Download PDF
          </a>
        </div>

        {/* Principles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {principles.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '22px 16px', borderBottom: i < principles.length - 1 ? '1px solid rgba(26,26,26,0.06)' : 'none', background: 'white', borderLeft: '1px solid rgba(26,26,26,0.08)', borderRight: '1px solid rgba(26,26,26,0.08)', borderTop: i === 0 ? '1px solid rgba(26,26,26,0.08)' : 'none' }}>
              <div style={{ width: '32px', height: '32px', background: 'rgba(184,149,107,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderRadius: '50%' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: colors.gold }}>{item.number}</span>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: colors.dark, margin: '0 0 6px' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.55)', margin: 0, lineHeight: 1.6 }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '32px', padding: '24px', background: 'rgba(184,149,107,0.06)', textAlign: 'center' }}>
          <p style={{ fontSize: '15px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', color: 'rgba(26,26,26,0.6)', margin: 0, lineHeight: 1.6 }}>Master the philosophy and every QI becomes a win — regardless of the outcome.</p>
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
