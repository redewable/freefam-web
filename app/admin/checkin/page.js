"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckinRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/leadership?tab=checkin');
  }, [router]);

  return (
    <div style={{ minHeight: '100vh', background: '#fafaf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <p style={{ color: 'rgba(26,26,26,0.4)', fontSize: '13px' }}>Redirecting to Leadership Portal...</p>
    </div>
  );
}
