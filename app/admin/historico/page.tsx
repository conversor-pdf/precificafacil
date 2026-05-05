'use client';

import styles from '../page.module.css';

export default function AdminHistory() {
  return (
    <div className="animate-fade-in">
      <div className={styles.sectionHeader}>
        <h2>Histórico de Aprovações</h2>
        <p style={{ color: 'var(--text-muted)' }}>Veja os produtos que foram aprovados ou alterados recentemente.</p>
      </div>
      
      <div className={styles.card} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📜</div>
        <p>O histórico está vazio no momento.</p>
      </div>
    </div>
  );
}
