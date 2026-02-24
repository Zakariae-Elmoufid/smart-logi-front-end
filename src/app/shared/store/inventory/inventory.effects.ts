import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { InventoryService } from '../../../api/inventory.service';
import * as InventoryActions from './inventory.actions';
import { selectInventoryLoaded } from './inventory.selectors';
import { catchError, map, switchMap, of, withLatestFrom, filter } from 'rxjs';

@Injectable()
export class InventoryEffects {
  private actions$ = inject(Actions);
  private inventoryService = inject(InventoryService);
  private store = inject(Store);

  // Load inventory - only if not already loaded
  loadInventory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InventoryActions.loadInventory),
      withLatestFrom(this.store.select(selectInventoryLoaded)),
      filter(([_, loaded]) => !loaded),
      switchMap(() =>
        this.inventoryService.getAll().pipe(
          map(response => {
            console.log('Inventory loaded successfully:', response.data);
            return InventoryActions.loadInventorySuccess({
              items: response.data || []
            });
          }),
          catchError(err => {
            console.error('Error loading inventory:', err);
            return of(
              InventoryActions.loadInventoryFailure({
                error: {
                  status: err?.status || 500,
                  message: err?.message || err?.statusText || 'Failed to load inventory',
                  detail: err?.error?.message || err?.detail
                }
              })
            );
          })
        )
      )
    )
  );

  // Force refresh inventory
  refreshInventory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InventoryActions.refreshInventory),
      switchMap(() =>
        this.inventoryService.getAll().pipe(
          map(response => {
            console.log('Inventory refreshed successfully:', response.data);
            return InventoryActions.loadInventorySuccess({
              items: response.data || []
            });
          }),
          catchError(err => {
            console.error('Error refreshing inventory:', err);
            return of(
              InventoryActions.loadInventoryFailure({
                error: {
                  status: err?.status || 500,
                  message: err?.message || err?.statusText || 'Failed to refresh inventory',
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
