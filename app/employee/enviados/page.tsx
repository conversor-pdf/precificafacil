'use client';

import { useState } from 'react';
import styles from '../../admin/page.module.css';
import { useAppContext } from '@/lib/AppContext';
import { Order } from '@/lib/types';

const IconEye = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
);

const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

const IconLoader = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);

const IconCheckCircle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

export default function SentOrdersPage() {
  const { orders } = useAppContext();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Show all orders sent by the employee
  const sentOrders = orders;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pendente':
        return { label: 'AGUARDANDO ADM', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd', icon: <IconClock /> };
      case 'processando':
        return { label: 'EM PROCESSAMENTO', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', icon: <IconLoader /> };
      default:
        return { label: 'PROCESSADO', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: <IconCheckCircle /> };
    }
  };

  return (
    <div className="animate-fade-in">
      <div className={styles.sectionHeader}>
        <h2>Pedidos Enviados</h2>
        <p>Acompanhe o status e o processamento dos seus lotes de produtos.</p>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {sentOrders.map(order => {
          const config = getStatusConfig(order.status);
          return (
            <div key={order.id} className={styles.card} style={{ padding: '0', overflow: 'hidden', border: `1px solid ${config.border}` }}>
              <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ 
                    width: '48px', height: '48px', borderRadius: '12px', 
                    background: config.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: config.color
                  }}>
                    {config.icon}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{order.nome}</h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {order.produtos.length} produtos • Enviado em {new Date(order.data_criacao).toLocaleDateString()} às {new Date(order.data_criacao).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <span style={{ 
                    padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800,
                    background: config.bg,
                    color: config.color,
                    border: `1px solid ${config.border}`
                  }}>
                    {config.label}
                  </span>
                  <button 
                    className={styles.btnChange}
                    onClick={() => setSelectedOrder(order)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'white' }}
                  >
                    <IconEye /> Detalhes
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {sentOrders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px', color: '#94a3b8' }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📤</div>
            <p>Você ainda não enviou nenhum pedido.</p>
          </div>
        )}
      </div>

      {/* Modal de Detalhes do Pedido Enviado */}
      {selectedOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ maxWidth: '900px', width: '95%' }}>
            <div className={styles.modalHeader} style={{ background: 'var(--secondary)' }}>
              <div>
                <h2>Itens do Pedido: {selectedOrder.nome}</h2>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                  {selectedOrder.mercado} • Enviado em {new Date(selectedOrder.data_criacao).toLocaleString()}
                </p>
              </div>
              <button className={styles.btnClose} onClick={() => setSelectedOrder(null)}>✕</button>
            </div>
            
            <div className={styles.modalBody} style={{ padding: '24px' }}>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th style={{ textAlign: 'center' }}>Custo</th>
                      <th style={{ textAlign: 'center' }}>Venda Sugerida</th>
                      <th style={{ textAlign: 'center' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.produtos.map(product => (
                      <tr key={product.id}>
                        <td>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <img src={product.imagem} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{product.nome}</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{product.codigo_barras}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>R$ {product.custo.toFixed(2)}</td>
                        <td style={{ textAlign: 'center', fontWeight: 700 }}>R$ {product.preco_sugerido.toFixed(2)}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{ 
                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800,
                            background: '#f1f5f9', color: '#64748b'
                          }}>
                            {product.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  className={styles.btnClose} 
                  style={{ background: 'var(--secondary)', color: 'white', padding: '0 30px', height: '48px' }}
                  onClick={() => setSelectedOrder(null)}
                >
                  Fechar Visualização
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
