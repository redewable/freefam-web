"use client";

import React, { useState, useRef, useEffect } from 'react';

const colors = {
  bg: '#fafaf8',
  dark: '#1a1a1a',
  gold: '#b8956b',
};

// Icons
const Icons = {
  ArrowRight: ({ style }) => (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  ArrowLeft: ({ style }) => (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  X: ({ style }) => (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  Check: ({ style }) => (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  MapPin: ({ style }) => (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Calendar: ({ style }) => (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  Share: ({ style }) => (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
    </svg>
  ),
};

// Signature Pad
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
      {hasSignature && <button type="button" onClick={clear} style={{ marginTop: '6px', fontSize: '11px', color: 'rgba(26,26,26,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>}
    </div>
  );
};

// LTD Disclosures
const LTD_DISCLOSURES = `This event is produced by Leadership Team Development, Inc. (LTD), an approved provider for Amway IBOs. No audio or video recording is allowed. The techniques suggested may have worked for others but results are not guaranteed. Any income depicted may also include income from multiple sources. Purchase of business support materials is optional. Event registrations are non-transferable. By attending, holder voluntarily assumes all risks. No refunds except as provided in our policies. Event details subject to change without notice.`;

// Registration Modal
const RegistrationModal = ({ isOpen, onClose, ticketType, setTicketType }) => {
  const [step, setStep] = useState(ticketType ? 2 : 1);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', invitedBy: '', visitNumber: '', ltdId: '', uplinePlatinum: '', agreed: false, signature: '' });
  const [processing, setProcessing] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (ticketType && isOpen) setStep(2);
  }, [ticketType, isOpen]);

  const reset = () => { setStep(1); setTicketType(''); setForm({ firstName: '', lastName: '', email: '', invitedBy: '', visitNumber: '', ltdId: '', uplinePlatinum: '', agreed: false, signature: '' }); setComplete(false); };
  const close = () => { reset(); onClose(); };
  
  const submit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    if (ticketType === 'ibo') {
      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            priceType: 'single',
            customerEmail: form.email,
            customerName: `${form.firstName} ${form.lastName}`,
            ltdId: form.ltdId,
            uplinePlatinum: form.uplinePlatinum,
            source: 'bcs',
          }),
        });
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error(data.error || 'Payment failed');
        }
      } catch (error) {
        alert('Payment failed. Please try again.');
        setProcessing(false);
      }
      return;
    }

    await new Promise(r => setTimeout(r, 1000));
    setProcessing(false);
    setComplete(true);
  };

  if (!isOpen) return null;

  const tickets = [
    { id: 'guest', label: 'Guest', sub: 'First-time visitor', price: 'Free' },
    { id: 'apprentice', label: 'Apprentice', sub: 'First-year IBO', price: 'Free' },
    { id: 'ibo', label: 'Business Owner', sub: 'Active IBO', price: '$12' },
  ];

  const labelStyle = { fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', display: 'block', marginBottom: '4px' };
  const inputStyle = { width: '100%', padding: '8px 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(26,26,26,0.2)', outline: 'none', color: colors.dark, fontSize: '15px', boxSizing: 'border-box' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.6)', backdropFilter: 'blur(8px)' }} onClick={close} />
      
      <div style={{ position: 'relative', width: '100%', maxWidth: '440px', maxHeight: '90vh', background: colors.bg, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        <div style={{ height: '2px', background: `linear-gradient(to right, transparent, ${colors.gold}, transparent)` }} />
        
        <button onClick={close} style={{ position: 'absolute', top: '16px', right: '16px', color: 'rgba(26,26,26,0.4)', background: 'none', border: 'none', cursor: 'pointer', zIndex: 10 }}>
          <Icons.X style={{ width: '18px', height: '18px' }} />
        </button>

        <div style={{ overflowY: 'auto', maxHeight: 'calc(90vh - 2px)' }}>
          {complete ? (
            <div style={{ padding: '40px 28px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', margin: '0 auto 16px', borderRadius: '50%', border: `1px solid ${colors.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.Check style={{ width: '24px', height: '24px', color: colors.gold }} />
              </div>
              <p style={{ color: colors.gold, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>Confirmed</p>
              <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '24px', color: colors.dark, marginBottom: '8px' }}>See You There</h3>
              <p style={{ color: 'rgba(26,26,26,0.5)', fontSize: '13px', marginBottom: '20px' }}>BCS Freedom Team</p>
              
              <div style={{ textAlign: 'left', borderTop: '1px solid rgba(26,26,26,0.1)', paddingTop: '16px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', marginBottom: '2px' }}>Location</p>
                  <p style={{ color: colors.dark, margin: 0, fontSize: '13px' }}>Embassy Suites</p>
                  <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.5)', margin: 0 }}>201 University Dr E, College Station, TX</p>
                </div>
                <div>
                  <p style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', marginBottom: '2px' }}>Attire</p>
                  <p style={{ color: colors.dark, margin: 0, fontSize: '13px' }}>Business Professional</p>
                </div>
              </div>
              
              <button onClick={close} style={{ marginTop: '20px', fontSize: '12px', color: 'rgba(26,26,26,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>Close</button>
            </div>
          ) : step === 1 ? (
            <div style={{ padding: '28px' }}>
              <p style={{ color: colors.gold, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '6px' }}>Register</p>
              <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '24px', color: colors.dark, marginBottom: '20px' }}>Select Your Path</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {tickets.map((t) => (
                  <button key={t.id} onClick={() => { setTicketType(t.id); setStep(2); }}
                    style={{ width: '100%', textAlign: 'left', padding: '14px', border: '1px solid rgba(26,26,26,0.1)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '15px', color: colors.dark, margin: '0 0 2px 0' }}>{t.label}</h3>
                      <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.5)', margin: 0 }}>{t.sub}</p>
                    </div>
                    <p style={{ fontSize: '13px', color: colors.gold, margin: 0 }}>{t.price}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={submit} style={{ padding: '24px 28px' }}>
              <button type="button" onClick={() => { setStep(1); setTicketType(''); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'rgba(26,26,26,0.4)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '12px' }}>
                <Icons.ArrowLeft style={{ width: '12px', height: '12px' }} /> Back
              </button>

              <p style={{ color: colors.gold, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '6px' }}>
                {ticketType === 'guest' ? 'Guest' : ticketType === 'apprentice' ? 'Apprentice' : 'Business Owner'}
              </p>
              <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '22px', color: colors.dark, marginBottom: '16px' }}>Your Details</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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

                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} required />
                </div>

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
                          <label key={v} style={{ flex: 1, padding: '8px', textAlign: 'center', fontSize: '12px', border: form.visitNumber === v ? `1px solid ${colors.dark}` : '1px solid rgba(26,26,26,0.1)', color: form.visitNumber === v ? colors.dark : 'rgba(26,26,26,0.4)', cursor: 'pointer' }}>
                            <input type="radio" name="visit" value={v} checked={form.visitNumber === v} onChange={(e) => setForm({ ...form, visitNumber: e.target.value })} style={{ display: 'none' }} required />
                            {v}
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

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

                <div>
                  <p style={labelStyle}>Signature</p>
                  <SignaturePad onChange={(sig) => setForm({ ...form, signature: sig })} />
                </div>

                <div style={{ borderTop: '1px solid rgba(26,26,26,0.1)', paddingTop: '12px' }}>
                  <details style={{ fontSize: '10px', color: 'rgba(26,26,26,0.4)' }}>
                    <summary style={{ cursor: 'pointer', marginBottom: '6px' }}>LTD Disclosures</summary>
                    <p style={{ lineHeight: 1.5, margin: 0 }}>{LTD_DISCLOSURES}</p>
                  </details>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '10px' }}>
                    <input type="checkbox" checked={form.agreed} onChange={(e) => setForm({ ...form, agreed: e.target.checked })} required style={{ width: '14px', height: '14px', accentColor: colors.dark }} />
                    <span style={{ fontSize: '12px', color: 'rgba(26,26,26,0.6)' }}>I agree to the terms</span>
                  </label>
                </div>

                <button type="submit" disabled={processing || !form.agreed || !form.signature}
                  style={{ width: '100%', padding: '14px', background: processing || !form.agreed || !form.signature ? 'rgba(26,26,26,0.2)' : colors.dark, color: processing || !form.agreed || !form.signature ? 'rgba(26,26,26,0.4)' : colors.bg, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: processing || !form.agreed || !form.signature ? 'not-allowed' : 'pointer', marginTop: '4px' }}>
                  {processing ? 'Processing...' : ticketType === 'ibo' ? 'Continue — $12' : 'Complete Registration'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// Main BCS Page
export default function BCSFreedomTeam() {
  const [modalOpen, setModalOpen] = useState(false);
  const [ticketType, setTicketType] = useState('');

  const copyGuestLink = () => {
    const url = `${window.location.origin}/bcs?register=guest`;
    navigator.clipboard.writeText(url);
    alert('Guest link copied!');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      
      if (params.get('success') === 'true') {
        alert('Payment successful! See you at the training.');
        window.history.replaceState({}, '', window.location.pathname);
      }
      
      if (params.get('canceled') === 'true') {
        alert('Payment was canceled.');
        window.history.replaceState({}, '', window.location.pathname);
      }
      
      const registerType = params.get('register');
      if (registerType && ['guest', 'apprentice', 'ibo'].includes(registerType)) {
        setTicketType(registerType);
        setModalOpen(true);
        window.history.replaceState({}, '', window.location.pathname);
      }
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
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
      `}</style>
      
      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40, background: 'rgba(250,250,248,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(26,26,26,0.05)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.dark, margin: 0 }}>BCS Freedom Team</p>
          <button onClick={() => setModalOpen(true)} style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.gold, background: 'none', border: 'none', cursor: 'pointer' }}>
            Register
          </button>
        </div>
      </nav>

      {/* Hero - Compact */}
      <section style={{ paddingTop: '80px', paddingBottom: '40px', textAlign: 'center', padding: '80px 20px 40px' }}>
        <p style={{ color: colors.gold, fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '16px' }}>Monthly Training</p>
        
        <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(36px, 8vw, 72px)', color: colors.dark, lineHeight: 0.95, marginBottom: '16px', fontWeight: 400 }}>
          BCS Freedom <em>Team</em>
        </h1>
        
        <p style={{ fontSize: '16px', color: 'rgba(26,26,26,0.5)', marginBottom: '24px' }}>
          Shared vision. Building together. 100 Strong!
        </p>

        <button onClick={() => setModalOpen(true)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 28px', background: colors.dark, color: colors.bg, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>
          Register Now
          <Icons.ArrowRight style={{ width: '14px', height: '14px' }} />
        </button>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(26,26,26,0.1), transparent)' }} />
      </div>

      {/* This Monday Event - Compact */}
      <section style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <p style={{ color: colors.gold, fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '12px' }}>This Monday</p>
          
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(28px, 6vw, 40px)', color: colors.dark, marginBottom: '8px', fontWeight: 400, lineHeight: 1.1 }}>
            Showing The Plan
          </h2>
          
          <p style={{ fontSize: '16px', color: 'rgba(26,26,26,0.5)', marginBottom: '24px' }}>
            Adrian &amp; Julia Williams
          </p>

          {/* Event Details - Inline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Icons.Calendar style={{ width: '16px', height: '16px', color: colors.gold, flexShrink: 0 }} />
              <span style={{ fontSize: '14px', color: colors.dark }}>Monday, February 2, 2025 · 7:30 PM</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Icons.MapPin style={{ width: '16px', height: '16px', color: colors.gold, flexShrink: 0 }} />
              <span style={{ fontSize: '14px', color: colors.dark }}>Embassy Suites · College Station, TX</span>
            </div>
          </div>

          {/* Schedule - Compact Grid */}
          <div style={{ background: 'rgba(26,26,26,0.02)', padding: '16px', marginBottom: '24px' }}>
            <p style={{ color: colors.gold, fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>Schedule</p>
            <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '6px 12px' }}>
              {schedule.map((item, i) => (
                <React.Fragment key={i}>
                  <span style={{ fontSize: '13px', color: 'rgba(26,26,26,0.4)', fontVariantNumeric: 'tabular-nums' }}>{item.time}</span>
                  <span style={{ fontSize: '13px', color: colors.dark }}>{item.label}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => setModalOpen(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 20px', background: colors.dark, color: colors.bg, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>
              Register Now
              <Icons.ArrowRight style={{ width: '12px', height: '12px' }} />
            </button>
            
            <button onClick={copyGuestLink}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 20px', background: 'transparent', color: colors.dark, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', border: `1px solid rgba(26,26,26,0.2)`, cursor: 'pointer' }}>
              <Icons.Share style={{ width: '12px', height: '12px' }} />
              Share Guest Link
            </button>
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer style={{ padding: '32px 20px', borderTop: '1px solid rgba(26,26,26,0.05)' }}>
        <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.25)', margin: 0, textAlign: 'center' }}>LTD · 100 Strong</p>
      </footer>

      {/* Modal */}
      <RegistrationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} ticketType={ticketType} setTicketType={setTicketType} />
    </div>
  );
}