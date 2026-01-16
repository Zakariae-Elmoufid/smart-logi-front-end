import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../../api/product-service';
import { CartService } from '../../../api/cart.service';
import { InventoryService } from '../../../api/inventory.service';
import { Product } from '../../admin/models/admin-product.model';
import { InventoryResponseDTO } from '../../manager/models/inventory.model';

// Extended product interface with stock info
interface ProductWithStock extends Product {
  stockQuantity?: number;
}

@Component({
  selector: 'app-client-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-product-list.html',
})
export class ClientProductList implements OnInit {
  products: ProductWithStock[] = [];
  filteredProducts: ProductWithStock[] = [];
  isLoading = false;
  searchQuery = '';
  selectedCategory = '';
  categories: string[] = [];
  
  // Quantity inputs for each product
  quantities: { [productId: number]: number } = {};
  
  // Toast
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private productService: ProductService,
    private inventoryService: InventoryService,
    public cartService: CartService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    
    // Load both products and inventory data
    forkJoin({
      products: this.productService.getProducts(),
      inventory: this.inventoryService.getAll()
    }).subscribe({
      next: ({ products, inventory }) => {
        // Create a map of product name to total stock across all warehouses
        const stockMap = new Map<string, number>();
        inventory.data.forEach((inv: InventoryResponseDTO) => {
          const currentStock = stockMap.get(inv.productName) || 0;
          stockMap.set(inv.productName, currentStock + inv.quantityOnHand);
        });
        
        // Merge stock info with products
        this.products = products.data
          .filter((p: Product) => p.active)
          .map((p: Product) => ({
            ...p,
            stockQuantity: stockMap.get(p.name) || 0
          }));
        
        this.filteredProducts = [...this.products];
        this.extractCategories();
        this.initializeQuantities();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.displayToast('Erreur lors du chargement des produits', 'error');
      }
    });
  }

  extractCategories() {
    const categorySet = new Set<string>();
    this.products.forEach(p => {
      if (p.category?.name) {
        categorySet.add(p.category.name);
      }
    });
    this.categories = Array.from(categorySet).sort();
  }

  initializeQuantities() {
    this.products.forEach(p => {
      this.quantities[p.id] = 1;
    });
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(p => {
      const matchesSearch = !this.searchQuery || 
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || 
        p.category?.name === this.selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }

  addToCart(product: ProductWithStock) {
    const quantity = this.quantities[product.id] || 1;
    
    if (quantity < 1) {
      this.displayToast('Quantité invalide', 'error');
      return;
    }
    
    // Check stock availability
    if (product.stockQuantity !== undefined && quantity > product.stockQuantity) {
      this.displayToast(`Stock insuffisant (${product.stockQuantity} disponibles)`, 'error');
      return;
    }
    
    this.cartService.addItem({
      productId: product.id,
      productName: product.name,
      unitPrice: product.sellingPrice,
      stock: product.stockQuantity || 0
    }, quantity);
    
    this.quantities[product.id] = 1;
    this.displayToast(`${product.name} ajouté au panier`, 'success');
  }

  incrementQuantity(productId: number) {
    const product = this.products.find(p => p.id === productId);
    if (product && (product.stockQuantity === undefined || this.quantities[productId] < product.stockQuantity)) {
      this.quantities[productId]++;
    }
  }

  decrementQuantity(productId: number) {
    if (this.quantities[productId] > 1) {
      this.quantities[productId]--;
    }
  }

  displayToast(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}
