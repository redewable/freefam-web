"use client";

import React, { useState, useRef, useEffect } from 'react';

const colors = { bg: '#fafaf8', dark: '#1a1a1a', gold: '#b8956b' };

const Icons = {
  ArrowRight: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>,
  ArrowLeft: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>,
  X: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>,
  Check: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>,
  MapPin: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>,
  Calendar: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>,
  Share: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" /></svg>,
  Link: ({ style }) => <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>,
};

const LTD_DISCLOSURES = `This event is produced by Leadership Team Development, Inc. (LTD). No audio or video recording is allowed. The techniques suggested may have worked for others but results are not guaranteed. Success depicted may reflect income from multiple sources. Purchase is optional. Registrations are non-transferable. Holder assumes all risks. No refunds except as provided. Event details subject to change.`;

// Toast
const Toast = ({ message, isVisible, onClose }) => {
  useEffect(() => { if (isVisible) { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); } }, [isVisible, onClose]);
  if (!isVisible) return null;
  return (
    <div style={{ position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)', zIndex: 60 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px', background: colors.dark, color: colors.bg }}>
        <Icons.Check style={{ width: '16px', height: '16px', color: colors.gold }} />
        <span style={{ fontSize: '14px' }}>{message}</span>
      </div>
    </div>
  );
};

// Signature Modal
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

