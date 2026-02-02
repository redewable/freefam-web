"use client";

import React, { useState, useRef, useEffect } from 'react';

// ============================================
// MINIMAL ICONS
// ============================================
const Icons = {
  ArrowRight: ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  ArrowLeft: ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  X: ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  Check: ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  MapPin: ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Calendar: ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  Link: ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  ),
  Share: ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
    </svg>
  ),
};

// ============================================
// COLORS
// ============================================
const colors = {
  bg: '#fafaf8',
  dark: '#1a1a1a',
  gold: '#b8956b',
};

// ============================================
// TOAST NOTIFICATION
// ============================================
const Toast = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div style={{ position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)', zIndex: 50 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px', background: colors.dark, color: colors.bg, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        <Icons.Check style={{ width: '16px', height: '16px', color: colors.gold }} />
        <span style={{ fontSize: '14px' }}>{message}</span>
      </div>
    </div>
  );
};

// ============================================
// SHARE MODAL
// ============================================
const ShareModal = ({ isOpen, onClose, onCopy }) => {
  const [guestLink, setGuestLink] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setGuestLink(`${window.location.origin}?register=guest`);
    }
  }, []);

  if (!isOpen) return null;

  const copyLink = () => {
    navigator.clipboard.writeText(guestLink);
    onCopy();
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.6)', backdropFilter: 'blur(8px)' }} onClick={onClose} />
      
      <div style={{ position: 'relative', width: '100%', maxWidth: '448px', background: colors.bg, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        <div style={{ height: '2px', background: `linear-gradient(to right, transparent, ${colors.gold}, transparent)` }} />
        
        <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', color: 'rgba(26,26,26,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>
          <Icons.X style={{ width: '20px', height: '20px' }} />
        </button>

        <div style={{ padding: '48px 40px' }}>
          <p style={{ color: colors.gold, fontSize: '12px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '12px' }}>Invite</p>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '30px', color: colors.dark, marginBottom: '24px' }}>Share With a Guest</h2>
          
          <p style={{ color: 'rgba(26,26,26,0.5)', fontSize: '14px', marginBottom: '32px' }}>
            Send this link to invite someone to register for Monday&#39;s information session.
          </p>

          <div style={{ padding: '16px', background: 'rgba(26,26,26,0.05)', border: '1px solid rgba(26,26,26,0.1)', marginBottom: '24px' }}>
            <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.4)', marginBottom: '8px' }}>Guest Registration Link</p>
            <p style={{ fontSize: '14px', color: colors.dark, wordBreak: 'break-all', fontFamily: 'monospace' }}>{guestLink}</p>
          </div>

          <button onClick={copyLink} style={{ width: '100%', padding: '16px', background: colors.dark, color: colors.bg, fontSize: '14px', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <Icons.Link style={{ width: '16px', height: '16px' }} />
            Copy Link
          </button>

          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(26,26,26,0.1)' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', marginBottom: '16px' }}>Or share via</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href={`sms:?body=${encodeURIComponent(`You're invited to our Monday night info session. Register here: ${guestLink}`)}`} style={{ flex: 1, padding: '12px', textAlign: 'center', fontSize: '14px', color: 'rgba(26,26,26,0.6)', border: '1px solid rgba(26,26,26,0.1)', textDecoration: 'none' }}>
                Text
              </a>
              <a href={`mailto:?subject=${encodeURIComponent("You're Invited")}&body=${encodeURIComponent(`You're invited to our Monday night info session. Register here: ${guestLink}`)}`} style={{ flex: 1, padding: '12px', textAlign: 'center', fontSize: '14px', color: 'rgba(26,26,26,0.6)', border: '1px solid rgba(26,26,26,0.1)', textDecoration: 'none' }}>
                Email
              </a>
              <a href={`https://wa.me/?text=${encodeURIComponent(`You're invited to our Monday night info session. Register here: ${guestLink}`)}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '12px', textAlign: 'center', fontSize: '14px', color: 'rgba(26,26,26,0.6)', border: '1px solid rgba(26,26,26,0.1)', textDecoration: 'none' }}>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SIGNATURE PAD
// ============================================
const SignaturePad = ({ onChange }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = colors.dark;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
    }
  }, []);

  const getCoords = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left) * (canvasRef.current.width / rect.width), y: (clientY - rect.top) * (canvasRef.current.height / rect.height) };
  };

  const start = (e) => { e.preventDefault(); const ctx = canvasRef.current.getContext('2d'); const { x, y } = getCoords(e); ctx.beginPath(); ctx.moveTo(x, y); setIsDrawing(true); };
  const draw = (e) => { if (!isDrawing) return; e.preventDefault(); const ctx = canvasRef.current.getContext('2d'); const { x, y } = getCoords(e); ctx.lineTo(x, y); ctx.stroke(); setHasSignature(true); };
  const stop = () => { if (isDrawing && hasSignature) onChange(canvasRef.current.toDataURL()); setIsDrawing(false); };
  const clear = () => { canvasRef.current.getContext('2d').clearRect(0, 0, 500, 80); setHasSignature(false); onChange(''); };

  return (
    <div>
      <div style={{ position: 'relative', borderBottom: `1px solid ${colors.dark}`, background: colors.bg }}>
        <canvas ref={canvasRef} width={500} height={80} style={{ width: '100%', height: '56px', cursor: 'crosshair', touchAction: 'none' }}
          onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop}
          onTouchStart={start} onTouchMove={draw} onTouchEnd={stop} />
        {!hasSignature && <p style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(26,26,26,0.3)', fontSize: '13px', fontStyle: 'italic', pointerEvents: 'none', margin: 0 }}>Sign here</p>}
      </div>
      {hasSignature && <button type="button" onClick={clear} style={{ marginTop: '8px', fontSize: '12px', color: 'rgba(26,26,26,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>}
    </div>
  );
};

// ============================================
// DISCLOSURES
// ============================================
const LTD_DISCLOSURES = `This event is produced by Leadership Team Development, Inc. (LTD). No audio or video recording is allowed. The techniques suggested may have worked for others but results are not guaranteed. Success depicted may reflect income from multiple sources. Purchase is optional. Registrations are non-transferable. Holder assumes all risks. No refunds except as provided. Event details subject to change.`;

// ============================================
// REGISTRATION MODAL
// ============================================
const RegistrationModal = ({ isOpen, onClose, ticketType, setTicketType }) => {
  const [step, setStep] = useState(ticketType ? 2 : 1);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', invitedBy: '', visitNumber: '', ltdId: '', uplinePlatinum: '', paymentOption: '', agreed: false, signature: '' });
  const [processing, setProcessing] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (ticketType && isOpen) setStep(2);
  }, [ticketType, isOpen]);

  const reset = () => { setStep(1); setTicketType(''); setForm({ firstName: '', lastName: '', email: '', invitedBy: '', visitNumber: '', ltdId: '', uplinePlatinum: '', paymentOption: '', agreed: false, signature: '' }); setComplete(false); };
  const close = () => { reset(); onClose(); };
  const submit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // For IBO registrations, redirect to Stripe
    if (ticketType === 'ibo') {
      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            priceType: form.paymentOption,
            customerEmail: form.email,
            customerName: `${form.firstName} ${form.lastName}`,
            ltdId: form.ltdId,
            uplinePlatinum: form.uplinePlatinum,
          }),
        });
        
        const data = await response.json();
        
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error(data.error || 'Payment failed');
        }
      } catch (error) {
        console.error('Payment error:', error);
        alert('Payment failed. Please try again.');
        setProcessing(false);
      }
      return;
    }

    // For Guest and Apprentice (free registrations)
    // TODO: Save to your database here
    await new Promise(r => setTimeout(r, 1200));
    setProcessing(false);
    setComplete(true);
  };

  if (!isOpen) return null;

  const tickets = [
    { id: 'guest', label: 'Guest', sub: 'First-time visitor', price: 'Complimentary' },
    { id: 'apprentice', label: 'Apprentice', sub: 'First-year IBO', price: 'Complimentary' },
    { id: 'ibo', label: 'Business Owner', sub: 'Active IBO', price: 'From $12' },
  ];

  const labelStyle = { fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', display: 'block', marginBottom: '4px' };
  const inputStyle = { width: '100%', padding: '8px 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(26,26,26,0.2)', outline: 'none', color: colors.dark, fontSize: '15px' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.6)', backdropFilter: 'blur(8px)' }} onClick={close} />
      
      <div style={{ position: 'relative', width: '100%', maxWidth: '480px', maxHeight: '90vh', background: colors.bg, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        <div style={{ height: '2px', background: `linear-gradient(to right, transparent, ${colors.gold}, transparent)` }} />
        
        <button onClick={close} style={{ position: 'absolute', top: '16px', right: '16px', color: 'rgba(26,26,26,0.4)', background: 'none', border: 'none', cursor: 'pointer', zIndex: 10 }}>
          <Icons.X style={{ width: '18px', height: '18px' }} />
        </button>

        <div style={{ overflowY: 'auto', maxHeight: 'calc(90vh - 2px)' }}>
          {complete ? (
            <div style={{ padding: '40px 32px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', margin: '0 auto 20px', borderRadius: '50%', border: `1px solid ${colors.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.Check style={{ width: '24px', height: '24px', color: colors.gold }} />
              </div>
              <p style={{ color: colors.gold, fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '10px' }}>Confirmed</p>
              <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '26px', color: colors.dark, marginBottom: '10px' }}>We&#39;ll See You There</h3>
              <p style={{ color: 'rgba(26,26,26,0.5)', fontSize: '14px', marginBottom: '24px' }}>Monday, February 2nd at 7:30 PM</p>
              
              <div style={{ textAlign: 'left', borderTop: '1px solid rgba(26,26,26,0.1)', paddingTop: '20px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', marginBottom: '2px' }}>Location</p>
                  <p style={{ color: colors.dark, margin: 0, fontSize: '14px' }}>Embassy Suites</p>
                  <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.6)', margin: 0 }}>201 University Dr E, College Station, TX</p>
                </div>
                <div>
                  <p style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', marginBottom: '2px' }}>Attire</p>
                  <p style={{ color: colors.dark, margin: 0, fontSize: '14px' }}>Business Professional</p>
                </div>
              </div>
              
              <button onClick={close} style={{ marginTop: '24px', fontSize: '13px', color: 'rgba(26,26,26,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}>Close</button>
            </div>
          ) : step === 1 ? (
            <div style={{ padding: '32px' }}>
              <p style={{ color: colors.gold, fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '8px' }}>Register</p>
              <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '26px', color: colors.dark, marginBottom: '24px' }}>Select Your Path</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {tickets.map((t) => (
                  <button key={t.id} onClick={() => { setTicketType(t.id); setStep(2); }}
                    style={{ width: '100%', textAlign: 'left', padding: '16px', border: '1px solid rgba(26,26,26,0.1)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', color: colors.dark, margin: '0 0 2px 0' }}>{t.label}</h3>
                      <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.5)', margin: 0 }}>{t.sub}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '13px', color: colors.gold, margin: 0 }}>{t.price}</p>
                      <Icons.ArrowRight style={{ width: '14px', height: '14px', color: 'rgba(26,26,26,0.2)', marginLeft: 'auto', marginTop: '2px' }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={submit} style={{ padding: '28px 32px' }}>
              <button type="button" onClick={() => { setStep(1); setTicketType(''); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'rgba(26,26,26,0.4)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px' }}>
                <Icons.ArrowLeft style={{ width: '14px', height: '14px' }} /> Back
              </button>

              <p style={{ color: colors.gold, fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '8px' }}>
                {ticketType === 'guest' ? 'Guest' : ticketType === 'apprentice' ? 'Apprentice' : 'Business Owner'}
              </p>
              <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '26px', color: colors.dark, marginBottom: '20px' }}>Your Details</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Name */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>First Name</label>
                    <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} style={inputStyle} required />
                  </div>
                  <div>
                    <label style={labelStyle}>Last Name</label>
                    <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} style={inputStyle} required />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} required />
                </div>

                {/* Guest fields */}
                {ticketType === 'guest' && (
                  <>
                    <div>
                      <label style={labelStyle}>Who Invited You</label>
                      <input type="text" value={form.invitedBy} onChange={(e) => setForm({ ...form, invitedBy: e.target.value })} style={inputStyle} required />
                    </div>
                    <div>
                      <label style={labelStyle}>Visit Number</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {['1st', '2nd', '3rd'].map((v) => (
                          <label key={v} style={{ flex: 1, padding: '10px', textAlign: 'center', fontSize: '13px', border: form.visitNumber === v ? `1px solid ${colors.dark}` : '1px solid rgba(26,26,26,0.1)', color: form.visitNumber === v ? colors.dark : 'rgba(26,26,26,0.4)', cursor: 'pointer' }}>
                            <input type="radio" name="visit" value={v} checked={form.visitNumber === v} onChange={(e) => setForm({ ...form, visitNumber: e.target.value })} style={{ display: 'none' }} required />
                            {v}
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* IBO fields */}
                {(ticketType === 'apprentice' || ticketType === 'ibo') && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={labelStyle}>LTD ID</label>
                      <input type="text" value={form.ltdId} onChange={(e) => setForm({ ...form, ltdId: e.target.value })} style={inputStyle} required />
                    </div>
                    <div>
                      <label style={labelStyle}>Upline Platinum</label>
                      <input type="text" value={form.uplinePlatinum} onChange={(e) => setForm({ ...form, uplinePlatinum: e.target.value })} style={inputStyle} required />
                    </div>
                  </div>
                )}

                {/* Payment */}
                {ticketType === 'ibo' && (
                  <div>
                    <label style={labelStyle}>Select</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[{ id: 'single', label: 'Single', price: '$12' }, { id: 'monthly', label: 'Monthly', price: '$40' }].map((o) => (
                        <label key={o.id} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: form.paymentOption === o.id ? `1px solid ${colors.dark}` : '1px solid rgba(26,26,26,0.1)', cursor: 'pointer' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: form.paymentOption === o.id ? `1px solid ${colors.dark}` : '1px solid rgba(26,26,26,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {form.paymentOption === o.id && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: colors.dark }} />}
                            </div>
                            <input type="radio" name="payment" value={o.id} checked={form.paymentOption === o.id} onChange={(e) => setForm({ ...form, paymentOption: e.target.value })} style={{ display: 'none' }} required />
                            <span style={{ color: colors.dark, fontSize: '14px' }}>{o.label}</span>
                          </div>
                          <span style={{ color: colors.gold, fontSize: '14px' }}>{o.price}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Signature */}
                <div>
                  <p style={labelStyle}>Signature</p>
                  <SignaturePad onChange={(sig) => setForm({ ...form, signature: sig })} />
                </div>

                {/* Disclosures - compact */}
                <div style={{ borderTop: '1px solid rgba(26,26,26,0.1)', paddingTop: '12px' }}>
                  <details style={{ fontSize: '11px', color: 'rgba(26,26,26,0.4)' }}>
                    <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>LTD Disclosures</summary>
                    <p style={{ lineHeight: 1.5, marginBottom: '8px' }}>{LTD_DISCLOSURES}</p>
                  </details>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.agreed} onChange={(e) => setForm({ ...form, agreed: e.target.checked })} required style={{ width: '14px', height: '14px', accentColor: colors.dark }} />
                    <span style={{ fontSize: '13px', color: 'rgba(26,26,26,0.6)' }}>I agree to the terms</span>
                  </label>
                </div>

                {/* Submit */}
                <button type="submit" disabled={processing || !form.agreed || !form.signature}
                  style={{ width: '100%', padding: '14px', background: processing || !form.agreed || !form.signature ? 'rgba(26,26,26,0.2)' : colors.dark, color: processing || !form.agreed || !form.signature ? 'rgba(26,26,26,0.4)' : colors.bg, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: processing || !form.agreed || !form.signature ? 'not-allowed' : 'pointer' }}>
                  {processing ? 'Processing...' : ticketType === 'ibo' ? `Complete — ${form.paymentOption === 'monthly' ? '$40' : '$12'}` : 'Complete Registration'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN PAGE
// ============================================
export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [ticketType, setTicketType] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      
      // Handle Stripe success
      if (params.get('success') === 'true') {
        setPaymentSuccess(true);
        window.history.replaceState({}, '', window.location.pathname);
      }
      
      // Handle Stripe cancel
      if (params.get('canceled') === 'true') {
        setToast({ visible: true, message: 'Payment was canceled' });
        window.history.replaceState({}, '', window.location.pathname);
      }
      
      // Handle registration type
      const registerType = params.get('register');
      if (registerType && ['guest', 'apprentice', 'ibo'].includes(registerType)) {
        setTicketType(registerType);
        setModalOpen(true);
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  const showToast = (message) => setToast({ visible: true, message });

  const schedule = [
    { time: '7:00 PM', label: 'IBOs Arrive' },
    { time: '7:15 PM', label: 'Guests Arrive' },
    { time: '7:30 PM', label: 'The Plan' },
    { time: '8:45 PM', label: 'Training' },
    { time: '10:00 PM', label: 'Close' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40, background: 'rgba(250,250,248,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(26,26,26,0.05)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '12px', letterSpacing: '0.3em', textTransform: 'uppercase', color: colors.dark, margin: 0 }}>Freedom Family</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <button onClick={() => setShareModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.6)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <Icons.Share style={{ width: '16px', height: '16px' }} />
              Invite
            </button>
            <button onClick={() => setModalOpen(true)} style={{ fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.6)', background: 'none', border: 'none', cursor: 'pointer' }}>
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 32px 0' }}>
        <div style={{ maxWidth: '896px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: colors.gold, fontSize: '12px', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '32px' }}>The Round Table</p>
          
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(60px, 12vw, 144px)', color: colors.dark, lineHeight: 0.9, marginBottom: '32px', fontWeight: 400 }}>
            Build Your
            <br />
            <em>Legacy</em>
          </h1>
          
          <p style={{ fontSize: '20px', color: 'rgba(26,26,26,0.5)', maxWidth: '512px', margin: '0 auto 48px', lineHeight: 1.6 }}>
            Where vision meets action. Where ordinary becomes extraordinary.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => setModalOpen(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', padding: '20px 40px', background: colors.dark, color: colors.bg, fontSize: '14px', letterSpacing: '0.15em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>
              Join Us Monday
              <Icons.ArrowRight style={{ width: '16px', height: '16px' }} />
            </button>
            
            <button onClick={() => setShareModalOpen(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '20px 40px', background: 'transparent', color: 'rgba(26,26,26,0.6)', fontSize: '14px', letterSpacing: '0.15em', textTransform: 'uppercase', border: '1px solid rgba(26,26,26,0.2)', cursor: 'pointer' }}>
              <Icons.Share style={{ width: '16px', height: '16px' }} />
              Invite a Guest
            </button>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>
        <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(26,26,26,0.1), transparent)' }} />
      </div>

      {/* Events */}
      <section style={{ padding: '128px 32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '96px' }}>
            
            {/* Monday */}
            <div>
              <p style={{ color: colors.gold, fontSize: '12px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '24px' }}>This Monday</p>
              <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '48px', color: colors.dark, marginBottom: '16px', fontWeight: 400 }}>Showing The Plan</h2>
              <p style={{ fontSize: '20px', color: 'rgba(26,26,26,0.5)', marginBottom: '40px' }}>Adrian &amp; Julia Williams</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <Icons.Calendar style={{ width: '20px', height: '20px', color: colors.gold, marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <p style={{ color: colors.dark, margin: 0 }}>Monday, February 2, 2025</p>
                    <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.5)', margin: 0 }}>7:30 PM — Arrive by 7:15</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <Icons.MapPin style={{ width: '20px', height: '20px', color: colors.gold, marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <p style={{ color: colors.dark, margin: 0 }}>Embassy Suites</p>
                    <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.5)', margin: 0 }}>201 University Dr E, College Station, TX</p>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div style={{ borderTop: '1px solid rgba(26,26,26,0.1)', paddingTop: '32px', marginBottom: '40px' }}>
                <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', marginBottom: '24px' }}>Schedule</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {schedule.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: 'rgba(26,26,26,0.6)' }}>{item.label}</span>
                      <span style={{ fontSize: '14px', color: 'rgba(26,26,26,0.4)' }}>{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                <button onClick={() => setModalOpen(true)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', color: colors.dark, fontSize: '14px', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'none', border: 'none', borderBottom: `1px solid ${colors.dark}`, paddingBottom: '4px', cursor: 'pointer' }}>
                  Register Now
                  <Icons.ArrowRight style={{ width: '16px', height: '16px' }} />
                </button>
                
                <button onClick={() => setShareModalOpen(true)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', color: 'rgba(26,26,26,0.5)', fontSize: '14px', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Icons.Link style={{ width: '16px', height: '16px' }} />
                  Share Guest Link
                </button>
              </div>
            </div>

            {/* Conference */}
            <div>
              <p style={{ color: colors.gold, fontSize: '12px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '24px' }}>Major Event</p>
              <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '48px', color: colors.dark, marginBottom: '16px', fontWeight: 400 }}>Breakthrough</h2>
              <p style={{ fontSize: '20px', color: 'rgba(26,26,26,0.5)', marginBottom: '40px' }}>Conference</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <Icons.Calendar style={{ width: '20px', height: '20px', color: colors.gold, marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <p style={{ color: colors.dark, margin: 0 }}>February 6–8, 2025</p>
                    <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.5)', margin: 0 }}>Three transformative days</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <Icons.MapPin style={{ width: '20px', height: '20px', color: colors.gold, marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <p style={{ color: colors.dark, margin: 0 }}>Franklin, Tennessee</p>
                  </div>
                </div>
              </div>

              <a href="https://www.ltdteam.com/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', color: colors.dark, fontSize: '14px', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: `1px solid ${colors.dark}`, paddingBottom: '4px' }}>
                Get Tickets
                <Icons.ArrowRight style={{ width: '16px', height: '16px' }} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '64px 32px', borderTop: '1px solid rgba(26,26,26,0.05)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <p style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', margin: 0 }}>· LTD ·</p>
          <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.3)', margin: 0 }}>© 2026 Freedom Family. All rights reserved.</p>
        </div>
      </footer>

      {/* Modals */}
      <RegistrationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} ticketType={ticketType} setTicketType={setTicketType} />
      <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} onCopy={() => showToast('Link copied to clipboard')} />
      
      {/* Payment Success Modal */}
      {paymentSuccess && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.6)', backdropFilter: 'blur(8px)' }} onClick={() => setPaymentSuccess(false)} />
          <div style={{ position: 'relative', width: '100%', maxWidth: '448px', background: colors.bg, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ height: '2px', background: `linear-gradient(to right, transparent, ${colors.gold}, transparent)` }} />
            <div style={{ padding: '64px 40px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', margin: '0 auto 32px', borderRadius: '50%', border: `1px solid ${colors.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.Check style={{ width: '32px', height: '32px', color: colors.gold }} />
              </div>
              <p style={{ color: colors.gold, fontSize: '12px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '16px' }}>Payment Successful</p>
              <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '30px', color: colors.dark, marginBottom: '16px' }}>We&#39;ll See You There</h3>
              <p style={{ color: 'rgba(26,26,26,0.5)', fontSize: '14px', marginBottom: '40px' }}>Monday, February 2nd at 7:30 PM</p>
              
              <div style={{ textAlign: 'left', borderTop: '1px solid rgba(26,26,26,0.1)', paddingTop: '32px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', marginBottom: '4px' }}>Location</p>
                  <p style={{ color: colors.dark, margin: 0 }}>Embassy Suites</p>
                  <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.6)', margin: 0 }}>201 University Dr E, College Station, TX</p>
                </div>
                <div>
                  <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', marginBottom: '4px' }}>Attire</p>
                  <p style={{ color: colors.dark, margin: 0 }}>Business Professional</p>
                </div>
              </div>
              
              <button onClick={() => setPaymentSuccess(false)} style={{ marginTop: '40px', fontSize: '14px', color: 'rgba(26,26,26,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast */}
      <Toast message={toast.message} isVisible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />
    </div>
  );
}