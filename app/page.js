"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createClient } from '@/app/lib/supabase/client';

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
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', flexDirection: 'column', background: colors.bg }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid rgba(26,26,26,0.1)' }}>
        <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.5)', margin: 0 }}>Sign below</p>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
          <Icons.X style={{ width: '20px', height: '20px', color: colors.dark }} />
        </button>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '600px', border: '1px solid rgba(26,26,26,0.2)', background: 'white' }}>
          <canvas ref={canvasRef} width={700} height={200} style={{ width: '100%', height: '330px', touchAction: 'none', cursor: 'crosshair' }}
            onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop} onTouchStart={start} onTouchMove={draw} onTouchEnd={stop} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', padding: '16px 20px', borderTop: '1px solid rgba(26,26,26,0.1)' }}>
        <button onClick={clear} style={{ flex: 1, padding: '14px', background: 'transparent', border: '1px solid rgba(26,26,26,0.2)', color: colors.dark, fontSize: '14px', cursor: 'pointer' }}>Clear</button>
        <button onClick={save} disabled={!hasSig} style={{ flex: 1, padding: '14px', background: hasSig ? colors.dark : 'rgba(26,26,26,0.2)', border: 'none', color: hasSig ? colors.bg : 'rgba(26,26,26,0.4)', fontSize: '14px', cursor: hasSig ? 'pointer' : 'not-allowed' }}>Confirm</button>
      </div>
    </div>
  );
};

