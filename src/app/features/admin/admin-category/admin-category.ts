import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category, CategoryRequest } from '../models/category.model';
import { CategoryService } from '../../../api/category-service';
import { CategoryModal } from './category-modal/category-modal';

@Component({
  selector: 'app-admin-category',
  standalone: true,
  imports: [CommonModule, CategoryModal],
  templateUrl: './admin-category.html',
  styleUrl: './admin-category.css',
})
export class AdminCategory implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  isLoading = true;
  searchTerm = '';
  activeFilter: 'all' | 'active' | 'inactive' = 'all';

  // Modal state
  isModalOpen = false;
  isSubmitting = false;
  editingCategory: Category | null = null;
  backendErrors: { [key: string]: string } | null = null;

  // Delete confirmation
  showDeleteConfirm = false;
  categoryToDelete: Category | null = null;
  isDeleting = false;

  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe({
      next: (resp) => {
        this.isLoading = false;
        this.categories = resp.data;
        this.filterCategories();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.isLoading = false;
        this.showNotification('Erreur lors du chargement des catégories', 'error');
      },
    });
  }

  // Modal methods
  openAddModal(): void {
    this.editingCategory = null;
    this.backendErrors = null;
    this.isModalOpen = true;
  }

  openEditModal(category: Category): void {
    this.editingCategory = category;
    this.backendErrors = null;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isSubmitting = false;
    this.editingCategory = null;
    this.backendErrors = null;
  }

  onSaveCategory(data: CategoryRequest): void {
    this.isSubmitting = true;
    this.backendErrors = null;

    if (this.editingCategory) {
      // Update existing category
      this.categoryService.updateCategory(this.editingCategory.id, data).subscribe({
        next: (resp) => {
          const index = this.categories.findIndex((c) => c.id === this.editingCategory!.id);
          if (index !== -1) {
            this.categories[index] = resp.data;
            this.categories = [...this.categories];
          }
          this.filterCategories();
          this.closeModal();
          this.showNotification('Catégorie mise à jour avec succès', 'success');
        },
        error: (error) => {
          console.error('Error updating category:', error);
          this.isSubmitting = false;
          if (error.error && typeof error.error === 'object') {
            this.backendErrors = error.error;
          } else {
            this.showNotification('Erreur lors de la mise à jour de la catégorie', 'error');
          }
          this.cdr.detectChanges();
        },
      });
    } else {
      // Create new category
      this.categoryService.createCategory(data).subscribe({
        next: (resp) => {
          this.categories = [resp.data, ...this.categories];
          this.filterCategories();
          this.closeModal();
          this.showNotification('Catégorie créée avec succès', 'success');
        },
        error: (error) => {
          console.error('Error creating category:', error);
          this.isSubmitting = false;
          if (error.error && typeof error.error === 'object') {
            this.backendErrors = error.error;
          } else {
            this.showNotification('Erreur lors de la création de la catégorie', 'error');
          }
          this.cdr.detectChanges();
        },
      });
    }
  }

  // Delete methods
  confirmDelete(category: Category): void {
    this.categoryToDelete = category;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.categoryToDelete = null;
    this.showDeleteConfirm = false;
  }

  executeDelete(): void {
    if (!this.categoryToDelete) return;

    this.isDeleting = true;
    this.categoryService.deleteCategory(this.categoryToDelete.id).subscribe({
      next: () => {
        this.categories = this.categories.filter((c) => c.id !== this.categoryToDelete!.id);
        this.filterCategories();
        this.showNotification('Catégorie supprimée avec succès', 'success');
        this.cancelDelete();
        this.isDeleting = false;
      },
      error: (error) => {
        console.error('Error deleting category:', error);
        this.showNotification('Erreur lors de la suppression de la catégorie', 'error');
        this.isDeleting = false;
      },
    });
  }

  // Search and filter
  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.filterCategories();
  }

  onFilterChange(filter: 'all' | 'active' | 'inactive'): void {
    this.activeFilter = filter;
    this.filterCategories();
  }

  private filterCategories(): void {
    let filtered = this.categories;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (category) =>
          category.name.toLowerCase().includes(term) ||
          category.description.toLowerCase().includes(term)
      );
    }

    if (this.activeFilter === 'active') {
      filtered = filtered.filter((category) => category.active);
    } else if (this.activeFilter === 'inactive') {
      filtered = filtered.filter((category) => !category.active);
    }

    this.filteredCategories = filtered;
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
    return this.categories.filter((c) => c.active).length;
  }

  getInactiveCount(): number {
    return this.categories.filter((c) => !c.active).length;
  }
}
