import { Routes } from '@angular/router';

export const MANAGER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./manager-layout/manager-layout.component').then(m => m.ManagerLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./manager-dashboard/manager-dashboard.component').then(m => m.ManagerDashboard)
      },
      {
        path: 'warehouse',
        loadComponent: () => import('./warehouses/warehouse-list/warehouse-list.component').then(m => m.WarehouseList)
      },
      {
        path: 'inventory',
        loadComponent: () => import('./inventory/inventory-list/inventory-list.component').then(m => m.InventoryList)
      },
      {
        path: 'orders',
        loadComponent: () => import('./purchase-order/purchase-order.component').then(m => m.PurchaseOrderComponent)
      },
      {
        path: 'sales-orders',
        loadComponent: () => import('./sales-order/manager-sales-order.component').then(m => m.ManagerSalesOrderComponent)
      },
      {
        path: 'carriers',
        loadComponent: () => import('./carriers/carrier-list/carrier-list.component').then(m => m.CarrierList)
      }
    ]
  }
];