// Share Modal
const ShareModal = ({ isOpen, onClose, onCopy }) => {
  const guestLink = typeof window !== 'undefined' ? `${window.location.origin}/guest` : '';
  const copy = () => { navigator.clipboard.writeText(guestLink); onCopy(); onClose(); };
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.6)', backdropFilter: 'blur(8px)' }} onClick={onClose} />
      <div style={{ position: 'relative', width: '100%', maxWidth: '420px', background: colors.bg }}>
        <div style={{ height: '2px', background: `linear-gradient(to right, transparent, ${colors.gold}, transparent)` }} />
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', color: 'rgba(26,26,26,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}><Icons.X style={{ width: '18px', height: '18px' }} /></button>
        <div style={{ padding: '40px 32px' }}>
          <p style={{ color: colors.gold, fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '10px' }}>Invite</p>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '26px', color: colors.dark, marginBottom: '20px' }}>Share With a Guest</h2>
          <p style={{ color: 'rgba(26,26,26,0.5)', fontSize: '14px', marginBottom: '24px' }}>Send this link to invite someone to register.</p>
          <div style={{ padding: '14px', background: 'rgba(26,26,26,0.04)', border: '1px solid rgba(26,26,26,0.1)', marginBottom: '20px' }}>
            <p style={{ fontSize: '11px', color: 'rgba(26,26,26,0.4)', marginBottom: '6px' }}>Guest Link</p>
            <p style={{ fontSize: '13px', color: colors.dark, wordBreak: 'break-all', fontFamily: 'monospace', margin: 0 }}>{guestLink}</p>
          </div>
          <button onClick={copy} style={{ width: '100%', padding: '14px', background: colors.dark, color: colors.bg, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <Icons.Link style={{ width: '14px', height: '14px' }} />Copy Link
          </button>
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(26,26,26,0.1)' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', marginBottom: '12px' }}>Or share via</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a href={`sms:?body=${encodeURIComponent(`You're invited! Register here: ${guestLink}`)}`} style={{ flex: 1, padding: '10px', textAlign: 'center', fontSize: '13px', color: 'rgba(26,26,26,0.6)', border: '1px solid rgba(26,26,26,0.1)', textDecoration: 'none' }}>Text</a>
              <a href={`mailto:?subject=You're Invited&body=${encodeURIComponent(`Register here: ${guestLink}`)}`} style={{ flex: 1, padding: '10px', textAlign: 'center', fontSize: '13px', color: 'rgba(26,26,26,0.6)', border: '1px solid rgba(26,26,26,0.1)', textDecoration: 'none' }}>Email</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Registration Modal
const RegistrationModal = ({ isOpen, onClose, ticketType, setTicketType }) => {
  const [step, setStep] = useState(ticketType ? 2 : 1);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', invitedBy: '', visitNumber: '', ltdId: '', uplinePlatinum: '', paymentOption: '', agreed: false, signature: '' });
  const [sigModal, setSigModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => { if (ticketType && isOpen) setStep(2); }, [ticketType, isOpen]);

  const reset = () => { setStep(1); setTicketType(''); setForm({ firstName: '', lastName: '', email: '', invitedBy: '', visitNumber: '', ltdId: '', uplinePlatinum: '', paymentOption: '', agreed: false, signature: '' }); setComplete(false); };
  const close = () => { reset(); onClose(); };

  const submit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    if (ticketType === 'ibo') {
      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ priceType: form.paymentOption, customerEmail: form.email, customerName: `${form.firstName} ${form.lastName}`, ltdId: form.ltdId, uplinePlatinum: form.uplinePlatinum, source: 'main' }),
        });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
        else throw new Error();
      } catch (e) { alert('Payment failed.'); setProcessing(false); }
      return;
    }

    // Guest or Apprentice - free registration
    try {
      await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: form.firstName, lastName: form.lastName, email: form.email, type: ticketType, invitedBy: form.invitedBy, visitNumber: form.visitNumber, ltdId: form.ltdId, uplinePlatinum: form.uplinePlatinum, source: 'main' }),
      });
      setComplete(true);
    } catch (e) { alert('Failed.'); }
    setProcessing(false);
  };

  if (!isOpen) return null;

  const tickets = [
    { id: 'guest', label: 'Guest', sub: 'First-time visitor', price: 'Complimentary' },
    { id: 'apprentice', label: 'Apprentice', sub: 'First-year IBO', price: 'Complimentary' },
    { id: 'ibo', label: 'Business Owner', sub: 'Active IBO', price: 'From $12' },
  ];

  const label = { fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', display: 'block', marginBottom: '4px' };
  const input = { width: '100%', padding: '10px', background: 'white', border: '1px solid rgba(26,26,26,0.15)', outline: 'none', color: colors.dark, fontSize: '16px', boxSizing: 'border-box' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.6)', backdropFilter: 'blur(8px)' }} onClick={close} />
      <div style={{ position: 'relative', width: '100%', maxWidth: '440px', maxHeight: '90vh', background: colors.bg, overflow: 'hidden' }}>
        <div style={{ height: '2px', background: `linear-gradient(to right, transparent, ${colors.gold}, transparent)` }} />
        <button onClick={close} style={{ position: 'absolute', top: '16px', right: '16px', color: 'rgba(26,26,26,0.4)', background: 'none', border: 'none', cursor: 'pointer', zIndex: 10 }}><Icons.X style={{ width: '18px', height: '18px' }} /></button>
        <div style={{ overflowY: 'auto', maxHeight: 'calc(90vh - 2px)' }}>
          {complete ? (
            <div style={{ padding: '40px 28px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', margin: '0 auto 16px', borderRadius: '50%', border: `1px solid ${colors.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.Check style={{ width: '24px', height: '24px', color: colors.gold }} /></div>
              <p style={{ color: colors.gold, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>Confirmed</p>
              <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '24px', color: colors.dark, marginBottom: '8px' }}>See You Monday</h3>
              <p style={{ color: 'rgba(26,26,26,0.5)', fontSize: '13px', marginBottom: '20px' }}>Embassy Suites · College Station</p>
              <button onClick={close} style={{ fontSize: '12px', color: 'rgba(26,26,26,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>Close</button>
            </div>
          ) : step === 1 ? (
            <div style={{ padding: '28px' }}>
              <p style={{ color: colors.gold, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '6px' }}>Register</p>
              <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '24px', color: colors.dark, marginBottom: '20px' }}>Select Your Path</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {tickets.map(t => (
                  <button key={t.id} onClick={() => { setTicketType(t.id); setStep(2); }}
                    style={{ width: '100%', textAlign: 'left', padding: '14px', border: '1px solid rgba(26,26,26,0.1)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div><h3 style={{ fontSize: '15px', color: colors.dark, margin: '0 0 2px' }}>{t.label}</h3><p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.5)', margin: 0 }}>{t.sub}</p></div>
                    <p style={{ fontSize: '13px', color: colors.gold, margin: 0 }}>{t.price}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={submit} style={{ padding: '24px 28px' }}>
              <button type="button" onClick={() => { setStep(1); setTicketType(''); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'rgba(26,26,26,0.4)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '12px' }}><Icons.ArrowLeft style={{ width: '12px', height: '12px' }} /> Back</button>
              <p style={{ color: colors.gold, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '6px' }}>{ticketType === 'guest' ? 'Guest' : ticketType === 'apprentice' ? 'Apprentice' : 'Business Owner'}</p>
              <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '22px', color: colors.dark, marginBottom: '16px' }}>Your Details</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div><label style={label}>First Name</label><input type="text" name="fname" autoComplete="given-name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} style={input} required /></div>
                  <div><label style={label}>Last Name</label><input type="text" name="lname" autoComplete="family-name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} style={input} required /></div>
                </div>
                <div><label style={label}>Email</label><input type="email" name="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={input} required /></div>
                
                {ticketType === 'guest' && (
                  <>
                    <div><label style={label}>Who Invited You</label><input type="text" value={form.invitedBy} onChange={(e) => setForm({ ...form, invitedBy: e.target.value })} style={input} required /></div>
                    <div>
                      <label style={label}>Visit Number</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {['1st', '2nd', '3rd'].map(v => (
                          <label key={v} style={{ flex: 1, padding: '10px', textAlign: 'center', fontSize: '13px', border: form.visitNumber === v ? `1px solid ${colors.dark}` : '1px solid rgba(26,26,26,0.15)', background: form.visitNumber === v ? colors.dark : 'white', color: form.visitNumber === v ? colors.bg : colors.dark, cursor: 'pointer' }}>
                            <input type="radio" name="visit" value={v} checked={form.visitNumber === v} onChange={(e) => setForm({ ...form, visitNumber: e.target.value })} style={{ display: 'none' }} required />{v}
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                {(ticketType === 'apprentice' || ticketType === 'ibo') && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div><label style={label}>LTD ID</label><input type="text" value={form.ltdId} onChange={(e) => setForm({ ...form, ltdId: e.target.value })} style={input} required /></div>
                    <div><label style={label}>Upline Platinum</label><input type="text" value={form.uplinePlatinum} onChange={(e) => setForm({ ...form, uplinePlatinum: e.target.value })} style={input} required /></div>
                  </div>
                )}
                
                {ticketType === 'ibo' && (
                  <div>
                    <label style={label}>Payment Option</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[{ id: 'single', label: 'Single · $12', sub: 'This week' }, { id: 'monthly', label: 'Monthly · $40', sub: 'All month' }].map(o => (
                        <label key={o.id} style={{ flex: 1, padding: '12px', textAlign: 'center', border: form.paymentOption === o.id ? `1px solid ${colors.dark}` : '1px solid rgba(26,26,26,0.15)', background: form.paymentOption === o.id ? colors.dark : 'white', color: form.paymentOption === o.id ? colors.bg : colors.dark, cursor: 'pointer' }}>
                          <input type="radio" name="payment" value={o.id} checked={form.paymentOption === o.id} onChange={(e) => setForm({ ...form, paymentOption: e.target.value })} style={{ display: 'none' }} required />
                          <p style={{ fontSize: '13px', fontWeight: 500, margin: 0 }}>{o.label}</p>
                          <p style={{ fontSize: '10px', opacity: 0.7, margin: '2px 0 0' }}>{o.sub}</p>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <label style={label}>Signature</label>
                  {form.signature ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                      <Icons.Check style={{ width: '16px', height: '16px', color: '#22c55e' }} />
                      <span style={{ flex: 1, color: '#22c55e', fontSize: '13px' }}>Signed</span>
                      <button type="button" onClick={() => setSigModal(true)} style={{ fontSize: '11px', color: colors.dark, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Re-sign</button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setSigModal(true)} style={{ width: '100%', padding: '16px', background: 'white', border: '1px dashed rgba(26,26,26,0.3)', color: 'rgba(26,26,26,0.5)', fontSize: '14px', cursor: 'pointer' }}>Tap to Sign</button>
                  )}
                </div>
                
                <div style={{ borderTop: '1px solid rgba(26,26,26,0.1)', paddingTop: '12px' }}>
                  <details style={{ fontSize: '10px', color: 'rgba(26,26,26,0.4)', marginBottom: '10px' }}><summary style={{ cursor: 'pointer' }}>LTD Disclosures</summary><p style={{ lineHeight: 1.5, marginTop: '6px' }}>{LTD_DISCLOSURES}</p></details>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.agreed} onChange={(e) => setForm({ ...form, agreed: e.target.checked })} required style={{ width: '16px', height: '16px', accentColor: colors.dark }} />
                    <span style={{ fontSize: '13px', color: 'rgba(26,26,26,0.6)' }}>I agree to the terms</span>
                  </label>
                </div>
                
                <button type="submit" disabled={processing || !form.agreed || !form.signature || (ticketType === 'ibo' && !form.paymentOption)}
                  style={{ width: '100%', padding: '14px', background: processing || !form.agreed || !form.signature || (ticketType === 'ibo' && !form.paymentOption) ? 'rgba(26,26,26,0.2)' : colors.dark, color: processing || !form.agreed || !form.signature || (ticketType === 'ibo' && !form.paymentOption) ? 'rgba(26,26,26,0.4)' : colors.bg, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: processing || !form.agreed || !form.signature || (ticketType === 'ibo' && !form.paymentOption) ? 'not-allowed' : 'pointer', marginTop: '4px' }}>
                  {processing ? 'Processing...' : ticketType === 'ibo' ? `Continue — ${form.paymentOption === 'monthly' ? '$40' : '$12'}` : 'Complete Registration'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <SignatureModal isOpen={sigModal} onClose={() => setSigModal(false)} onSave={(sig) => setForm({ ...form, signature: sig })} />
    </div>
  );
};

// Main Page
export default function FreedomFamily() {
  const [modalOpen, setModalOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [ticketType, setTicketType] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('success') === 'true') { setToast({ visible: true, message: 'Payment successful!' }); window.history.replaceState({}, '', window.location.pathname); }
      if (params.get('canceled') === 'true') { setToast({ visible: true, message: 'Payment canceled' }); window.history.replaceState({}, '', window.location.pathname); }
      const reg = params.get('register');
      if (reg && ['guest', 'apprentice', 'ibo'].includes(reg)) { setTicketType(reg); setModalOpen(true); window.history.replaceState({}, '', window.location.pathname); }
    }
  }, []);

  const schedule = [
    { time: '7:00 PM', label: 'IBOs Arrive' },
    { time: '7:15 PM', label: 'Guests Arrive' },
    { time: '7:30 PM', label: 'The Plan' },
    { time: '8:45 PM', label: 'Training' },
    { time: '10:00 PM', label: 'Close' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap');`}</style>
      
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40, background: 'rgba(250,250,248,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(26,26,26,0.05)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.dark, margin: 0 }}>Freedom Family</p>
          <button onClick={() => setModalOpen(true)} style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.gold, background: 'none', border: 'none', cursor: 'pointer' }}>Register</button>
        </div>
      </nav>

      <section style={{ paddingTop: '100px', paddingBottom: '60px', textAlign: 'center', padding: '100px 20px 60px' }}>
        <p style={{ color: colors.gold, fontSize: '11px', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: '20px' }}>The Round Table</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(40px, 9vw, 80px)', color: colors.dark, lineHeight: 0.95, marginBottom: '20px', fontWeight: 400 }}>Freedom <em>Family</em></h1>
        <p style={{ fontSize: '17px', color: 'rgba(26,26,26,0.5)', maxWidth: '400px', margin: '0 auto 32px' }}>Monday nights. Building futures together.</p>
        <button onClick={() => setModalOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '16px 32px', background: colors.dark, color: colors.bg, fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>Register Now<Icons.ArrowRight style={{ width: '14px', height: '14px' }} /></button>
      </section>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 20px' }}><div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(26,26,26,0.1), transparent)' }} /></div>

      <section style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: '550px', margin: '0 auto' }}>
          <p style={{ color: colors.gold, fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '12px' }}>This Monday</p>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(30px, 6vw, 44px)', color: colors.dark, marginBottom: '8px', fontWeight: 400, lineHeight: 1.1 }}>Showing The Plan</h2>
          <p style={{ fontSize: '17px', color: 'rgba(26,26,26,0.5)', marginBottom: '28px' }}>Adrian &amp; Julia Williams</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Icons.Calendar style={{ width: '18px', height: '18px', color: colors.gold }} /><span style={{ fontSize: '15px', color: colors.dark }}>Monday, February 2, 2025 · 7:30 PM</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Icons.MapPin style={{ width: '18px', height: '18px', color: colors.gold }} /><span style={{ fontSize: '15px', color: colors.dark }}>Embassy Suites · 201 University Dr E, College Station</span></div>
          </div>
          
          <div style={{ background: 'rgba(26,26,26,0.02)', padding: '20px', marginBottom: '28px' }}>
            <p style={{ color: colors.gold, fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '14px' }}>Schedule</p>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px 16px' }}>
              {schedule.map((s, i) => (<React.Fragment key={i}><span style={{ fontSize: '14px', color: 'rgba(26,26,26,0.4)', fontVariantNumeric: 'tabular-nums' }}>{s.time}</span><span style={{ fontSize: '14px', color: colors.dark }}>{s.label}</span></React.Fragment>))}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={() => setModalOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 24px', background: colors.dark, color: colors.bg, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>Register Now<Icons.ArrowRight style={{ width: '14px', height: '14px' }} /></button>
            <button onClick={() => setShareOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 24px', background: 'transparent', color: colors.dark, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', border: '1px solid rgba(26,26,26,0.2)', cursor: 'pointer' }}><Icons.Share style={{ width: '14px', height: '14px' }} />Share Guest Link</button>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 20px' }}><div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(26,26,26,0.1), transparent)' }} /></div>

      <section style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: '550px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: colors.gold, fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '12px' }}>Major Event</p>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px, 5vw, 36px)', color: colors.dark, marginBottom: '8px', fontWeight: 400 }}>Breakthrough Conference</h2>
          <p style={{ fontSize: '15px', color: 'rgba(26,26,26,0.5)', marginBottom: '8px' }}>February 6–8, 2025</p>
          <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.4)', marginBottom: '24px' }}>Franklin, TN</p>
          <a href="https://www.ltdteam.com/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 24px', background: 'transparent', color: colors.dark, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', border: '1px solid rgba(26,26,26,0.2)', cursor: 'pointer', textDecoration: 'none' }}>Get Tickets<Icons.ArrowRight style={{ width: '14px', height: '14px' }} /></a>
        </div>
      </section>

      <footer style={{ padding: '40px 20px', borderTop: '1px solid rgba(26,26,26,0.05)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.25)', margin: 0 }}>LTD</p>
          <a href="/admin/checkin" style={{ fontSize: '10px', color: 'rgba(26,26,26,0.2)', textDecoration: 'none' }}>Admin</a>
        </div>
      </footer>

      <RegistrationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} ticketType={ticketType} setTicketType={setTicketType} />
      <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} onCopy={() => setToast({ visible: true, message: 'Link copied!' })} />
      <Toast message={toast.message} isVisible={toast.visible} onClose={() => setToast({ visible: false, message: '' })} />
    </div>
  );
}