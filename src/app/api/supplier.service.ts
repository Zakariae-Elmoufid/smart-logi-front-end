import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../features/manager/models/inventory.model';
import { Supplier } from '../features/manager/models/supplier.model';

@Injectable({
    providedIn: 'root'
})
export class SupplierService {
    private apiUrl = `${environment.apiUrl}/manager/suppliers`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<ApiResponse<Supplier[]>> {
        return this.http.get<ApiResponse<Supplier[]>>(this.apiUrl);
    }
}
