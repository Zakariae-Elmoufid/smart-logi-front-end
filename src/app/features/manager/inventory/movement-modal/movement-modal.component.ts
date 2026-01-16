import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventoryResponseDTO, MovementType } from '../../models/inventory.model';

@Component({
    selector: 'app-movement-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './movement-modal.html',
})
export class MovementModal implements OnChanges {
    @Input() isOpen = false;
    @Input() isSubmitting = false;
    @Input() inventoryItem: InventoryResponseDTO | null = null;
    @Input() backendErrors: { [key: string]: string } | null = null;
    @Output() close = new EventEmitter<void>();
    @Output() submit = new EventEmitter<{ type: MovementType, quantity: number, inventoryId: number }>();

    movementForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.movementForm = this.fb.group({
            type: ['INBOUND', [Validators.required]],
            quantity: ['', [Validators.required, Validators.min(1)]]
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['isOpen'] && this.isOpen) {
            this.movementForm.reset({
                type: 'INBOUND',
                quantity: ''
            });
        }
    }

    get f() {
        return this.movementForm.controls;
    }

    onClose(): void {
        this.close.emit();
    }

    onSubmit(): void {
        if (this.isSubmitting) return;

        if (this.movementForm.invalid) {
            this.movementForm.markAllAsTouched();
            return;
        }

        if (!this.inventoryItem) return;

        const formValue = this.movementForm.value;
        this.submit.emit({
            type: formValue.type,
            quantity: Number(formValue.quantity),
            inventoryId: this.inventoryItem.id
        });
    }
}
