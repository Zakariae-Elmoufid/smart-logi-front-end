import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseResponseDTO, WarehouseRequestDTO } from '../../models/warehouse.model';
import { WarehouseService } from '../../../../api/warehouse.service';
import { WarehouseModal } from '../warehouse-modal/warehouse-modal.component';

@Component({
    selector: 'app-warehouse-list',
    standalone: true,
    imports: [CommonModule, WarehouseModal],
    templateUrl: './warehouse-list.html',
})
export class WarehouseList implements OnInit {
    // Modal State
    isModalOpen = false;
    isSubmitting = false;
    editingWarehouse: WarehouseResponseDTO | null = null;
    backendErrors: { [key: string]: string } | null = null;

    // Data State
    warehouses: WarehouseResponseDTO[] = [];
    isLoading = true;

    // Messages
    successMessage: string | null = null;
    errorMessage: string | null = null;

    constructor(
        private warehouseService: WarehouseService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadWarehouses();
    }

    loadWarehouses(): void {
        this.isLoading = true;
        this.warehouseService.getAll().subscribe({
            next: (response: any) => {
                if (response && Array.isArray(response.data)) {
                    this.warehouses = response.data;
                } else if (Array.isArray(response)) {
                    this.warehouses = response;
                } else {
                    this.warehouses = [];
                }
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading warehouses', err);
                this.isLoading = false;
                this.showErrorMessage('Erreur lors du chargement des entrepôts');
                this.cdr.detectChanges();
            }
        });
    }

    // --- Modal Logic ---

    openAddModal(): void {
        this.editingWarehouse = null;
        this.backendErrors = null;
        this.isModalOpen = true;
    }

    openEditModal(warehouse: WarehouseResponseDTO): void {
        this.editingWarehouse = warehouse;
        this.backendErrors = null;
        this.isModalOpen = true;
    }

    closeModal(): void {
        this.isModalOpen = false;
        this.editingWarehouse = null;
        this.backendErrors = null;
        this.cdr.detectChanges();
    }

    onSave(data: WarehouseRequestDTO): void {
        this.isSubmitting = true;
        this.backendErrors = null;

        if (this.editingWarehouse) {
            // Update
            this.warehouseService.update(this.editingWarehouse.id, data).subscribe({
                next: (res: any) => {
                    this.showSuccessMessage(res?.message || 'Entrepôt mis à jour avec succès');
                    this.isSubmitting = false;
                    this.closeModal();
                    this.loadWarehouses();
                },
                error: (err) => {
                    this.isSubmitting = false;
                    this.handleError(err);
                    this.cdr.detectChanges();
                }
            });
        } else {
            // Create
            this.warehouseService.create(data).subscribe({
                next: (res: any) => {
                    this.showSuccessMessage(res?.message || 'Entrepôt créé avec succès');
                    this.isSubmitting = false;
                    this.closeModal();
                    this.loadWarehouses();
                },
                error: (err) => {
                    this.isSubmitting = false;
                    this.handleError(err);
                    this.cdr.detectChanges();
                }
            });
        }
    }

    deleteWarehouse(warehouse: WarehouseResponseDTO): void {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer "${warehouse.name}" ?`)) return;

        this.warehouseService.delete(warehouse.id).subscribe({
            next: (res: any) => {
                this.showSuccessMessage(res?.message || 'Entrepôt supprimé');
                this.loadWarehouses();
            },
            error: (err) => {
                this.showErrorMessage('Erreur lors de la suppression');
            }
        });
    }

    // --- Helpers ---

    handleError(error: any): void {
        if (error.error && typeof error.error === 'object') {
            this.backendErrors = error.error;
        } else {
            this.showErrorMessage('Une erreur est survenue');
        }
    }

    showSuccessMessage(msg: string): void {
        this.successMessage = msg;
        this.cdr.detectChanges();
        setTimeout(() => {
            this.successMessage = null;
            this.cdr.detectChanges();
        }, 5000);
    }

    showErrorMessage(msg: string): void {
        this.errorMessage = msg;
        this.cdr.detectChanges();
        setTimeout(() => {
            this.errorMessage = null;
            this.cdr.detectChanges();
        }, 5000);
    }
}
