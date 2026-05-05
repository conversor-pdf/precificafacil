'use client';

import styles from '../page.module.css';

const usuarios = [
  { id: 1, nome: 'Ana Oliveira', cargo: 'Administradora', email: 'ana@precifica.com' },
  { id: 2, nome: 'João Silva', cargo: 'Operador', email: 'joao@mercado.com' },
  { id: 3, nome: 'Maria Santos', cargo: 'Operador', email: 'maria@mercado.com' },
];

export default function AdminUsers() {
  return (
    <div className="animate-fade-in">
      <div className={styles.sectionHeader}>
        <h2>Gerenciar Usuários</h2>
        <button className={styles.confirmBtn} style={{ width: 'auto', padding: '10px 20px' }}>+ Novo Usuário</button>
      </div>
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cargo</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id}>
                <td style={{ fontWeight: 600 }}>{u.nome}</td>
                <td>{u.cargo}</td>
                <td>{u.email}</td>
                <td>
                  <button style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
