import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail-modal',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './product-detail-modal.component.html',
  styleUrl: './product-detail-modal.component.css'
})
export class ProductDetailModalComponent {
  @Input() product: Product | null = null;
  @Input() isOpen = false;
  @Input() quantity = 1;
  
  @Output() close = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<{ product: Product; quantity: number }>();
  @Output() quantityChange = new EventEmitter<number>();

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.onClose();
    }
  }

  onAddToCart(): void {
    if (this.product) {
      this.addToCart.emit({ product: this.product, quantity: this.quantity });
    }
  }

  incrementQuantity(): void {
    this.quantity++;
    this.quantityChange.emit(this.quantity);
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
      this.quantityChange.emit(this.quantity);
    }
  }

  onQuantityInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value, 10);
    
    if (isNaN(value) || value < 1) {
      value = 1;
    }
    
    this.quantity = value;
    this.quantityChange.emit(this.quantity);
  }
}
