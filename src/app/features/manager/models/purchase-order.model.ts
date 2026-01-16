export interface PurchaseOrderRequestDTO {
  supplierId: number;
  warehouseId: number;
  expectedDate: string;
  liens: PurchaseOrderLineRequestDTO[];
}

export interface PurchaseOrderLineRequestDTO {
  productId: number;
  quantity: number;
}


export interface PurchaseOrderResponseDTO {
  id: number;
  supplierId: number;
  warehouseId: number;
  supplierName?: string;
  warehouseName?: string;
  orderStatus: 'CREATED' | 'APPROVED' | 'RECEIVED' | 'PARTIALLY_RECEIVED' | 'CANCELED';
  expiryDate?: string;
  orderDate: string;
  expectedDate?: string;
  liens: PurchaseOrderLineResponseDTO[];
}

export interface PurchaseOrderLineResponseDTO {
  id: number;
  quantity: number;
  unitPrice?: number;
  productId: number;
  productName: string;
}
