export interface Category {
  id: number;
  name: string;
  description: string;
  active: boolean;
  createdAt?: string;
}

export interface CategoryRequest {
  name: string;
  description: string;
  active: boolean;
}

// Aliases for backward compatibility
export type CategoryResponseDTO = Category;
export type CategoryRequestDTO = CategoryRequest;

export interface ApiResponse<T> {
  message: string;
  status: number;
  data: T;
}
