import { Routes } from '@angular/router';
import { ManagerLayout } from './manager-layout/manager-layout.component';
import { ManagerDashboard } from './manager-dashboard/manager-dashboard.component';
import { WarehouseList } from './warehouses/warehouse-list/warehouse-list.component';
import { InventoryList } from './inventory/inventory-list/inventory-list.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { CarrierList } from './carriers/carrier-list/carrier-list.component';

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
                component: PurchaseOrderComponent
            },
            {
                path: 'carriers',
                component: CarrierList
            }
        ]
    }
];
