import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category, CategoryRequest } from '../../models/category.model';

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-modal.html',
  styleUrl: './category-modal.css',
})
export class CategoryModal implements OnChanges {
  @Input() isOpen = false;
  @Input() isSubmitting = false;
  @Input() editCategory: Category | null = null;
  @Input() backendErrors: { [key: string]: string } | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<CategoryRequest>();

  categoryForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      active: [true],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      if (this.editCategory) {
        this.categoryForm.patchValue({
          name: this.editCategory.name,
          description: this.editCategory.description,
          active: this.editCategory.active,
        });
      } else {
        this.categoryForm.reset({
          name: '',
          description: '',
          active: true,
        });
      }
    }
  }

  get isEditMode(): boolean {
    return this.editCategory !== null;
  }

  get f() {
    return this.categoryForm.controls;
  }

  get descriptionLength(): number {
    return this.categoryForm.get('description')?.value?.length || 0;
  }

  onClose(): void {
    this.categoryForm.reset({
      name: '',
      description: '',
      active: true,
    });
    this.close.emit();
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const category: CategoryRequest = {
        name: this.categoryForm.value.name.trim(),
        description: this.categoryForm.value.description.trim(),
        active: this.categoryForm.value.active,
      };
      this.submit.emit(category);
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }
}
