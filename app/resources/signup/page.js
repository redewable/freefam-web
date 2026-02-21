"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/app/lib/supabase/client';

const colors = { bg: '#fafaf8', dark: '#1a1a1a', gold: '#b8956b' };

function SignupContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [invite, setInvite] = useState(null);
  const [checking, setChecking] = useState(true);
  const [invalidToken, setInvalidToken] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (!token) { setChecking(false); setInvalidToken(true); return; }
    fetch(`/api/auth/signup?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setInvalidToken(true); }
        else { setInvite(data.invite); if (data.invite.invitee_email) setEmail(data.invite.invitee_email); }
        setChecking(false);
      })
      .catch(() => { setInvalidToken(true); setChecking(false); });
  }, [token]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, password, fullName }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); setLoading(false); return; }
      setComplete(true);
    } catch (err) {
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px', background: 'white',
    border: '1px solid rgba(26,26,26,0.15)', outline: 'none',
    color: colors.dark, fontSize: '16px', boxSizing: 'border-box',
  };

  const labelStyle = {
    fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
    color: 'rgba(26,26,26,0.4)', display: 'block', marginBottom: '6px',
  };

  if (checking) return (
    <div style={{ minHeight: '100vh', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <p style={{ color: 'rgba(26,26,26,0.5)' }}>Validating invite...</p>
    </div>
  );

  if (invalidToken) return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap');`}</style>
      <nav style={{ borderBottom: '1px solid rgba(26,26,26,0.05)', padding: '14px 20px' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.dark, textDecoration: 'none' }}>Freedom Family</a>
          <span style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.gold }}>Resources</span>
        </div>
      </nav>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '360px' }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '28px', color: colors.dark, fontWeight: 400, marginBottom: '12px' }}>Invalid Invite</h1>
          <p style={{ color: 'rgba(26,26,26,0.5)', fontSize: '14px', marginBottom: '24px' }}>This invite link is expired or has already been used. Ask your sponsor for a new one.</p>
          <a href="/resources/login" style={{ color: colors.gold, fontSize: '13px', textDecoration: 'none', borderBottom: '1px solid rgba(184,149,107,0.4)' }}>Go to login</a>
        </div>
      </div>
    </div>
  );

  if (complete) return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap');`}</style>
      <nav style={{ borderBottom: '1px solid rgba(26,26,26,0.05)', padding: '14px 20px' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.dark, textDecoration: 'none' }}>Freedom Family</a>
          <span style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.gold }}>Resources</span>
        </div>
      </nav>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '360px' }}>
          <div style={{ width: '56px', height: '56px', margin: '0 auto 20px', borderRadius: '50%', border: `1px solid ${colors.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: '28px', height: '28px', color: colors.gold }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <p style={{ color: colors.gold, fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '10px' }}>Account Created</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '28px', color: colors.dark, fontWeight: 400, marginBottom: '12px' }}>Welcome to the Team</h1>
          <p style={{ color: 'rgba(26,26,26,0.5)', fontSize: '14px', marginBottom: '24px' }}>Sign in to access your resources.</p>
          <a href="/resources/login" style={{ display: 'inline-block', padding: '14px 28px', background: colors.dark, color: colors.bg, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>Sign In</a>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap');`}</style>

      <nav style={{ borderBottom: '1px solid rgba(26,26,26,0.05)', padding: '14px 20px' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.dark, textDecoration: 'none' }}>Freedom Family</a>
          <span style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.gold }}>Resources</span>
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <form onSubmit={handleSignup} style={{ width: '100%', maxWidth: '360px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <p style={{ color: colors.gold, fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '10px' }}>You&#39;re Invited</p>
            <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '32px', color: colors.dark, fontWeight: 400, marginBottom: '8px' }}>Create Account</h1>
            <p style={{ color: 'rgba(26,26,26,0.45)', fontSize: '14px' }}>Set up your member access</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} style={inputStyle} required autoComplete="name" autoFocus />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required autoComplete="email" readOnly={!!invite?.invitee_email} />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required autoComplete="new-password" />
            </div>
            <div>
              <label style={labelStyle}>Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} required autoComplete="new-password" />
            </div>

            {error && <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>{error}</p>}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '16px',
              background: loading ? 'rgba(26,26,26,0.3)' : colors.dark,
              color: colors.bg, fontSize: '12px', letterSpacing: '0.1em',
              textTransform: 'uppercase', border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px',
            }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'rgba(26,26,26,0.4)' }}>
            Already have an account? <a href="/resources/login" style={{ color: colors.gold, textDecoration: 'none', borderBottom: '1px solid rgba(184,149,107,0.4)' }}>Sign in</a>
          </p>
        </form>
      </div>

      <footer style={{ padding: '24px 20px', borderTop: '1px solid rgba(26,26,26,0.05)' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.25)', textDecoration: 'none' }}>Freedom Family</a>
          <span style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.25)' }}>LTD</span>
        </div>
      </footer>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#fafaf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <p style={{ color: 'rgba(26,26,26,0.5)' }}>Loading...</p>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
