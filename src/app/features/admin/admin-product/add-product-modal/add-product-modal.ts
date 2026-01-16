import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductRequestDTO, Product } from '../../models/admin-product.model';
import { CategoryResponseDTO } from '../../models/category.model';
import { CategoryService } from '../../../../api/category-service';

@Component({
  selector: 'app-add-product-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product-modal.html',
  styleUrl: './add-product-modal.css',
})
export class AddProductModal implements OnChanges {
  @Input() isOpen = false;
  @Input() isSubmitting = false;
  @Input() editProduct: Product | null = null;
  @Input() backendErrors: { [key: string]: string } | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<ProductRequestDTO>();

  productForm: FormGroup;
  categories: CategoryResponseDTO[] = [];
  isLoadingCategories = false;

  constructor(private fb: FormBuilder, private categoryService: CategoryService) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      sku: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9-]+$/)]],
      categoryId: ['', [Validators.required]],
      purchasePrice: [0, [Validators.required, Validators.min(0)]],
      sellingPrice: [0, [Validators.required, Validators.min(0)]],
      active: [true],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Load categories when modal opens
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      this.loadCategories();

      // If editing, populate the form with product data
      if (this.editProduct) {
        this.productForm.patchValue({
          name: this.editProduct.name,
          sku: this.editProduct.sku,
          categoryId: this.editProduct.categoryId || '',
          purchasePrice: this.editProduct.purchasePrice,
          sellingPrice: this.editProduct.sellingPrice,
          active: this.editProduct.active,
        });
      }
    }
  }

  get isEditMode(): boolean {
    return this.editProduct !== null;
  }

  loadCategories(): void {
    if (this.categories.length > 0) {
      return;
    }

    this.isLoadingCategories = true;

    this.categoryService.getCategories().subscribe({
      next: (resp) => {
        this.categories = resp.data;
        console.log('Categories loaded:', this.categories);
        this.isLoadingCategories = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.isLoadingCategories = false;
      },
    });
  }

  get f() {
    return this.productForm.controls;
  }

  get profitMargin(): number {
    const purchase = this.productForm.get('purchasePrice')?.value || 0;
    const selling = this.productForm.get('sellingPrice')?.value || 0;
    if (selling <= 0) return 0;
    return ((selling - purchase) / selling) * 100;
  }

  onClose(): void {
    this.productForm.reset({
      name: '',
      sku: '',
      categoryId: '',
      purchasePrice: 0,
      sellingPrice: 0,
      active: true,
    });
    this.close.emit();
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const product: ProductRequestDTO = {
        name: this.productForm.value.name.trim(),
        sku: this.productForm.value.sku.trim().toUpperCase(),
        categoryId: Number(this.productForm.value.categoryId),
        purchasePrice: Number(this.productForm.value.purchasePrice),
        sellingPrice: Number(this.productForm.value.sellingPrice),
        active: this.productForm.value.active,
      };
      this.submit.emit(product);
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  generateSku(): void {
    const name = this.productForm.get('name')?.value || '';
    if (name.length >= 3) {
      const prefix = name
        .substring(0, 3)
        .toUpperCase()
        .replace(/[^A-Z]/g, 'X');
      const random = Math.floor(1000 + Math.random() * 9000);
      this.productForm.patchValue({ sku: `${prefix}-${random}` });
    }
  }
}
