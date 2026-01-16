import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
    WarehouseResponseDTO,
    WarehouseRequestDTO,
    ApiResponse,
} from '../features/manager/models/warehouse.model';

@Injectable({
    providedIn: 'root',
})
export class WarehouseService {
    private apiUrl = `${environment.apiUrl}/manager/warehouses`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<ApiResponse<WarehouseResponseDTO[]>> {
        return this.http.get<ApiResponse<WarehouseResponseDTO[]>>(this.apiUrl);
    }

    getById(id: number): Observable<ApiResponse<WarehouseResponseDTO>> {
        return this.http.get<ApiResponse<WarehouseResponseDTO>>(`${this.apiUrl}/${id}`);
    }

    create(warehouse: WarehouseRequestDTO): Observable<ApiResponse<WarehouseResponseDTO>> {
        return this.http.post<ApiResponse<WarehouseResponseDTO>>(this.apiUrl, warehouse);
    }

    update(
        id: number,
        warehouse: WarehouseRequestDTO
    ): Observable<ApiResponse<WarehouseResponseDTO>> {
        return this.http.put<ApiResponse<WarehouseResponseDTO>>(`${this.apiUrl}/${id}`, warehouse);
    }

    delete(id: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
    }
}
