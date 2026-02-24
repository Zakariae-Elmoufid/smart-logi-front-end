import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WarehouseResponseDTO, WarehouseRequestDTO } from '../../models/warehouse.model';

@Component({
    selector: 'app-warehouse-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './warehouse-modal.html',
})
export class WarehouseModal implements OnChanges {
    @Input() isOpen = false;
    @Input() isSubmitting = false;
    @Input() editWarehouse: WarehouseResponseDTO | null = null;
    @Input() backendErrors: { [key: string]: string } | null = null;

    @Output() close = new EventEmitter<void>();
    @Output() submit = new EventEmitter<WarehouseRequestDTO>();

    warehouseForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.warehouseForm = this.fb.group({
            name: ['', [Validators.required]],
            code: ['', [Validators.required]],
            address: ['', [Validators.required]],
            active: [true],
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['isOpen'] && this.isOpen) {
            if (this.editWarehouse) {
                this.warehouseForm.patchValue({
                    name: this.editWarehouse.name,
                    code: this.editWarehouse.code,
                    address: this.editWarehouse.address,
                    active: this.editWarehouse.active,
                });
            } else {
                this.warehouseForm.reset({
                    name: '',
                    code: '',
                    address: '',
                    active: true,
                });
            }
        }
    }

    get f() {
        return this.warehouseForm.controls;
    }

    get isEditMode(): boolean {
        return !!this.editWarehouse;
    }

    objectKeys(obj: any): string[] {
        return obj ? Object.keys(obj) : [];
    }

    onClose(): void {
        this.warehouseForm.reset();
        this.close.emit();
    }

    onSubmit(): void {
        if (this.isSubmitting) return;

        if (this.warehouseForm.invalid) {
            this.warehouseForm.markAllAsTouched();
            return;
        }

        const formValue = this.warehouseForm.value;
        const data: WarehouseRequestDTO = {
            name: formValue.name,
            code: formValue.code,
            address: formValue.address,
            active: formValue.active,
        };

        this.submit.emit(data);
    }
}
