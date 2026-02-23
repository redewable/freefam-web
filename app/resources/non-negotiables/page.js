"use client";

import React from 'react';

const colors = { bg: '#fafaf8', dark: '#1a1a1a', gold: '#b8956b' };

const items = [
  { title: "2 Machines — Volume / Sponsoring", description: "Your business runs on two machines: volume (moving product) and sponsoring (bringing in new people). Both must be running at all times. One without the other won't build a sustainable business." },
  { title: "3–5 Registrations Per Month", description: "2+ QIs per week gets you here. Consistent plan-showing leads to consistent registrations. This is the benchmark that keeps your business growing month over month." },
  { title: "3 Knobs — Enough Work / Right Work / Right People", description: "If results aren't coming, check the 3 knobs. Are you doing enough work? Are you doing the right work? Are you working with the right people? Adjust until the output matches the vision." },
  { title: "Business Intent — Does Your Prospect Bring a List to the Table?", description: "A prospect with real business intent shows up ready to go. Do they have a list? Are they coachable? Are they serious? Intent is the filter — don't build with people who aren't all in." },
  { title: "Starter Stack — Launch With Strength", description: "When someone joins, launch them with strength. A starter stack sets the tone: products in hand, system plugged in, and momentum from day one. A weak start leads to a weak business." },
];

const Icons = {
  Back: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>,
  Shield: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  Download: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
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
          <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.5)', margin: '0 0 20px', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>The 5 standards we hold ourselves to — no exceptions, no excuses</p>
          <a href="/team-isi-non-negotiables.pdf" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: colors.dark, color: colors.bg, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', border: 'none' }}>
            <Icons.Download style={{ width: '14px', height: '14px' }} /> Download PDF
          </a>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '22px 16px', borderBottom: i < items.length - 1 ? '1px solid rgba(26,26,26,0.06)' : 'none', background: 'white', borderLeft: '1px solid rgba(26,26,26,0.08)', borderRight: '1px solid rgba(26,26,26,0.08)', borderTop: i === 0 ? '1px solid rgba(26,26,26,0.08)' : 'none' }}>
              <div style={{ width: '32px', height: '32px', background: 'rgba(184,149,107,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderRadius: '50%' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: colors.gold }}>{i + 1}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '15px', fontWeight: 600, color: colors.dark, margin: '0 0 4px' }}>{item.title}</p>
                <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.5)', margin: 0, lineHeight: 1.5 }}>{item.description}</p>
              </div>
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
