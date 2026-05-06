'use client';

import { useState, useEffect } from 'react';
import styles from '../app/employee/page.module.css';
import { mockProductsBase } from '@/lib/data';
import { ProductBase, ProductEnvio } from '@/lib/types';
import { useAppContext } from '@/lib/AppContext';

export default function ProductForm() {
  const { addOrder } = useAppContext();
  const [supplierName, setSupplierName] = useState('');
  const [draftItems, setDraftItems] = useState<Omit<ProductEnvio, 'id' | 'status' | 'data_envio'>[]>([]);

  // PERSISTENCE: Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('precifica_draft_items');
    const savedSupplier = localStorage.getItem('precifica_draft_supplier');
    if (savedDraft) setDraftItems(JSON.parse(savedDraft));
    if (savedSupplier) setSupplierName(savedSupplier);
  }, []);

  // PERSISTENCE: Save draft to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('precifica_draft_items', JSON.stringify(draftItems));
    localStorage.setItem('precifica_draft_supplier', supplierName);
  }, [draftItems, supplierName]);
  
  const [barcode, setBarcode] = useState('');
  const [productName, setProductName] = useState('');
  const [custo, setCusto] = useState('');
  const [precoVenda, setPrecoVenda] = useState('');
  const [loading, setLoading] = useState(false);
  const [foundProduct, setFoundProduct] = useState<ProductBase | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image Selector State
  const [imageResults, setImageResults] = useState<{url: string, name: string; barcode: string}[]>([]);
  const [isSearchingImages, setIsSearchingImages] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [searchTrigger, setSearchTrigger] = useState<'barcode' | 'name' | null>(null);
  const [hasSelectedProduct, setHasSelectedProduct] = useState(false);

  useEffect(() => {
    if (barcode.length >= 3 && searchTrigger === 'barcode' && !hasSelectedProduct) {
      setLoading(true);
      const timer = setTimeout(() => {
        const product = mockProductsBase.find(p => p.codigo_barras === barcode);
        if (product) {
          setFoundProduct(product);
          setProductName(product.nome);
          setSelectedImageUrl(product.imagem);
          setHasSelectedProduct(true);
        }
        setLoading(false);
        searchExternalImages(barcode);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [barcode, searchTrigger, hasSelectedProduct]);

  const searchExternalImages = async (query: string) => {
    if (!query || query.length < 3) return;
    setIsSearchingImages(true);
    try {
      const response = await fetch(`/api/images?query=${encodeURIComponent(query)}`);
      const data = await response.text();
      extractImagesFromHtml(data);
    } catch (error) {
      console.error('Error searching images:', error);
    } finally {
      setIsSearchingImages(false);
    }
  };

  const extractImagesFromHtml = (html: string) => {
    const results: { url: string; name: string; barcode: string }[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const containers = doc.querySelectorAll('.produto-box, .one-produto-result');
    containers.forEach(container => {
      const img = container.querySelector('img');
      const pemUrl = container.getAttribute('data-pem_url');
      let name = '';
      if (pemUrl) {
        name = pemUrl.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      } else {
        const nameEl = container.querySelector('p, .nome, .title');
        name = nameEl?.textContent?.trim() || '';
      }
      const barcodeMatch = container.innerHTML.match(/\b\d{13}\b/);
      if (img && img.src && name && name.toLowerCase() !== 'novo') {
        results.push({ url: img.src, name, barcode: barcodeMatch ? barcodeMatch[0] : '' });
      }
    });
    setImageResults(results.slice(0, 15).map(item => ({
      ...item,
      url: item.url.startsWith('/') ? `https://cdn.qrofertas.com${item.url}` : item.url
    })));
  };

  const handleAddToDraft = () => {
    if (!barcode || !productName || !custo || !precoVenda) {
      alert('Preencha todos os campos do produto!');
      return;
    }

    const newItem = {
      codigo_barras: barcode,
      nome: productName,
      imagem: selectedImageUrl || 'https://via.placeholder.com/200',
      mercado: 'Mercado Central',
      custo: parseFloat(custo),
      preco_sugerido: parseFloat(precoVenda),
      margem: ((parseFloat(precoVenda) - parseFloat(custo)) / parseFloat(custo)) * 100
    };

    setDraftItems([...draftItems, newItem]);
    
    // Reset product fields
    setBarcode('');
    setProductName('');
    setCusto('');
    setPrecoVenda('');
    setFoundProduct(null);
    setSelectedImageUrl(null);
    setImageResults([]);
    setSearchTrigger(null);
    setHasSelectedProduct(false);
  };

  const handleSubmitOrder = () => {
    if (draftItems.length === 0) {
      alert('Adicione pelo menos um produto à lista!');
      return;
    }
    if (!supplierName) {
      alert('Por favor, informe o nome da Empresa/Distribuidora!');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      addOrder(supplierName, draftItems);
      alert('Pedido enviado com sucesso!');
      setIsSubmitting(false);
      setDraftItems([]);
      setSupplierName('');
    }, 1000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. SEÇÃO DE ENTRADA */}
      <div className={styles.registrationGrid}>
        
        {/* Formulário Principal */}
        <div className={styles.card} style={{ margin: 0 }}>
          <div className={styles.sectionHeader} style={{ marginBottom: '15px' }}>
            <h2 style={{ fontSize: '1.2rem' }}>1. Informações do Produto</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className={styles.field}>
              <label className={styles.label}>Código de Barras</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={barcode}
                  onChange={(e) => { setBarcode(e.target.value); if(!searchTrigger) setSearchTrigger('barcode'); }}
                  placeholder="Escaneie ou digite"
                  style={{ width: '100%' }}
                />
                {loading && <div className={styles.loading} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', borderTopColor: 'var(--primary)', width: '16px', height: '16px' }}></div>}
              </div>
            </div>
            
            <div className={styles.field}>
              <label className={styles.label}>Nome do Produto</label>
              <input 
                type="text" 
                className={styles.input} 
                value={productName} 
                onChange={(e) => setProductName(e.target.value)} 
                placeholder="Ex: Coca Cola 2L"
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px' }}>
              <div className={styles.field}>
                <label className={styles.label}>Custo (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  className={styles.input} 
                  value={custo} 
                  onChange={(e) => setCusto(e.target.value)} 
                  placeholder="0.00"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Venda Sugerida (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  className={styles.input} 
                  value={precoVenda} 
                  onChange={(e) => setPrecoVenda(e.target.value)} 
                  placeholder="0.00"
                />
              </div>
            </div>

            <button 
              className={styles.submitBtn} 
              onClick={handleAddToDraft} 
              style={{ background: 'var(--secondary)', height: '48px', width: '100%' }}
            >
              ➕ Adicionar à Lista
            </button>
          </div>
        </div>

        {/* Sugestões de Imagem */}
        <div className={styles.card} style={{ margin: 0, height: '100%' }}>
          <div className={styles.imageSelectorHeader} style={{ marginBottom: '15px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--secondary)' }}>Sugestões de Imagem</h3>
            {isSearchingImages && <div className={styles.loading} style={{ borderTopColor: 'var(--primary)', width: '16px', height: '16px' }}></div>}
          </div>
          
          <div className={styles.imageGrid} style={{ maxHeight: '350px' }}>
            {imageResults.map((result, idx) => (
              <div 
                key={idx} 
                className={`${styles.imageItem} ${selectedImageUrl === result.url ? styles.imageItemSelected : ''}`} 
                onClick={() => { 
                  setSelectedImageUrl(result.url); 
                  if(!productName || productName.toLowerCase() === 'novo') setProductName(result.name); 
                  if(!barcode) setBarcode(result.barcode); 
                  setHasSelectedProduct(true); 
                }}
              >
                <img src={result.url} alt="suggest" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. LISTA DE PRODUTOS */}
      {draftItems.length > 0 && (
        <div className={styles.card} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>2. Itens do Pedido ({draftItems.length})</h2>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                className={styles.input} 
                value={supplierName} 
                onChange={(e) => setSupplierName(e.target.value)} 
                placeholder="Nome da Empresa"
                style={{ minWidth: '200px', height: '40px' }}
              />
              <button 
                className={styles.submitBtn} 
                onClick={handleSubmitOrder} 
                disabled={isSubmitting}
                style={{ width: 'auto', padding: '0 25px', margin: 0, height: '40px' }}
              >
                {isSubmitting ? 'Enviando...' : '🚀 Enviar Pedido'}
              </button>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Imagem</th>
                  <th>Produto</th>
                  <th style={{ textAlign: 'center' }}>Custo</th>
                  <th style={{ textAlign: 'center' }}>Venda</th>
                  <th style={{ textAlign: 'center' }}>Margem</th>
                  <th style={{ textAlign: 'center' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {draftItems.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <img src={item.imagem} alt="thumb" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.nome}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{item.codigo_barras}</div>
                    </td>
                    <td style={{ textAlign: 'center', fontSize: '0.9rem' }}>R$ {item.custo.toFixed(2)}</td>
                    <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>R$ {item.preco_sugerido.toFixed(2)}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ 
                        background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', 
                        fontSize: '0.8rem', fontWeight: 600, color: 'var(--secondary)' 
                      }}>
                        {item.margem.toFixed(1)}%
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        onClick={() => setDraftItems(draftItems.filter((_, i) => i !== idx))}
                        style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.75rem' }}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
