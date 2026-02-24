import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Observable, Subject, takeUntil, take } from 'rxjs';
import { CartService } from '../../../api/cart.service';
import { Category, Product } from '../models/product.model';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import * as ProductsSelectors from './store/products.selectors';
import { ProductsQuery } from './store/products.state';
import * as ProductsActions from './store/products.actions';
import { CategoryService } from '../../../api/category-service';
import { ProductDetailModalComponent } from './product-detail-modal/product-detail-modal.component';

@Component({
  selector: 'app-client-product-list',
  standalone: true,
  templateUrl: './client-product-list.html',
  styleUrl: './client-product-list.components.css',
  imports: [
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
    CurrencyPipe,
    ProductDetailModalComponent
  ],
})
export class ClientProductList implements OnInit, OnDestroy {

  // Products state
  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<{ status: number; message: string; detail?: string } | null>;
  totals$: Observable<any>;
  isEmpty$: Observable<boolean>;
  query$: Observable<ProductsQuery>;

  // Form controls
  searchControl = new FormControl('');
  categoryControl = new FormControl('');
  sizeControl = new FormControl(10);

  pageSizes = [10, 20, 50];

  private destroy$ = new Subject<void>();

  categories: Category[] = [];
  quantities: { [productId: number]: number } = {};

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  // Modal state
  isModalOpen = false;
  selectedProduct: Product | null = null;
  modalQuantity = 1;

  currentSort = { field: 'name', direction: 'asc' };

  constructor(
    private cartService: CartService,
    private categoryService: CategoryService,
    private store: Store
  ) {
    // Products selectors
    this.products$ = this.store.select(ProductsSelectors.selectProductsItems);
    this.loading$ = this.store.select(ProductsSelectors.selectProductsLoading);
    this.error$ = this.store.select(ProductsSelectors.selectProductsError);
    this.totals$ = this.store.select(ProductsSelectors.selectProductsTotals);
    this.isEmpty$ = this.store.select(ProductsSelectors.selectIsEmpty);
    this.query$ = this.store.select(ProductsSelectors.selectProductsQuery);
  }

  ngOnInit(): void {
    // Load products
    this.query$.pipe(take(1)).subscribe(query => {
      this.store.dispatch(ProductsActions.loadProducts({ query }));
    });

    this.loadCategories();
    this.setupFormListeners();
  }

  private setupFormListeners(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(search => {
        this.store.dispatch(ProductsActions.setQuery({
          partialQuery: { search: search || '', page: 0 }
        }));
      });

    this.categoryControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(category => {
        this.store.dispatch(ProductsActions.setQuery({
          partialQuery: { category: category || '', page: 0 }
        }));
      });

    this.sizeControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(size => {
        this.store.dispatch(ProductsActions.setQuery({
          partialQuery: { size: size || 10, page: 0 }
        }));
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: resp => {
        this.categories = resp.data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });
  }

  incrementQuantity(productId: number): void {
    const current = this.quantities[productId] || 1;
    this.quantities[productId] = current + 1;
  }

  decrementQuantity(productId: number): void {
    const current = this.quantities[productId] || 1;
    if (current > 1) {
      this.quantities[productId] = current - 1;
    }
  }

  onQuantityChange(productId: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value, 10);

    if (isNaN(value) || value < 1) {
      value = 1;
    }

    this.quantities[productId] = value;
    input.value = value.toString();
  }

  addToCart(product: Product): void {
    const quantity = this.quantities[product.id] || 1;

    this.cartService.addItem({
      productId: product.id,
      productName: product.name,
      unitPrice: product.sellingPrice,
      stock: 0
    }, quantity);

    // Reset quantity for this product
    this.quantities[product.id] = 1;

    this.showToastMessage(`${quantity}x ${product.name} ajouté au panier`, 'success');
  }

  // Modal methods
  openProductModal(product: Product): void {
    this.selectedProduct = product;
    this.modalQuantity = this.quantities[product.id] || 1;
    this.isModalOpen = true;
  }

  closeProductModal(): void {
    this.isModalOpen = false;
    this.selectedProduct = null;
    this.modalQuantity = 1;
  }

  onModalQuantityChange(quantity: number): void {
    this.modalQuantity = quantity;
  }

  onModalAddToCart(event: { product: Product; quantity: number }): void {
    this.cartService.addItem({
      productId: event.product.id,
      productName: event.product.name,
      unitPrice: event.product.sellingPrice,
      stock: 0
    }, event.quantity);

    this.showToastMessage(`${event.quantity}x ${event.product.name} ajouté au panier`, 'success');
    this.closeProductModal();
  }

  showToastMessage(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }


  onPageChange(page: number): void {
    this.store.dispatch(ProductsActions.setQuery({
      partialQuery: { page }
    }));
  }

  onSort(field: string): void {
    const direction =
      this.currentSort.field === field && this.currentSort.direction === 'asc'
        ? 'desc'
        : 'asc';

    this.currentSort = { field, direction };

    this.store.dispatch(ProductsActions.setQuery({
      partialQuery: { sort: `${field},${direction}` }
    }));
  }

  onReset(): void {
    this.searchControl.setValue('', { emitEvent: false });
    this.categoryControl.setValue('', { emitEvent: false });
    this.sizeControl.setValue(10, { emitEvent: false });
    this.store.dispatch(ProductsActions.resetQuery());
  }

  onClearError(): void {
    this.store.dispatch(ProductsActions.clearError());
  }

  getSortIcon(field: string): string {
    if (this.currentSort.field !== field) return '⇅';
    return this.currentSort.direction === 'asc' ? '↑' : '↓';
  }

  getStatusBadgeClass(active: boolean): string {
    return active ? 'badge-success' : 'badge-danger';
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  protected readonly Math = Math;
}


