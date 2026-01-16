import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Carrier,
  CarrierRequest,
  ApiResponse,
} from '../features/manager/models/carrier.model';

@Injectable({
  providedIn: 'root',
})
export class CarrierService {
  private apiUrl = `${environment.apiUrl}/manager/carriers`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Carrier[]>> {
    return this.http.get<ApiResponse<Carrier[]>>(this.apiUrl);
  }

  getById(id: number): Observable<ApiResponse<Carrier>> {
    return this.http.get<ApiResponse<Carrier>>(`${this.apiUrl}/${id}`);
  }

  create(carrier: CarrierRequest): Observable<ApiResponse<Carrier>> {
    return this.http.post<ApiResponse<Carrier>>(this.apiUrl, carrier);
  }

  update(id: number, carrier: CarrierRequest): Observable<ApiResponse<Carrier>> {
    return this.http.put<ApiResponse<Carrier>>(`${this.apiUrl}/${id}`, carrier);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
