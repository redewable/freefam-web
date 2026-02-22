"use client";

import React, { useState } from 'react';

const colors = { bg: '#fafaf8', dark: '#1a1a1a', gold: '#b8956b' };

export default function CreateUserPage() {
  const [form, setForm] = useState({
    ltdId: '2118394',
    fullName: 'Derly Trevino',
    password: 'Sixin2026',
    role: 'member',
    portalAccess: 'viewer',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to create user');
    }
    setLoading(false);
  };

  const inputStyle = { width: '100%', padding: '12px', background: 'white', border: '1px solid rgba(26,26,26,0.15)', fontSize: '14px', boxSizing: 'border-box', outline: 'none' };
  const labelStyle = { display: 'block', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', marginBottom: '5px' };

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ borderBottom: '1px solid rgba(26,26,26,0.05)', padding: '14px 16px' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/admin/leadership" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.dark, textDecoration: 'none' }}>← Leadership</a>
          <span style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.gold }}>Create User</span>
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        {result ? (
          <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" style={{ width: '24px', height: '24px' }}><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <h2 style={{ fontSize: '20px', color: colors.dark, fontWeight: 500, marginBottom: '20px' }}>Account Created</h2>
            <div style={{ background: 'white', border: '1px solid rgba(26,26,26,0.1)', padding: '20px', textAlign: 'left' }}>
              <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.gold, marginBottom: '12px' }}>Send these credentials</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <div><span style={{ color: 'rgba(26,26,26,0.4)', fontSize: '11px' }}>LTD ID:</span> <strong style={{ color: colors.dark }}>{form.ltdId}</strong></div>
                <div><span style={{ color: 'rgba(26,26,26,0.4)', fontSize: '11px' }}>Password:</span> <strong style={{ color: colors.dark }}>{form.password}</strong></div>
                <div><span style={{ color: 'rgba(26,26,26,0.4)', fontSize: '11px' }}>Access:</span> <strong style={{ color: colors.dark, textTransform: 'capitalize' }}>{form.portalAccess || 'None'}</strong></div>
              </div>
              <div style={{ marginTop: '16px', padding: '10px', background: 'rgba(26,26,26,0.03)', fontSize: '12px', color: 'rgba(26,26,26,0.5)' }}>
                Leadership Portal: <strong>/admin/leadership</strong><br />
                Member Dashboard: <strong>/resources</strong>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} style={{ width: '100%', maxWidth: '400px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <p style={{ color: colors.gold, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>Admin</p>
              <h1 style={{ fontSize: '22px', color: colors.dark, fontWeight: 500, margin: 0 }}>Create User Account</h1>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>LTD ID</label>
                <input value={form.ltdId} onChange={e => setForm(p => ({ ...p, ltdId: e.target.value.replace(/\D/g, '') }))} style={inputStyle} required inputMode="numeric" />
              </div>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Portal Access</label>
                <select value={form.portalAccess} onChange={e => setForm(p => ({ ...p, portalAccess: e.target.value }))} style={{ ...inputStyle, background: 'white' }}>
                  <option value="">None (member only)</option>
                  <option value="viewer">Viewer — Read-only</option>
                  <option value="admin">Admin — Check-in + history</option>
                  <option value="leadership">Leadership — Full access</option>
                </select>
              </div>

              {error && <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>{error}</p>}

              <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? 'rgba(26,26,26,0.3)' : colors.dark, color: colors.bg, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px' }}>
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
