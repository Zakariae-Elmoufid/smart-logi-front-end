import { Router, Routes } from '@angular/router';
import { AdminLayout } from './admin-layout/admin-layout';
import { AdminProduct } from './admin-product/admin-product';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./admin-dashboard/admin-dashboard').then((m) => m.AdminDashboard),
      },
      {
        path: 'products',
        loadComponent: () => import('./admin-product/admin-product').then((m) => m.AdminProduct),
      },
      {
        path: 'managers',
        loadComponent: () => import('./admin-manager/admin-manager').then((m) => m.AdminManager),
      },
      {
        path: 'categories',
        loadComponent: () => import('./admin-category/admin-category').then((m) => m.AdminCategory),
      },
    ],
  },
];
