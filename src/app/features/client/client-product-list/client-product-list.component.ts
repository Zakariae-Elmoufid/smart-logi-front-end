import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, forkJoin, Observable, Subject, takeUntil, take } from 'rxjs';
import { ProductService } from '../../../api/product-service';
import { CartService } from '../../../api/cart.service';
import { InventoryService } from '../../../api/inventory.service';
import { ApiError, Product } from '../models/product.model';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import * as ProductsSelectors from './store/products.selectors';
import { ProductsQuery } from './store/products.state';
import * as ProductsActions from './store/products.actions';

interface ProductWithStock extends Product {
  stockQuantity?: number;
}

@Component({
  selector: 'app-client-product-list',
  standalone: true,
  templateUrl: './client-product-list.html',
  styleUrl: './client-product-list.components.css',
  imports: [
    RouterLink,
    CommonModule,
    ReactiveFormsModule
  ],
})
export class ClientProductList implements OnInit, OnDestroy {

  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<{ status: number; message: string; detail?: string } | null>;
  totals$: Observable<any>;
  isEmpty$: Observable<boolean>;
  query$: Observable<ProductsQuery>;

  searchControl = new FormControl('');
  categoryControl = new FormControl('');
  sizeControl = new FormControl(10);

  pageSizes = [10, 20, 50];

  private destroy$ = new Subject<void>();

  // Legacy local state - kept for categories dropdown
  categories: string[] = [];

  // Quantity inputs for each product
  quantities: { [productId: number]: number } = {};

  // Toast
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';


  currentSort = { field: 'name', direction: 'asc' };
  constructor(
    private productService: ProductService,
    private inventoryService: InventoryService,
    public cartService: CartService,
    private store: Store
  ) {
    this.products$ = this.store.select(ProductsSelectors.selectProductsItems);
    this.loading$ = this.store.select(ProductsSelectors.selectProductsLoading);
    this.error$ = this.store.select(ProductsSelectors.selectProductsError);
    this.totals$ = this.store.select(ProductsSelectors.selectProductsTotals);
    this.isEmpty$ = this.store.select(ProductsSelectors.selectIsEmpty);
    this.query$ = this.store.select(ProductsSelectors.selectProductsQuery);
  }


  ngOnInit(): void {
    // Debug: Log store state
    this.products$.subscribe(products => console.log('Products from store:', products));
    this.loading$.subscribe(loading => console.log('Loading state:', loading));
    this.error$.subscribe(error => console.log('Error state:', error));

    // Initial load - dispatch loadProducts with the current query from state (only once)
    this.query$.pipe(
      take(1)
    ).subscribe(query => {
      console.log('Dispatching loadProducts with query:', query);
      this.store.dispatch(ProductsActions.loadProducts({ query }));
    });

    // Recherche avec debounce
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

    // Filtre catégorie
    this.categoryControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(category => {
        this.store.dispatch(ProductsActions.setQuery({
          partialQuery: { category: category || '', page: 0 }
        }));
      });

    // Taille de page
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


