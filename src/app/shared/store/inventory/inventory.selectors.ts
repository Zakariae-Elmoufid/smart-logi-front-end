import { createFeatureSelector, createSelector } from '@ngrx/store';
import { InventoryState, initialInventoryState } from './inventory.state';

// Feature selector
export const selectInventoryState = createFeatureSelector<InventoryState>('inventory');

// Select all inventory items
export const selectInventoryItems = createSelector(
  selectInventoryState,
  (state) => state?.items ?? []
);

// Select stock map by product name
export const selectStockByProductName = createSelector(
  selectInventoryState,
  (state) => state?.stockByProductName ?? {}
);

// Select loading state
export const selectInventoryLoading = createSelector(
  selectInventoryState,
  (state) => state?.loading ?? false
);

// Select loaded state
export const selectInventoryLoaded = createSelector(
  selectInventoryState,
  (state) => state?.loaded ?? false
);

// Select error
export const selectInventoryError = createSelector(
  selectInventoryState,
  (state) => state?.error ?? null
);

// Select stock for a specific product by name
export const selectStockForProduct = (productName: string) =>
  createSelector(
    selectStockByProductName,
    (stockMap) => stockMap[productName] ?? 0
  );

// Select total available stock
export const selectTotalStock = createSelector(
  selectStockByProductName,
  (stockMap) => Object.values(stockMap).reduce((sum, stock) => sum + stock, 0)
);

// Check if inventory has items
export const selectHasInventory = createSelector(
  selectInventoryItems,
  (items) => items.length > 0
);
