'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductEnvio, Order, UserProfile } from './types';
import { supabase } from './supabase';
import { useRouter } from 'next/navigation';

interface AppContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  orders: Order[];
  addOrder: (nome: string, produtos: Omit<ProductEnvio, 'id' | 'status' | 'data_envio'>[]) => void;
  updateOrderProduct: (orderId: string, productId: string, newPrice: number, newMargin: number, isChange: boolean) => void;
  keepProductInOrder: (orderId: string, productId: string) => void;
  concludeOrder: (orderId: string) => void;
  startProcessingOrder: (orderId: string) => void;
  confirmOrderResponse: (orderId: string) => void;
  logout: () => void;
  fetchOrders: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  // Load user session from local storage on mount (simple auth simulation)
  useEffect(() => {
    const savedUser = localStorage.getItem('precifica_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('precifica_user', JSON.stringify(user));
      fetchOrders();
      
      // Real-time subscription mais robusta
      const channel = supabase
        .channel('db-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
          console.log('Ordem alterada:', payload);
          fetchOrders();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
          console.log('Produto alterado:', payload);
          fetchOrders();
        })
        .subscribe((status) => {
          console.log('Status da inscrição real-time:', status);
        });

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      localStorage.removeItem('precifica_user');
      setOrders([]);
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    let query = supabase.from('orders').select('*, produtos:products(*)');

    // Filter based on role
    if (user.role === 'admin') {
      // Lojista sees orders assigned to them
      query = query.eq('lojista_id', user.id);
    } else if (user.role === 'employee') {
      // O funcionário só vê os pedidos que ele mesmo enviou (baseado no nome gravado em 'mercado')
      query = query.eq('lojista_id', user.parent_id).eq('mercado', user.nome);
    }

    const { data, error } = await query.order('data_criacao', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
    }
  };

  const addOrder = async (nome: string, produtos: Omit<ProductEnvio, 'id' | 'status' | 'data_envio'>[]) => {
    if (!user) return;

    // Redireciona o lojista_id (se for funcionário, o lojista é o parent_id)
    const lojistaId = user.role === 'employee' ? user.parent_id : user.id;

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        nome,
        mercado: user.nome || 'Mercado Central',
        status: 'pendente',
        lojista_id: lojistaId
      })
      .select()
      .single();

    if (orderError) return;

    const productsToInsert = produtos.map(p => ({
      order_id: orderData.id,
      nome: p.nome,
      codigo_barras: p.codigo_barras,
      imagem: p.imagem,
      custo: p.custo,
      preco_sugerido: p.preco_sugerido,
      margem: p.margem,
      status: 'pendente'
    }));

    await supabase.from('products').insert(productsToInsert);
  };

  const updateOrderProduct = async (orderId: string, productId: string, newPrice: number, newMargin: number, isChange: boolean) => {
    // Optimistic update
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        produtos: o.produtos.map(p => 
          p.id === productId 
            ? { ...p, preco_final: newPrice, margem: newMargin, status: isChange ? 'alterado' : 'aprovado' } 
            : p
        )
      };
    }));
    await supabase.from('products').update({
      preco_final: newPrice,
      margem: newMargin,
      status: isChange ? 'alterado' : 'aprovado'
    }).eq('id', productId);
  };

  const keepProductInOrder = async (orderId: string, productId: string) => {
    const order = orders.find(o => o.id === orderId);
    const product = order?.produtos.find(p => p.id === productId);
    if (!product) return;

    // Optimistic update
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        produtos: o.produtos.map(p => 
          p.id === productId 
            ? { ...p, preco_final: product.preco_sugerido, status: 'verificado' } 
            : p
        )
      };
    }));

    await supabase.from('products').update({
      preco_final: product.preco_sugerido,
      status: 'verificado'
    }).eq('id', productId);
  };

  const concludeOrder = async (orderId: string) => {
    const now = new Date().toISOString();
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'concluido', data_conclusao: now } : o));
    
    const { error } = await supabase.from('orders').update({ status: 'concluido', data_conclusao: now }).eq('id', orderId);
    
    if (error) {
      console.error('Erro ao concluir (provavelmente falta a coluna data_conclusao):', error);
      // Fallback: tenta atualizar apenas o status
      await supabase.from('orders').update({ status: 'concluido' }).eq('id', orderId);
    }
  };

  const startProcessingOrder = async (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'processando' } : o));
    await supabase.from('orders').update({ status: 'processando' }).eq('id', orderId);
  };

  const confirmOrderResponse = async (orderId: string) => {
    const now = new Date().toISOString();
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'confirmado', data_confirmacao: now } : o));
    
    const { error } = await supabase.from('orders').update({ status: 'confirmado', data_confirmacao: now }).eq('id', orderId);
    
    if (error) {
      console.error('Erro ao confirmar (provavelmente falta a coluna data_confirmacao):', error);
      // Fallback: tenta atualizar apenas o status
      await supabase.from('orders').update({ status: 'confirmado' }).eq('id', orderId);
    }
  };

  const logout = () => {
    setUser(null);
    router.push('/login');
  };

  return (
    <AppContext.Provider value={{ user, setUser, orders, addOrder, updateOrderProduct, keepProductInOrder, concludeOrder, startProcessingOrder, confirmOrderResponse, logout, fetchOrders }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
