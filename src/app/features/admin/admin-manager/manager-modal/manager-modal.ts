import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Manager, ManagerCreateDTO, ManagerUpdateDTO } from '../../models/manager.model';
import { WarehouseService } from '../../../../api/warehouse.service';
import { WarehouseResponseDTO } from '../../../manager/models/warehouse.model';

@Component({
  selector: 'app-manager-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manager-modal.html',
  styleUrl: './manager-modal.css',
})
export class ManagerModal implements OnChanges {
  @Input() isOpen = false;
  @Input() isSubmitting = false;
  @Input() editManager: Manager | null = null;
  @Input() backendErrors: { [key: string]: string } | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<ManagerCreateDTO | ManagerUpdateDTO>();

  managerForm: FormGroup;
  warehouses: WarehouseResponseDTO[] = [];
  isLoadingWarehouses = false;
  selectedWarehouseIds: number[] = [];

  constructor(
    private fb: FormBuilder,
    private warehouseService: WarehouseService
  ) {
    this.managerForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      enabled: [true],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      this.loadWarehouses();

      if (this.editManager) {
        // Edit mode - password not required
        this.managerForm.get('password')?.clearValidators();
        this.managerForm.get('password')?.updateValueAndValidity();
        this.managerForm.get('confirmPassword')?.clearValidators();
        this.managerForm.get('confirmPassword')?.updateValueAndValidity();

        this.managerForm.patchValue({
          firstName: this.editManager.firstName,
          lastName: this.editManager.lastName,
          email: this.editManager.email,
          enabled: this.editManager.enabled,
          password: '',
          confirmPassword: '',
        });

        // Set selected warehouses if available
        if (this.editManager.warehouses) {
          this.selectedWarehouseIds = this.editManager.warehouses.map(w => w.id);
        } else {
          this.selectedWarehouseIds = [];
        }
      } else {
        // Create mode - password required
        this.managerForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
        this.managerForm.get('password')?.updateValueAndValidity();
        this.managerForm.get('confirmPassword')?.setValidators([Validators.required]);
        this.managerForm.get('confirmPassword')?.updateValueAndValidity();
        this.selectedWarehouseIds = [];
      }
    }
  }

  get isEditMode(): boolean {
    return this.editManager !== null;
  }

  get f() {
    return this.managerForm.controls;
  }

  loadWarehouses(): void {
    if (this.warehouses.length > 0) {
      return;
    }

    this.isLoadingWarehouses = true;
    this.warehouseService.getAll().subscribe({
      next: (resp) => {
        this.warehouses = resp.data;
        this.isLoadingWarehouses = false;
      },
      error: (error) => {
        console.error('Error loading warehouses:', error);
        this.isLoadingWarehouses = false;
      },
    });
  }

  isWarehouseSelected(warehouseId: number): boolean {
    return this.selectedWarehouseIds.includes(warehouseId);
  }

  toggleWarehouse(warehouseId: number): void {
    const index = this.selectedWarehouseIds.indexOf(warehouseId);
    if (index > -1) {
      this.selectedWarehouseIds.splice(index, 1);
    } else {
      this.selectedWarehouseIds.push(warehouseId);
    }
  }

  get passwordsMatch(): boolean {
    const password = this.managerForm.get('password')?.value;
    const confirmPassword = this.managerForm.get('confirmPassword')?.value;
    return password === confirmPassword;
  }

  onClose(): void {
    this.managerForm.reset({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      enabled: true,
    });
    this.selectedWarehouseIds = [];
    this.close.emit();
  }

  onSubmit(): void {
    // Check passwords match if creating new manager
    if (!this.isEditMode && !this.passwordsMatch) {
      return;
    }

    if (this.managerForm.valid) {
      if (this.isEditMode) {
        const updateData: ManagerUpdateDTO = {
          firstName: this.managerForm.value.firstName.trim(),
          lastName: this.managerForm.value.lastName.trim(),
          email: this.managerForm.value.email.trim(),
          enabled: this.managerForm.value.enabled,
          warehouseIds: this.selectedWarehouseIds,
        };
        this.submit.emit(updateData);
      } else {
        const createData: ManagerCreateDTO = {
          firstName: this.managerForm.value.firstName.trim(),
          lastName: this.managerForm.value.lastName.trim(),
          email: this.managerForm.value.email.trim(),
          password: this.managerForm.value.password,
          enabled: this.managerForm.value.enabled,
          warehouseIds: this.selectedWarehouseIds,
        };
        this.submit.emit(createData);
      }
    } else {
      this.managerForm.markAllAsTouched();
    }
  }
}
