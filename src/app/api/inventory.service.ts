import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
    InventoryMovementRequestDTO,
    InventoryMovementResponseDTO,
    InventoryRequestDTO,
    InventoryResponseDTO,
  ApiResponse
} from '../features/manager/models/inventory.model';

@Injectable({
    providedIn: 'root'
})
export class InventoryService {
    private apiUrl = `${environment.apiUrl}/manager/inventories`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<ApiResponse<InventoryResponseDTO[]>> {
        return this.http.get<ApiResponse<InventoryResponseDTO[]>>(this.apiUrl);
    }

    getById(id: number): Observable<ApiResponse<InventoryResponseDTO>> {
        return this.http.get<ApiResponse<InventoryResponseDTO>>(`${this.apiUrl}/${id}`);
    }

    create(dto: InventoryRequestDTO): Observable<ApiResponse<InventoryResponseDTO>> {
        return this.http.post<ApiResponse<InventoryResponseDTO>>(this.apiUrl, dto);
    }

    recordInbound(dto: InventoryMovementRequestDTO): Observable<ApiResponse<InventoryMovementResponseDTO>> {
        return this.http.post<ApiResponse<InventoryMovementResponseDTO>>(`${this.apiUrl}/inbound`, dto);
    }

    recordOutbound(dto: InventoryMovementRequestDTO): Observable<ApiResponse<InventoryMovementResponseDTO>> {
        return this.http.post<ApiResponse<InventoryMovementResponseDTO>>(`${this.apiUrl}/outbound`, dto);
    }

    recordAdjustment(dto: InventoryMovementRequestDTO): Observable<ApiResponse<InventoryMovementResponseDTO>> {
        return this.http.post<ApiResponse<InventoryMovementResponseDTO>>(`${this.apiUrl}/adjustment`, dto);
    }
}
