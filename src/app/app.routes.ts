import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'client',
    loadChildren: () => import('./features/client/client.routes')
      .then(m => m.clientRoutes)
  },
  {
    path: 'manager',
    loadChildren: () => import('./features/manager/manager.routes')
      .then(m => m.MANAGER_ROUTES)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes')
      .then(m => m.ADMIN_ROUTES)
  },
  {
    path: '',
    redirectTo: 'manager',
    pathMatch: 'full'
  }
];
