export interface InventoryRequestDTO {
    productId: number;
    warehouseId: number;
}

export interface InventoryResponseDTO {
    id: number;
    quantityOnHand: number;
    quantityReserved: number;
    productName: string;
    warehouseName: string;
}

export interface InventoryMovementRequestDTO {
    inventoryId: number;
    quantity: number;
}

export interface InventoryMovementResponseDTO {
    id: number;
    quantity: number;
    inventoryId: number;
    movementType: MovementType;
    createdAt: string;
}

export enum MovementType {
    INBOUND = 'INBOUND',
    OUTBOUND = 'OUTBOUND',
    ADJUSTMENT = 'ADJUSTMENT'
}


export interface ApiResponse<T> {
  message: string;
  status: number;
  data: T;
}
