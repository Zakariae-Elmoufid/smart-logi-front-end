import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseService } from '../../../api/warehouse.service';
import { InventoryService } from '../../../api/inventory.service';
import { PurchaseOrderService } from '../../../api/purchase-order.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { forkJoin, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manager-dashboard.html',
})
export class ManagerDashboard implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  stats = {
    totalWarehouses: 0,
    totalStock: 0,
    pendingOrders: 0,
    lowStockAlerts: 0,
  };
  isLoading = true;
  currentUser: User | null = null;

  constructor(
    private warehouseService: WarehouseService,
    private inventoryService: InventoryService,
    private purchaseOrderService: PurchaseOrderService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadStats();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadStats() {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    forkJoin({
      warehouses: this.warehouseService.getAll(),
      inventory: this.inventoryService.getAll(),
      orders: this.purchaseOrderService.getAllPurchaseOrders(),
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res: any) => {
        // Warehouses
        const warehouses = Array.isArray(res.warehouses.data)
          ? res.warehouses.data
          : Array.isArray(res.warehouses)
            ? res.warehouses
            : [];
        this.stats.totalWarehouses = warehouses.length;

        // Inventory & Alerts
        const inventory = Array.isArray(res.inventory.data)
          ? res.inventory.data
          : Array.isArray(res.inventory)
            ? res.inventory
            : [];
        this.stats.totalStock = inventory.reduce(
          (acc: number, item: any) => acc + item.quantityOnHand,
          0,
        );
        this.stats.lowStockAlerts = inventory.filter(
          (item: any) => item.quantityOnHand <= 5,
        ).length;

        // Orders
        const orders = Array.isArray(res.orders.data)
          ? res.orders.data
          : Array.isArray(res.orders)
            ? res.orders
            : [];
        this.stats.pendingOrders = orders.filter(
          (o: any) => o.orderStatus === 'CREATED' || o.orderStatus === 'PENDING',
        ).length;

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading dashboard stats', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
