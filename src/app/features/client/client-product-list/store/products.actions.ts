import { createAction, props } from '@ngrx/store';
import { ProductsQuery } from './products.state';
import { Product } from '../../models/product.model';

export const setQuery = createAction(
  '[Products] Set Query',
  props<{ partialQuery: Partial<ProductsQuery> }>()
);

export const loadProducts = createAction(
  '[Products] Load Products',
  props<{ query: ProductsQuery }>()
);

export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ items: Product[]; totalElements: number; totalPages: number }>()
);

export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  props<{ error: { status: number; message: string; detail?: string } }>()
);

export const resetQuery = createAction('[Products] Reset Query');
export const clearError = createAction(
  '[Products] Clear Error'
);
