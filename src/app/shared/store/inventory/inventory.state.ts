import { InventoryResponseDTO } from '../../../features/manager/models/inventory.model';

export interface InventoryState {
  items: InventoryResponseDTO[];
  stockByProductName: { [productName: string]: number };
  loading: boolean;
  loaded: boolean;
  error: { status: number; message: string; detail?: string } | null;
}

export const initialInventoryState: InventoryState = {
  items: [],
  stockByProductName: {},
  loading: false,
  loaded: false,
  error: null
};
