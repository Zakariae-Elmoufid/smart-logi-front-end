import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../api/cart.service';
import { SalesOrderService } from '../../../api/sales-order.service';
import { CartItem, SalesOrderRequest } from '../models/sales-order.model';

@Component({
  selector: 'app-client-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './client-cart.html',
})
export class ClientCart {

  isSubmitting = false;
  showConfirmModal = false;

  // Toast
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    public cartService: CartService,
    private salesOrderService: SalesOrderService,
    private router: Router
  ) {}

  get cartItems(): CartItem[] {
    return this.cartService.getItems();
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity < 1) {
      this.cartService.removeItem(productId);
    } else {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  removeItem(productId: number) {
    this.cartService.removeItem(productId);
    this.displayToast('Article supprimé du panier', 'success');
  }

  clearCart() {
    this.cartService.clearCart();
    this.displayToast('Panier vidé', 'success');
  }

  openConfirmModal() {
    if (this.cartItems.length === 0) {
      this.displayToast('Votre panier est vide', 'error');
      return;
    }
    this.showConfirmModal = true;
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
  }

  submitOrder() {
    if (this.cartItems.length === 0) {
      this.displayToast('Votre panier est vide', 'error');
      return;
    }

    const orderRequest: SalesOrderRequest = {
      liens: this.cartItems.map(item => ({
        productId: item.productId,
        quantityRequested: item.quantity
      }))
    };

    this.isSubmitting = true;
    this.salesOrderService.createOrder(orderRequest).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.showConfirmModal = false;
        this.cartService.clearCart();
        this.displayToast('Commande créée avec succès!', 'success');
        setTimeout(() => {
          this.router.navigate(['/client/orders']);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.displayToast(error.error?.message || 'Erreur lors de la création de la commande', 'error');
      }
    });
  }

  displayToast(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  getItemTotal(item: CartItem): number {
    return item.unitPrice * item.quantity;
  }
}
