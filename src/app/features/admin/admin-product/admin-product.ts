import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { Product, ProductRequestDTO, Category } from '../models/admin-product.model';
import { ProductService } from '../../../api/product-service';
import { CommonModule } from '@angular/common';
import { AddProductModal } from './add-product-modal/add-product-modal';

@Component({
  selector: 'app-admin-product',
  imports: [CommonModule, AddProductModal],
  templateUrl: './admin-product.html',
  styleUrl: './admin-product.css',
})
export class AdminProduct implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = true;
  searchTerm = '';
  activeFilter: 'all' | 'active' | 'inactive' = 'all';

  // Modal state
  isAddModalOpen = false;
  isSubmitting = false;
  editingProduct: Product | null = null;
  backendErrors: { [key: string]: string } | null = null;

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (resp) => {
        this.isLoading = false;
        this.products = resp.data;
        this.filteredProducts = resp.data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      },
    });
  }

  // Modal methods
  openAddModal(): void {
    this.editingProduct = null;
    this.isAddModalOpen = true;
  }

  openEditModal(product: Product): void {
    this.editingProduct = product;
    this.isAddModalOpen = true;
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
    this.isSubmitting = false;
    this.editingProduct = null;
    this.backendErrors = null;
  }

  onSaveProduct(productData: ProductRequestDTO): void {
    this.isSubmitting = true;

    if (this.editingProduct) {
      // Update existing product
      this.productService.updateProduct(this.editingProduct.id, productData).subscribe({
        next: (resp) => {
          const updatedProduct = {
            ...resp.data,
            createdAt: new Date(resp.data.createdAt),
          };
          const index = this.products.findIndex((p) => p.id === this.editingProduct!.id);
          if (index !== -1) {
            this.products[index] = updatedProduct;
            this.products = [...this.products];
          }
          this.filterProducts();
          this.closeAddModal();
        },
        error: (error) => {
            console.error('Error updating product:', error);
            this.isSubmitting = false;
            if (error.error && typeof error.error === 'object') {
              this.backendErrors = error.error;
            } else {
              alert('Erreur lors de la mise à jour du produit');
            }
        },
      });
    } else {
      // Create new product
      this.productService.createProduct(productData).subscribe({
        next: (resp) => {
          const newProduct = {
            ...resp.data,
            createdAt: new Date(resp.data.createdAt),
          };
          this.products = [newProduct, ...this.products];
          this.filterProducts();
          this.closeAddModal();
        },
        error: (error) => {
            console.error('Error creating product:', error);
            this.isSubmitting = false;
            if (error.error && typeof error.error === 'object') {
              this.backendErrors = error.error;
            } else {
              alert('Erreur lors de la création du produit');
            }
        },
      });
    }
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.filterProducts();
  }

  onFilterChange(filter: 'all' | 'active' | 'inactive'): void {
    this.activeFilter = filter;
    this.filterProducts();
  }

  private filterProducts(): void {
    let filtered = this.products;

    if (this.searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.activeFilter === 'active') {
      filtered = filtered.filter((product) => product.active);
    } else if (this.activeFilter === 'inactive') {
      filtered = filtered.filter((product) => !product.active);
    }

    this.filteredProducts = filtered;
  }

  calculateMargin(product: Product): number {
    return ((product.sellingPrice - product.purchasePrice) / product.sellingPrice) * 100;
  }


}
