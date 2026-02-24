import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseOrderService } from '../../../api/purchase-order.service';
import { PurchaseOrderResponseDTO, PurchaseOrderRequestDTO } from '../models/purchase-order.model';
import { PurchaseOrderModal } from './purchase-order-modal/purchase-order-modal.component';
import { PurchaseOrderDetailsModal } from './purchase-order-details-modal/purchase-order-details-modal.component';

@Component({
  selector: 'app-purchase-order',
  imports: [CommonModule, PurchaseOrderModal, PurchaseOrderDetailsModal],
  templateUrl: './purchase-order.html',
  standalone: true
})
export class PurchaseOrderComponent implements OnInit {

  purchaseOrders: PurchaseOrderResponseDTO[] = [];
  isLoading = true;
  isSubmitting = false;
  backendErrors: any = null;

  isCreateModalOpen = false;
  isDetailsModalOpen = false;
  selectedOrder: PurchaseOrderResponseDTO | null = null;

  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.purchaseOrderService.getAllPurchaseOrders().subscribe({
      next: (res: any) => {
        if (res && Array.isArray(res.data)) this.purchaseOrders = res.data;
        else if (Array.isArray(res)) this.purchaseOrders = res;
        else this.purchaseOrders = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading orders', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Create
  openCreateModal(): void {
    this.isCreateModalOpen = true;
    this.backendErrors = null;
  }

  closeCreateModal(): void {
    this.isCreateModalOpen = false;
    this.backendErrors = null;
  }

  onCreateOrder(data: PurchaseOrderRequestDTO): void {
    this.isSubmitting = true;
    this.backendErrors = null;
    console.log("data : " + data);
    this.purchaseOrderService.createPurchaseOrder(data).subscribe({
      next: (res) => {
        console.log(res.message);

        this.isSubmitting = false;
        this.closeCreateModal();
        this.loadOrders();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.handleError(err);
        this.cdr.detectChanges();
      }
    });
  }

  // Details
  openDetails(order: PurchaseOrderResponseDTO): void {
    this.selectedOrder = order;
    this.isDetailsModalOpen = true;
  }

    closeDetails(): void {
    this.isDetailsModalOpen = false;
    this.selectedOrder = null;
  }

  // Actions
  approveOrder(order: PurchaseOrderResponseDTO): void {
    if (!confirm(`Valider la commande #${order.id} ?`)) return;

    this.purchaseOrderService.approvePurchaseOrder(order.id).subscribe({
      next: () => this.loadOrders(),
      error: (err) => alert('Erreur lors de la validation')
    });
  }

  receiveOrder(order: PurchaseOrderResponseDTO): void {
    if (!confirm(`Réceptionner la commande #${order.id} ? Cela mettra à jour les stocks.`)) return;

    this.purchaseOrderService.receivePurchaseOrder(order.id).subscribe({
      next: () => this.loadOrders(),
      error: (err) => alert('Erreur lors de la réception')
    });
  }

  handleError(error: any): void {
    if (error.error && typeof error.error === 'object') {
      this.backendErrors = error.error;
    } else {
      this.backendErrors = { error: 'Une erreur est survenue' };
    }
  }
}
