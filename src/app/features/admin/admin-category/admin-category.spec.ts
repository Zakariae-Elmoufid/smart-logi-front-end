import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdminCategory } from './admin-category';
import { CategoryService } from '../../../api/category-service';

describe('AdminCategory', () => {
  let component: AdminCategory;
  let fixture: ComponentFixture<AdminCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCategory, HttpClientTestingModule],
      providers: [CategoryService],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty categories list initially', () => {
    expect(component.categories).toEqual([]);
  });

  it('should filter categories correctly', () => {
    component.categories = [
      { id: 1, name: 'Electronics', description: 'Electronic devices', active: true },
      { id: 2, name: 'Furniture', description: 'Home furniture', active: false },
    ];
    
    component.onFilterChange('active');
    expect(component.filteredCategories.length).toBe(1);
    expect(component.filteredCategories[0].name).toBe('Electronics');

    component.onFilterChange('inactive');
    expect(component.filteredCategories.length).toBe(1);
    expect(component.filteredCategories[0].name).toBe('Furniture');

    component.onFilterChange('all');
    expect(component.filteredCategories.length).toBe(2);
  });

  it('should count active and inactive categories', () => {
    component.categories = [
      { id: 1, name: 'Electronics', description: 'Electronic devices', active: true },
      { id: 2, name: 'Furniture', description: 'Home furniture', active: false },
      { id: 3, name: 'Clothing', description: 'Fashion items', active: true },
    ];

    expect(component.getActiveCount()).toBe(2);
    expect(component.getInactiveCount()).toBe(1);
  });
});
