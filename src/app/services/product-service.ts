import {ApplicationConfig, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';


export interface Product {
  id: number;
  name: string;
  sku: string;
  sellingPrice: number;
  purchasePrice :number;
  active: boolean;
  createdAt : Date;

}

export interface ApiResponse<T> {
  message: string;
  status: number;
  data: T;
}


@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private domain = 'http://localhost:8081';


  constructor(private http: HttpClient) {

  }

  getProducts(): Observable<ApiResponse<Product[]>>  {
    return this.http.get<ApiResponse<Product[]>>(`${this.domain}/api/admin/products`)
      .pipe(
        map((resp: ApiResponse<Product[]>) => ({
          ...resp,
          data: resp.data.map(p => ({
            ...p,
            createdAt: new Date(p.createdAt)
          }))
        }))
      );
  }


}
