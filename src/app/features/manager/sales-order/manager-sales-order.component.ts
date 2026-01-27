import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalesOrderService } from '../../../api/sales-order.service';
import { SalesOrder } from '../../client/models/sales-order.model';

@Component({
  selector: 'app-manager-sales-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manager-sales-order.component.html',
})
export class ManagerSalesOrderComponent implements OnInit {
  orders: SalesOrder[] = [];
  filteredOrders: SalesOrder[] = [];
  isLoading = false;
  searchQuery = '';
  statusFilter = '';
  selectedOrder: SalesOrder | null = null;

  // Toast
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(private salesOrderService: SalesOrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.salesOrderService.getManagerOrders().subscribe({
      next: (response) => {
        this.orders = response.data;
        this.filteredOrders = [...this.orders];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.displayToast('Erreur lors du chargement des commandes', 'error');
      },
    });
  }

  filterOrders() {
    this.filteredOrders = this.orders.filter((order) => {
      const matchesSearch =
        !this.searchQuery || order.id?.toString().includes(this.searchQuery.toLowerCase());

      const matchesStatus =
        !this.statusFilter || order.orderStatus?.toUpperCase() === this.statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }

  viewDetails(order: SalesOrder) {
    this.selectedOrder = order;
  }

  closeDetails() {
    this.selectedOrder = null;
  }

  getStatusColor(status: string): string {
    switch (status?.toUpperCase()) {
      case 'CREATED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RESERVED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PARTIALLY_RESERVED':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DELIVERED':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'CANCELED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  getStatusLabel(status: string): string {
    switch (status?.toUpperCase()) {
      case 'CREATED':
        return 'Créée';
      case 'RESERVED':
        return 'Réservée';
      case 'PARTIALLY_RESERVED':
        return 'Partiellement réservée';
      case 'CONFIRMED':
        return 'Confirmée';
      case 'SHIPPED':
        return 'Expédiée';
      case 'DELIVERED':
        return 'Livrée';
      case 'CANCELED':
        return 'Annulée';
      default:
        return status;
    }
  }

  getLineStatusColor(status: string): string {
    switch (status?.toUpperCase()) {
      case 'RESERVED':
        return 'bg-green-100 text-green-800';
      case 'BACKORDER':
        return 'bg-orange-100 text-orange-800';
      case 'PARTIALLY_RESERVED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  displayToast(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  calculateOrderTotal(order: SalesOrder): number {
    if (!order.orderLines) return 0;
    return order.orderLines.reduce((sum, line) => sum + line.price * line.quantityRequested, 0);
  }

  get pendingCount(): number {
    return this.orders.filter((o) =>
      ['CREATED', 'RESERVED', 'PARTIALLY_RESERVED'].includes(o.orderStatus?.toUpperCase()),
    ).length;
  }

  get confirmedCount(): number {
    return this.orders.filter((o) => o.orderStatus?.toUpperCase() === 'CONFIRMED').length;
  }

  get shippedCount(): number {
    return this.orders.filter((o) =>
      ['SHIPPED', 'DELIVERED'].includes(o.orderStatus?.toUpperCase()),
    ).length;
  }

  get cancelledCount(): number {
    return this.orders.filter((o) => o.orderStatus?.toUpperCase() === 'CANCELED').length;
  }
}
