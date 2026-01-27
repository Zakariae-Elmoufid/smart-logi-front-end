import { createReducer, on } from '@ngrx/store';
import { ProductsState, DEFAULT_PRODUCTS_QUERY } from './products.state';

import * as ProductsActions from './products.actions';

export const initialState: ProductsState = {
  query: DEFAULT_PRODUCTS_QUERY,
  items: [],
  totalElements: 0,
  totalPages: 0,
  loading: false,
  error: null
};

export const productsReducer = createReducer(
  initialState,
  on(ProductsActions.setQuery, (state, { partialQuery }) => ({
    ...state,
    query: { ...state.query, ...partialQuery },
    loading: true,
    error: null
  })),

  on(ProductsActions.loadProducts, state => ({ ...state, loading: true, error: null })),

  on(ProductsActions.loadProductsSuccess, (state, { items, totalElements, totalPages }) => ({
    ...state,
    items,
    totalElements,
    totalPages,
    loading: false
  })),

  on(ProductsActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(ProductsActions.resetQuery, (state) => ({
    ...state,
    query: DEFAULT_PRODUCTS_QUERY,
    error: null
  })),
  on(ProductsActions.clearError, (state) => ({
    ...state,
    error: null
  }))
);
