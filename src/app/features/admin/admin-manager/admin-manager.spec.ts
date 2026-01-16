import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdminManager } from './admin-manager';
import { ManagerService } from '../../../api/manager.service';

describe('AdminManager', () => {
  let component: AdminManager;
  let fixture: ComponentFixture<AdminManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminManager, HttpClientTestingModule],
      providers: [ManagerService],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminManager);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty managers list initially', () => {
    expect(component.managers).toEqual([]);
  });

  it('should filter managers correctly', () => {
    component.managers = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@test.com', role: 'MANAGER', enabled: true, createdAt: '2024-01-01' },
      { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@test.com', role: 'MANAGER', enabled: false, createdAt: '2024-01-02' },
    ];
    
    component.onFilterChange('active');
    expect(component.filteredManagers.length).toBe(1);
    expect(component.filteredManagers[0].firstName).toBe('John');

    component.onFilterChange('inactive');
    expect(component.filteredManagers.length).toBe(1);
    expect(component.filteredManagers[0].firstName).toBe('Jane');

    component.onFilterChange('all');
    expect(component.filteredManagers.length).toBe(2);
  });
});
