import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../features/client/models/sales-order.model';

@Injectable({
  providedIn: 'root',
})

export class CartService {
  private cartItems = signal<CartItem[]>([]);

  readonly items = this.cartItems.asReadonly();

  readonly itemCount = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly totalAmount = computed(() =>
    this.cartItems().reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
  );

  addItem(item: Omit<CartItem, 'quantity'>, quantity: number = 1): void {
    const currentItems = this.cartItems();
    const existingIndex = currentItems.findIndex(i => i.productId === item.productId);

    if (existingIndex >= 0) {
      const updated = [...currentItems];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + quantity,
      };
      this.cartItems.set(updated);
    } else {
      this.cartItems.set([...currentItems, { ...item, quantity }]);
    }
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const currentItems = this.cartItems();
    const updated = currentItems.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );
    this.cartItems.set(updated);
  }

  removeItem(productId: number): void {
    this.cartItems.set(this.cartItems().filter(item => item.productId !== productId));
  }

  clearCart(): void {
    this.cartItems.set([]);
  }

  getItems(): CartItem[] {
    return this.cartItems();
  }
}
