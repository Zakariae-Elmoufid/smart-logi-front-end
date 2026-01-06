import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Product, ProductService} from '../services/product-service';
import {CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-component',
  imports: [
    CommonModule
  ],
  templateUrl: './product-component.html',
  styleUrl: './product-component.css',
  standalone :  true,
})
export class ProductComponent  implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts() {
   this.productService.getProducts().subscribe(
      {
        next:  (resp) =>  {
          console.log(resp.data);
          this.products = resp.data;
        },
        error :err => {
          console.log('error ',err)
        }
      }
    );
  }



}
