import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseOrderResponseDTO } from '../../models/purchase-order.model';

@Component({
    selector: 'app-purchase-order-details-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './purchase-order-details-modal.html',
})
export class PurchaseOrderDetailsModal {
    @Input() isOpen = false;
    @Input() order: PurchaseOrderResponseDTO | null = null;
    @Output() close = new EventEmitter<void>();

    onClose(): void {
        this.close.emit();
    }
}
