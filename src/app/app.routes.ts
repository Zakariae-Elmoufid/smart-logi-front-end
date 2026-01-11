import { Routes } from '@angular/router';
import {AdminProduct} from './features/admin/admin-product/admin-product';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes')
      .then(m => m.ADMIN_ROUTES)
  },

];
