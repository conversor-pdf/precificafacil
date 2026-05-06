export type UserRole = 'super_admin' | 'admin' | 'employee';

export interface UserProfile {
  id: string;
  email: string;
  nome: string;
  role: UserRole;
  parent_id?: string;
  mercado?: string;
  data_criacao: string;
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
  preco_sugerido: number;
  preco_final?: number;
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
  lojista_id?: string;
}

export interface Stats {
  pendentes: number;
  hoje: number;
  aprovados: number;
  margem_media: number;
}
