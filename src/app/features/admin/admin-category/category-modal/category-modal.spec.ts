import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryModal } from './category-modal';

describe('CategoryModal', () => {
  let component: CategoryModal;
  let fixture: ComponentFixture<CategoryModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryModal, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form when all required fields are filled', () => {
    component.categoryForm.patchValue({
      name: 'Electronics',
      description: 'All electronic devices and gadgets',
      active: true,
    });
    expect(component.categoryForm.valid).toBeTruthy();
  });

  it('should have invalid form when name is too short', () => {
    component.categoryForm.patchValue({
      name: 'A',
      description: 'All electronic devices and gadgets',
      active: true,
    });
    expect(component.categoryForm.get('name')?.errors?.['minlength']).toBeTruthy();
  });

  it('should have invalid form when description is too short', () => {
    component.categoryForm.patchValue({
      name: 'Electronics',
      description: 'Short',
      active: true,
    });
    expect(component.categoryForm.get('description')?.errors?.['minlength']).toBeTruthy();
  });

  it('should calculate description length correctly', () => {
    component.categoryForm.patchValue({
      description: 'Test description',
    });
    expect(component.descriptionLength).toBe(16);
  });

  it('should be in edit mode when editCategory is provided', () => {
    component.editCategory = {
      id: 1,
      name: 'Electronics',
      description: 'Electronic devices',
      active: true,
    };
    expect(component.isEditMode).toBeTruthy();
  });
});
