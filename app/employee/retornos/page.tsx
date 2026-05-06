'use client';

import { useState } from 'react';
import styles from '../../admin/page.module.css';
import { useAppContext } from '@/lib/AppContext';
import { Order } from '@/lib/types';

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);

const IconEye = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
);

export default function RetornosPage() {
  const { orders, confirmOrderResponse } = useAppContext();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter orders that have been processed (concluido) or confirmed (confirmado)
  const processedOrders = orders.filter(o => o.status === 'concluido' || o.status === 'confirmado');

  const handleConfirm = (id: string) => {
    confirmOrderResponse(id);
    setSelectedOrder(null);
    alert('Alterações confirmadas e aplicadas ao sistema!');
  };

  return (
    <div className="animate-fade-in">
      <div className={styles.sectionHeader}>
        <h2>Retornos da Administração</h2>
        <p>Acompanhe as respostas da ADM e confirme os novos preços</p>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {processedOrders.map(order => (
          <div key={order.id} className={styles.card} style={{ padding: '0', overflow: 'hidden', border: order.status === 'concluido' ? '1px solid #fbbf24' : '1px solid #10b981' }}>
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ 
                  width: '48px', height: '48px', borderRadius: '12px', 
                  background: order.status === 'concluido' ? '#fffbeb' : '#f0fdf4',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: order.status === 'concluido' ? '#d97706' : '#16a34a'
                }}>
                  {order.status === 'concluido' ? '⏳' : <IconCheck />}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{order.nome}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {order.produtos.length} produtos • Resposta em {order.data_conclusao ? new Date(order.data_conclusao).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Processando...'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <span style={{ 
                  padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800,
                  background: order.status === 'concluido' ? '#fff7ed' : '#f0fdf4',
                  color: order.status === 'concluido' ? '#ea580c' : '#16a34a',
                  border: order.status === 'concluido' ? '1px solid #fed7aa' : '1px solid #bbf7d0'
                }}>
                  {order.status === 'concluido' ? 'PENDENTE DE CONFIRMAÇÃO' : 'CONFIRMADO'}
                </span>
                <button 
                  className={styles.btnChange}
                  onClick={() => setSelectedOrder(order)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
                >
                  <IconEye /> Visualizar
                </button>
              </div>
            </div>
          </div>
        ))}

        {processedOrders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📁</div>
            <p>Nenhum retorno da administração no momento.</p>
          </div>
        )}
      </div>

      {/* Modal de Visualização e Confirmação */}
      {selectedOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ maxWidth: '900px', width: '95%' }}>
            <div className={styles.modalHeader}>
              <div>
                <h2>Detalhes do Retorno: {selectedOrder.nome}</h2>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Confira os ajustes realizados pela administração</p>
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
                      <th style={{ textAlign: 'center' }}>Sugerido</th>
                      <th style={{ textAlign: 'center' }}>Final ADM</th>
                      <th style={{ textAlign: 'center' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.produtos
                      .sort((a, b) => a.status === 'alterado' ? -1 : 1)
                      .map(product => (
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
                        <td style={{ textAlign: 'center' }}>R$ {product.preco_sugerido.toFixed(2)}</td>
                        <td style={{ textAlign: 'center', fontWeight: 800, color: product.status === 'alterado' ? '#ea580c' : '#16a34a' }}>
                          R$ {product.preco_final?.toFixed(2)}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{ 
                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800,
                            background: product.status === 'alterado' ? '#fff7ed' : '#f0fdf4',
                            color: product.status === 'alterado' ? '#ea580c' : '#16a34a'
                          }}>
                            {product.status === 'alterado' ? 'ALTERADO' : 'MANTIDO'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                <button 
                  className={styles.btnClose} 
                  style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', padding: '0 25px' }}
                  onClick={() => setSelectedOrder(null)}
                >
                  Fechar
                </button>
                {selectedOrder.status === 'concluido' && (
                  <button 
                    className={styles.submitBtn}
                    style={{ background: 'var(--success)', width: 'auto', padding: '0 30px', display: 'flex', alignItems: 'center', gap: '10px' }}
                    onClick={() => handleConfirm(selectedOrder.id)}
                  >
                    <IconCheck /> Confirmar e Aplicar Alterações
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
