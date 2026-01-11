import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { ApiResponse, Category } from '../features/admin/models/admin-product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<any>(`${this.apiUrl}/categories`).pipe(
      tap((response) => console.log('API Response:', response)),
      map((response) => {
        // Handle different response formats
        if (Array.isArray(response)) {
          return response;
        }
        if (response?.data) {
          return response.data;
        }
        if (response?.content) {
          return response.content;
        }
        return [];
      })
    );
  }
}
