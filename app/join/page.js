"use client";

import React, { useState, useCallback } from 'react';

const colors = { bg: '#fafaf8', dark: '#1a1a1a', gold: '#b8956b' };

export default function JoinPage() {
  const [form, setForm] = useState({ ltdId: '', fullName: '', password: '', confirmPassword: '', phone: '', email: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [ltdAvailable, setLtdAvailable] = useState(null); // null = unchecked, true/false
  const [checkingLtd, setCheckingLtd] = useState(false);

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === 'ltdId') setLtdAvailable(null);
    setError('');
  };

  // Debounced LTD ID availability check
  const checkLtdId = useCallback(async (ltdId) => {
    if (!ltdId || ltdId.length < 4) { setLtdAvailable(null); return; }
    setCheckingLtd(true);
    try {
      const res = await fetch(`/api/auth/join?ltdId=${ltdId}`);
      const data = await res.json();
      setLtdAvailable(data.available);
    } catch {
      setLtdAvailable(null);
      setError('Could not verify LTD ID. Please try again.');
    }
    setCheckingLtd(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate
    if (!form.ltdId || !form.fullName || !form.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!/^\d+$/.test(form.ltdId)) {
      setError('LTD ID must be numeric.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (ltdAvailable === false) {
      setError('This LTD ID is already registered.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ltdId: form.ltdId,
          fullName: form.fullName,
          password: form.password,
          phone: form.phone || undefined,
          email: form.email || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      setSuccess({ ltdId: data.ltdId, fullName: data.fullName });
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px',
    background: 'white',
    border: '1px solid rgba(26,26,26,0.15)',
    outline: 'none',
    color: colors.dark,
    fontSize: '16px',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    fontSize: '10px',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'rgba(26,26,26,0.4)',
    display: 'block',
    marginBottom: '6px',
  };

  // Success screen
  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
        <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap');`}</style>

        <nav style={{ borderBottom: '1px solid rgba(26,26,26,0.05)', padding: '14px 20px' }}>
          <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <a href="/" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.dark, textDecoration: 'none' }}>Freedom Family</a>
            <span style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.gold }}>Welcome</span>
          </div>
        </nav>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '28px', color: colors.dark, fontWeight: 400, marginBottom: '8px' }}>Account Created</h1>
            <p style={{ color: 'rgba(26,26,26,0.5)', fontSize: '14px', marginBottom: '32px' }}>Welcome aboard, {success.fullName}.</p>

            <div style={{ background: 'white', border: '1px solid rgba(26,26,26,0.1)', padding: '20px', textAlign: 'left', marginBottom: '24px' }}>
              <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', marginBottom: '12px' }}>Your Login Credentials</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: 'rgba(26,26,26,0.5)' }}>LTD ID</span>
                <span style={{ fontSize: '14px', color: colors.dark, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{success.ltdId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: 'rgba(26,26,26,0.5)' }}>Password</span>
                <span style={{ fontSize: '14px', color: colors.dark, fontWeight: 500 }}>The password you chose</span>
              </div>
            </div>

            <a
              href="/resources/login"
              style={{
                display: 'block',
                width: '100%',
                padding: '16px',
                background: colors.dark,
                color: colors.bg,
                fontSize: '12px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                border: 'none',
                textDecoration: 'none',
                textAlign: 'center',
                boxSizing: 'border-box',
              }}
            >
              Sign In Now
            </a>

            <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.35)', marginTop: '16px' }}>Your leadership team will place you in the organization shortly.</p>
          </div>
        </div>

        <footer style={{ padding: '24px 20px', borderTop: '1px solid rgba(26,26,26,0.05)' }}>
          <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a href="/" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.25)', textDecoration: 'none' }}>Freedom Family</a>
            <a href="https://www.ltdteam.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.25)', textDecoration: 'none' }}>LTD</a>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap');
        input:focus-visible, select:focus-visible, button:focus-visible { outline: 2px solid ${colors.gold} !important; outline-offset: -1px; }
        @media (max-width: 400px) {
          .join-phone-email-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <nav style={{ borderBottom: '1px solid rgba(26,26,26,0.05)', padding: '14px 20px' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.dark, textDecoration: 'none' }}>Freedom Family</a>
          <span style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.gold }}>Join</span>
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <p style={{ color: colors.gold, fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '10px' }}>Team Registration</p>
            <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '32px', color: colors.dark, fontWeight: 400, marginBottom: '8px' }}>Create Your Account</h1>
            <p style={{ color: 'rgba(26,26,26,0.45)', fontSize: '14px' }}>Join the Freedom Family team portal</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* LTD ID */}
            <div>
              <label style={labelStyle}>LTD ID <span style={{ color: '#ef4444' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={form.ltdId}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '');
                    update('ltdId', v);
                  }}
                  onBlur={() => checkLtdId(form.ltdId)}
                  placeholder="e.g. 6076043"
                  style={{
                    ...inputStyle,
                    borderColor: ltdAvailable === false ? '#ef4444' : ltdAvailable === true ? '#22c55e' : 'rgba(26,26,26,0.15)',
                  }}
                  required
                  autoFocus
                  inputMode="numeric"
                />
                {checkingLtd && (
                  <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: 'rgba(26,26,26,0.3)' }}>Checking...</span>
                )}
                {!checkingLtd && ltdAvailable === true && (
                  <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#22c55e' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                  </span>
                )}
                {!checkingLtd && ltdAvailable === false && (
                  <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#ef4444', fontSize: '12px' }}>Already registered</span>
                )}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label style={labelStyle}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => update('fullName', e.target.value)}
                placeholder="First Last"
                style={inputStyle}
                required
                autoComplete="name"
              />
            </div>

            {/* Phone + Email row */}
            <div className="join-phone-email-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Phone <span style={{ color: 'rgba(26,26,26,0.25)', fontStyle: 'italic', textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  style={inputStyle}
                  autoComplete="tel"
                />
              </div>
              <div>
                <label style={labelStyle}>Email <span style={{ color: 'rgba(26,26,26,0.25)', fontStyle: 'italic', textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@email.com"
                  style={inputStyle}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder="Minimum 6 characters"
                style={inputStyle}
                required
                autoComplete="new-password"
              />
              {form.password && form.password.length < 6 && (
                <p style={{ color: '#f97316', fontSize: '11px', margin: '4px 0 0' }}>{6 - form.password.length} more character{6 - form.password.length !== 1 ? 's' : ''} needed</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={labelStyle}>Confirm Password <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => update('confirmPassword', e.target.value)}
                placeholder="Re-enter your password"
                style={{
                  ...inputStyle,
                  borderColor: form.confirmPassword && form.confirmPassword !== form.password ? '#ef4444' : 'rgba(26,26,26,0.15)',
                }}
                required
                autoComplete="new-password"
              />
              {form.confirmPassword && form.confirmPassword !== form.password && (
                <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>Passwords do not match</p>
              )}
            </div>

            {error && (
              <p style={{ color: '#ef4444', fontSize: '13px', margin: 0, padding: '8px 12px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                background: loading ? 'rgba(26,26,26,0.3)' : colors.dark,
                color: colors.bg,
                fontSize: '12px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '4px',
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
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
          <a href="https://www.ltdteam.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.25)', textDecoration: 'none' }}>LTD</a>
        </div>
      </footer>
    </div>
  );
}
