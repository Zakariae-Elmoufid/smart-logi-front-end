export interface SalesOrderLineRequest {
  productId: number;
  quantityRequested: number;
}

export interface SalesOrderRequest {
  liens: SalesOrderLineRequest[];
}

export interface SalesOrderLineResponse {
  id: number;
  productId: number;
  productName: string;
  quantityRequested: number;
  quantityReserved: number;
  quantityBackorder: number;
  price: number;
  totalPrice: number;
}

export interface SalesOrder {
  id: number;
  clientId: number;
  orderStatus: 'CREATED' | 'RESERVED' | 'SHIPPED' | 'DELIVERED' | 'PARTIALLY_RESERVED' | 'CONFIRMED' | 'CANCELED';
  createdAt: string;
  orderLines: SalesOrderLineResponse[];
  message: string;
  totalAmount?: number;
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
