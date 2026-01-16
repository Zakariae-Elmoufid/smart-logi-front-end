import { Routes } from '@angular/router';

export const clientRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./client-layout/client-layout.component').then(m => m.ClientLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./client-dashboard/client-dashboard.component').then(m => m.ClientDashboard)
      },
      {
        path: 'products',
        loadComponent: () => import('./client-product-list/client-product-list.component').then(m => m.ClientProductList)
      },
      {
        path: 'cart',
        loadComponent: () => import('./client-cart/client-cart.component').then(m => m.ClientCart)
      },
      {
        path: 'orders',
        loadComponent: () => import('./client-orders/client-orders.component').then(m => m.ClientOrders)
      }
    ]
  }
];
