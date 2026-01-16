import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalesOrderService } from '../../../api/sales-order.service';
import { SalesOrder } from '../../client/models/sales-order.model';

@Component({
  selector: 'app-admin-sales-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-sales-order.html',
})
export class AdminSalesOrder implements OnInit {
  orders: SalesOrder[] = [];
  filteredOrders: SalesOrder[] = [];
  isLoading = false;
  searchQuery = '';
  statusFilter = '';
  selectedOrder: SalesOrder | null = null;
  isProcessing = false;
  
  // Delete confirmation
  showDeleteConfirm = false;
  orderToProcess: SalesOrder | null = null;
  processAction: 'confirm' | 'cancel' | null = null;
  
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
    this.salesOrderService.getAllOrders().subscribe({
      next: (response) => {
        this.orders = response.data;
        this.filteredOrders = [...this.orders];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.displayToast('Erreur lors du chargement des commandes', 'error');
      }
    });
  }

  filterOrders() {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = !this.searchQuery || 
        order.orderNumber?.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesStatus = !this.statusFilter || 
        order.status?.toUpperCase() === this.statusFilter.toUpperCase();
      
      return matchesSearch && matchesStatus;
    });
  }

  viewDetails(order: SalesOrder) {
    this.selectedOrder = order;
  }

  closeDetails() {
    this.selectedOrder = null;
  }

  openConfirmAction(order: SalesOrder, action: 'confirm' | 'cancel') {
    this.orderToProcess = order;
    this.processAction = action;
    this.showDeleteConfirm = true;
  }

  closeConfirmAction() {
    this.showDeleteConfirm = false;
    this.orderToProcess = null;
    this.processAction = null;
  }

  executeAction() {
    if (!this.orderToProcess || !this.processAction) return;
    
    this.isProcessing = true;
    const action$ = this.processAction === 'confirm' 
      ? this.salesOrderService.confirmOrder(this.orderToProcess.id)
      : this.salesOrderService.cancelOrder(this.orderToProcess.id);
    
    action$.subscribe({
      next: () => {
        this.isProcessing = false;
        this.closeConfirmAction();
        this.loadOrders();
        this.displayToast(
          this.processAction === 'confirm' 
            ? 'Commande confirmée avec succès' 
            : 'Commande annulée avec succès', 
          'success'
        );
      },
      error: (error) => {
        this.isProcessing = false;
        this.displayToast(error.error?.message || 'Erreur lors du traitement', 'error');
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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

  displayToast(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  get pendingCount(): number {
    return this.orders.filter(o => o.status?.toUpperCase() === 'PENDING').length;
  }

  get confirmedCount(): number {
    return this.orders.filter(o => o.status?.toUpperCase() === 'CONFIRMED').length;
  }

  get cancelledCount(): number {
    return this.orders.filter(o => o.status?.toUpperCase() === 'CANCELLED').length;
  }
}