// Share Modal
const ShareModal = ({ isOpen, onClose, onCopy }) => {
  const guestLink = typeof window !== 'undefined' ? `${window.location.origin}/guest` : '';
  const copy = () => { navigator.clipboard.writeText(guestLink); onCopy(); onClose(); };
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Freedom Family - You\'re Invited!',
          text: 'You\'re invited to our Info Session! Register here:',
          url: guestLink,
        });
        onClose();
      } catch (err) {
        if (err.name !== 'AbortError') copy();
      }
    } else {
      copy();
    }
  };
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
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button onClick={copy} style={{ flex: 1, padding: '14px', background: 'transparent', border: '1px solid rgba(26,26,26,0.15)', color: colors.dark, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Icons.Link style={{ width: '14px', height: '14px' }} />Copy
            </button>
            <button onClick={handleShare} style={{ flex: 1, padding: '14px', background: colors.dark, color: colors.bg, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Icons.Share style={{ width: '14px', height: '14px' }} />Share
            </button>
          </div>
          <div style={{ paddingTop: '20px', borderTop: '1px solid rgba(26,26,26,0.1)' }}>
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
  const [step, setStep] = useState(ticketType ? (ticketType === 'webcast' ? 'webcast-select' : 2) : 1);
  const [webcastSub, setWebcastSub] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', invitedBy: '', visitNumber: '', ltdId: '', uplinePlatinum: '', paymentOption: '', agreed: false, signature: '' });
  const [sigModal, setSigModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [complete, setComplete] = useState(false);
  const [webcastToken, setWebcastToken] = useState('');
  const [webcastZoomLink, setWebcastZoomLink] = useState('');
  const [addSpouse, setAddSpouse] = useState(false);
  const [spouseForm, setSpouseForm] = useState({ firstName: '', lastName: '', ltdId: '' });
  const formRef = useRef(null);

  // After autofill blurs the email field, refocus the next empty visible input
  const handleEmailBlur = () => {
    setTimeout(() => {
      if (!formRef.current) return;
      const inputs = Array.from(formRef.current.querySelectorAll('input[type="text"], input[type="email"]'));
      const next = inputs.find(i => i.offsetParent !== null && !i.value && i.required !== false);
      if (next) next.focus();
    }, 80);
  };

  useEffect(() => {
    if (ticketType && isOpen) {
      if (ticketType === 'webcast') setStep('webcast-select');
      else setStep(2);
    }
  }, [ticketType, isOpen]);

  const reset = () => { setStep(1); setTicketType(''); setWebcastSub(''); setForm({ firstName: '', lastName: '', email: '', invitedBy: '', visitNumber: '', ltdId: '', uplinePlatinum: '', paymentOption: '', agreed: false, signature: '' }); setComplete(false); setWebcastToken(''); setWebcastZoomLink(''); setAddSpouse(false); setSpouseForm({ firstName: '', lastName: '', ltdId: '' }); };
  const close = () => { reset(); onClose(); };

  const effectiveType = webcastSub || ticketType;
  const needsLtdFields = effectiveType === 'apprentice' || effectiveType === 'ibo' || effectiveType === 'webcast-apprentice' || effectiveType === 'webcast-ibo';
  const needsPayment = effectiveType === 'ibo' || effectiveType === 'webcast-ibo';
  const isWebcast = effectiveType?.startsWith('webcast-');
  const isGuest = effectiveType === 'guest';

  const submit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // Paid paths: IBO in-person or IBO webcast
    if (needsPayment) {
      try {
        const priceType = effectiveType === 'webcast-ibo' ? 'webcast' : form.paymentOption;
        const checkoutBody = { priceType, customerEmail: form.email, customerName: `${form.firstName} ${form.lastName}`, ltdId: form.ltdId, uplinePlatinum: form.uplinePlatinum, source: effectiveType === 'webcast-ibo' ? 'webcast' : 'main' };
        if (addSpouse && spouseForm.firstName && spouseForm.lastName && spouseForm.ltdId) {
          checkoutBody.spouse = { name: `${spouseForm.firstName} ${spouseForm.lastName}`, ltdId: spouseForm.ltdId };
        }
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(checkoutBody),
        });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
        else throw new Error();
      } catch (e) { alert('Payment failed.'); setProcessing(false); }
      return;
    }

    // Free paths: guest, apprentice, webcast-guest, webcast-apprentice
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: form.firstName, lastName: form.lastName, email: form.email, type: effectiveType, invitedBy: form.invitedBy, visitNumber: form.visitNumber, ltdId: form.ltdId, uplinePlatinum: form.uplinePlatinum, source: 'main' }),
      });
      const data = await res.json();
      if (isWebcast && data.webcastToken) {
        setWebcastToken(data.webcastToken);
        try {
          const zRes = await fetch('/api/webcast').then(r => r.json());
          if (zRes.link) setWebcastZoomLink(zRes.link);
        } catch (e) {}
      }
      setComplete(true);
    } catch (e) { alert('Failed.'); }
    setProcessing(false);
  };

  if (!isOpen) return null;

  const tickets = [
    { id: 'guest', label: 'Guest', sub: 'First-time visitor', price: 'Complimentary' },
    { id: 'apprentice', label: 'Apprentice', sub: 'First-year IBO', price: 'Complimentary' },
    { id: 'ibo', label: 'Business Owner', sub: 'Active IBO', price: 'From $12' },
    { id: 'webcast', label: 'Webcast', sub: 'Watch live via Zoom', price: 'From Free' },
  ];

  const webcastTickets = [
    { id: 'webcast-guest', label: 'Guest', sub: 'First-time viewer', price: 'Free' },
    { id: 'webcast-apprentice', label: 'Apprentice', sub: 'First-year IBO', price: 'Free' },
    { id: 'webcast-ibo', label: 'Business Owner', sub: 'Active IBO', price: '$10' },
  ];

  const typeLabel = { 'guest': 'Guest', 'apprentice': 'Apprentice', 'ibo': 'Business Owner', 'webcast-guest': 'Webcast · Guest', 'webcast-apprentice': 'Webcast · Apprentice', 'webcast-ibo': 'Webcast · Business Owner' }[effectiveType] || '';

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
              {isWebcast ? (
                <>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '24px', color: colors.dark, marginBottom: '16px' }}>You&#39;re In!</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.5)', marginBottom: '20px', lineHeight: 1.6 }}>Your webcast registration is confirmed. Join live via Zoom at the scheduled time.</p>
                  {webcastZoomLink ? (
                    <a href={webcastZoomLink} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 28px', background: colors.dark, color: colors.bg, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}>
                      Join Zoom Meeting <Icons.ArrowRight style={{ width: '14px', height: '14px' }} />
                    </a>
                  ) : (
                    <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.4)', fontStyle: 'italic' }}>Zoom link will be available shortly before the event.</p>
                  )}
                  {webcastToken && (
                    <p style={{ marginTop: '16px', fontSize: '11px', color: 'rgba(26,26,26,0.3)', lineHeight: 1.5 }}>
                      Need the link later? Visit <a href={`/webcast?token=${webcastToken}`} style={{ color: colors.gold, textDecoration: 'none' }}>your webcast page</a> or use your email at <a href="/webcast" style={{ color: colors.gold, textDecoration: 'none' }}>/webcast</a>.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '24px', color: colors.dark, marginBottom: '8px' }}>{new Date().getDay() === 1 ? 'See You Tonight!' : 'See You Soon!'}</h3>
                  <p style={{ color: 'rgba(26,26,26,0.5)', fontSize: '13px', marginBottom: '20px' }}>Embassy Suites · College Station</p>
                </>
              )}
              <button onClick={close} style={{ marginTop: '16px', fontSize: '12px', color: 'rgba(26,26,26,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>Close</button>
            </div>
          ) : step === 1 ? (
            <div style={{ padding: '28px' }}>
              <p style={{ color: colors.gold, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '6px' }}>Register</p>
              <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '24px', color: colors.dark, marginBottom: '20px' }}>Select Your Path</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {tickets.map(t => (
                  <button key={t.id} onClick={() => { if (t.id === 'webcast') { setTicketType('webcast'); setStep('webcast-select'); } else { setTicketType(t.id); setStep(2); } }}
                    style={{ width: '100%', textAlign: 'left', padding: '14px', border: t.id === 'webcast' ? '1px solid rgba(59,130,246,0.2)' : '1px solid rgba(26,26,26,0.1)', background: t.id === 'webcast' ? 'rgba(59,130,246,0.03)' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div><h3 style={{ fontSize: '15px', color: colors.dark, margin: '0 0 2px' }}>{t.label}</h3><p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.5)', margin: 0 }}>{t.sub}</p></div>
                    <p style={{ fontSize: '13px', color: colors.gold, margin: 0 }}>{t.price}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : step === 'webcast-select' ? (
            <div style={{ padding: '28px' }}>
              <button type="button" onClick={() => { setStep(1); setTicketType(''); setWebcastSub(''); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'rgba(26,26,26,0.4)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '12px' }}><Icons.ArrowLeft style={{ width: '12px', height: '12px' }} /> Back</button>
              <p style={{ color: '#3b82f6', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '6px' }}>Webcast</p>
              <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '24px', color: colors.dark, marginBottom: '20px' }}>Select Your Role</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {webcastTickets.map(t => (
                  <button key={t.id} onClick={() => { setWebcastSub(t.id); setStep(2); }}
                    style={{ width: '100%', textAlign: 'left', padding: '14px', border: '1px solid rgba(59,130,246,0.15)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div><h3 style={{ fontSize: '15px', color: colors.dark, margin: '0 0 2px' }}>{t.label}</h3><p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.5)', margin: 0 }}>{t.sub}</p></div>
                    <p style={{ fontSize: '13px', color: t.price === 'Free' ? '#22c55e' : colors.gold, margin: 0 }}>{t.price}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form ref={formRef} onSubmit={submit} style={{ padding: '24px 28px' }}>
              <button type="button" onClick={() => { if (isWebcast) { setStep('webcast-select'); setWebcastSub(''); } else { setStep(1); setTicketType(''); } }} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'rgba(26,26,26,0.4)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '12px' }}><Icons.ArrowLeft style={{ width: '12px', height: '12px' }} /> Back</button>
              <p style={{ color: isWebcast ? '#3b82f6' : colors.gold, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '6px' }}>{typeLabel}</p>
              <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '22px', color: colors.dark, marginBottom: '16px' }}>Your Details</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                  <div><label style={label}>First Name</label><input type="text" name="fname" autoComplete="given-name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} style={input} required /></div>
                  <div><label style={label}>Last Name</label><input type="text" name="lname" autoComplete="family-name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} style={input} required /></div>
                </div>
                <div><label style={label}>Email</label><input type="email" name="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} onBlur={handleEmailBlur} style={input} required /></div>

                {isGuest && (
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

                {needsLtdFields && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                    <div><label style={label}>LTD ID</label><input type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={form.ltdId} onChange={(e) => setForm({ ...form, ltdId: e.target.value })} style={input} required /></div>
                    <div><label style={label}>Upline Platinum</label><input type="text" autoComplete="off" value={form.uplinePlatinum} onChange={(e) => setForm({ ...form, uplinePlatinum: e.target.value })} style={input} required /></div>
                  </div>
                )}

                {effectiveType === 'ibo' && (
                  <div>
                    <label style={label}>Payment Option</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[{ id: 'single', label: 'Single · $12', sub: 'This week' }, { id: 'monthly5', label: 'Monthly · $50', sub: '5 weeks' }].map(o => (
                        <label key={o.id} style={{ flex: 1, padding: '12px', textAlign: 'center', border: form.paymentOption === o.id ? `1px solid ${colors.dark}` : '1px solid rgba(26,26,26,0.15)', background: form.paymentOption === o.id ? colors.dark : 'white', color: form.paymentOption === o.id ? colors.bg : colors.dark, cursor: 'pointer' }}>
                          <input type="radio" name="payment" value={o.id} checked={form.paymentOption === o.id} onChange={(e) => setForm({ ...form, paymentOption: e.target.value })} style={{ display: 'none' }} required />
                          <p style={{ fontSize: '13px', fontWeight: 500, margin: 0 }}>{o.label}</p>
                          <p style={{ fontSize: '10px', opacity: 0.7, margin: '2px 0 0' }}>{o.sub}</p>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {needsPayment && (
                  <div style={{ borderTop: '1px solid rgba(26,26,26,0.08)', paddingTop: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={addSpouse} onChange={(e) => setAddSpouse(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: colors.gold }} />
                      <span style={{ fontSize: '13px', color: colors.dark }}>Also registering spouse</span>
                    </label>
                    {addSpouse && (
                      <div style={{ marginTop: '12px', padding: '14px', background: 'rgba(184,149,107,0.04)', border: '1px solid rgba(184,149,107,0.15)' }}>
                        <p style={{ ...label, color: colors.gold, marginBottom: '10px' }}>Spouse Details</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                          <div><label style={label}>First Name</label><input type="text" value={spouseForm.firstName} onChange={(e) => setSpouseForm({ ...spouseForm, firstName: e.target.value })} style={input} required /></div>
                          <div><label style={label}>Last Name</label><input type="text" value={spouseForm.lastName} onChange={(e) => setSpouseForm({ ...spouseForm, lastName: e.target.value })} style={input} required /></div>
                        </div>
                        <div><label style={label}>LTD ID</label><input type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={spouseForm.ltdId} onChange={(e) => setSpouseForm({ ...spouseForm, ltdId: e.target.value })} style={input} required /></div>
                      </div>
                    )}
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

                <button type="submit" disabled={processing || !form.agreed || !form.signature || (effectiveType === 'ibo' && !form.paymentOption)}
                  style={{ width: '100%', padding: '14px', background: processing || !form.agreed || !form.signature || (effectiveType === 'ibo' && !form.paymentOption) ? 'rgba(26,26,26,0.2)' : colors.dark, color: processing || !form.agreed || !form.signature || (effectiveType === 'ibo' && !form.paymentOption) ? 'rgba(26,26,26,0.4)' : colors.bg, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: processing || !form.agreed || !form.signature || (effectiveType === 'ibo' && !form.paymentOption) ? 'not-allowed' : 'pointer', marginTop: '4px' }}>
                  {processing ? 'Processing...' : needsPayment ? (() => { const base = effectiveType === 'webcast-ibo' ? 10 : form.paymentOption === 'monthly5' ? 50 : 12; const total = addSpouse ? base * 2 : base; return `Continue — $${total}${addSpouse ? ' (2 tickets)' : ''}`; })() : 'Complete Registration'}
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [webcastSuccess, setWebcastSuccess] = useState(false);
  const [zoomLink, setZoomLink] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('success') === 'true' && params.get('webcast') === 'true') {
        setWebcastSuccess(true);
        fetch('/api/webcast').then(r => r.json()).then(data => {
          if (data.link) setZoomLink(data.link);
        }).catch(() => {});
        window.history.replaceState({}, '', window.location.pathname);
      } else if (params.get('success') === 'true') { setToast({ visible: true, message: 'Payment successful!' }); window.history.replaceState({}, '', window.location.pathname); }
      if (params.get('canceled') === 'true') { setToast({ visible: true, message: 'Payment canceled' }); window.history.replaceState({}, '', window.location.pathname); }
      const reg = params.get('register');
      if (reg && ['guest', 'apprentice', 'ibo'].includes(reg)) { setTicketType(reg); setModalOpen(true); window.history.replaceState({}, '', window.location.pathname); }

      // Check if user is logged in
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) setIsLoggedIn(true);
      }).catch(() => {});
    }
  }, []);

  const schedule = [
    { time: '7:00 PM', label: 'IBOs Arrive' },
    { time: '7:15 PM', label: 'Doors Open / Guests Arrive' },
    { time: '7:30 PM', label: 'Info Session (The Plan)' },
    { time: '8:30 PM', label: 'Break' },
    { time: '8:45 PM', label: 'Training (IBOs Only)' },
    { time: '10:00 PM', label: 'Dismissed' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap');`}</style>
      
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40, background: 'rgba(250,250,248,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(26,26,26,0.05)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.dark, margin: 0 }}>Freedom Family</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => setModalOpen(true)} style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.gold, background: 'none', border: 'none', cursor: 'pointer' }}>Register</button>
            <a href={isLoggedIn ? '/resources' : '/resources/login'} style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.45)', textDecoration: 'none' }}>{isLoggedIn ? 'Dashboard' : 'Login'}</a>
          </div>
        </div>
      </nav>

      <section style={{ paddingTop: '140px', paddingBottom: '80px', textAlign: 'center', padding: '140px 20px 80px' }}>
        <p style={{ color: colors.gold, fontSize: '11px', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: '24px' }}>You&apos;re Invited</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(52px, 12vw, 100px)', color: colors.dark, lineHeight: 0.9, marginBottom: '20px', fontWeight: 400 }}>Freedom <em>Family</em></h1>
        <p style={{ fontSize: '16px', color: 'rgba(26,26,26,0.45)', letterSpacing: '0.05em', marginBottom: '40px', maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>Info Session &amp; Training</p>
        <button onClick={() => setModalOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '18px 48px', background: `linear-gradient(135deg, ${colors.dark} 0%, #2a2a2a 100%)`, color: colors.bg, fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(26,26,26,0.15)', position: 'relative', overflow: 'hidden' }}><span style={{ position: 'relative', zIndex: 1 }}>Register Now</span><Icons.ArrowRight style={{ width: '14px', height: '14px', position: 'relative', zIndex: 1 }} /><span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(to right, transparent, ${colors.gold}, transparent)` }} /></button>
      </section>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 20px' }}><div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(26,26,26,0.1), transparent)' }} /></div>

      <section style={{ padding: '70px 20px' }}>
        <div style={{ maxWidth: '580px', margin: '0 auto' }}>
          <p style={{ color: colors.gold, fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '14px' }}>This Monday</p>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(30px, 6vw, 44px)', color: colors.dark, marginBottom: '10px', fontWeight: 400, lineHeight: 1.1 }}>Showing The Plan</h2>
          <p style={{ fontSize: '17px', color: 'rgba(26,26,26,0.5)', marginBottom: '32px' }}>Derly Trevino</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Icons.Calendar style={{ width: '18px', height: '18px', color: colors.gold }} /><span style={{ fontSize: '15px', color: colors.dark }}>Monday, March 2, 2026 · 7:30 PM</span></div>
            <a href="https://maps.google.com/?q=Embassy+Suites,+201+University+Dr+E,+College+Station,+TX" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', textDecoration: 'none' }}><Icons.MapPin style={{ width: '18px', height: '18px', color: colors.gold, flexShrink: 0, marginTop: '2px' }} /><span style={{ fontSize: '15px', color: colors.dark }}>Embassy Suites<br />201 University Dr E, College Station</span></a>
          </div>
          
          <div style={{ background: 'rgba(26,26,26,0.02)', padding: '24px', marginBottom: '32px' }}>
            <p style={{ color: colors.gold, fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '14px' }}>Schedule</p>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px 16px' }}>
              {schedule.map((s, i) => (<React.Fragment key={i}><span style={{ fontSize: '14px', color: 'rgba(26,26,26,0.4)', fontVariantNumeric: 'tabular-nums' }}>{s.time}</span><span style={{ fontSize: '14px', color: colors.dark }}>{s.label}</span></React.Fragment>))}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={() => setModalOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 24px', background: colors.dark, color: colors.bg, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>Register Now<Icons.ArrowRight style={{ width: '14px', height: '14px' }} /></button>
            <button onClick={() => setShareOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 24px', background: 'transparent', color: colors.dark, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', border: '1px solid rgba(26,26,26,0.2)', cursor: 'pointer' }}><Icons.Share style={{ width: '14px', height: '14px' }} />Share Guest Link</button>
          </div>
          <p style={{ marginTop: '16px', fontSize: '12px', color: 'rgba(26,26,26,0.35)' }}>
            Unable to attend in person?{' '}
            <button onClick={() => { setTicketType('webcast'); setModalOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: colors.gold, textDecoration: 'underline', padding: 0 }}>
              Watch via webcast
            </button>
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 20px' }}><div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(26,26,26,0.1), transparent)' }} /></div>

      <section style={{ padding: '70px 20px' }}>
        <div style={{ maxWidth: '580px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: colors.gold, fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '14px' }}>Upcoming Events</p>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px, 5vw, 36px)', color: colors.dark, marginBottom: '8px', fontWeight: 400 }}>HFT</h2>
            <p style={{ fontSize: '15px', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>Joel Weinberg STP</p>
            <p style={{ fontSize: '15px', color: 'rgba(26,26,26,0.5)', marginBottom: '8px' }}>Tuesday, March 3, 2026</p>
            <a href="https://app.waiverelectronic.com/render/splash/HFT_Houston" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: colors.dark, color: colors.bg, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>Details &amp; Registration<Icons.ArrowRight style={{ width: '12px', height: '12px' }} /></a>
          </div>

          <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(26,26,26,0.08), transparent)', marginBottom: '40px' }} />

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px, 5vw, 36px)', color: colors.dark, marginBottom: '8px', fontWeight: 400 }}>Trevino Team Meeting</h2>
            <p style={{ fontSize: '15px', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>Saturday, March 21, 2026 · 1:00 PM</p>
            <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.4)', marginBottom: '16px' }}>Holiday Inn – Galleria, Houston, TX</p>
            <a href="https://app.waiverelectronic.com/render/splash/666104722c4d2f5b80675ddc" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: colors.dark, color: colors.bg, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>Register<Icons.ArrowRight style={{ width: '12px', height: '12px' }} /></a>
          </div>

          <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(26,26,26,0.08), transparent)', marginBottom: '40px' }} />

          <div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px, 5vw, 36px)', color: colors.dark, marginBottom: '8px', fontWeight: 400 }}>Winter&#39;s Spring Leadership</h2>
            <p style={{ fontSize: '15px', color: 'rgba(26,26,26,0.5)', marginBottom: '8px' }}>April 17–19, 2026</p>
            <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.4)', marginBottom: '16px' }}>Virtual Event · Save the Date!</p>
            <a href="https://www.ltdteam.com" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'transparent', color: colors.dark, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid rgba(26,26,26,0.2)' }}>More Info<Icons.ArrowRight style={{ width: '12px', height: '12px' }} /></a>
          </div>
        </div>
      </section>

      {/* Other Info Sessions */}
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 20px' }}><div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(26,26,26,0.1), transparent)' }} /></div>

      <section style={{ padding: '50px 20px' }}>
        <div style={{ maxWidth: '580px', margin: '0 auto' }}>
          <p style={{ color: colors.gold, fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '18px', textAlign: 'center' }}>Other Info Sessions in Texas</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a href="https://www.waiverelectronic.com/render/splash/Trevino_Houston" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'white', border: '1px solid rgba(26,26,26,0.1)', textDecoration: 'none', transition: 'border-color 0.2s' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 500, color: colors.dark, margin: '0 0 2px' }}>Trevino Info Session</p>
                <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.4)', margin: 0 }}>Houston, TX</p>
              </div>
              <Icons.ArrowRight style={{ width: '16px', height: '16px', color: 'rgba(26,26,26,0.3)' }} />
            </a>
            <a href="https://central-texas-ltd-team.square.site/product/gala-double-diamond-mindset-webcast-9-6-23/3" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'white', border: '1px solid rgba(26,26,26,0.1)', textDecoration: 'none', transition: 'border-color 0.2s' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 500, color: colors.dark, margin: '0 0 2px' }}>Central Texas Info Session</p>
                <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.4)', margin: 0 }}>Central Texas</p>
              </div>
              <Icons.ArrowRight style={{ width: '16px', height: '16px', color: 'rgba(26,26,26,0.3)' }} />
            </a>
          </div>
        </div>
      </section>

      <footer style={{ padding: '24px 16px', borderTop: '1px solid rgba(26,26,26,0.05)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <a href="https://www.ltdteam.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.25)', textDecoration: 'none', margin: 0 }}>LTD</a>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <a href="/resources" style={{ fontSize: '10px', color: 'rgba(26,26,26,0.2)', textDecoration: 'none' }}>Resources</a>
            <a href="/admin/leadership" style={{ fontSize: '10px', color: 'rgba(26,26,26,0.2)', textDecoration: 'none' }}>Leadership</a>
            <a href="/admin/checkin" style={{ fontSize: '10px', color: 'rgba(26,26,26,0.2)', textDecoration: 'none' }}>Admin</a>
          </div>
        </div>
      </footer>

      {/* Webcast Success Overlay */}
      {webcastSuccess && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.6)', backdropFilter: 'blur(8px)' }} onClick={() => setWebcastSuccess(false)} />
          <div style={{ position: 'relative', width: '100%', maxWidth: '420px', background: colors.bg, textAlign: 'center' }}>
            <div style={{ height: '2px', background: `linear-gradient(to right, transparent, ${colors.gold}, transparent)` }} />
            <div style={{ padding: '40px 28px' }}>
              <div style={{ width: '48px', height: '48px', margin: '0 auto 16px', borderRadius: '50%', border: `1px solid ${colors.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.Check style={{ width: '24px', height: '24px', color: colors.gold }} />
              </div>
              <p style={{ color: colors.gold, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>Webcast Confirmed</p>
              <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '24px', color: colors.dark, marginBottom: '16px' }}>You&#39;re In!</h3>
              <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.5)', marginBottom: '24px', lineHeight: 1.6 }}>
                Your webcast ticket has been confirmed. Join the live broadcast via Zoom at the scheduled time.
              </p>
              {zoomLink ? (
                <a href={zoomLink} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 28px', background: colors.dark, color: colors.bg, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', border: 'none', textDecoration: 'none', cursor: 'pointer' }}>
                  Join Zoom Meeting <Icons.ArrowRight style={{ width: '14px', height: '14px' }} />
                </a>
              ) : (
                <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.4)', fontStyle: 'italic' }}>Zoom link will be available shortly before the event.</p>
              )}
              <p style={{ marginTop: '20px', fontSize: '11px', color: 'rgba(26,26,26,0.3)' }}>
                The Zoom link will also appear in your <a href="/resources" style={{ color: colors.gold, textDecoration: 'none' }}>My Events</a> page.
              </p>
              <button onClick={() => setWebcastSuccess(false)} style={{ marginTop: '16px', fontSize: '12px', color: 'rgba(26,26,26,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      <RegistrationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} ticketType={ticketType} setTicketType={setTicketType} />
      <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} onCopy={() => setToast({ visible: true, message: 'Link copied!' })} />
      <Toast message={toast.message} isVisible={toast.visible} onClose={() => setToast({ visible: false, message: '' })} />
    </div>
  );
}