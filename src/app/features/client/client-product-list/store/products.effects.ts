import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ProductService } from '../../../../api/product-service';
import * as ProductsActions from './products.actions';
import { catchError, map, switchMap, of, withLatestFrom } from 'rxjs';
import { selectProductsQuery } from './products.selectors';

@Injectable()
export class ProductsEffects {
  private actions$ = inject(Actions);
  private productService = inject(ProductService);
  private store = inject(Store);
  
  // Load products when loadProducts action is dispatched
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProducts),
      switchMap(action =>
        this.productService.list(action.query).pipe(
          map(res => {
            console.log('Products loaded successfully:', res);
            return ProductsActions.loadProductsSuccess({
              items: res.items || [],
              totalElements: res.totalElements || 0,
              totalPages: res.totalPages || 0
            });
          }),
          catchError(err => {
            console.error('Error loading products:', err);
            return of(
              ProductsActions.loadProductsFailure({
                error: { 
                  status: err?.status || 500, 
                  message: err?.message || err?.statusText || 'Failed to load products', 
                  detail: err?.error?.message || err?.detail 
                }
              })
            );
          })
        )
      )
    )
  );

  // Automatically load products when query changes (setQuery or resetQuery)
  loadProductsOnQueryChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.setQuery, ProductsActions.resetQuery),
      withLatestFrom(this.store.select(selectProductsQuery)),
      switchMap(([_, query]) =>
        this.productService.list(query).pipe(
          map(res => {
            console.log('Products loaded on query change:', res);
            return ProductsActions.loadProductsSuccess({
              items: res.items || [],
              totalElements: res.totalElements || 0,
              totalPages: res.totalPages || 0
            });
          }),
          catchError(err => {
            console.error('Error loading products on query change:', err);
            return of(
              ProductsActions.loadProductsFailure({
                error: { 
                  status: err?.status || 500, 
                  message: err?.message || err?.statusText || 'Failed to load products', 
                  detail: err?.error?.message || err?.detail 
                }
              })
            );
          })
        )
      )
    )
  );
}
