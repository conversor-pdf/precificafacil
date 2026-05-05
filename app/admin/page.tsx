'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { Order, ProductEnvio } from '@/lib/types';
import { useAppContext } from '@/lib/AppContext';

const IconPlay = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
);

export default function AdminDashboard() {
  const { orders, updateOrderProduct, keepProductInOrder, concludeOrder, startProcessingOrder } = useAppContext();
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<{orderId: string, product: ProductEnvio} | null>(null);
  
  // Tabs state per order
  const [orderTabs, setOrderTabs] = useState<Record<string, 'pendente' | 'verificado'>>({});

  const [marginInput, setMarginInput] = useState<string>('30');
  const [priceInput, setPriceInput] = useState<string>('');

  // Show both 'pendente' and 'processando' orders in the main dashboard
  const activeOrders = orders.filter(o => o.status === 'pendente' || o.status === 'processando');

  const handleOpenModal = (orderId: string, product: ProductEnvio) => {
    setSelectedProduct({ orderId, product });
    setMarginInput(product.margem.toFixed(2));
    setPriceInput((product.preco_sugerido).toFixed(2));
  };

  const handleMarginChange = (val: string) => {
    setMarginInput(val);
    if (selectedProduct) {
      const margin = parseFloat(val) || 0;
      const newPrice = selectedProduct.product.custo * (1 + margin / 100);
      setPriceInput(newPrice.toFixed(2));
    }
  };

  const handlePriceChange = (val: string) => {
    setPriceInput(val);
    if (selectedProduct) {
      const price = parseFloat(val) || 0;
      const newMargin = ((price - selectedProduct.product.custo) / selectedProduct.product.custo) * 100;
      setMarginInput(newMargin.toFixed(2));
    }
  };

  const handleConfirmPrice = () => {
    if (!selectedProduct) return;
    const price = parseFloat(priceInput);
    const margin = parseFloat(marginInput);
    updateOrderProduct(selectedProduct.orderId, selectedProduct.product.id, price, margin, true);
    setSelectedProduct(null);
  };

  const toggleTab = (orderId: string, tab: 'pendente' | 'verificado') => {
    setOrderTabs(prev => ({ ...prev, [orderId]: tab }));
  };

  const handleStartProcessing = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    startProcessingOrder(id);
    setActiveOrderId(id); // Automatically expand when starting
  };

  return (
    <div className="animate-fade-in">
      <div className={styles.sectionHeader}>
        <h2>📦 Pedidos de Ajuste de Preço ({activeOrders.length})</h2>
        <p>Inicie o processamento para revisar os itens de cada distribuidora.</p>
      </div>

      <div style={{ display: 'grid', gap: '15px' }}>
        {activeOrders.map(order => {
          const isProcessing = order.status === 'processando';
          const isOpen = activeOrderId === order.id && isProcessing;
          const currentTab = orderTabs[order.id] || 'pendente';
          const pendingItems = order.produtos.filter(p => p.status === 'pendente');
          const verifiedItems = order.produtos.filter(p => p.status === 'verificado' || p.status === 'alterado');
          const isComplete = pendingItems.length === 0;

          return (
            <div key={order.id} className={styles.card} style={{ 
              padding: '0', 
              overflow: 'hidden', 
              border: isOpen ? '2px solid var(--primary)' : '1px solid var(--border)',
              opacity: !isProcessing && activeOrderId && activeOrderId !== order.id ? 0.6 : 1
            }}>
              
              {/* Header do Pedido */}
              <div 
                onClick={() => isProcessing && setActiveOrderId(isOpen ? null : order.id)}
                style={{ 
                  padding: '24px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  background: isOpen ? '#f0fdf4' : 'white',
                  cursor: isProcessing ? 'pointer' : 'default',
                  transition: 'background 0.2s'
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', color: isProcessing ? 'var(--secondary)' : '#64748b' }}>{order.nome}</h3>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{order.mercado}</span> • {order.produtos.length} itens • {new Date(order.data_criacao).toLocaleDateString()}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                  {!isProcessing ? (
                    <button 
                      onClick={(e) => handleStartProcessing(e, order.id)}
                      style={{ 
                        background: 'var(--primary)', color: 'white', padding: '10px 24px', 
                        borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                      }}
                    >
                      <IconPlay /> Processar
                    </button>
                  ) : (
                    <>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isComplete ? 'var(--success)' : 'var(--primary)' }}>
                          {isComplete ? 'PRONTO PARA ENVIAR' : 'EM PROCESSAMENTO'}
                        </div>
                        <div style={{ width: '120px', height: '6px', background: '#e2e8f0', borderRadius: '3px', marginTop: '4px' }}>
                          <div style={{ width: `${(verifiedItems.length / order.produtos.length) * 100}%`, height: '100%', background: isComplete ? 'var(--success)' : 'var(--primary)', borderRadius: '3px' }}></div>
                        </div>
                      </div>
                      <div style={{ fontSize: '1.2rem', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s', color: 'var(--primary)' }}>▼</div>
                    </>
                  )}
                </div>
              </div>

              {/* Corpo do Pedido (Apenas se em processamento e aberto) */}
              {isOpen && (
                <div className="animate-slide-down">
                  <div style={{ display: 'flex', padding: '0 24px', background: '#f8fafc', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                    <button onClick={(e) => { e.stopPropagation(); toggleTab(order.id, 'pendente'); }}
                      style={{ padding: '15px 25px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700, color: currentTab === 'pendente' ? 'var(--primary)' : '#64748b', borderBottom: currentTab === 'pendente' ? '3px solid var(--primary)' : '3px solid transparent' }}>
                      Pendentes ({pendingItems.length})
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); toggleTab(order.id, 'verificado'); }}
                      style={{ padding: '15px 25px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700, color: currentTab === 'verificado' ? 'var(--primary)' : '#64748b', borderBottom: currentTab === 'verificado' ? '3px solid var(--primary)' : '3px solid transparent' }}>
                      Verificados ({verifiedItems.length})
                    </button>
                    
                    <button 
                      disabled={!isComplete}
                      onClick={(e) => { e.stopPropagation(); concludeOrder(order.id); alert('Resposta enviada para o colaborador!'); }}
                      style={{ 
                        marginLeft: 'auto', alignSelf: 'center', padding: '10px 24px', borderRadius: '8px', border: 'none',
                        background: isComplete ? 'var(--success)' : '#e2e8f0', color: 'white', fontWeight: 800, cursor: isComplete ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s'
                      }}
                    >
                      Concluir e Enviar Resposta
                    </button>
                  </div>

                  <div style={{ padding: '24px' }}>
                    <div className={styles.tableContainer}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Produto</th>
                            <th style={{ textAlign: 'center' }}>Custo</th>
                            <th style={{ textAlign: 'center' }}>Sugerido</th>
                            <th style={{ textAlign: 'center' }}>Ajuste</th>
                            <th style={{ textAlign: 'center' }}>Status</th>
                            <th style={{ textAlign: 'center' }}>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(currentTab === 'pendente' ? pendingItems : verifiedItems).map(product => (
                            <tr key={product.id}>
                              <td>
                                <div className={styles.productCell}>
                                  <img src={product.imagem} className={styles.productImg} />
                                  <div>
                                    <div style={{ fontWeight: 700 }}>{product.nome}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{product.codigo_barras}</div>
                                  </div>
                                </div>
                              </td>
                              <td style={{ textAlign: 'center' }}>R$ {product.custo.toFixed(2)}</td>
                              <td style={{ textAlign: 'center' }}>R$ {product.preco_sugerido.toFixed(2)}</td>
                              <td style={{ textAlign: 'center', fontWeight: 800, color: product.status === 'alterado' ? '#ea580c' : '#16a34a' }}>
                                {product.status === 'pendente' ? '-' : `R$ ${product.preco_final?.toFixed(2)}`}
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <span style={{ 
                                  fontSize: '0.75rem', fontWeight: 800, 
                                  padding: '4px 8px', borderRadius: '4px',
                                  background: product.status === 'pendente' ? '#f1f5f9' : product.status === 'alterado' ? '#fff7ed' : '#f0fdf4',
                                  color: product.status === 'pendente' ? '#94a3b8' : product.status === 'alterado' ? '#ea580c' : '#16a34a' 
                                }}>
                                  {product.status.toUpperCase()}
                                </span>
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                  {product.status === 'pendente' ? (
                                    <>
                                      <button className={styles.btnMaintain} onClick={() => keepProductInOrder(order.id, product.id)}>Manter</button>
                                      <button className={styles.btnChange} onClick={() => handleOpenModal(order.id, product)}>Ajustar</button>
                                    </>
                                  ) : (
                                    <button className={styles.btnChange} onClick={() => handleOpenModal(order.id, product)} style={{ background: 'white', color: '#64748b' }}>Re-ajustar</button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal de Ajuste */}
      {selectedProduct && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Ajustar Preço</h2>
              <button className={styles.btnClose} onClick={() => setSelectedProduct(null)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.productCell} style={{ marginBottom: '20px' }}>
                <img src={selectedProduct.product.imagem} className={styles.productImg} style={{ width: 64, height: 64 }} />
                <div>
                  <div className={styles.productName}>{selectedProduct.product.nome}</div>
                  <div className={styles.productCode}>Sugerido: R$ {selectedProduct.product.preco_sugerido.toFixed(2)}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <label className={styles.label} style={{ fontSize: '0.85rem' }}>Margem (%)</label>
                  <input type="number" value={marginInput} onChange={(e) => handleMarginChange(e.target.value)} className={styles.input} style={{ fontWeight: 700, width: '100%' }} />
                </div>
                <div>
                  <label className={styles.label} style={{ fontSize: '0.85rem' }}>Preço Final (R$)</label>
                  <input type="number" step="0.01" value={priceInput} onChange={(e) => handlePriceChange(e.target.value)} className={styles.input} style={{ fontWeight: 700, width: '100%' }} />
                </div>
              </div>
              <button className={styles.confirmBtn} onClick={handleConfirmPrice}>Confirmar Alteração</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
