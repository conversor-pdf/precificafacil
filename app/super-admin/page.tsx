'use client';

import { useState, useEffect } from 'react';
import styles from '../admin/page.module.css';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/lib/types';

export default function SuperAdminDashboard() {
  const [lojistas, setLojistas] = useState<UserProfile[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mercado, setMercado] = useState('');

  const fetchLojistas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'admin')
      .order('data_criacao', { ascending: false });

    if (!error) setLojistas(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLojistas();
  }, []);

  const handleCreateLojista = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('profiles').insert({
      nome,
      email,
      password,
      mercado,
      role: 'admin'
    });

    if (!error) {
      alert('Lojista cadastrado com sucesso!');
      setShowModal(false);
      fetchLojistas();
      // Reset form
      setNome(''); setEmail(''); setPassword(''); setMercado('');
    } else {
      alert('Erro ao cadastrar lojista.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className={styles.sectionHeader}>
        <div>
          <h2>Redes de Lojistas Cadastradas</h2>
          <p>Gerencie os administradores das redes de supermercados</p>
        </div>
        <button className={styles.btnChange} style={{ background: 'var(--secondary)' }} onClick={() => setShowModal(true)}>
          ➕ Novo Lojista
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome / Responsável</th>
              <th>Rede de Mercado</th>
              <th>E-mail de Acesso</th>
              <th>Data de Cadastro</th>
              <th style={{ textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lojistas.map(lojista => (
              <tr key={lojista.id}>
                <td style={{ fontWeight: 700 }}>{lojista.nome}</td>
                <td>
                  <span className={styles.marketBadge}>{lojista.mercado}</span>
                </td>
                <td>{lojista.email}</td>
                <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {new Date(lojista.data_criacao).toLocaleDateString()}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.8rem' }}>Excluir</button>
                </td>
              </tr>
            ))}
            {lojistas.length === 0 && !loading && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Nenhum lojista cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Novo Lojista */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Cadastrar Novo Lojista</h2>
              <button className={styles.btnClose} onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form className={styles.modalBody} onSubmit={handleCreateLojista}>
              <div>
                <label className={styles.label}>Nome do Responsável</label>
                <input type="text" className={styles.input} required value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Roberto Carlos" />
              </div>
              <div>
                <label className={styles.label}>Nome da Rede / Mercado</label>
                <input type="text" className={styles.input} required value={mercado} onChange={e => setMercado(e.target.value)} placeholder="Ex: Rede Super Norte" />
              </div>
              <div>
                <label className={styles.label}>E-mail de Login</label>
                <input type="email" className={styles.input} required value={email} onChange={e => setEmail(e.target.value)} placeholder="ex: roberto@rede.com" />
              </div>
              <div>
                <label className={styles.label}>Senha Inicial</label>
                <input type="password" className={styles.input} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" />
              </div>
              <button type="submit" className={styles.confirmBtn} style={{ background: 'var(--secondary)' }}>Salvar Lojista</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
