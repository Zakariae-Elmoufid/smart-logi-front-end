import {Router, Routes} from '@angular/router';
import {AdminLayout} from './admin-layout/admin-layout';
import {AdminProduct} from './admin-product/admin-product';


export const ADMIN_ROUTES: Routes = [

  {
    path: '',
    component: AdminLayout,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./admin-dashboard/admin-dashboard')
            .then(m => m.AdminDashboard)
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./admin-product/admin-product')
            .then(m => m.AdminProduct)
      }
    ],
  }




]
