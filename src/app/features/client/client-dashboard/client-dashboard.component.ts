import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../api/cart.service';
import { SalesOrderService } from '../../../api/sales-order.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { SalesOrder } from '../models/sales-order.model';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './client-dashboard.html',
})
export class ClientDashboard implements OnInit {
  recentOrders: SalesOrder[] = [];
  isLoading = true;
  currentUser: User | null = null;
  ordersCount: number | null = 0 ;
  constructor(
    public cartService: CartService,
    private salesOrderService: SalesOrderService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadRecentOrders();
  }

  loadRecentOrders() {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.salesOrderService.getMyOrders().subscribe({
      next: (response) => {
        if (response.data) {
          const ordersData = Array.isArray(response.data) ? response.data : [response.data];
          this.ordersCount = ordersData.length;

          this.recentOrders = ordersData.slice(0, 5).map(order => ({
            ...order,
            totalAmount: this.calculateOrderTotal(order)
          }));
        } else {
          this.recentOrders = [];
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.recentOrders = [];
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

  getStatusColor(status: string): string {
    switch (status?.toUpperCase()) {
      case 'CREATED':
        return 'bg-yellow-100 text-yellow-800';
      case 'PARTIALLY_RESERVED':
        return 'bg-yellow-100 text-yellow-800';
      case 'RESERVED':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'DELIVERED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(status: string): string {
    switch (status?.toUpperCase()) {
      case 'CREATED':
        return 'cree';
      case 'PARTIALLY_RESERVED':
        return 'Partiellement réservée';

      case 'RESERVED':
        return 'reserveè';
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
}
