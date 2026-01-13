import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventoryRequestDTO } from '../../models/inventory.model';
import { ProductService } from '../../../../api/product-service';
import { WarehouseService } from '../../../../api/warehouse.service';
import { Product } from '../../../admin/models/admin-product.model';
import { WarehouseResponseDTO } from '../../models/warehouse.model';

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

    constructor(
        private fb: FormBuilder,
        private productService: ProductService,
        private warehouseService: WarehouseService
    ) {
        this.inventoryForm = this.fb.group({
            productId: ['', [Validators.required]],
            warehouseId: ['', [Validators.required]]
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['isOpen'] && this.isOpen) {
            this.inventoryForm.reset({
                productId: '',
                warehouseId: ''
            });
            this.loadOptions();
        }
    }

    loadOptions(): void {
        this.productService.getProducts().subscribe((res: any) => {
            if (res && Array.isArray(res.data)) {
                this.products = res.data;
            } else if (Array.isArray(res)) {
                this.products = res;
            }
        });

        this.warehouseService.getAll().subscribe((res: any) => {
            if (res && Array.isArray(res.data)) {
                this.warehouses = res.data;
            } else if (Array.isArray(res)) {
                this.warehouses = res; // Handle direct array return if generic logic fails
            }
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
            warehouseId: Number(formValue.warehouseId)
        };

        this.submit.emit(data);
    }
}
