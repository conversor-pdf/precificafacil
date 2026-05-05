'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../admin/layout.module.css';
import { useAppContext } from '@/lib/AppContext';

// Professional SVG Icons
const IconHome = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const IconSend = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
);
const IconFile = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
);
const IconList = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
);
const IconUndo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5c0-1.1.9-2 2-2h2"/><path d="M17 3h2c1.1 0 2 .9 2 2v2"/><path d="M21 17v2c0 1.1-.9 2-2 2h-2"/><path d="M7 21H5c-1.1 0-2-.9-2-2v-2"/><polyline points="15 13 10 13 10 8"/><path d="m10 13 6-6"/></svg>
);
const IconLogout = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);
const IconBell = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
);

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { orders } = useAppContext();

  // Employee notifications: orders that are 'concluido' (returned by ADM but not confirmed by employee)
  const notificationCount = orders.filter(o => o.status === 'concluido').length;

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          Precifica<span>Fácil</span>
        </div>

        <nav className={styles.nav}>
          <Link href="/employee" className={`${styles.navItem} ${pathname === '/employee' ? styles.navItemActive : ''}`}>
            <IconHome /> Início
          </Link>
          <Link href="/employee/novo" className={`${styles.navItem} ${pathname === '/employee/novo' ? styles.navItemActive : ''}`}>
            <IconSend /> Enviar
          </Link>
          <Link href="/employee/importar" className={`${styles.navItem} ${pathname === '/employee/importar' ? styles.navItemActive : ''}`}>
            <IconFile /> Importar XML
          </Link>
          <Link href="/employee/enviados" className={`${styles.navItem} ${pathname === '/employee/enviados' ? styles.navItemActive : ''}`}>
            <IconList /> Enviados
          </Link>
          <Link href="/employee/retornos" className={`${styles.navItem} ${pathname === '/employee/retornos' ? styles.navItemActive : ''}`}>
            <IconUndo /> Retornos (ADM)
            {notificationCount > 0 && (
              <span style={{ 
                marginLeft: 'auto', background: 'white', color: 'var(--primary)', 
                fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px' 
              }}>
                {notificationCount}
              </span>
            )}
          </Link>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <Link href="/login" className={styles.navItem}>
            <IconLogout /> Sair
          </Link>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.titleSection}>
            <h1>Área do Colaborador</h1>
            <p>Mercado Central - Unidade 01</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            {/* Notification Bell */}
            <Link href="/employee/retornos" style={{ position: 'relative', color: 'var(--text-muted)', display: 'flex' }}>
              <IconBell />
              {notificationCount > 0 && (
                <span style={{ 
                  position: 'absolute', top: '-5px', right: '-5px', 
                  background: 'var(--error)', color: 'white', 
                  fontSize: '0.65rem', fontWeight: 800, width: '18px', height: '18px',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid white'
                }}>
                  {notificationCount}
                </span>
              )}
            </Link>

            <div className={styles.userProfile} style={{ paddingRight: '10px' }}>
              <div className={styles.userText} style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>João Silva</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Operador de Loja</div>
              </div>
              <div className={styles.avatar} style={{ background: 'var(--secondary)' }}>JS</div>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
