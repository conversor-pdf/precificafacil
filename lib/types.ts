export type UserRole = 'admin' | 'employee';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  market?: string;
}

export interface ProductBase {
  codigo_barras: string;
  nome: string;
  imagem: string;
}

export type ProductStatus = 'pendente' | 'aprovado' | 'alterado' | 'verificado';

export interface ProductEnvio {
  id: string;
  codigo_barras: string;
  nome: string;
  imagem: string;
  mercado: string;
  custo: number;
  preco_sugerido: number; // The price employee suggested
  preco_final?: number;   // The price admin approved
  margem: number;
  status: ProductStatus;
  data_envio: string;
}

export interface Order {
  id: string;
  nome: string;
  mercado: string;
  data_criacao: string;
  status: 'pendente' | 'processando' | 'concluido' | 'confirmado';
  produtos: ProductEnvio[];
}

export interface Stats {
  pendentes: number;
  hoje: number;
  aprovados: number;
  margem_media: number;
}
