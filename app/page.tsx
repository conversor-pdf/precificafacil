'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      background: '#f8fafc'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#10b981' }}>Precifica Fácil</h2>
        <p style={{ color: '#64748b' }}>Redirecionando para o login...</p>
      </div>
    </div>
  );
}
