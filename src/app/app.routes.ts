import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
export const routes: Routes = [
  {
    path: 'client',
    canActivate: [authGuard, roleGuard(['ROLE_CLIENT'])],
    loadChildren: () => import('./features/client/client.routes')
      .then(m => m.clientRoutes)
  },
  {
    path: 'manager',
    canActivate: [authGuard, roleGuard(['ROLE_WAREHOUSE_MANAGER'])],
    loadChildren: () => import('./features/manager/manager.routes')
      .then(m => m.MANAGER_ROUTES)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN'])],
    loadChildren: () => import('./features/admin/admin.routes')
      .then(m => m.ADMIN_ROUTES)
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component')
      .then(m => m.RegisterComponent)
  },

];
