'use client';

import { useState } from 'react';
import styles from '../../admin/page.module.css';
import { useAppContext } from '@/lib/AppContext';
import { Order } from '@/lib/types';

const IconEye = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
);

const IconClock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export default function EmployeeHistory() {
  const { orders } = useAppContext();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter orders that are already processed or confirmed
  const historyOrders = orders.filter(o => o.status === 'concluido' || o.status === 'confirmado');

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="animate-fade-in">
      <div className={styles.sectionHeader}>
        <h2>📜 Histórico de Pedidos</h2>
        <p>Veja todos os seus pedidos que já foram revisados pela administração.</p>
      </div>
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Pedido / Empresa</th>
              <th style={{ textAlign: 'center' }}>Itens</th>
              <th style={{ textAlign: 'center' }}>Status</th>
              <th style={{ textAlign: 'center' }}>Data da Resposta</th>
              <th style={{ textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {historyOrders.map(order => (
              <tr key={order.id}>
                <td>
                  <div style={{ fontWeight: 700 }}>{order.nome}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {order.id.split('-')[0]}</div>
                </td>
                <td style={{ textAlign: 'center' }}>{order.produtos.length}</td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{ 
                    fontSize: '0.7rem', fontWeight: 800, padding: '4px 8px', borderRadius: '4px',
                    background: order.status === 'confirmado' ? '#f0fdf4' : '#fffbeb',
                    color: order.status === 'confirmado' ? '#16a34a' : '#d97706'
                  }}>
                    {order.status === 'confirmado' ? 'FINALIZADO' : 'AGUARDANDO SUA CONFIRMAÇÃO'}
                  </span>
                </td>
                <td style={{ textAlign: 'center', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <IconClock /> {formatDateTime(order.data_conclusao)}
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    style={{ color: 'var(--primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <IconEye /> Ver Detalhes
                  </button>
                </td>
              </tr>
            ))}
            {historyOrders.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                  Nenhum histórico disponível. Continue enviando seus pedidos!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Detalhes (Read-only) */}
      {selectedOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ maxWidth: '900px', width: '95%' }}>
            <div className={styles.modalHeader}>
              <div>
                <h2>Detalhes: {selectedOrder.nome}</h2>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                  Resposta enviada em {formatDateTime(selectedOrder.data_conclusao)}
                </p>
              </div>
              <button className={styles.btnClose} onClick={() => setSelectedOrder(null)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.tableContainer} style={{ boxShadow: 'none', border: '1px solid var(--border)' }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th style={{ textAlign: 'center' }}>Custo</th>
                      <th style={{ textAlign: 'center' }}>Original</th>
                      <th style={{ textAlign: 'center' }}>Final ADM</th>
                      <th style={{ textAlign: 'center' }}>Resultado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.produtos.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div className={styles.productCell}>
                            <img src={p.imagem} className={p.productImg} style={{ width: 40, height: 40 }} />
                            <div>
                              <div style={{ fontWeight: 600 }}>{p.nome}</div>
                              <div style={{ fontSize: '0.7rem' }}>{p.codigo_barras}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>R$ {p.custo.toFixed(2)}</td>
                        <td style={{ textAlign: 'center' }}>R$ {p.preco_sugerido.toFixed(2)}</td>
                        <td style={{ textAlign: 'center', fontWeight: 800, color: p.status === 'alterado' ? 'var(--error)' : 'var(--success)' }}>
                          R$ {p.preco_final?.toFixed(2)}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: p.status === 'alterado' ? 'var(--error)' : 'var(--success)' }}>
                            {p.status === 'alterado' ? 'ALTERADO' : 'MANTIDO'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button className={styles.confirmBtn} style={{ width: 'auto', padding: '10px 40px' }} onClick={() => setSelectedOrder(null)}>Fechar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
