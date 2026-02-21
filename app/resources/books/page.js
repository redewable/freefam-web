"use client";

import React from 'react';

const colors = { bg: '#fafaf8', dark: '#1a1a1a', gold: '#b8956b' };

const books = [
  { title: "Acres of Diamonds", author: "Russell Conwell" },
  { title: "Bringing out the Best in People", author: "Alan Loy McGinnis" },
  { title: "Go for No!", author: "Richard Fenton & Andrea Waltz" },
  { title: "Greatest Miracle in the World", author: "Og Mandino" },
  { title: "How I Raised Myself from Failure to Success in Selling", author: "Frank Bettger" },
  { title: "How to Win Friends and Influence People", author: "Dale Carnegie" },
  { title: "Hung by the Tongue", author: "Francis Martin" },
  { title: "Live the Dream: No More Excuses", author: "Larry Winters" },
  { title: "Magic of Thinking Big", author: "David Schwartz" },
  { title: "The Compound Effect / The Slight Edge", author: "Darren Hardy / Jeff Olson" },
  { title: "The Go-Getter", author: "Peter Kyne" },
  { title: "The Master Key to Riches", author: "Napoleon Hill" },
  { title: "Think and Grow Rich", author: "Napoleon Hill" },
];

const Icons = {
  Back: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>,
  Download: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
  Book: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>,
};

export default function BooksPage() {
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
          <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.gold, marginBottom: '8px' }}>Freedom Family</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '32px', fontWeight: 400, color: colors.dark, margin: '0 0 8px' }}>First Year Book List</h1>
          <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.5)', margin: '0 0 20px' }}>Essential reads for your journey</p>
          <a href="/first-year-book-list.pdf" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: colors.dark, color: colors.bg, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', border: 'none' }}>
            <Icons.Download style={{ width: '14px', height: '14px' }} /> Download PDF
          </a>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {books.map((book, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '18px 16px', borderBottom: i < books.length - 1 ? '1px solid rgba(26,26,26,0.06)' : 'none', background: 'white', borderLeft: i === 0 ? '1px solid rgba(26,26,26,0.08)' : '1px solid rgba(26,26,26,0.08)', borderRight: '1px solid rgba(26,26,26,0.08)', borderTop: i === 0 ? '1px solid rgba(26,26,26,0.08)' : 'none' }}>
              <div style={{ width: '28px', height: '28px', background: 'rgba(184,149,107,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: colors.gold }}>{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '15px', fontWeight: 500, color: colors.dark, margin: '0 0 3px' }}>{book.title}</p>
                <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.5)', margin: 0 }}>{book.author}</p>
              </div>
              <Icons.Book style={{ width: '16px', height: '16px', color: 'rgba(26,26,26,0.15)', flexShrink: 0, marginTop: '4px' }} />
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
