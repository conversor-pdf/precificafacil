'use client';

import { useState, useEffect } from 'react';
import styles from '../page.module.css';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/lib/types';
import { useAppContext } from '@/lib/AppContext';

export default function LojistaUsersPage() {
  const { user } = useAppContext();
  const [employees, setEmployees] = useState<UserProfile[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const fetchEmployees = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'employee')
      .eq('parent_id', user.id)
      .order('data_criacao', { ascending: false });

    if (!error) setEmployees(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, [user]);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase.from('profiles').insert({
      nome,
      email,
      password,
      mercado: user.mercado, // O funcionário herda o nome do mercado da rede
      role: 'employee',
      parent_id: user.id
    });

    if (!error) {
      alert('Colaborador cadastrado com sucesso!');
      setShowModal(false);
      fetchEmployees();
      setNome(''); setEmail(''); setPassword('');
    } else {
      alert('Erro ao cadastrar colaborador.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className={styles.sectionHeader}>
        <div>
          <h2>Colaboradores da Rede</h2>
          <p>Gerencie os funcionários que enviam os preços das lojas</p>
        </div>
        <button className={styles.btnChange} onClick={() => setShowModal(true)}>
          ➕ Novo Colaborador
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Unidade / Mercado</th>
              <th>Data de Cadastro</th>
              <th style={{ textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id}>
                <td style={{ fontWeight: 700 }}>{emp.nome}</td>
                <td>{emp.email}</td>
                <td>{emp.mercado}</td>
                <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {new Date(emp.data_criacao).toLocaleDateString()}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.8rem' }}>Remover</button>
                </td>
              </tr>
            ))}
            {employees.length === 0 && !loading && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Nenhum colaborador cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Novo Colaborador */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Cadastrar Novo Colaborador</h2>
              <button className={styles.btnClose} onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form className={styles.modalBody} onSubmit={handleCreateEmployee}>
              <div>
                <label className={styles.label}>Nome Completo</label>
                <input type="text" className={styles.input} required value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: João da Silva" />
              </div>
              <div>
                <label className={styles.label}>E-mail (Login)</label>
                <input type="email" className={styles.input} required value={email} onChange={e => setEmail(e.target.value)} placeholder="ex: loja1@rede.com" />
              </div>
              <div>
                <label className={styles.label}>Senha Inicial</label>
                <input type="password" className={styles.input} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" />
              </div>
              <button type="submit" className={styles.confirmBtn}>Salvar Colaborador</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
