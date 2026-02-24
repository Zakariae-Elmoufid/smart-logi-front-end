import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../../../api/inventory.service';
import { InventoryModal } from '../inventory-modal/inventory-modal.component';
import { MovementModal } from '../movement-modal/movement-modal.component';
import {
    InventoryResponseDTO,
    InventoryRequestDTO,
    MovementType,
    InventoryMovementRequestDTO
} from '../../models/inventory.model';

@Component({
    selector: 'app-inventory-list',
    standalone: true,
    imports: [CommonModule, InventoryModal, MovementModal],
    templateUrl: './inventory-list.html',
})
export class InventoryList implements OnInit {
    inventories: InventoryResponseDTO[] = [];
    isLoading = true;
    isSubmitting = false;
    backendErrors: any = null;

    // Modal States
    isCreateModalOpen = false;
    isMovementModalOpen = false;
    selectedInventory: InventoryResponseDTO | null = null;

    constructor(
        private inventoryService: InventoryService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadInventories();
    }

    loadInventories(): void {
        this.isLoading = true;
        this.inventoryService.getAll().subscribe({
            next: (res: any) => {
                if (res && Array.isArray(res.data)) {
                    this.inventories = res.data;
                } else if (Array.isArray(res)) {
                    this.inventories = res;
                } else {
                    this.inventories = [];
                }
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading inventories', err);
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    // Create Inventory
    openCreateModal(): void {
        this.isCreateModalOpen = true;
        this.backendErrors = null;
    }

    closeCreateModal(): void {
        this.isCreateModalOpen = false;
        this.backendErrors = null;
    }

    onCreateInventory(data: InventoryRequestDTO): void {
        this.isSubmitting = true;
        this.backendErrors = null;

        this.inventoryService.create(data).subscribe({
            next: (res) => {
                this.isSubmitting = false;
                this.closeCreateModal();
                this.loadInventories();
            },
            error: (err) => {
                this.isSubmitting = false;
                this.handleError(err);
                this.cdr.detectChanges();
            }
        });
    }

    // Movements
    openMovementModal(item: InventoryResponseDTO): void {
        this.selectedInventory = item;
        this.isMovementModalOpen = true;
        this.backendErrors = null;
    }

    closeMovementModal(): void {
        this.isMovementModalOpen = false;
        this.selectedInventory = null;
        this.backendErrors = null;
    }

    onRecordMovement(event: { type: MovementType, quantity: number, inventoryId: number }): void {
        this.isSubmitting = true;
        this.backendErrors = null;

        const dto: InventoryMovementRequestDTO = {
            inventoryId: event.inventoryId,
            quantity: event.quantity
        };

        let request;
        if (event.type === MovementType.INBOUND) {
            request = this.inventoryService.recordInbound(dto);
        } else if (event.type === MovementType.OUTBOUND) {
            request = this.inventoryService.recordOutbound(dto);
        } else {
            request = this.inventoryService.recordAdjustment(dto);
        }

        request.subscribe({
            next: (res) => {
                this.isSubmitting = false;
                this.closeMovementModal();
                this.loadInventories(); // Reload to see updated quantities
            },
            error: (err) => {
                this.isSubmitting = false;
                this.handleError(err);
                this.cdr.detectChanges();
            }
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
