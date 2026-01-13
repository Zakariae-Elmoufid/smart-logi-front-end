import { Routes } from '@angular/router';
import { ManagerLayout } from './manager-layout/manager-layout.component';
import { ManagerDashboard } from './manager-dashboard/manager-dashboard.component';
import { WarehouseList } from './warehouses/warehouse-list/warehouse-list.component';
import { InventoryList } from './inventory/inventory-list/inventory-list.component';

export const MANAGER_ROUTES: Routes = [
    {
        path: '',
        component: ManagerLayout,
        children: [
            {
                path: '',
                component: ManagerDashboard
            },
            {
                path: 'warehouses',
                component: WarehouseList
            },
            {
                path: 'inventory',
                component: InventoryList
            },
            {
                path: 'orders',
                component: ManagerDashboard
            }
        ]
    }
];
