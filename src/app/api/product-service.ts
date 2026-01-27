import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable, tap } from 'rxjs';
import {
  Product,
  ApiResponse,
  Category,
  ProductRequestDTO,
} from '../features/admin/models/admin-product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/products`).pipe(
      map((resp: ApiResponse<Product[]>) => ({
        ...resp,
        data: resp.data.map((p) => ({
          ...p,
          createdAt: new Date(p.createdAt),
        })),
      }))
    );
  }

  createProduct(product: ProductRequestDTO): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(`${this.apiUrl}/products`, product);
  }

  updateProduct(id: number, product: ProductRequestDTO): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/products/${id}`, product);
  }

  list(query: any): Observable<{ items: Product[]; totalElements: number; totalPages: number }> {
    let params = new HttpParams();
    Object.keys(query).forEach(key => {
      if (query[key] !== null && query[key] !== undefined && query[key] !== '') {
        params = params.set(key, query[key]);
      }
    });
    
    console.log('ProductService.list() - Calling API with params:', params.toString());
    
    return this.http.get<any>(`${this.apiUrl}/products`, { params }).pipe(
      tap(response => console.log('ProductService.list() - Raw API response:', response)),
      map(response => {
        // Handle different API response formats:
        // 1. ApiResponse wrapper: { message, status, data: [...] }
        // 2. Spring Boot Page: { content: [], totalElements, totalPages, ... }
        // 3. Custom paginated: { items: [], totalElements, totalPages }
        // 4. Direct array: [...]
        
        let items: Product[] = [];
        let totalElements = 0;
        let totalPages = 0;
        
        if (Array.isArray(response)) {
          // Direct array response
          items = response;
          totalElements = response.length;
          totalPages = 1;
        } else if (response.data) {
          // ApiResponse wrapper
          if (Array.isArray(response.data)) {
            items = response.data;
            totalElements = response.data.length;
            totalPages = 1;
          } else {
            // Nested pagination inside data
            items = response.data.content || response.data.items || [];
            totalElements = response.data.totalElements || items.length;
            totalPages = response.data.totalPages || 1;
          }
        } else if (response.content) {
          // Spring Boot Page format
          items = response.content;
          totalElements = response.totalElements || items.length;
          totalPages = response.totalPages || 1;
        } else if (response.items) {
          // Custom format
          items = response.items;
          totalElements = response.totalElements || items.length;
          totalPages = response.totalPages || 1;
        }
        
        const result = { items, totalElements, totalPages };
        console.log('ProductService.list() - Mapped result:', result);
        return result;
      })
    );
  }
}
