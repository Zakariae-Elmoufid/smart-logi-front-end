import { createReducer, on } from '@ngrx/store';
import { InventoryState, initialInventoryState } from './inventory.state';
import * as InventoryActions from './inventory.actions';

export const inventoryReducer = createReducer(
  initialInventoryState,

  on(InventoryActions.loadInventory, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(InventoryActions.loadInventorySuccess, (state, { items }) => {
    // Build stock map by product name (sum stock across all warehouses)
    const stockByProductName: { [productName: string]: number } = {};
    
    items.forEach(inv => {
      const availableStock = inv.quantityOnHand - inv.quantityReserved;
      if (!stockByProductName[inv.productName]) {
        stockByProductName[inv.productName] = 0;
      }
      stockByProductName[inv.productName] += availableStock;
    });

    return {
      ...state,
      items,
      stockByProductName,
      loading: false,
      loaded: true
    };
  }),

  on(InventoryActions.loadInventoryFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
    loaded: false
  })),

  on(InventoryActions.clearInventoryError, (state) => ({
    ...state,
    error: null
  })),

  on(InventoryActions.refreshInventory, (state) => ({
    ...state,
    loaded: false,
    loading: true,
    error: null
  }))
);
