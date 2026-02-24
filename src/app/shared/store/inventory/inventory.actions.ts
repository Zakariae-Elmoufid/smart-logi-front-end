import { createAction, props } from '@ngrx/store';
import { InventoryResponseDTO } from '../../../features/manager/models/inventory.model';

// Load inventory
export const loadInventory = createAction('[Inventory] Load Inventory');

export const loadInventorySuccess = createAction(
  '[Inventory] Load Inventory Success',
  props<{ items: InventoryResponseDTO[] }>()
);

export const loadInventoryFailure = createAction(
  '[Inventory] Load Inventory Failure',
  props<{ error: { status: number; message: string; detail?: string } }>()
);

// Clear error
export const clearInventoryError = createAction('[Inventory] Clear Error');

// Refresh inventory (force reload)
export const refreshInventory = createAction('[Inventory] Refresh Inventory');
