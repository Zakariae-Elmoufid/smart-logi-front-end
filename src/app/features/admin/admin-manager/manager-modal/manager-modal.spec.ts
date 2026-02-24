import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ManagerModal } from './manager-modal';
import { WarehouseService } from '../../../../api/warehouse.service';

describe('ManagerModal', () => {
  let component: ManagerModal;
  let fixture: ComponentFixture<ManagerModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerModal, HttpClientTestingModule, ReactiveFormsModule],
      providers: [WarehouseService],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form when all required fields are filled', () => {
    component.managerForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      password: 'password123',
      confirmPassword: 'password123',
      enabled: true,
    });
    expect(component.managerForm.valid).toBeTruthy();
  });

  it('should have invalid form when email is invalid', () => {
    component.managerForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
      password: 'password123',
      confirmPassword: 'password123',
      enabled: true,
    });
    expect(component.managerForm.get('email')?.errors?.['email']).toBeTruthy();
  });

  it('should detect password mismatch', () => {
    component.managerForm.patchValue({
      password: 'password123',
      confirmPassword: 'different',
    });
    expect(component.passwordsMatch).toBeFalsy();
  });

  it('should toggle warehouse selection', () => {
    component.toggleWarehouse(1);
    expect(component.selectedWarehouseIds).toContain(1);
    
    component.toggleWarehouse(1);
    expect(component.selectedWarehouseIds).not.toContain(1);
  });
});
