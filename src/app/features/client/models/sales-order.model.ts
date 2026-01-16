export interface SalesOrderLineRequest {
  productId: number;
  quantity: number;
}

export interface SalesOrderRequest {
  liens: SalesOrderLineRequest[];
}

export interface SalesOrderLine {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface SalesOrder {
  id: number;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED';
  createdAt: string;
  totalAmount: number;
  clientName?: string;
  lines: SalesOrderLine[];
}

export interface ApiResponse<T> {
  message: string;
  status: number;
  data: T;
}

export interface CartItem {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  stock: number;
}
