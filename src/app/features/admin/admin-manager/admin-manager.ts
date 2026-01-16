import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Manager, ManagerCreateDTO, ManagerUpdateDTO } from '../models/manager.model';
import { ManagerService } from '../../../api/manager.service';
import { ManagerModal } from './manager-modal/manager-modal';

@Component({
  selector: 'app-admin-manager',
  standalone: true,
  imports: [CommonModule, ManagerModal],
  templateUrl: './admin-manager.html',
  styleUrl: './admin-manager.css',
})
export class AdminManager implements OnInit {
  managers: Manager[] = [];
  filteredManagers: Manager[] = [];
  isLoading = true;
  searchTerm = '';
  activeFilter: 'all' | 'active' | 'inactive' = 'all';

  // Modal state
  isModalOpen = false;
  isSubmitting = false;
  editingManager: Manager | null = null;
  backendErrors: { [key: string]: string } | null = null;

  // Delete confirmation
  showDeleteConfirm = false;
  managerToDelete: Manager | null = null;
  isDeleting = false;

  // Toast notifications
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  constructor(
    private managerService: ManagerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadManagers();
  }

  loadManagers(): void {
    this.isLoading = true;
    this.managerService.getAll().subscribe({
      next: (resp) => {
        this.isLoading = false;
        this.managers = resp.data;
        this.filterManagers();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading managers:', error);
        this.isLoading = false;
        this.showNotification('Erreur lors du chargement des managers', 'error');
      },
    });
  }

  // Modal methods
  openAddModal(): void {
    this.editingManager = null;
    this.backendErrors = null;
    this.isModalOpen = true;
  }

  openEditModal(manager: Manager): void {
    this.editingManager = manager;
    this.backendErrors = null;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isSubmitting = false;
    this.editingManager = null;
    this.backendErrors = null;
  }

  onSaveManager(data: ManagerCreateDTO | ManagerUpdateDTO): void {
    this.isSubmitting = true;
    this.backendErrors = null;

    if (this.editingManager) {
      // Update existing manager
      this.managerService.update(this.editingManager.id, data as ManagerUpdateDTO).subscribe({
        next: (resp) => {
          const index = this.managers.findIndex((m) => m.id === this.editingManager!.id);
          if (index !== -1) {
            this.managers[index] = resp.data;
            this.managers = [...this.managers];
          }
          this.filterManagers();
          this.closeModal();
          this.showNotification('Manager mis à jour avec succès', 'success');
        },
        error: (error) => {
          console.error('Error updating manager:', error);
          this.isSubmitting = false;
          if (error.error && typeof error.error === 'object') {
            this.backendErrors = error.error;
          } else {
            this.showNotification('Erreur lors de la mise à jour du manager', 'error');
          }
          this.cdr.detectChanges();
        },
      });
    } else {
      // Create new manager
      this.managerService.create(data as ManagerCreateDTO).subscribe({
        next: (resp) => {
          this.managers = [resp.data, ...this.managers];
          this.filterManagers();
          this.closeModal();
          this.showNotification('Manager créé avec succès', 'success');
        },
        error: (error) => {
          console.error('Error creating manager:', error);
          this.isSubmitting = false;
          if (error.error && typeof error.error === 'object') {
            this.backendErrors = error.error;
          } else {
            this.showNotification('Erreur lors de la création du manager', 'error');
          }
          this.cdr.detectChanges();
        },
      });
    }
  }

  // Delete methods
  confirmDelete(manager: Manager): void {
    this.managerToDelete = manager;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.managerToDelete = null;
    this.showDeleteConfirm = false;
  }

  executeDelete(): void {
    if (!this.managerToDelete) return;

    this.isDeleting = true;
    this.managerService.delete(this.managerToDelete.id).subscribe({
      next: () => {
        this.managers = this.managers.filter((m) => m.id !== this.managerToDelete!.id);
        this.filterManagers();
        this.showNotification('Manager supprimé avec succès', 'success');
        this.cancelDelete();
        this.isDeleting = false;
      },
      error: (error) => {
        console.error('Error deleting manager:', error);
        this.showNotification('Erreur lors de la suppression du manager', 'error');
        this.isDeleting = false;
      },
    });
  }

  // Search and filter
  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.filterManagers();
  }

  onFilterChange(filter: 'all' | 'active' | 'inactive'): void {
    this.activeFilter = filter;
    this.filterManagers();
  }

  private filterManagers(): void {
    let filtered = this.managers;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (manager) =>
          manager.firstName.toLowerCase().includes(term) ||
          manager.lastName.toLowerCase().includes(term) ||
          manager.email.toLowerCase().includes(term)
      );
    }

    if (this.activeFilter === 'active') {
      filtered = filtered.filter((manager) => manager.enabled);
    } else if (this.activeFilter === 'inactive') {
      filtered = filtered.filter((manager) => !manager.enabled);
    }

    this.filteredManagers = filtered;
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

  // Helpers
  getActiveCount(): number {
    return this.managers.filter((m) => m.enabled).length;
  }

  getInactiveCount(): number {
    return this.managers.filter((m) => !m.enabled).length;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
}
