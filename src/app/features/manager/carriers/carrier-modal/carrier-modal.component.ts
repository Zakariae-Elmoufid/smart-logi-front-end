import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Carrier, CarrierRequest } from '../../models/carrier.model';

@Component({
  selector: 'app-carrier-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './carrier-modal.html',
})
export class CarrierModal implements OnChanges {
  @Input() isOpen = false;
  @Input() isSubmitting = false;
  @Input() editCarrier: Carrier | null = null;
  @Input() backendErrors: { [key: string]: string } | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<CarrierRequest>();

  carrierForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.carrierForm = this.fb.group({
      carrierName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[+]?[\d\s-]{8,20}$/)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      if (this.editCarrier) {
        this.carrierForm.patchValue({
          carrierName: this.editCarrier.carrierName,
          phoneNumber: this.editCarrier.phoneNumber,
        });
      } else {
        this.carrierForm.reset({
          carrierName: '',
          phoneNumber: '',
        });
      }
    }
  }

  get isEditMode(): boolean {
    return this.editCarrier !== null;
  }

  get f() {
    return this.carrierForm.controls;
  }

  onClose(): void {
    this.carrierForm.reset({
      carrierName: '',
      phoneNumber: '',
    });
    this.close.emit();
  }

  onSubmit(): void {
    if (this.carrierForm.valid) {
      const carrier: CarrierRequest = {
        carrierName: this.carrierForm.value.carrierName.trim(),
        phoneNumber: this.carrierForm.value.phoneNumber.trim(),
      };
      this.submit.emit(carrier);
    } else {
      this.carrierForm.markAllAsTouched();
    }
  }
}
