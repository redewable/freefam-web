"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const colors = { bg: '#fafaf8', dark: '#1a1a1a', gold: '#b8956b' };

function ReceiptContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) { setError('No receipt specified.'); setLoading(false); return; }

    fetch(`/api/receipt?session_id=${sessionId}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setReceipt(data);
        setLoading(false);
      })
      .catch(() => { setError('Unable to load receipt.'); setLoading(false); });
  }, [sessionId]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <p style={{ color: 'rgba(26,26,26,0.4)' }}>Loading receipt...</p>
    </div>
  );

  if (error || !receipt) return (
    <div style={{ minHeight: '100vh', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '18px', color: colors.dark }}>Receipt Not Found</p>
        <p style={{ color: 'rgba(26,26,26,0.5)', fontSize: '14px' }}>{error}</p>
      </div>
    </div>
  );

  const eventDate = new Date(receipt.date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    timeZone: 'America/Chicago',
  });
  const eventTime = new Date(receipt.date).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', timeZone: 'America/Chicago',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap');
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .receipt-page { padding: 0 !important; background: white !important; }
          .receipt-card { box-shadow: none !important; border: none !important; }
        }
      `}</style>

      {/* Action bar - hidden in print */}
      <div className="no-print" style={{ padding: '16px 20px', background: 'white', borderBottom: '1px solid rgba(26,26,26,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/resources?tab=events" style={{ fontSize: '12px', color: 'rgba(26,26,26,0.5)', textDecoration: 'none' }}>{'\u2190'} Back to Events</a>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => window.print()}
            style={{
              padding: '8px 16px', background: colors.dark, color: colors.bg,
              border: 'none', cursor: 'pointer', fontSize: '11px',
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}
          >
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Receipt */}
      <div className="receipt-page" style={{ padding: '40px 20px' }}>
        <div className="receipt-card" style={{
          maxWidth: '520px', margin: '0 auto', background: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          border: '1px solid rgba(26,26,26,0.06)',
        }}>
          {/* Header */}
          <div style={{ padding: '32px 32px 24px', borderBottom: '1px solid rgba(26,26,26,0.06)', textAlign: 'center' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: colors.gold, marginBottom: '8px' }}>Freedom Family</p>
            <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '28px', color: colors.dark, fontWeight: 400, margin: '0 0 4px' }}>Receipt</h1>
            <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.4)' }}>Payment Confirmation</p>
          </div>

          {/* Details */}
          <div style={{ padding: '24px 32px' }}>
            {/* Event info */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.35)', marginBottom: '10px' }}>Event Details</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Row label="Event" value={receipt.source === 'bcs' ? 'Business Coaching Session' : 'Info Session / Training'} />
                <Row label="Date" value={eventDate} />
                <Row label="Time" value={eventTime} />
                <Row label="Ticket" value={receipt.priceType === 'monthly' ? 'Monthly Pass' : 'Weekly Ticket'} />
              </div>
            </div>

            <div style={{ height: '1px', background: 'rgba(26,26,26,0.06)', margin: '0 0 24px' }} />

            {/* Attendee */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.35)', marginBottom: '10px' }}>Attendee</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Row label="Name" value={receipt.name} />
                {receipt.email && <Row label="Email" value={receipt.email} />}
                {receipt.ltdId && <Row label="LTD ID" value={receipt.ltdId} />}
              </div>
            </div>

            <div style={{ height: '1px', background: 'rgba(26,26,26,0.06)', margin: '0 0 24px' }} />

            {/* Payment */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.35)', marginBottom: '10px' }}>Payment</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '14px', color: 'rgba(26,26,26,0.6)' }}>Amount Paid</span>
                <span style={{ fontSize: '24px', fontWeight: 500, color: colors.dark, fontVariantNumeric: 'tabular-nums' }}>${receipt.amount}</span>
              </div>
            </div>

            <div style={{ height: '1px', background: 'rgba(26,26,26,0.06)', margin: '0 0 24px' }} />

            {/* Reference */}
            <div>
              <p style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.35)', marginBottom: '8px' }}>Reference</p>
              <p style={{ fontSize: '11px', color: 'rgba(26,26,26,0.3)', fontFamily: 'monospace', wordBreak: 'break-all' }}>{receipt.sessionId}</p>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '20px 32px', background: 'rgba(26,26,26,0.02)', borderTop: '1px solid rgba(26,26,26,0.06)', textAlign: 'center' }}>
            <p style={{ fontSize: '10px', color: 'rgba(26,26,26,0.3)', margin: 0 }}>
              Freedom Family {'\u00b7'} Embassy Suites, College Station TX
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const Row = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '16px' }}>
    <span style={{ fontSize: '13px', color: 'rgba(26,26,26,0.5)', flexShrink: 0 }}>{label}</span>
    <span style={{ fontSize: '14px', color: colors.dark, fontWeight: 500, textAlign: 'right' }}>{value}</span>
  </div>
);

export default function ReceiptPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <p style={{ color: 'rgba(26,26,26,0.5)' }}>Loading...</p>
      </div>
    }>
      <ReceiptContent />
    </Suspense>
  );
}
