"use client";

import React from 'react';
import Link from 'next/link';

const colors = {
  bg: '#fafaf8',
  dark: '#1a1a1a',
  gold: '#b8956b',
};

const Icons = {
  CheckCircle: ({ style }) => (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>
  ),
  Users: ({ style }) => (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  DollarSign: ({ style }) => (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  ),
  ArrowRight: ({ style }) => (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
};

export default function AdminPage() {
  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(26,26,26,0.1)', padding: '20px 32px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: colors.gold, marginBottom: '4px' }}>Freedom Family</p>
          <h1 style={{ fontSize: '24px', color: colors.dark, margin: 0, fontWeight: 500 }}>Admin Dashboard</h1>
        </div>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Check-In */}
          <Link href="/admin/checkin" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '24px',
              background: 'white',
              border: '1px solid rgba(26,26,26,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: 'rgba(34, 197, 94, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Icons.CheckCircle style={{ width: '28px', height: '28px', color: '#22c55e' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '18px', color: colors.dark, margin: '0 0 4px 0', fontWeight: 500 }}>Check-In</h2>
                <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.5)', margin: 0 }}>Check in IBOs and guests as they arrive</p>
              </div>
              <Icons.ArrowRight style={{ width: '20px', height: '20px', color: 'rgba(26,26,26,0.3)' }} />
            </div>
          </Link>

          {/* View on Stripe */}
          <a href="https://dashboard.stripe.com/payments" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '24px',
              background: 'white',
              border: '1px solid rgba(26,26,26,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              cursor: 'pointer',
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: 'rgba(184, 149, 107, 0.15)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Icons.DollarSign style={{ width: '28px', height: '28px', color: colors.gold }} />
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '18px', color: colors.dark, margin: '0 0 4px 0', fontWeight: 500 }}>Payments</h2>
                <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.5)', margin: 0 }}>View all payments in Stripe Dashboard</p>
              </div>
              <Icons.ArrowRight style={{ width: '20px', height: '20px', color: 'rgba(26,26,26,0.3)' }} />
            </div>
          </a>

          {/* Back to main site */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '24px',
              background: 'white',
              border: '1px solid rgba(26,26,26,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              cursor: 'pointer',
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: 'rgba(26,26,26,0.05)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Icons.Users style={{ width: '28px', height: '28px', color: colors.dark }} />
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '18px', color: colors.dark, margin: '0 0 4px 0', fontWeight: 500 }}>Registration Page</h2>
                <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.5)', margin: 0 }}>View the public registration page</p>
              </div>
              <Icons.ArrowRight style={{ width: '20px', height: '20px', color: 'rgba(26,26,26,0.3)' }} />
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}