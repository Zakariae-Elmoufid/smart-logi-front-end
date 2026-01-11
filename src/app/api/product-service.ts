import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
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


}
