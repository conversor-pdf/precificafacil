'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';
import { useAppContext } from '@/lib/AppContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setUser } = useAppContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (supabaseError || !data) {
        setError('E-mail ou senha incorretos.');
      } else {
        setUser(data);
        // Redirect based on role
        if (data.role === 'super_admin') {
          router.push('/super-admin');
        } else if (data.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/employee');
        }
      }
    } catch (err) {
      setError('Ocorreu um erro ao tentar entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.header}>
          <div className={styles.logo}>
            Precifica<span>Fácil</span>
          </div>
          <p className={styles.subtitle}>Gestão Inteligente de Preços</p>
        </div>

        <form className={styles.form} onSubmit={handleLogin}>
          {error && <div style={{ color: '#ef4444', background: '#fef2f2', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '15px', textAlign: 'center', border: '1px solid #fee2e2' }}>{error}</div>}

          <div className={styles.field}>
            <label className={styles.label}>Usuário / E-mail</label>
            <input 
              type="email" 
              className={styles.input} 
              placeholder="ex: admin@super.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Senha</label>
            <input 
              type="password" 
              className={styles.input} 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Validando Acesso...' : 'Entrar no Sistema'}
          </button>
        </form>

        <div className={styles.footer}>
          &copy; 2026 Precifica Fácil - Sistema Hierárquico de Gestão
        </div>
      </div>
    </div>
  );
}
