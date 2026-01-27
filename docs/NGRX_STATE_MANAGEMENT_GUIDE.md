# NgRx State Management - Complete Implementation Guide

This guide explains how to implement NgRx state management in an Angular application, using the Products feature as a real-world example.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Installation](#2-installation)
3. [Architecture](#3-architecture)
4. [Step-by-Step Implementation](#4-step-by-step-implementation)
   - [Step 1: Define State Interface](#step-1-define-state-interface)
   - [Step 2: Create Actions](#step-2-create-actions)
   - [Step 3: Create Reducer](#step-3-create-reducer)
   - [Step 4: Create Selectors](#step-4-create-selectors)
   - [Step 5: Create Effects](#step-5-create-effects)
   - [Step 6: Configure Store](#step-6-configure-store)
   - [Step 7: Use in Component](#step-7-use-in-component)
5. [Best Practices](#5-best-practices)
6. [Common Issues & Solutions](#6-common-issues--solutions)
7. [File Structure](#7-file-structure)

---

## 1. Overview

### What is NgRx?

NgRx is a reactive state management library for Angular applications, inspired by Redux. It provides:

- **Store**: Single source of truth for application state
- **Actions**: Events that describe state changes
- **Reducers**: Pure functions that handle state transitions
- **Selectors**: Functions to query/derive data from state
- **Effects**: Handle side effects (API calls, etc.)

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         Component                                │
│                                                                  │
│  1. User clicks button ──────────────────────────┐              │
│                                                   │              │
│  4. UI updates with new data ◄───── selectors ◄──┼──────┐       │
└───────────────────────────────────────────────────┼──────┼───────┘
                                                    │      │
                                    dispatch action │      │ select
                                                    ▼      │
┌─────────────────────────────────────────────────────────────────┐
│                           Store                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                     State                                │    │
│  │  { products: [], loading: false, error: null }          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              ▲                                   │
│                              │                                   │
│                         3. new state                             │
│                              │                                   │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────────┐  │
│  │   Actions   │ ───► │   Reducer   │      │    Effects      │  │
│  └─────────────┘      └─────────────┘      │  (side effects) │  │
│         │                                   │                 │  │
│         └──────────────────────────────────►│  2. API call    │  │
│                                             └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Installation

```bash
# Install NgRx packages
npm install @ngrx/store @ngrx/effects @ngrx/store-devtools
```

**Package versions used:**

```json
{
  "@ngrx/store": "^21.0.1",
  "@ngrx/effects": "^21.0.1",
  "@ngrx/store-devtools": "^21.0.1"
}
```

---

## 3. Architecture

### Folder Structure

```
src/app/
├── app.config.ts                    # Store configuration
├── features/
│   └── client/
│       └── client-product-list/
│           ├── client-product-list.component.ts
│           ├── client-product-list.html
│           └── store/                # NgRx store files
│               ├── products.state.ts      # State interface & initial state
│               ├── products.actions.ts    # Action definitions
│               ├── products.reducer.ts    # State reducer
│               ├── products.selectors.ts  # State selectors
│               └── products.effects.ts    # Side effects
└── api/
    └── product-service.ts           # API service
```

---

## 4. Step-by-Step Implementation

### Step 1: Define State Interface

**File: `store/products.state.ts`**

Define the shape of your state and the initial values.

```typescript
import { Product } from '../../models/product.model';

// Query parameters for filtering/pagination
export interface ProductsQuery {
  page: number;
  size: number;
  sort: string; // e.g., 'name,asc'
  search: string;
  category: string;
  active: boolean;
}

// Default query values
export const DEFAULT_PRODUCTS_QUERY: ProductsQuery = {
  active: true,
  page: 0,
  size: 10,
  sort: 'name,asc',
  search: '',
  category: '',
};

// Complete state interface
export interface ProductsState {
  query: ProductsQuery;
  items: Product[];
  totalElements: number;
  totalPages: number;
  loading: boolean;
  error: { status: number; message: string; detail?: string } | null;
}

// Initial state
export const initialState: ProductsState = {
  query: DEFAULT_PRODUCTS_QUERY,
  items: [],
  totalElements: 0,
  totalPages: 0,
  loading: false,
  error: null,
};
```

**Key Points:**

- Define all properties your feature needs
- Include loading and error states for async operations
- Export initial state for use in reducer

---

### Step 2: Create Actions

**File: `store/products.actions.ts`**

Actions describe events that can occur in your application.

```typescript
import { createAction, props } from '@ngrx/store';
import { ProductsQuery } from './products.state';
import { Product } from '../../models/product.model';

// Update query parameters (triggers reload via effect)
export const setQuery = createAction(
  '[Products] Set Query',
  props<{ partialQuery: Partial<ProductsQuery> }>(),
);

// Load products (initial load or manual refresh)
export const loadProducts = createAction(
  '[Products] Load Products',
  props<{ query: ProductsQuery }>(),
);

// Success: products loaded from API
export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ items: Product[]; totalElements: number; totalPages: number }>(),
);

// Failure: API call failed
export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  props<{ error: { status: number; message: string; detail?: string } }>(),
);

// Reset query to defaults
export const resetQuery = createAction('[Products] Reset Query');

// Clear error message
export const clearError = createAction('[Products] Clear Error');
```

**Action Naming Convention:**

```
'[Feature Name] Action Description'
```

Examples:

- `'[Products] Load Products'`
- `'[Auth] Login Success'`
- `'[Cart] Add Item'`

**Action Types:**
| Type | Purpose | Example |
|------|---------|---------|
| Command | Request an operation | `loadProducts` |
| Success | Operation succeeded | `loadProductsSuccess` |
| Failure | Operation failed | `loadProductsFailure` |
| Event | Something happened | `setQuery`, `resetQuery` |

---

### Step 3: Create Reducer

**File: `store/products.reducer.ts`**

Reducers are pure functions that take current state + action and return new state.

```typescript
import { createReducer, on } from '@ngrx/store';
import { ProductsState, DEFAULT_PRODUCTS_QUERY } from './products.state';
import * as ProductsActions from './products.actions';

export const initialState: ProductsState = {
  query: DEFAULT_PRODUCTS_QUERY,
  items: [],
  totalElements: 0,
  totalPages: 0,
  loading: false,
  error: null,
};

export const productsReducer = createReducer(
  initialState,

  // When query changes, set loading to true
  on(ProductsActions.setQuery, (state, { partialQuery }) => ({
    ...state,
    query: { ...state.query, ...partialQuery },
    loading: true,
    error: null,
  })),

  // When loadProducts is dispatched, set loading
  on(ProductsActions.loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  // When products are loaded successfully
  on(ProductsActions.loadProductsSuccess, (state, { items, totalElements, totalPages }) => ({
    ...state,
    items,
    totalElements,
    totalPages,
    loading: false,
  })),

  // When loading fails
  on(ProductsActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Reset query to defaults
  on(ProductsActions.resetQuery, (state) => ({
    ...state,
    query: DEFAULT_PRODUCTS_QUERY,
    loading: true, // Will trigger reload via effect
    error: null,
  })),

  // Clear error
  on(ProductsActions.clearError, (state) => ({
    ...state,
    error: null,
  })),
);
```

**Reducer Rules:**

1. ✅ Always return a new state object (immutability)
2. ✅ Use spread operator: `{ ...state, property: newValue }`
3. ❌ Never mutate the existing state
4. ❌ Never call APIs or have side effects

---

### Step 4: Create Selectors

**File: `store/products.selectors.ts`**

Selectors are functions that extract and derive data from the store.

```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState, DEFAULT_PRODUCTS_QUERY } from './products.state';

// Select the entire feature state
// 'products' must match the key used in provideStore()
export const selectProductsState = createFeatureSelector<ProductsState>('products');

// Select individual pieces of state
export const selectProductsItems = createSelector(
  selectProductsState,
  (state) => state?.items ?? [],
);

export const selectProductsQuery = createSelector(
  selectProductsState,
  (state) => state?.query ?? DEFAULT_PRODUCTS_QUERY,
);

export const selectProductsLoading = createSelector(
  selectProductsState,
  (state) => state?.loading ?? false,
);

export const selectProductsError = createSelector(
  selectProductsState,
  (state) => state?.error ?? null,
);

// Derived/computed selectors
export const selectProductsTotals = createSelector(selectProductsState, (state) => ({
  totalElements: state?.totalElements ?? 0,
  totalPages: state?.totalPages ?? 0,
  currentPage: state?.query?.page ?? 0,
  size: state?.query?.size ?? 10,
}));

export const selectHasProducts = createSelector(selectProductsItems, (items) => items.length > 0);

export const selectIsEmpty = createSelector(
  selectProductsLoading,
  selectProductsItems,
  (loading, items) => !loading && items.length === 0,
);
```

**Selector Benefits:**

- Memoized (cached) - only recalculates when inputs change
- Composable - build complex selectors from simple ones
- Testable - easy to unit test

---

### Step 5: Create Effects

**File: `store/products.effects.ts`**

Effects handle side effects like API calls.

```typescript
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ProductService } from '../../../../api/product-service';
import * as ProductsActions from './products.actions';
import { catchError, map, switchMap, of, withLatestFrom } from 'rxjs';
import { selectProductsQuery } from './products.selectors';

@Injectable()
export class ProductsEffects {
  // ⚠️ IMPORTANT: Use inject() instead of constructor injection
  // This ensures dependencies are available when effects are initialized
  private actions$ = inject(Actions);
  private productService = inject(ProductService);
  private store = inject(Store);

  // Effect 1: Load products when loadProducts action is dispatched
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProducts),
      switchMap((action) =>
        this.productService.list(action.query).pipe(
          map((res) =>
            ProductsActions.loadProductsSuccess({
              items: res.items || [],
              totalElements: res.totalElements || 0,
              totalPages: res.totalPages || 0,
            }),
          ),
          catchError((err) =>
            of(
              ProductsActions.loadProductsFailure({
                error: {
                  status: err?.status || 500,
                  message: err?.message || 'Failed to load products',
                  detail: err?.error?.message,
                },
              }),
            ),
          ),
        ),
      ),
    ),
  );

  // Effect 2: Automatically reload when query changes
  loadProductsOnQueryChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.setQuery, ProductsActions.resetQuery),
      withLatestFrom(this.store.select(selectProductsQuery)),
      switchMap(([_, query]) =>
        this.productService.list(query).pipe(
          map((res) =>
            ProductsActions.loadProductsSuccess({
              items: res.items || [],
              totalElements: res.totalElements || 0,
              totalPages: res.totalPages || 0,
            }),
          ),
          catchError((err) =>
            of(
              ProductsActions.loadProductsFailure({
                error: {
                  status: err?.status || 500,
                  message: err?.message || 'Failed to load products',
                  detail: err?.error?.message,
                },
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
```

**⚠️ CRITICAL: Use `inject()` instead of constructor injection!**

```typescript
// ❌ WRONG - causes "Cannot read properties of undefined (reading 'pipe')"
@Injectable()
export class ProductsEffects {
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(...)  // this.actions$ is undefined here!
  );

  constructor(private actions$: Actions) {}  // Too late!
}

// ✅ CORRECT - inject() is available during property initialization
@Injectable()
export class ProductsEffects {
  private actions$ = inject(Actions);  // Available immediately

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(...)  // Works!
  );
}
```

**RxJS Operators in Effects:**
| Operator | Use Case |
|----------|----------|
| `switchMap` | Cancel previous request when new one comes (most common) |
| `mergeMap` | Allow multiple concurrent requests |
| `concatMap` | Queue requests, execute in order |
| `exhaustMap` | Ignore new requests while one is in progress |

---

### Step 6: Configure Store

**File: `app.config.ts`**

Register the store, reducers, and effects in your application config.

```typescript
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { ProductsEffects } from './features/client/client-product-list/store/products.effects';
import { productsReducer } from './features/client/client-product-list/store/products.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        /* your interceptors */
      ]),
    ),

    // 1. Provide the store with feature reducers
    provideStore({
      products: productsReducer, // Key must match createFeatureSelector('products')
    }),

    // 2. Provide effects
    provideEffects([ProductsEffects]),

    // 3. Optional: DevTools for debugging (only in development)
    provideStoreDevtools({
      maxAge: 25, // Keep last 25 states
      logOnly: !isDevMode(), // Restrict features in production
    }),
  ],
};
```

**Adding Multiple Features:**

```typescript
provideStore({
  products: productsReducer,
  cart: cartReducer,
  auth: authReducer
}),
provideEffects([ProductsEffects, CartEffects, AuthEffects]),
```

---

### Step 7: Use in Component

**File: `client-product-list.component.ts`**

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil, take, debounceTime, distinctUntilChanged } from 'rxjs';

// Import NgRx artifacts
import * as ProductsSelectors from './store/products.selectors';
import * as ProductsActions from './store/products.actions';
import { ProductsQuery } from './store/products.state';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-client-product-list',
  standalone: true,
  templateUrl: './client-product-list.html',
  styleUrl: './client-product-list.css',
  imports: [CommonModule, ReactiveFormsModule],
})
export class ClientProductList implements OnInit, OnDestroy {
  // Observables from store (use async pipe in template)
  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<{ status: number; message: string; detail?: string } | null>;
  totals$: Observable<any>;
  isEmpty$: Observable<boolean>;
  query$: Observable<ProductsQuery>;

  // Form controls for filters
  searchControl = new FormControl('');
  categoryControl = new FormControl('');
  sizeControl = new FormControl(10);

  private destroy$ = new Subject<void>();

  constructor(private store: Store) {
    // Initialize observables from store selectors
    this.products$ = this.store.select(ProductsSelectors.selectProductsItems);
    this.loading$ = this.store.select(ProductsSelectors.selectProductsLoading);
    this.error$ = this.store.select(ProductsSelectors.selectProductsError);
    this.totals$ = this.store.select(ProductsSelectors.selectProductsTotals);
    this.isEmpty$ = this.store.select(ProductsSelectors.selectIsEmpty);
    this.query$ = this.store.select(ProductsSelectors.selectProductsQuery);
  }

  ngOnInit(): void {
    // Initial load - get current query and dispatch loadProducts (once)
    this.query$
      .pipe(
        take(1), // Only take first emission
      )
      .subscribe((query) => {
        this.store.dispatch(ProductsActions.loadProducts({ query }));
      });

    // Search with debounce
    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((search) => {
        this.store.dispatch(
          ProductsActions.setQuery({
            partialQuery: { search: search || '', page: 0 },
          }),
        );
      });

    // Category filter
    this.categoryControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((category) => {
      this.store.dispatch(
        ProductsActions.setQuery({
          partialQuery: { category: category || '', page: 0 },
        }),
      );
    });

    // Page size
    this.sizeControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((size) => {
      this.store.dispatch(
        ProductsActions.setQuery({
          partialQuery: { size: size || 10, page: 0 },
        }),
      );
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Action dispatchers
  onPageChange(page: number): void {
    this.store.dispatch(
      ProductsActions.setQuery({
        partialQuery: { page },
      }),
    );
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

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}
```

**Template: `client-product-list.html`**

```html
<div class="products-container">
  <!-- Loading State -->
  <div *ngIf="loading$ | async" class="loading-spinner">
    <p>Loading products...</p>
  </div>

  <!-- Error State -->
  <div *ngIf="error$ | async as error" class="error-message">
    <strong>Error {{ error.status }}</strong>
    <p>{{ error.message }}</p>
    <button (click)="onClearError()">Dismiss</button>
  </div>

  <!-- Empty State -->
  <div *ngIf="isEmpty$ | async" class="empty-state">
    <p>No products found</p>
  </div>

  <!-- Products Table -->
  <table *ngIf="!(loading$ | async) && !(isEmpty$ | async)">
    <tbody>
      <tr *ngFor="let product of products$ | async; trackBy: trackByProductId">
        <td>{{ product.name }}</td>
        <td>{{ product.sku }}</td>
        <td>{{ product.sellingPrice | currency }}</td>
      </tr>
    </tbody>
  </table>

  <!-- Pagination -->
  <div *ngIf="totals$ | async as totals">
    <span>Page {{ totals.currentPage + 1 }} of {{ totals.totalPages }}</span>
    <button [disabled]="totals.currentPage === 0" (click)="onPageChange(totals.currentPage - 1)">
      Previous
    </button>
    <button
      [disabled]="totals.currentPage >= totals.totalPages - 1"
      (click)="onPageChange(totals.currentPage + 1)"
    >
      Next
    </button>
  </div>
</div>
```

---

## 5. Best Practices

### ✅ Do's

1. **Use `inject()` in Effects** - Prevents undefined errors
2. **Add null safety to selectors** - Use `state?.property ?? defaultValue`
3. **Use `async` pipe in templates** - Auto-subscribes and unsubscribes
4. **Use `takeUntil()` for subscriptions** - Prevents memory leaks
5. **Use `switchMap` for API calls** - Cancels previous requests
6. **Keep reducers pure** - No side effects, no API calls
7. **Use meaningful action names** - `'[Feature] Action Description'`

### ❌ Don'ts

1. **Don't mutate state in reducers** - Always return new objects
2. **Don't call APIs in reducers** - Use effects instead
3. **Don't subscribe in constructor** - Wait for ngOnInit
4. **Don't forget to unsubscribe** - Use `takeUntil` or `async` pipe
5. **Don't use constructor DI in effects** - Use `inject()`

---

## 6. Common Issues & Solutions

### Issue 1: "Cannot read properties of undefined (reading 'pipe')"

**Cause:** Using constructor injection in Effects

**Solution:** Use `inject()` function instead:

```typescript
// Before (broken)
constructor(private actions$: Actions) {}

// After (fixed)
private actions$ = inject(Actions);
```

### Issue 2: Selector returns undefined

**Cause:** Feature state not registered or wrong key name

**Solution:**

1. Check `provideStore({ products: reducer })` key matches selector
2. Add null safety: `state?.items ?? []`

### Issue 3: Infinite loop when dispatching actions

**Cause:** Subscribing to state and dispatching in same subscription

**Solution:** Use `take(1)` for initial load or separate the concerns

### Issue 4: API errors not showing

**Cause:** Error not properly caught in effects

**Solution:** Always use `catchError` and return an observable:

```typescript
catchError((err) => of(SomeActions.failure({ error: err })));
```

### Issue 5: Store DevTools not showing

**Cause:** `provideStoreDevtools` before `provideStore`

**Solution:** Ensure correct order:

```typescript
provideStore({ ... }),
provideEffects([...]),
provideStoreDevtools({ ... })  // Last
```

---

## 7. File Structure

Final file structure for a feature with NgRx:

```
src/app/features/client/client-product-list/
├── client-product-list.component.ts   # Component using store
├── client-product-list.html           # Template with async pipes
├── client-product-list.css            # Styles
└── store/
    ├── products.state.ts              # State interface, initial state
    ├── products.actions.ts            # Action creators
    ├── products.reducer.ts            # State reducer
    ├── products.selectors.ts          # State selectors
    └── products.effects.ts            # Side effects (API calls)
```

---

## Quick Reference

| File             | Purpose              | Key Exports                       |
| ---------------- | -------------------- | --------------------------------- |
| `*.state.ts`     | Define state shape   | `interface State`, `initialState` |
| `*.actions.ts`   | Define events        | `createAction()` functions        |
| `*.reducer.ts`   | Handle state changes | `createReducer()`                 |
| `*.selectors.ts` | Query state          | `createSelector()` functions      |
| `*.effects.ts`   | Handle side effects  | `createEffect()`                  |

---

## Summary

1. **State** → Define what data you need
2. **Actions** → Define what can happen
3. **Reducer** → Define how state changes
4. **Selectors** → Define how to read state
5. **Effects** → Handle async operations
6. **Config** → Wire it all together
7. **Component** → Dispatch actions, select data

The key insight is that NgRx creates a **unidirectional data flow**:

- Components dispatch **actions**
- Actions are handled by **reducers** (sync) and **effects** (async)
- New state flows to components via **selectors**
- Components update automatically via the `async` pipe
