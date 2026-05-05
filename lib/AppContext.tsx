'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductEnvio, Order } from './types';

interface AppContextType {
  orders: Order[];
  addOrder: (nome: string, produtos: Omit<ProductEnvio, 'id' | 'status' | 'data_envio'>[]) => void;
  updateOrderProduct: (orderId: string, productId: string, newPrice: number, newMargin: number, isChange: boolean) => void;
  keepProductInOrder: (orderId: string, productId: string) => void;
  concludeOrder: (orderId: string) => void;
  startProcessingOrder: (orderId: string) => void;
  confirmOrderResponse: (orderId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('precifica_orders');
    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved orders', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('precifica_orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (nome: string, produtos: Omit<ProductEnvio, 'id' | 'status' | 'data_envio'>[]) => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      nome,
      mercado: 'Mercado Central',
      data_criacao: new Date().toISOString(),
      status: 'pendente',
      produtos: produtos.map(p => ({
        ...p,
        id: Math.random().toString(36).substr(2, 9),
        status: 'pendente',
        data_envio: new Date().toISOString(),
      })),
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrderProduct = (orderId: string, productId: string, newPrice: number, newMargin: number, isChange: boolean) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      return {
        ...order,
        produtos: order.produtos.map(p => {
          if (p.id !== productId) return p;
          return {
            ...p,
            preco_final: newPrice,
            margem: newMargin,
            status: isChange ? 'alterado' : 'aprovado'
          };
        })
      };
    }));
  };

  const keepProductInOrder = (orderId: string, productId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      return {
        ...order,
        produtos: order.produtos.map(p => {
          if (p.id !== productId) return p;
          return {
            ...p,
            preco_final: p.preco_sugerido,
            status: 'verificado'
          };
        })
      };
    }));
  };

  const concludeOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      return { ...order, status: 'concluido' };
    }));
  };

  const startProcessingOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      return { ...order, status: 'processando' };
    }));
  };

  const confirmOrderResponse = (orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      return { ...order, status: 'confirmado' };
    }));
  };

  return (
    <AppContext.Provider value={{ orders, addOrder, updateOrderProduct, keepProductInOrder, concludeOrder, startProcessingOrder, confirmOrderResponse }}>
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
