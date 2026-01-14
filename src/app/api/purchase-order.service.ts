import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../features/manager/models/inventory.model';
import { PurchaseOrderRequestDTO, PurchaseOrderResponseDTO } from '../features/manager/models/purchase-order.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  private apiUrl = `${environment.apiUrl}/manager/purchase-orders`;

  constructor(private http: HttpClient) { }

  createPurchaseOrder(order: PurchaseOrderRequestDTO): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(this.apiUrl, order);
  }

  getAllPurchaseOrders(): Observable<ApiResponse<PurchaseOrderResponseDTO[]>> {
    return this.http.get<ApiResponse<PurchaseOrderResponseDTO[]>>(this.apiUrl);
  }

  getPurchaseOrderById(id: number): Observable<ApiResponse<PurchaseOrderResponseDTO>> {
    return this.http.get<ApiResponse<PurchaseOrderResponseDTO>>(`${this.apiUrl}/${id}`);
  }

  approvePurchaseOrder(id: number): Observable<ApiResponse<string>> {
    return this.http.patch<ApiResponse<string>>(`${this.apiUrl}/${id}/approve`,{});
  }

  receivePurchaseOrder(id: number): Observable<ApiResponse<string>> {
    return this.http.patch<ApiResponse<string>>(`${this.apiUrl}/${id}/receive`,{});
  }
}
