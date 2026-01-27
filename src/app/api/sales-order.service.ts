import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  SalesOrder,
  SalesOrderRequest,
  ApiResponse,
} from '../features/client/models/sales-order.model';

@Injectable({
  providedIn: 'root',
})
export class SalesOrderService {
  private clientApiUrl = `${environment.apiUrl}/client`;
  private adminApiUrl = `${environment.apiUrl}/admin`;
  private managerApiUrl = `${environment.apiUrl}/manager`;

  constructor(private http: HttpClient) {}

  // Client methods
  createOrder(order: SalesOrderRequest): Observable<ApiResponse<SalesOrder>> {
      return this.http.post<ApiResponse<SalesOrder>>(`${this.clientApiUrl}/salse-order`, order);
  }

  getClientOrders(): Observable<ApiResponse<SalesOrder[]>> {
    return this.http.get<ApiResponse<SalesOrder[]>>(`${this.clientApiUrl}/salse-order`);
  }

  getMyOrders(): Observable<ApiResponse<SalesOrder[]>> {
    return this.http.get<ApiResponse<SalesOrder[]>>(`${this.clientApiUrl}/salse-order/my-orders`);
  }

  // Admin methods
  getAllOrders(): Observable<ApiResponse<SalesOrder[]>> {
    return this.http.get<ApiResponse<SalesOrder[]>>(`${this.adminApiUrl}/salse-order`);
  }

  getOrderById(id: number): Observable<ApiResponse<SalesOrder>> {
    return this.http.get<ApiResponse<SalesOrder>>(`${this.adminApiUrl}/salse-order/${id}`);
  }

  confirmOrder(id: number): Observable<ApiResponse<SalesOrder>> {
    return this.http.get<ApiResponse<SalesOrder>>(`${this.adminApiUrl}/salse-order/${id}/confirm`);
  }

  cancelOrder(id: number): Observable<ApiResponse<SalesOrder>> {
    return this.http.get<ApiResponse<SalesOrder>>(`${this.adminApiUrl}/salse-order/${id}/cancel`);
  }

  // Manager methods
  getManagerOrders(): Observable<ApiResponse<SalesOrder[]>> {
    return this.http.get<ApiResponse<SalesOrder[]>>(`${this.managerApiUrl}/sales-order`);
  }
}
