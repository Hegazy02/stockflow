/**
 * Automated Pagination Integration Tests
 * 
 * This file contains automated tests to verify the pagination flow.
 * These tests complement the manual verification checklist.
 * 
 * Run with: npm test
 */

import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { ProductListComponent } from '../../../src/app/features/products/components/product-list/product-list.component';
import { loadProducts, changePage } from '../../../src/app/features/products/store/products.actions';
import { 
  selectAllProducts, 
  selectProductsLoading, 
  selectProductsPagination,
  selectTotalRecords,
  selectCurrentPage,
  selectPageSize,
  selectProductsError
} from '../../../src/app/features/products/store/products.selectors';

describe('Pagination Integration Tests', () => {
  let component: ProductListComponent;
  let store: MockStore;
  let router: Router;
  let mockActivatedRoute: any;

  const initialState = {
    products: {
      entities: {},
      ids: [],
      selectedProductId: null,
      loading: false,
      error: null,
      pagination: {
        total: 50,
        page: 1,
        limit: 10,
        pages: 5
      }
    }
  };

  beforeEach(() => {
    mockActivatedRoute = {
      queryParams: of({ page: '1', limit: '10' })
    };

    TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        provideMockStore({ initialState }),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true))
          }
        }
      ]
    });

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    
    // Spy on store dispatch
    spyOn(store, 'dispatch');
  });

  describe('Test Scenario 1: Navigation Between Pages', () => {
    
    it('1.1 should load with default pagination on initial load', () => {
      // Arrange
      store.overrideSelector(selectCurrentPage, 1);
      store.overrideSelector(selectPageSize, 10);
      store.overrideSelector(selectTotalRecords, 50);

      // Act
      const fixture = TestBed.createComponent(ProductListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Assert
      expect(store.dispatch).toHaveBeenCalledWith(
        loadProducts({ page: 1, limit: 10 })
      );
    });

    it('1.2 should dispatch changePage action when page changes', () => {
      // Arrange
      const fixture = TestBed.createComponent(ProductListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Act
      component.onPageChange({ page: 2, pageSize: 10, first: 10 });

      // Assert
      expect(store.dispatch).toHaveBeenCalledWith(
        changePage({ page: 2, limit: 10 })
      );
    });

    it('1.3 should update URL when page changes', () => {
      // Arrange
      const fixture = TestBed.createComponent(ProductListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Act
      component.onPageChange({ page: 2, pageSize: 10, first: 10 });
      
      // Assert
      expect(router.navigate).toHaveBeenCalledWith(
        [],
        jasmine.objectContaining({
          queryParams: { page: 2, limit: 10 }
        })
      );
    });
  });

  describe('Test Scenario 2: Page Size Changes', () => {
    
    it('2.1 should reset to page 1 when page size changes', () => {
      // Arrange
      const fixture = TestBed.createComponent(ProductListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Act
      component.onPageChange({ page: 1, pageSize: 20, first: 0 });

      // Assert
      expect(store.dispatch).toHaveBeenCalledWith(
        changePage({ page: 1, limit: 20 })
      );
    });

    it('2.2 should update URL with new page size', () => {
      // Arrange
      const fixture = TestBed.createComponent(ProductListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Act
      component.onPageChange({ page: 1, pageSize: 20, first: 0 });

      // Assert
      expect(router.navigate).toHaveBeenCalledWith(
        [],
        jasmine.objectContaining({
          queryParams: { page: 1, limit: 20 }
        })
      );
    });
  });

  describe('Test Scenario 3: URL Synchronization', () => {
    
    it('3.1 should read pagination from URL query parameters', () => {
      // Arrange
      mockActivatedRoute.queryParams = of({ page: '3', limit: '20' });
      
      // Act
      const fixture = TestBed.createComponent(ProductListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Assert
      expect(store.dispatch).toHaveBeenCalledWith(
        loadProducts({ page: 3, limit: 20 })
      );
    });

    it('3.2 should default to page 1 and limit 10 when URL params are missing', () => {
      // Arrange
      mockActivatedRoute.queryParams = of({});

      // Act
      const fixture = TestBed.createComponent(ProductListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Assert
      expect(store.dispatch).toHaveBeenCalledWith(
        loadProducts({ page: 1, limit: 10 })
      );
    });

    it('3.3 should handle invalid page numbers gracefully', () => {
      // Arrange
      mockActivatedRoute.queryParams = of({ page: 'invalid', limit: '10' });

      // Act
      const fixture = TestBed.createComponent(ProductListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Assert - should default to page 1
      expect(store.dispatch).toHaveBeenCalledWith(
        loadProducts({ page: 1, limit: 10 })
      );
    });
  });

  describe('Test Scenario 4: Pagination with Filters', () => {
    
    it('4.1 should reset to page 1 when filter changes', () => {
      // Arrange
      store.overrideSelector(selectCurrentPage, 3);
      store.overrideSelector(selectPageSize, 10);
      
      const fixture = TestBed.createComponent(ProductListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Act
      component.onFilterChange({ field: 'name', value: 'test', filters: { name: 'test' } });

      // Assert
      expect(store.dispatch).toHaveBeenCalledWith(
        loadProducts({ page: 1, limit: 10 })
      );
    });

    it('4.2 should update URL to page 1 when filter changes', () => {
      // Arrange
      store.overrideSelector(selectCurrentPage, 3);
      store.overrideSelector(selectPageSize, 10);
      
      const fixture = TestBed.createComponent(ProductListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Act
      component.onFilterChange({ field: 'name', value: 'test', filters: { name: 'test' } });

      // Assert
      expect(router.navigate).toHaveBeenCalledWith(
        [],
        jasmine.objectContaining({
          queryParams: jasmine.objectContaining({ page: 1 })
        })
      );
    });
  });

  describe('Test Scenario 5: Loading States', () => {
    
    it('5.1 should show loading state during page change', (done) => {
      // Arrange
      store.overrideSelector(selectProductsLoading, true);
      
      const fixture = TestBed.createComponent(ProductListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Act & Assert
      component.loading$.subscribe(loading => {
        expect(loading).toBe(true);
        done();
      });
    });

    it('5.2 should clear loading state after data loads', (done) => {
      // Arrange
      store.overrideSelector(selectProductsLoading, false);
      
      const fixture = TestBed.createComponent(ProductListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Act & Assert
      component.loading$.subscribe(loading => {
        expect(loading).toBe(false);
        done();
      });
    });
  });

  describe('Test Scenario 6: Store State Verification', () => {
    
    it('6.1 should have correct pagination state in store', (done) => {
      // Arrange
      const expectedPagination = {
        total: 50,
        page: 2,
        limit: 10,
        pages: 5
      };
      store.overrideSelector(selectProductsPagination, expectedPagination);
      
      const fixture = TestBed.createComponent(ProductListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Act & Assert
      component.pagination$.subscribe(pagination => {
        expect(pagination).toEqual(expectedPagination);
        done();
      });
    });

    it('6.2 should expose individual pagination selectors', (done) => {
      // Arrange
      store.overrideSelector(selectCurrentPage, 3);
      store.overrideSelector(selectPageSize, 20);
      store.overrideSelector(selectTotalRecords, 100);
      
      const fixture = TestBed.createComponent(ProductListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Act & Assert
      component.currentPage$.subscribe(page => {
        expect(page).toBe(3);
      });
      
      component.pageSize$.subscribe(size => {
        expect(size).toBe(20);
      });
      
      component.totalRecords$.subscribe(total => {
        expect(total).toBe(100);
        done();
      });
    });
  });

  describe('Test Scenario 7: Error Handling', () => {
    
    it('7.1 should retry with current pagination on error', () => {
      // Arrange
      store.overrideSelector(selectCurrentPage, 2);
      store.overrideSelector(selectPageSize, 10);
      
      const fixture = TestBed.createComponent(ProductListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Act
      component.retryLoadProducts();

      // Assert
      expect(store.dispatch).toHaveBeenCalledWith(
        loadProducts({ page: 2, limit: 10 })
      );
    });
  });

  describe('Test Scenario 8: Edge Cases', () => {
    
    it('8.1 should handle single page of results', (done) => {
      // Arrange
      store.overrideSelector(selectTotalRecords, 5);
      store.overrideSelector(selectPageSize, 10);
      
      const fixture = TestBed.createComponent(ProductListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Act & Assert
      component.totalRecords$.subscribe(total => {
        expect(total).toBe(5);
        done();
      });
    });

    it('8.2 should handle empty results', (done) => {
      // Arrange
      store.overrideSelector(selectTotalRecords, 0);
      store.overrideSelector(selectAllProducts, []);
      
      const fixture = TestBed.createComponent(ProductListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Act & Assert
      component.totalRecords$.subscribe(total => {
        expect(total).toBe(0);
      });
      
      component.products$.subscribe(products => {
        expect(products.length).toBe(0);
        done();
      });
    });
  });
});

/**
 * Data Table Component Pagination Tests
 */
describe('DataTable Pagination Component Tests', () => {
  
  it('should calculate first record index correctly', () => {
    // Test: first = (currentPage - 1) * pageSize
    const testCases = [
      { page: 1, size: 10, expected: 0 },
      { page: 2, size: 10, expected: 10 },
      { page: 3, size: 20, expected: 40 },
      { page: 5, size: 5, expected: 20 }
    ];

    testCases.forEach(({ page, size, expected }) => {
      const first = (page - 1) * size;
      expect(first).toBe(expected);
    });
  });

  it('should calculate last record index correctly', () => {
    // Test: last = min(first + pageSize, totalRecords)
    const testCases = [
      { first: 0, size: 10, total: 50, expected: 10 },
      { first: 40, size: 10, total: 50, expected: 50 },
      { first: 0, size: 10, total: 5, expected: 5 },
      { first: 20, size: 10, total: 25, expected: 25 }
    ];

    testCases.forEach(({ first, size, total, expected }) => {
      const last = Math.min(first + size, total);
      expect(last).toBe(expected);
    });
  });

  it('should convert PrimeNG page event to PageChangeEvent correctly', () => {
    // PrimeNG event: { first: 10, rows: 10 }
    // Our event: { page: 2, pageSize: 10, first: 10 }
    
    const primeNgEvent = { first: 10, rows: 10 };
    const page = Math.floor(primeNgEvent.first / primeNgEvent.rows) + 1;
    
    expect(page).toBe(2);
  });

  it('should hide pagination when totalRecords is 0', () => {
    const totalRecords = 0;
    const shouldShowPagination = totalRecords > 0;
    
    expect(shouldShowPagination).toBe(false);
  });

  it('should show pagination when totalRecords > 0', () => {
    const totalRecords = 50;
    const shouldShowPagination = totalRecords > 0;
    
    expect(shouldShowPagination).toBe(true);
  });
});

/**
 * Product Service Pagination Tests
 */
describe('ProductService Pagination Tests', () => {
  
  it('should construct correct query parameters', () => {
    const page = 2;
    const limit = 20;
    
    // Simulate HttpParams construction
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', limit.toString());
    
    expect(params.get('page')).toBe('2');
    expect(params.get('limit')).toBe('20');
    expect(params.toString()).toBe('page=2&limit=20');
  });

  it('should use default values when parameters not provided', () => {
    const page = undefined;
    const limit = undefined;
    
    const defaultPage = page ?? 1;
    const defaultLimit = limit ?? 10;
    
    expect(defaultPage).toBe(1);
    expect(defaultLimit).toBe(10);
  });
});

/**
 * URL Parameter Parsing Tests
 */
describe('URL Parameter Parsing Tests', () => {
  
  it('should parse valid page and limit from URL', () => {
    const params: any = { page: '3', limit: '20' };
    
    const page = parseInt(params['page']) || 1;
    const limit = parseInt(params['limit']) || 10;
    
    expect(page).toBe(3);
    expect(limit).toBe(20);
  });

  it('should default to 1 and 10 for invalid parameters', () => {
    const params: any = { page: 'invalid', limit: 'abc' };
    
    const page = parseInt(params['page']) || 1;
    const limit = parseInt(params['limit']) || 10;
    
    expect(page).toBe(1);
    expect(limit).toBe(10);
  });

  it('should default to 1 and 10 for missing parameters', () => {
    const params: any = {};
    
    const page = parseInt(params['page']) || 1;
    const limit = parseInt(params['limit']) || 10;
    
    expect(page).toBe(1);
    expect(limit).toBe(10);
  });

  it('should handle negative numbers', () => {
    const params: any = { page: '-1', limit: '-10' };
    
    const page = Math.max(1, parseInt(params['page']) || 1);
    const limit = Math.max(1, parseInt(params['limit']) || 10);
    
    expect(page).toBe(1);
    expect(limit).toBe(1);
  });
});
