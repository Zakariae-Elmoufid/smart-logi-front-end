import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Manager,
  ManagerCreateDTO,
  ManagerUpdateDTO,
  ApiResponse,
} from '../features/admin/models/manager.model';

@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  private apiUrl = `${environment.apiUrl}/admin/managers`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Manager[]>> {
    return this.http.get<ApiResponse<Manager[]>>(this.apiUrl);
  }

  getById(id: number): Observable<ApiResponse<Manager>> {
    return this.http.get<ApiResponse<Manager>>(`${this.apiUrl}/${id}`);
  }

  create(manager: ManagerCreateDTO): Observable<ApiResponse<Manager>> {
    return this.http.post<ApiResponse<Manager>>(this.apiUrl, manager);
  }

  update(id: number, manager: ManagerUpdateDTO): Observable<ApiResponse<Manager>> {
    return this.http.put<ApiResponse<Manager>>(`${this.apiUrl}/${id}`, manager);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
