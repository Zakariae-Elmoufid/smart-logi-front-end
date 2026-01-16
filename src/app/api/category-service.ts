import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CategoryResponseDTO,
  CategoryRequestDTO,
  ApiResponse,
} from '../features/admin/models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/admin/categories`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<ApiResponse<CategoryResponseDTO[]>> {
    return this.http.get<ApiResponse<CategoryResponseDTO[]>>(this.apiUrl);
  }

  getCategory(id: number): Observable<ApiResponse<CategoryResponseDTO>> {
    return this.http.get<ApiResponse<CategoryResponseDTO>>(`${this.apiUrl}/${id}`);
  }

  createCategory(category: CategoryRequestDTO): Observable<ApiResponse<CategoryResponseDTO>> {
    return this.http.post<ApiResponse<CategoryResponseDTO>>(this.apiUrl, category);
  }

  updateCategory(
    id: number,
    category: CategoryRequestDTO
  ): Observable<ApiResponse<CategoryResponseDTO>> {
    return this.http.put<ApiResponse<CategoryResponseDTO>>(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
