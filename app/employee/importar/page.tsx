'use client';

import styles from '../page.module.css';

export default function ImportXmlPage() {
  return (
    <div className="animate-fade-in">
      <div className={styles.card}>
        <div className={styles.importSection}>
          <div className={styles.importBox}>
            <span className={styles.importIcon}>📥</span>
            <h3>Arraste o arquivo XML aqui</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Lê automaticamente produtos e custos da Nota Fiscal</p>
            <input type="file" style={{ display: 'none' }} id="xml-upload-page" />
            <button 
              className={styles.submitBtn} 
              style={{ marginTop: '24px', maxWidth: '200px', margin: '24px auto 0' }}
              onClick={() => document.getElementById('xml-upload-page')?.click()}
            >
              Selecionar Arquivo NF-e
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
