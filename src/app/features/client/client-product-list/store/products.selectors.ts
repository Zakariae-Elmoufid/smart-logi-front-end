import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState, DEFAULT_PRODUCTS_QUERY } from './products.state';

// Initial state for fallback
const initialState: ProductsState = {
  query: DEFAULT_PRODUCTS_QUERY,
  items: [],
  totalElements: 0,
  totalPages: 0,
  loading: false,
  error: null
};

export const selectProductsState = createFeatureSelector<ProductsState>('products');

export const selectProductsItems = createSelector(
  selectProductsState,
  state => state?.items ?? []
);

export const selectProductsQuery = createSelector(
  selectProductsState,
  state => state?.query ?? DEFAULT_PRODUCTS_QUERY
);

export const selectProductsLoading = createSelector(
  selectProductsState,
  state => state?.loading ?? false
);

export const selectProductsError = createSelector(
  selectProductsState,
  state => state?.error ?? null
);

export const selectProductsTotals = createSelector(
  selectProductsState,
  state => ({
    totalElements: state?.totalElements ?? 0,
    totalPages: state?.totalPages ?? 0,
    currentPage: state?.query?.page ?? 0,
    size: state?.query?.size ?? 10
  })
);

export const selectHasProducts = createSelector(
  selectProductsItems,
  (items) => items.length > 0
);

export const selectIsEmpty = createSelector(
  selectProductsLoading,
  selectProductsItems,
  (loading, items) => !loading && items.length === 0
);
