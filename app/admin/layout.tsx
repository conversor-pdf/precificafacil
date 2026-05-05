'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './layout.module.css';
import { useAppContext } from '@/lib/AppContext';

// Professional SVG Icons
const IconDashboard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
);
const IconHistory = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
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
const IconBell = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { orders } = useAppContext();

  // Admin notifications: new orders that are 'pendente' (waiting to be processed)
  const notificationCount = orders.filter(o => o.status === 'pendente').length;

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          Precifica<span>Fácil</span>
        </div>

        <nav className={styles.nav}>
          <Link href="/admin" className={`${styles.navItem} ${pathname === '/admin' ? styles.navItemActive : ''}`}>
            <IconDashboard /> Dashboard
            {notificationCount > 0 && (
              <span style={{ 
                marginLeft: 'auto', background: 'white', color: 'var(--primary)', 
                fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px' 
              }}>
                {notificationCount}
              </span>
            )}
          </Link>
          <Link href="/admin/historico" className={`${styles.navItem} ${pathname === '/admin/historico' ? styles.navItemActive : ''}`}>
            <IconHistory /> Histórico
          </Link>
          <Link href="/admin/mercados" className={`${styles.navItem} ${pathname === '/admin/mercados' ? styles.navItemActive : ''}`}>
            <IconMarkets /> Mercados
          </Link>
          <Link href="/admin/usuarios" className={`${styles.navItem} ${pathname === '/admin/usuarios' ? styles.navItemActive : ''}`}>
            <IconUsers /> Usuários
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
            <h1>Painel de Aprovação</h1>
            <p>Aprove ou ajuste os preços enviados pelos mercados</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            {/* Notification Bell */}
            <Link href="/admin" style={{ position: 'relative', color: 'var(--text-muted)', display: 'flex' }}>
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
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Ana Oliveira</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Administradora</div>
              </div>
              <div className={styles.avatar}>AO</div>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
