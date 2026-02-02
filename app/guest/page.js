"use client";

import React, { useState, useRef, useEffect } from 'react';

const colors = { bg: '#fafaf8', dark: '#1a1a1a', gold: '#b8956b' };

const Icons = {
  Check: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>,
  MapPin: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>,
  Calendar: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>,
};

const LTD_DISCLOSURES = `This event is produced by Leadership Team Development, Inc. (LTD). No audio or video recording is allowed. The techniques suggested may have worked for others but results are not guaranteed. Purchase of business support materials is optional. Event registrations are non-transferable. By attending, holder assumes all risks. Event details subject to change.`;

const SignatureModal = ({ isOpen, onClose, onSave }) => {
  const canvasRef = useRef(null);
  const [hasSig, setHasSig] = useState(false);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.strokeStyle = colors.dark;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.clearRect(0, 0, 700, 200);
      setHasSig(false);
    }
  }, [isOpen]);

  const getCoords = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (x - rect.left) * (700 / rect.width), y: (y - rect.top) * (200 / rect.height) };
  };

  const start = (e) => { e.preventDefault(); const ctx = canvasRef.current.getContext('2d'); const { x, y } = getCoords(e); ctx.beginPath(); ctx.moveTo(x, y); setDrawing(true); };
  const draw = (e) => { if (!drawing) return; e.preventDefault(); const ctx = canvasRef.current.getContext('2d'); const { x, y } = getCoords(e); ctx.lineTo(x, y); ctx.stroke(); setHasSig(true); };
  const stop = () => setDrawing(false);
  const clear = () => { canvasRef.current.getContext('2d').clearRect(0, 0, 700, 200); setHasSig(false); };
  const save = () => { if (hasSig) { onSave(canvasRef.current.toDataURL()); onClose(); } };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.8)' }} onClick={onClose} />
      <div style={{ position: 'relative', width: '100%', maxWidth: '420px', background: colors.bg, padding: '24px' }}>
        <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.5)', marginBottom: '12px', textAlign: 'center' }}>Sign below</p>
        <div style={{ border: '1px solid rgba(26,26,26,0.2)', background: 'white', marginBottom: '16px' }}>
          <canvas ref={canvasRef} width={700} height={200} style={{ width: '100%', height: '140px', touchAction: 'none', cursor: 'crosshair' }}
            onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop} onTouchStart={start} onTouchMove={draw} onTouchEnd={stop} />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={clear} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid rgba(26,26,26,0.2)', color: colors.dark, fontSize: '13px', cursor: 'pointer' }}>Clear</button>
          <button onClick={save} disabled={!hasSig} style={{ flex: 1, padding: '12px', background: hasSig ? colors.dark : 'rgba(26,26,26,0.2)', border: 'none', color: hasSig ? colors.bg : 'rgba(26,26,26,0.4)', fontSize: '13px', cursor: hasSig ? 'pointer' : 'not-allowed' }}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default function GuestPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', invitedBy: '', visitNumber: '', signature: '', agreed: false });
  const [sigModal, setSigModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [complete, setComplete] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: form.firstName, lastName: form.lastName, email: form.email, type: 'guest', invitedBy: form.invitedBy, visitNumber: form.visitNumber, source: 'guest' }),
      });
      setComplete(true);
    } catch (e) { alert('Failed. Try again.'); }
    setProcessing(false);
  };

  const label = { fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', display: 'block', marginBottom: '6px' };
  const input = { width: '100%', padding: '12px', background: 'white', border: '1px solid rgba(26,26,26,0.15)', outline: 'none', color: colors.dark, fontSize: '16px', boxSizing: 'border-box' };

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap');`}</style>
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '40px 20px' }}>
        {complete ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ width: '56px', height: '56px', margin: '0 auto 20px', borderRadius: '50%', border: `1px solid ${colors.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icons.Check style={{ width: '28px', height: '28px', color: colors.gold }} />
            </div>
            <p style={{ color: colors.gold, fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '10px' }}>Confirmed</p>
            <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '32px', color: colors.dark, marginBottom: '10px' }}>See You There!</h1>
            <p style={{ color: 'rgba(26,26,26,0.5)', fontSize: '15px', marginBottom: '32px' }}>You&#39;re registered as a guest</p>
            <div style={{ textAlign: 'left', background: 'white', padding: '20px', border: '1px solid rgba(26,26,26,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Icons.Calendar style={{ width: '18px', height: '18px', color: colors.gold }} />
                <div><p style={{ color: colors.dark, margin: 0, fontSize: '14px' }}>This Monday · 7:30 PM</p><p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.5)', margin: 0 }}>Arrive by 7:15</p></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icons.MapPin style={{ width: '18px', height: '18px', color: colors.gold }} />
                <div><p style={{ color: colors.dark, margin: 0, fontSize: '14px' }}>Embassy Suites</p><p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.5)', margin: 0 }}>College Station, TX</p></div>
              </div>
            </div>
            <p style={{ marginTop: '24px', fontSize: '13px', color: 'rgba(26,26,26,0.4)' }}>Dress: Business Professional</p>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <p style={{ color: colors.gold, fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '10px' }}>You&#39;re Invited</p>
              <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '36px', color: colors.dark, marginBottom: '10px', fontWeight: 400 }}>Guest Registration</h1>
              <p style={{ color: 'rgba(26,26,26,0.5)', fontSize: '15px' }}>Join us this Monday</p>
            </div>
            <form onSubmit={submit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div><label style={label}>First Name</label><input type="text" name="fname" autoComplete="given-name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} style={input} required /></div>
                  <div><label style={label}>Last Name</label><input type="text" name="lname" autoComplete="family-name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} style={input} required /></div>
                </div>
                <div><label style={label}>Email</label><input type="email" name="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={input} required /></div>
                <div><label style={label}>Who Invited You</label><input type="text" value={form.invitedBy} onChange={(e) => setForm({ ...form, invitedBy: e.target.value })} style={input} required /></div>
                <div>
                  <label style={label}>Is This Your...</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['1st', '2nd', '3rd'].map(v => (
                      <label key={v} style={{ flex: 1, padding: '12px', textAlign: 'center', fontSize: '14px', border: form.visitNumber === v ? `1px solid ${colors.dark}` : '1px solid rgba(26,26,26,0.15)', background: form.visitNumber === v ? colors.dark : 'white', color: form.visitNumber === v ? colors.bg : colors.dark, cursor: 'pointer' }}>
                        <input type="radio" name="visit" value={v} checked={form.visitNumber === v} onChange={(e) => setForm({ ...form, visitNumber: e.target.value })} style={{ display: 'none' }} required />{v} Look
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={label}>Signature</label>
                  {form.signature ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                      <Icons.Check style={{ width: '18px', height: '18px', color: '#22c55e' }} />
                      <span style={{ flex: 1, color: '#22c55e', fontSize: '14px' }}>Signed</span>
                      <button type="button" onClick={() => setSigModal(true)} style={{ fontSize: '12px', color: colors.dark, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Re-sign</button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setSigModal(true)} style={{ width: '100%', padding: '18px', background: 'white', border: '1px dashed rgba(26,26,26,0.3)', color: 'rgba(26,26,26,0.5)', fontSize: '14px', cursor: 'pointer' }}>Tap to Sign</button>
                  )}
                </div>
                <div style={{ borderTop: '1px solid rgba(26,26,26,0.1)', paddingTop: '16px' }}>
                  <details style={{ fontSize: '11px', color: 'rgba(26,26,26,0.4)', marginBottom: '12px' }}><summary style={{ cursor: 'pointer' }}>LTD Disclosures</summary><p style={{ lineHeight: 1.6, marginTop: '8px' }}>{LTD_DISCLOSURES}</p></details>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.agreed} onChange={(e) => setForm({ ...form, agreed: e.target.checked })} required style={{ width: '18px', height: '18px', accentColor: colors.dark }} />
                    <span style={{ fontSize: '14px', color: 'rgba(26,26,26,0.7)' }}>I agree to the terms</span>
                  </label>
                </div>
                <button type="submit" disabled={processing || !form.agreed || !form.signature}
                  style={{ width: '100%', padding: '16px', background: processing || !form.agreed || !form.signature ? 'rgba(26,26,26,0.2)' : colors.dark, color: processing || !form.agreed || !form.signature ? 'rgba(26,26,26,0.4)' : colors.bg, fontSize: '14px', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: processing || !form.agreed || !form.signature ? 'not-allowed' : 'pointer', marginTop: '8px' }}>
                  {processing ? 'Registering...' : 'Complete Registration'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
      <SignatureModal isOpen={sigModal} onClose={() => setSigModal(false)} onSave={(sig) => setForm({ ...form, signature: sig })} />
    </div>
  );
}