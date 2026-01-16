import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../api/cart.service';
import { SalesOrderService } from '../../../api/sales-order.service';
import { SalesOrder } from '../models/sales-order.model';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './client-dashboard.html',
})
export class ClientDashboard implements OnInit {
  recentOrders: SalesOrder[] = [];
  isLoading = false;

  constructor(
    public cartService: CartService,
    private salesOrderService: SalesOrderService
  ) {}

  ngOnInit() {
    this.loadRecentOrders();
  }

  loadRecentOrders() {
    this.isLoading = true;
    this.salesOrderService.getMyOrders().subscribe({
      next: (response) => {
        this.recentOrders = response.data.slice(0, 5);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PENDING':
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
      case 'PENDING':
        return 'En attente';
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
