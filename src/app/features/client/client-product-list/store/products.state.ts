import { Product } from '../../models/product.model';

export interface ProductsQuery {
  page: number;
  size: number;
  sort: string;
  search: string;
  category: string;
  active: boolean;
}

export const DEFAULT_PRODUCTS_QUERY: ProductsQuery = {
  active: true,
  page: 0,
  size: 10,
  sort: 'name,asc',
  search: '',
  category: ''
};

export interface ProductsState {
  query: ProductsQuery;
  items: Product[];
  totalElements: number;
  totalPages: number;
  loading: boolean;
  error: { status: number; message: string; detail?: string } | null;
}

export const initialState: ProductsState = {
  query: DEFAULT_PRODUCTS_QUERY,
  items: [],
  totalElements: 0,
  totalPages: 0,
  loading: false,
  error: null
};
