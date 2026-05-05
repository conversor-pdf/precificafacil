'use client';

import styles from '../page.module.css';

const mercados = [
  { id: 1, nome: 'Mercado Central', unidade: 'Unidade 01', cidade: 'São Paulo', status: 'Ativo' },
  { id: 2, nome: 'Mercado Norte', unidade: 'Unidade 02', cidade: 'São José', status: 'Ativo' },
  { id: 3, nome: 'Mercado Sul', unidade: 'Unidade 03', cidade: 'Curitiba', status: 'Ativo' },
];

export default function AdminMarkets() {
  return (
    <div className="animate-fade-in">
      <div className={styles.sectionHeader}>
        <h2>Gerenciar Mercados</h2>
        <button className={styles.confirmBtn} style={{ width: 'auto', padding: '10px 20px' }}>+ Novo Mercado</button>
      </div>
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Unidade</th>
              <th>Cidade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mercados.map(m => (
              <tr key={m.id}>
                <td style={{ fontWeight: 600 }}>{m.nome}</td>
                <td>{m.unidade}</td>
                <td>{m.cidade}</td>
                <td><span style={{ padding: '4px 12px', background: '#f0fdf4', color: '#16a34a', borderRadius: '12px', fontSize: '0.8rem' }}>{m.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
