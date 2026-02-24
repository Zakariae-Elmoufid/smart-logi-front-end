import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventoryRequestDTO } from '../../models/inventory.model';
import { ProductService } from '../../../../api/product-service';
import { WarehouseService } from '../../../../api/warehouse.service';
import { Product } from '../../../admin/models/admin-product.model';
import { WarehouseResponseDTO } from '../../models/warehouse.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-inventory-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inventory-modal.html',
})
export class InventoryModal implements OnChanges {
  @Input() isOpen = false;
  @Input() isSubmitting = false;
  @Input() backendErrors: { [key: string]: string } | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<InventoryRequestDTO>();

  inventoryForm: FormGroup;
  products: Product[] = [];
  warehouses: WarehouseResponseDTO[] = [];
  isLoadingOptions = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private warehouseService: WarehouseService,
  ) {
    this.inventoryForm = this.fb.group({
      productId: ['', [Validators.required]],
      warehouseId: ['', [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.inventoryForm.reset({
        productId: '',
        warehouseId: '',
      });
      this.loadOptions();
    }
  }

  loadOptions(): void {
    this.isLoadingOptions = true;

    forkJoin({
      products: this.productService.getProducts(),
      warehouses: this.warehouseService.getAll(),
    }).subscribe({
      next: (res) => {
        if (res.products.data ) {
          this.products = res.products.data;
        }

        if (res.warehouses && Array.isArray(res.warehouses.data)) {
          this.warehouses = res.warehouses.data;
        } else if (Array.isArray(res.warehouses)) {
          this.warehouses = res.warehouses;
        }

        this.isLoadingOptions = false;
      },
      error: (err) => {
        console.error('Error loading options:', err);
        this.isLoadingOptions = false;
      },
    });
  }

  get f() {
    return this.inventoryForm.controls;
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.isSubmitting) return;

    if (this.inventoryForm.invalid) {
      this.inventoryForm.markAllAsTouched();
      return;
    }

    const formValue = this.inventoryForm.value;
    const data: InventoryRequestDTO = {
      productId: Number(formValue.productId),
      warehouseId: Number(formValue.warehouseId),
    };

    this.submit.emit(data);
  }
}
