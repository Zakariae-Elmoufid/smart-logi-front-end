export interface Product {
  id: number;
  name: string;
  sku: string;
  sellingPrice: number;
  purchasePrice: number;
  active: boolean;
  createdAt: Date;
  categoryId?: number;
  category?: Category;
}

export interface ProductsQuery {
  page: number;
  size: number;
  sort: string; // ex: 'name,asc'
  search: string;
  category: string;
  active: boolean;
}

export interface ProductsState {
  query: ProductsQuery;
  items: Product[];
  totalElements: number;
  totalPages: number;
  loading: boolean;
  error: { status: number; message: string; detail?: string } | null;
}


export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface ProductRequestDTO {
  name: string;
  sku: string;
  sellingPrice: number;
  purchasePrice: number;
  active: boolean;
  categoryId: number;
}

export interface ApiResponse<T> {
  message: string;
  status: number;
  data: T;
}
