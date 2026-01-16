import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Carrier, CarrierRequest } from '../../models/carrier.model';
import { CarrierService } from '../../../../api/carrier.service';
import { CarrierModal } from '../carrier-modal/carrier-modal.component';

@Component({
  selector: 'app-carrier-list',
  standalone: true,
  imports: [CommonModule, CarrierModal],
  templateUrl: './carrier-list.html',
})
export class CarrierList implements OnInit {
  carriers: Carrier[] = [];
  filteredCarriers: Carrier[] = [];
  isLoading = true;
  searchTerm = '';

  // Modal state
  isModalOpen = false;
  isSubmitting = false;
  editingCarrier: Carrier | null = null;
  backendErrors: { [key: string]: string } | null = null;

  // Delete confirmation
  showDeleteConfirm = false;
  carrierToDelete: Carrier | null = null;
  isDeleting = false;

  // Toast notifications
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  constructor(
    private carrierService: CarrierService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCarriers();
  }

  loadCarriers(): void {
    this.isLoading = true;
    this.carrierService.getAll().subscribe({
      next: (resp) => {
        this.isLoading = false;
        this.carriers = resp.data;
        this.filterCarriers();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading carriers:', error);
        this.isLoading = false;
        this.showNotification('Erreur lors du chargement des transporteurs', 'error');
      },
    });
  }

  // Modal methods
  openAddModal(): void {
    this.editingCarrier = null;
    this.backendErrors = null;
    this.isModalOpen = true;
  }

  openEditModal(carrier: Carrier): void {
    this.editingCarrier = carrier;
    this.backendErrors = null;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isSubmitting = false;
    this.editingCarrier = null;
    this.backendErrors = null;
  }

  onSaveCarrier(data: CarrierRequest): void {
    this.isSubmitting = true;
    this.backendErrors = null;

    if (this.editingCarrier) {
      // Update existing carrier
      this.carrierService.update(this.editingCarrier.id, data).subscribe({
        next: (resp) => {
          const index = this.carriers.findIndex((c) => c.id === this.editingCarrier!.id);
          if (index !== -1) {
            this.carriers[index] = resp.data;
            this.carriers = [...this.carriers];
          }
          this.filterCarriers();
          this.closeModal();
          this.showNotification('Transporteur mis à jour avec succès', 'success');
        },
        error: (error) => {
          console.error('Error updating carrier:', error);
          this.isSubmitting = false;
          if (error.error && typeof error.error === 'object') {
            this.backendErrors = error.error;
          } else {
            this.showNotification('Erreur lors de la mise à jour du transporteur', 'error');
          }
          this.cdr.detectChanges();
        },
      });
    } else {
      // Create new carrier
      this.carrierService.create(data).subscribe({
        next: (resp) => {
          this.carriers = [resp.data, ...this.carriers];
          this.filterCarriers();
          this.closeModal();
          this.showNotification('Transporteur créé avec succès', 'success');
        },
        error: (error) => {
          console.error('Error creating carrier:', error);
          this.isSubmitting = false;
          if (error.error && typeof error.error === 'object') {
            this.backendErrors = error.error;
          } else {
            this.showNotification('Erreur lors de la création du transporteur', 'error');
          }
          this.cdr.detectChanges();
        },
      });
    }
  }

  // Delete methods
  confirmDelete(carrier: Carrier): void {
    this.carrierToDelete = carrier;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.carrierToDelete = null;
    this.showDeleteConfirm = false;
  }

  executeDelete(): void {
    if (!this.carrierToDelete) return;

    this.isDeleting = true;
    this.carrierService.delete(this.carrierToDelete.id).subscribe({
      next: () => {
        this.carriers = this.carriers.filter((c) => c.id !== this.carrierToDelete!.id);
        this.filterCarriers();
        this.showNotification('Transporteur supprimé avec succès', 'success');
        this.cancelDelete();
        this.isDeleting = false;
      },
      error: (error) => {
        console.error('Error deleting carrier:', error);
        this.showNotification('Erreur lors de la suppression du transporteur', 'error');
        this.isDeleting = false;
      },
    });
  }

  // Search
  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.filterCarriers();
  }

  private filterCarriers(): void {
    let filtered = this.carriers;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (carrier) =>
          carrier.carrierName.toLowerCase().includes(term) ||
          carrier.phoneNumber.toLowerCase().includes(term)
      );
    }

    this.filteredCarriers = filtered;
  }

  // Notifications
  private showNotification(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.showToast = false;
      this.cdr.detectChanges();
    }, 3000);
  }
}
