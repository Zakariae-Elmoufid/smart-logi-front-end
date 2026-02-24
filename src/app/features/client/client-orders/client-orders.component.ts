import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SalesOrderService } from '../../../api/sales-order.service';
import { SalesOrder } from '../models/sales-order.model';

@Component({
  selector: 'app-client-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './client-orders.html',
})
export class ClientOrders implements OnInit {
  orders: SalesOrder[] = [];
  isLoading = true;
  selectedOrder: SalesOrder | null = null;

  constructor(
    private salesOrderService: SalesOrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.salesOrderService.getMyOrders().subscribe({
      next: (response) => {
        const ordersData = Array.isArray(response.data) ? response.data : (response.data ? [response.data] : []);
        this.orders = ordersData.map(order => ({
          ...order,
          totalAmount: this.calculateOrderTotal(order)
        }));
        console.log('Orders with totals:', this.orders);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.orders = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculateOrderTotal(order: SalesOrder): number {
    if (!order.orderLines || order.orderLines.length === 0) return 0;
    return order.orderLines.reduce((sum, line) => {
      const price = line.price || 0;
      const qty = line.quantityRequested || 0;
      return sum + (price * qty);
    }, 0);
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
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'RESERVED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'PARTIALLY_RESERVED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'DELIVERED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  getStatusLabel(status: string): string {
    switch (status?.toUpperCase()) {
      case 'RESERVED':
        return 'Réservée';
      case 'PARTIALLY_RESERVED':
        return 'Partiellement réservée';

      case 'CONFIRMED':
        return 'Confirmée';
      case 'CANCELLED':
        return 'Annulée';
      case 'DELIVERED':
        return 'Livrée';
      default:
        return status;
    }
  }

  getStatusIcon(status: string): string {
    switch (status?.toUpperCase()) {

      case 'RESERVED':
        return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'CONFIRMED':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'CANCELLED':
        return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'DELIVERED':
        return 'M5 13l4 4L19 7';
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }



}
