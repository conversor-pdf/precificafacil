'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function EmployeeDashboard() {
  return (
    <div className="animate-fade-in">
      <div className={styles.statsGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className={styles.statCard} style={{ display: 'flex', gap: '15px', padding: '20px', background: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '2rem' }}>📦</div>
          <div>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Meus Envios Hoje</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>0</div>
          </div>
        </div>
        <div className={styles.statCard} style={{ display: 'flex', gap: '15px', padding: '20px', background: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '2rem' }}>⏳</div>
          <div>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Aguardando Aprovação</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>0</div>
          </div>
        </div>
      </div>

      <div className={styles.sectionHeader}>
        <h2>Ações Rápidas</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <Link href="/employee/novo" className={styles.card} style={{ padding: '30px', textAlign: 'center', textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s' }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>➕</div>
          <h3 style={{ marginBottom: '10px' }}>Cadastrar Manual</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Busca por código de barras e imagem externa.</p>
        </Link>
        <Link href="/employee/importar" className={styles.card} style={{ padding: '30px', textAlign: 'center', textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s' }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📄</div>
          <h3 style={{ marginBottom: '10px' }}>Importar XML (NF-e)</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Carregue arquivos de nota fiscal para agilizar o processo.</p>
        </Link>
      </div>
    </div>
  );
}
