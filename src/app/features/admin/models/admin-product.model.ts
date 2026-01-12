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
