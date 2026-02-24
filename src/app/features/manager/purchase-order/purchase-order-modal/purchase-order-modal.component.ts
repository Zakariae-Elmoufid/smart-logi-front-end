import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PurchaseOrderRequestDTO } from '../../models/purchase-order.model';
import { SupplierService } from '../../../../api/supplier.service';
import { WarehouseService } from '../../../../api/warehouse.service';
import { ProductService } from '../../../../api/product-service';
import { Supplier } from '../../models/supplier.model';
import { WarehouseResponseDTO } from '../../models/warehouse.model';
import { Product } from '../../../admin/models/admin-product.model';

@Component({
    selector: 'app-purchase-order-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './purchase-order-modal.html',
})
export class PurchaseOrderModal implements OnChanges {
    @Input() isOpen = false;
    @Input() isSubmitting = false;
    @Input() backendErrors: { [key: string]: string } | null = null;
    @Output() close = new EventEmitter<void>();
    @Output() submit = new EventEmitter<PurchaseOrderRequestDTO>();

    orderForm: FormGroup;
    suppliers: Supplier[] = [];
    warehouses: WarehouseResponseDTO[] = [];
    products: Product[] = [];

    constructor(
        private fb: FormBuilder,
        private supplierService: SupplierService,
        private warehouseService: WarehouseService,
        private productService: ProductService
    ) {
        this.orderForm = this.fb.group({
            supplierId: ['', [Validators.required]],
            warehouseId: ['', [Validators.required]],
            expectedDate: ['', [Validators.required]],
            liens: this.fb.array([], [Validators.required])
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['isOpen'] && this.isOpen) {
            this.orderForm.reset();
            this.liens.clear();
            this.addLine();
            this.loadOptions();
        }
    }

    loadOptions(): void {
        // Load Suppliers
        this.supplierService.getAll().subscribe((res: any) => {
            if (res && Array.isArray(res.data)) this.suppliers = res.data;
            else if (Array.isArray(res)) this.suppliers = res;
        });

        // Load Warehouses
        this.warehouseService.getAll().subscribe((res: any) => {
            if (res && Array.isArray(res.data)) this.warehouses = res.data;
            else if (Array.isArray(res)) this.warehouses = res;
        });

        // Load Products
        this.productService.getProducts().subscribe((res: any) => {
            if (res && Array.isArray(res.data)) this.products = res.data;
            else if (Array.isArray(res)) this.products = res;
        });
    }

    get liens() {
        return this.orderForm.get('liens') as FormArray;
    }

    get f() {
        return this.orderForm.controls;
    }

    addLine(): void {
        const lineGroup = this.fb.group({
            productId: ['', Validators.required],
            quantity: ['', [Validators.required, Validators.min(1)]]
        });
        this.liens.push(lineGroup);
    }

    removeLine(index: number): void {
        this.liens.removeAt(index);
    }

    onClose(): void {
        this.close.emit();
    }

    onSubmit(): void {
        if (this.isSubmitting) return;

        if (this.orderForm.invalid || this.liens.length === 0) {
            this.orderForm.markAllAsTouched();
            return;
        }

        const formValue = this.orderForm.value;

        let formattedDate = formValue.expectedDate;
        // Append seconds if missing from datetime-local input
        if (formattedDate && formattedDate.length === 16) {
            formattedDate += ':00';
        }

        const dto: PurchaseOrderRequestDTO = {
            supplierId: Number(formValue.supplierId),
            warehouseId: Number(formValue.warehouseId),
            expectedDate: formattedDate,
            liens: formValue.liens.map((l: any) => ({
                productId: Number(l.productId),
                quantity: Number(l.quantity)
            }))
        };

        this.submit.emit(dto);
    }
}
