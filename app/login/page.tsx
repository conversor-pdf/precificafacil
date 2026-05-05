'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function LoginPage() {
  const [role, setRole] = useState<'admin' | 'employee'>('employee');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate auth delay
    setTimeout(() => {
      if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/employee');
      }
    }, 800);
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
          <div className={styles.field}>
            <label className={styles.label}>Nível de Acesso</label>
            <div className={styles.roleSelector}>
              <button 
                type="button" 
                className={`${styles.roleBtn} ${role === 'employee' ? styles.roleBtnActive : ''}`}
                onClick={() => setRole('employee')}
              >
                Funcionário
              </button>
              <button 
                type="button" 
                className={`${styles.roleBtn} ${role === 'admin' ? styles.roleBtnActive : ''}`}
                onClick={() => setRole('admin')}
              >
                Administrador
              </button>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Usuário / E-mail</label>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="ex: ana.oliveira" 
              required 
              defaultValue={role === 'admin' ? 'admin@super.com' : 'mercado1@super.com'}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Senha</label>
            <input 
              type="password" 
              className={styles.input} 
              placeholder="••••••••" 
              required 
              defaultValue="123456"
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Acessando...' : 'Entrar no Sistema'}
          </button>
        </form>

        <div className={styles.footer}>
          &copy; 2026 Precifica Fácil - Todos os direitos reservados
        </div>
      </div>
    </div>
  );
}
