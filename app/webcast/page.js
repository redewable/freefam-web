"use client";

import React, { useState, useEffect } from 'react';

const colors = { bg: '#fafaf8', dark: '#1a1a1a', gold: '#b8956b' };

const Icons = {
  ArrowRight: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>,
  Video: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>,
  Check: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>,
};

export default function WebcastAccessPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [zoomLink, setZoomLink] = useState('');
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);

  // Check for token or session_id in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const sessionId = params.get('session_id');

    if (token) {
      setLoading(true);
      fetch(`/api/webcast/verify?token=${encodeURIComponent(token)}`)
        .then(r => r.json())
        .then(data => {
          if (data.link) { setZoomLink(data.link); setVerified(true); }
          else setError('This webcast link has expired or is invalid.');
          setLoading(false);
        })
        .catch(() => { setError('Unable to verify. Please try again.'); setLoading(false); });
    } else if (sessionId) {
      setLoading(true);
      fetch(`/api/webcast/verify?session_id=${encodeURIComponent(sessionId)}`)
        .then(r => r.json())
        .then(data => {
          if (data.link) { setZoomLink(data.link); setVerified(true); }
          else setError('This session could not be verified.');
          setLoading(false);
        })
        .catch(() => { setError('Unable to verify. Please try again.'); setLoading(false); });
    }
  }, []);

  const lookupByEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/webcast/verify?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();
      if (data.link) { setZoomLink(data.link); setVerified(true); }
      else setError('No webcast registration found for this email. Please check your email or register at the event page.');
    } catch (e) {
      setError('Unable to look up. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap');`}</style>

      <nav style={{ borderBottom: '1px solid rgba(26,26,26,0.05)', padding: '14px 20px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.dark, textDecoration: 'none' }}>Freedom Family</a>
          <span style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3b82f6' }}>Webcast</span>
        </div>
      </nav>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: '420px', textAlign: 'center' }}>
          {loading ? (
            <p style={{ color: 'rgba(26,26,26,0.4)', fontSize: '14px' }}>Verifying...</p>
          ) : verified && zoomLink ? (
            <>
              <div style={{ width: '56px', height: '56px', margin: '0 auto 20px', borderRadius: '50%', border: '1px solid #3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.Video style={{ width: '28px', height: '28px', color: '#3b82f6' }} />
              </div>
              <p style={{ color: '#3b82f6', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>Webcast Access</p>
              <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '32px', color: colors.dark, fontWeight: 400, marginBottom: '16px' }}>You&#39;re All Set</h1>
              <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.5)', marginBottom: '28px', lineHeight: 1.6 }}>
                Join the live broadcast at the scheduled time using the link below.
              </p>
              <a href={zoomLink} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '16px 32px',
                  background: colors.dark, color: colors.bg, fontSize: '12px', letterSpacing: '0.15em',
                  textTransform: 'uppercase', textDecoration: 'none',
                }}>
                Join Zoom Meeting
                <Icons.ArrowRight style={{ width: '14px', height: '14px' }} />
              </a>
              <p style={{ marginTop: '20px', fontSize: '11px', color: 'rgba(26,26,26,0.3)' }}>
                Bookmark this page to access the link again later.
              </p>
            </>
          ) : (
            <>
              <div style={{ width: '56px', height: '56px', margin: '0 auto 20px', borderRadius: '50%', border: '1px solid rgba(26,26,26,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.Video style={{ width: '28px', height: '28px', color: 'rgba(26,26,26,0.3)' }} />
              </div>
              <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '32px', color: colors.dark, fontWeight: 400, marginBottom: '8px' }}>Webcast Access</h1>
              <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.5)', marginBottom: '28px', lineHeight: 1.6 }}>
                Enter the email you registered with to access your Zoom link.
              </p>
              <form onSubmit={lookupByEmail} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  style={{ padding: '14px', border: '1px solid rgba(26,26,26,0.15)', background: 'white', fontSize: '16px', outline: 'none', textAlign: 'center', boxSizing: 'border-box' }}
                  required
                />
                <button type="submit" disabled={loading || !email.trim()}
                  style={{
                    padding: '14px', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase',
                    background: loading || !email.trim() ? 'rgba(26,26,26,0.15)' : colors.dark,
                    color: loading || !email.trim() ? 'rgba(26,26,26,0.4)' : colors.bg,
                    border: 'none', cursor: loading || !email.trim() ? 'not-allowed' : 'pointer',
                  }}>
                  {loading ? 'Looking up...' : 'Access Webcast'}
                </button>
              </form>
              {error && <p style={{ marginTop: '16px', fontSize: '13px', color: '#ef4444' }}>{error}</p>}
              <p style={{ marginTop: '24px', fontSize: '12px', color: 'rgba(26,26,26,0.3)' }}>
                Don&#39;t have a ticket? <a href="/bcs" style={{ color: colors.gold, textDecoration: 'none' }}>Register here</a>
              </p>
            </>
          )}
        </div>
      </main>

      <footer style={{ padding: '24px 16px', borderTop: '1px solid rgba(26,26,26,0.05)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <a href="/" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.25)', textDecoration: 'none' }}>Freedom Family</a>
        </div>
      </footer>
    </div>
  );
}
