'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../admin/layout.module.css';
import { useAppContext } from '@/lib/AppContext';

// Professional SVG Icons
const IconDashboard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
);
const IconMarkets = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 10V7"/></svg>
);
const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const IconLogout = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAppContext();

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar} style={{ background: '#0f172a' }}>
        <div className={styles.logo}>
          Precifica<span>Master</span>
        </div>

        <nav className={styles.nav}>
          <Link href="/super-admin" className={`${styles.navItem} ${pathname === '/super-admin' ? styles.navItemActive : ''}`}>
            <IconDashboard /> Dashboard
          </Link>
          <Link href="/super-admin/lojistas" className={`${styles.navItem} ${pathname === '/super-admin/lojistas' ? styles.navItemActive : ''}`}>
            <IconMarkets /> Lojistas
          </Link>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button onClick={logout} className={styles.navItem} style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}>
            <IconLogout /> Sair
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.titleSection}>
            <h1>Painel Master</h1>
            <p>Gerenciamento Global de Lojistas e Redes</p>
          </div>

          <div className={styles.userProfile} style={{ paddingRight: '10px' }}>
            <div className={styles.userText} style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.nome}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Super Administrador</div>
            </div>
            <div className={styles.avatar} style={{ background: '#1e293b' }}>SA</div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
