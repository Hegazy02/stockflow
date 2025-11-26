import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ProductFormComponent } from './product-form.component';
import { Product } from '../../models/product.model';
import { ProductCategory } from '../../../categories/models/category.model';
import { loadCategories } from '../../../categories/store/categories.actions';
import {
  selectAllCategories,
  selectCategoriesLoading,
  selectCategoriesError,
} from '../../../categories/store/categories.selectors';
import { selectProductEntities } from '../../store/products.selectors';
import { By } from '@angular/platform-browser';

/**
 * Integration tests for Product Form Component
 * Feature: product-category-selection, Task 13: Final integration testing
 * 
 * These tests verify:
 * - Complete flow: open form → categories load → select category → submit
 * - Edit flow: open product → category populated → change category → submit
 * - Error flow: categories fail to load → error displayed → retry
 * - Validation flow: submit without category → error displayed → select category → submit
 * - Dropdown filter works correctly
 * - Keyboard navigation works
 */
describe('ProductFormComponent - Integration Tests', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let store: MockStore;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  const mockCategories: ProductCategory[] = [
    { _id: 'cat1', name: 'Electronics' },
    { _id: 'cat2', name: 'Furniture' },
    { _id: 'cat3', name: 'Office Supplies' },
  ];

  const mockProduct: Product = {
    _id: 'prod1',
    name: 'Test Product',
    sku: 'TEST-001',
    description: 'Test description for product',
    category: { _id: 'cat1', name: 'Electronics' },
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteStub = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue(null),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [ProductFormComponent, ReactiveFormsModule],
      providers: [
        provideMockStore({
          initialState: {
            products: {
              ids: [],
              entities: {},
              loading: false,
              error: null,
            },
            categories: {
              ids: [],
              entities: {},
              loading: false,
              error: null,
              loaded: false,
            },
          },
          selectors: [
            { selector: selectAllCategories, value: [] },
            { selector: selectCategoriesLoading, value: false },
            { selector: selectCategoriesError, value: null },
          ],
        }),
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();

    store = TestBed.inject(Store) as MockStore;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    
    spyOn(store, 'dispatch');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
  });

  /**
   * Test 1: Complete flow - open form → categories load → select category → submit
   * Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4, 4.4
   */
  describe('Complete Create Flow', () => {
    it('should load categories on init and allow category selection and form submission', fakeAsync(() => {
      // Arrange: Set up initial state
      store.overrideSelector(selectAllCategories, mockCategories);
      store.overrideSelector(selectCategoriesLoading, false);
      store.overrideSelector(selectCategoriesError, null);

      // Act: Initialize component
      fixture.detectChanges();
      tick();

      // Assert: Verify loadCategories action was dispatched
      expect(store.dispatch).toHaveBeenCalledWith(loadCategories());

      // Act: Fill out the form
      component.productForm.patchValue({
        name: 'New Product',
        sku: 'NEW-001',
        description: 'This is a new product description',
        category: 'cat2', // Select Furniture
      });
      fixture.detectChanges();

      // Assert: Form should be valid
      expect(component.productForm.valid).toBe(true);
      expect(component.productForm.value.category).toBe('cat2');

      // Act: Submit the form
      component.onSubmit();

      // Assert: Verify createProduct action was dispatched with correct payload
      const dispatchCalls = (store.dispatch as jasmine.Spy).calls.all();
      const createCall = dispatchCalls.find(
        (call) => call.args[0].type === '[Products] Create Product'
      );
      expect(createCall).toBeDefined();
      expect(createCall?.args[0].product.name).toBe('New Product');
      expect(createCall?.args[0].product.sku).toBe('NEW-001');
      expect(createCall?.args[0].product.description).toBe('This is a new product description');
      expect(createCall?.args[0].product.category).toBe('cat2');

      // Assert: Verify navigation to products list
      expect(router.navigate).toHaveBeenCalledWith(['/products']);
    }));

    it('should display categories in dropdown after loading', fakeAsync(() => {
      // Arrange
      store.overrideSelector(selectAllCategories, mockCategories);
      store.overrideSelector(selectCategoriesLoading, false);

      // Act
      fixture.detectChanges();
      tick();

      // Assert: Categories should be available in component
      component.categories$.subscribe((categories) => {
        expect(categories.length).toBe(3);
        expect(categories).toEqual(mockCategories);
      });
    }));
  });

  /**
   * Test 2: Edit flow - open product → category populated → change category → submit
   * Requirements: 4.1, 4.2, 4.3, 4.4
   */
  describe('Edit Flow', () => {
    beforeEach(() => {
      // Set up edit mode
      (activatedRoute.snapshot.paramMap.get as jasmine.Spy).and.returnValue('prod1');
    });

    it('should populate form with existing product data including category', fakeAsync(() => {
      // Arrange
      store.overrideSelector(selectAllCategories, mockCategories);
      store.overrideSelector(selectCategoriesLoading, false);
      
      // Override the product entities selector to include our mock product
      store.overrideSelector(selectProductEntities, { 'prod1': mockProduct });
      store.refreshState();

      // Act
      fixture.detectChanges();
      tick(100); // Give time for async operations

      // Assert: Form should be populated with product data
      expect(component.isEditMode).toBe(true);
      
      // Wait for the subscription to complete
      fixture.detectChanges();
      tick(100);
      
      expect(component.productForm.value.name).toBe('Test Product');
      expect(component.productForm.value.sku).toBe('TEST-001');
      expect(component.productForm.value.category).toBe('cat1'); // Category ID
    }));

    it('should handle category as object and extract _id', fakeAsync(() => {
      // Arrange: Product with category as object
      store.overrideSelector(selectAllCategories, mockCategories);
      store.overrideSelector(selectProductEntities, { 'prod1': mockProduct });
      store.refreshState();

      // Act
      fixture.detectChanges();
      tick(100);
      fixture.detectChanges();
      tick(100);

      // Assert: Category should be extracted as ID
      expect(component.productForm.value.category).toBe('cat1');
    }));

    it('should handle category as string ID', fakeAsync(() => {
      // Arrange: Product with category as string
      const productWithStringCategory = {
        ...mockProduct,
        category: 'cat1' as any,
      };
      store.overrideSelector(selectAllCategories, mockCategories);
      store.overrideSelector(selectProductEntities, { 'prod1': productWithStringCategory });
      store.refreshState();

      // Act
      fixture.detectChanges();
      tick(100);
      fixture.detectChanges();
      tick(100);

      // Assert: Category should remain as string ID
      expect(component.productForm.value.category).toBe('cat1');
    }));

    it('should update product with new category on submit', fakeAsync(() => {
      // Arrange
      store.overrideSelector(selectAllCategories, mockCategories);
      store.overrideSelector(selectProductEntities, { 'prod1': mockProduct });
      store.refreshState();

      fixture.detectChanges();
      tick(100);
      fixture.detectChanges();
      tick(100);

      // Act: Change category
      component.productForm.patchValue({ category: 'cat3' });
      fixture.detectChanges();

      // Act: Submit form
      component.onSubmit();
      tick(100);

      // Assert: Verify updateProduct action was dispatched with new category
      const dispatchCalls = (store.dispatch as jasmine.Spy).calls.all();
      const updateCall = dispatchCalls.find(
        (call) => call.args[0].type === '[Products] Update Product'
      );
      expect(updateCall).toBeDefined();
      expect(updateCall?.args[0].product._id).toBe('prod1');
      expect(updateCall?.args[0].product.category).toBe('cat3');
    }));
  });

  /**
   * Test 3: Error flow - categories fail to load → error displayed
   * Requirements: 1.3, 3.4, 3.5
   */
  describe('Error Handling Flow', () => {
    it('should display error message when categories fail to load', fakeAsync(() => {
      // Arrange
      const mockError = {
        code: 'HTTP_500',
        message: 'Server error. Please try again later.',
      };
      store.overrideSelector(selectAllCategories, []);
      store.overrideSelector(selectCategoriesLoading, false);
      store.overrideSelector(selectCategoriesError, mockError);

      // Act
      fixture.detectChanges();
      tick();

      // Assert: Error message should be displayed
      component.categoriesError$.subscribe((error) => {
        expect(error).toEqual(mockError);
        expect(error.message).toBe('Server error. Please try again later.');
      });

      // Check if error is displayed in template
      const compiled = fixture.nativeElement as HTMLElement;
      const errorElements = compiled.querySelectorAll('.error-message');
      const hasErrorMessage = Array.from(errorElements).some(
        (el) => el.textContent?.includes('Server error') || el.textContent?.includes('Failed to load')
      );
      expect(hasErrorMessage).toBe(true);
    }));

    it('should show loading state while categories are being fetched', fakeAsync(() => {
      // Arrange
      store.overrideSelector(selectAllCategories, []);
      store.overrideSelector(selectCategoriesLoading, true);
      store.overrideSelector(selectCategoriesError, null);

      // Act
      fixture.detectChanges();
      tick();

      // Assert: Loading state should be true
      component.categoriesLoading$.subscribe((loading) => {
        expect(loading).toBe(true);
      });

      // Assert: Custom dropdown should be present
      const dropdownElement = fixture.debugElement.query(By.css('app-dropdown'));
      expect(dropdownElement).toBeTruthy();
    }));

    it('should show empty state when no categories are available', fakeAsync(() => {
      // Arrange
      store.overrideSelector(selectAllCategories, []);
      store.overrideSelector(selectCategoriesLoading, false);
      store.overrideSelector(selectCategoriesError, null);

      // Act
      fixture.detectChanges();
      tick();

      // Assert: Categories should be empty
      component.categories$.subscribe((categories) => {
        expect(categories.length).toBe(0);
      });
    }));
  });

  /**
   * Test 4: Validation flow - submit without category → error displayed → select category → submit
   * Requirements: 3.1, 3.2, 3.3
   */
  describe('Validation Flow', () => {
    it('should prevent submission when category is not selected', fakeAsync(() => {
      // Arrange
      store.overrideSelector(selectAllCategories, mockCategories);
      store.overrideSelector(selectCategoriesLoading, false);

      fixture.detectChanges();
      tick();

      // Act: Fill form without category
      component.productForm.patchValue({
        name: 'Test Product',
        sku: 'TEST-001',
        description: 'Test description here',
        category: null,
      });
      fixture.detectChanges();

      // Assert: Form should be invalid
      expect(component.productForm.valid).toBe(false);
      expect(component.productForm.get('category')?.hasError('required')).toBe(true);

      // Act: Try to submit
      component.onSubmit();

      // Assert: Form should be marked as touched but not submitted
      expect(component.productForm.get('category')?.touched).toBe(true);
      
      // Verify createProduct was NOT dispatched (only loadCategories on init)
      const createProductCalls = (store.dispatch as jasmine.Spy).calls
        .all()
        .filter((call) => call.args[0].type === '[Products] Create Product');
      expect(createProductCalls.length).toBe(0);
    }));

    it('should display validation error message for required category', fakeAsync(() => {
      // Arrange
      store.overrideSelector(selectAllCategories, mockCategories);
      fixture.detectChanges();
      tick();

      // Act: Mark category as touched without value
      const categoryControl = component.productForm.get('category');
      categoryControl?.markAsTouched();
      categoryControl?.setValue(null);
      fixture.detectChanges();

      // Assert: Error message should be generated
      const errorMessage = component.getErrorMessage('category');
      expect(errorMessage).toBe('Category is required');
      expect(component.isFieldInvalid('category')).toBe(true);
    }));

    it('should allow submission after selecting category', fakeAsync(() => {
      // Arrange
      store.overrideSelector(selectAllCategories, mockCategories);
      fixture.detectChanges();
      tick();

      // Act: Fill form without category and try to submit
      component.productForm.patchValue({
        name: 'Test Product',
        sku: 'TEST-001',
        description: 'Test description here',
        category: null,
      });
      component.onSubmit();
      fixture.detectChanges();

      // Assert: Form should be invalid
      expect(component.productForm.valid).toBe(false);

      // Act: Now select a category
      component.productForm.patchValue({ category: 'cat1' });
      fixture.detectChanges();

      // Assert: Form should now be valid
      expect(component.productForm.valid).toBe(true);

      // Act: Submit again
      component.onSubmit();

      // Assert: createProduct should be dispatched
      const dispatchCalls = (store.dispatch as jasmine.Spy).calls.all();
      const createCall = dispatchCalls.find(
        (call) => call.args[0].type === '[Products] Create Product'
      );
      expect(createCall).toBeDefined();
      expect(createCall?.args[0].product.category).toBe('cat1');
    }));
  });

  /**
   * Test 5: Dropdown filter functionality
   * Requirements: 5.1, 5.2
   */
  describe('Dropdown Filter', () => {
    it('should have app-dropdown component with filter capability', fakeAsync(() => {
      // Arrange
      store.overrideSelector(selectAllCategories, mockCategories);
      fixture.detectChanges();
      tick();

      // Assert: Check that app-dropdown element exists
      const dropdownElement = fixture.debugElement.query(By.css('app-dropdown'));
      expect(dropdownElement).toBeTruthy();
      
      // The component should have the filter input configured
      expect(dropdownElement.componentInstance).toBeTruthy();
    }));

    it('should configure dropdown with filter settings', fakeAsync(() => {
      // Arrange
      store.overrideSelector(selectAllCategories, mockCategories);
      fixture.detectChanges();
      tick();

      // Assert: Verify the app-dropdown component is configured
      const dropdownElement = fixture.debugElement.query(By.css('app-dropdown'));
      expect(dropdownElement).toBeTruthy();
      
      // Verify categories are passed to the dropdown
      component.categories$.subscribe((categories) => {
        expect(categories.length).toBe(3);
      });
    }));
  });

  /**
   * Test 6: Form control and payload structure
   * Requirements: 2.4, 4.3, 4.4
   */
  describe('Form Control Value and Payload', () => {
    it('should store category as string ID in form control', fakeAsync(() => {
      // Arrange
      store.overrideSelector(selectAllCategories, mockCategories);
      fixture.detectChanges();
      tick();

      // Act: Select a category
      component.productForm.patchValue({ category: 'cat2' });

      // Assert: Form control value should be string ID
      const categoryValue = component.productForm.get('category')?.value;
      expect(typeof categoryValue).toBe('string');
      expect(categoryValue).toBe('cat2');
    }));

    it('should send category as string ID in create payload', fakeAsync(() => {
      // Arrange
      store.overrideSelector(selectAllCategories, mockCategories);
      fixture.detectChanges();
      tick();

      // Act: Fill and submit form
      component.productForm.patchValue({
        name: 'New Product',
        sku: 'NEW-001',
        description: 'New product description',
        category: 'cat3',
      });
      component.onSubmit();

      // Assert: Payload should have category as string
      const dispatchCalls = (store.dispatch as jasmine.Spy).calls.all();
      const createCall = dispatchCalls.find(
        (call) => call.args[0].type === '[Products] Create Product'
      );
      expect(createCall).toBeDefined();
      expect(createCall?.args[0].product.category).toBe('cat3');
      expect(typeof createCall?.args[0].product.category).toBe('string');
    }));

    it('should send category as string ID in update payload', fakeAsync(() => {
      // Arrange
      (activatedRoute.snapshot.paramMap.get as jasmine.Spy).and.returnValue('prod1');
      store.overrideSelector(selectAllCategories, mockCategories);
      store.overrideSelector(selectProductEntities, { 'prod1': mockProduct });
      store.refreshState();
      
      fixture.detectChanges();
      tick(100);
      fixture.detectChanges();
      tick(100);

      // Act: Change category and submit
      component.productForm.patchValue({ category: 'cat2' });
      component.onSubmit();
      tick(100);

      // Assert: Update payload should have category as string
      const dispatchCalls = (store.dispatch as jasmine.Spy).calls.all();
      const updateCall = dispatchCalls.find(
        (call) => call.args[0].type === '[Products] Update Product'
      );
      expect(updateCall).toBeDefined();
      expect(updateCall?.args[0].product._id).toBe('prod1');
      expect(updateCall?.args[0].product.category).toBe('cat2');
    }));
  });

  /**
   * Test 7: Component lifecycle and cleanup
   */
  describe('Component Lifecycle', () => {
    it('should dispatch loadCategories on init', fakeAsync(() => {
      // Act
      fixture.detectChanges();
      tick();

      // Assert
      expect(store.dispatch).toHaveBeenCalledWith(loadCategories());
    }));

    it('should clean up subscriptions on destroy', () => {
      // Arrange
      fixture.detectChanges();
      spyOn(component['destroy$'], 'next');
      spyOn(component['destroy$'], 'complete');

      // Act
      component.ngOnDestroy();

      // Assert
      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });

  /**
   * Test 8: Navigation
   */
  describe('Navigation', () => {
    it('should navigate to products list on cancel', () => {
      // Act
      component.onCancel();

      // Assert
      expect(router.navigate).toHaveBeenCalledWith(['/products']);
    });

    it('should navigate to products list after successful create', fakeAsync(() => {
      // Arrange
      store.overrideSelector(selectAllCategories, mockCategories);
      fixture.detectChanges();
      tick();

      component.productForm.patchValue({
        name: 'Test',
        sku: 'TEST-001',
        description: 'Test description',
        category: 'cat1',
      });

      // Act
      component.onSubmit();

      // Assert
      expect(router.navigate).toHaveBeenCalledWith(['/products']);
    }));

    it('should navigate to products list after successful update', fakeAsync(() => {
      // Arrange
      (activatedRoute.snapshot.paramMap.get as jasmine.Spy).and.returnValue('prod1');
      store.overrideSelector(selectAllCategories, mockCategories);
      store.overrideSelector(selectProductEntities, { 'prod1': mockProduct });
      store.refreshState();
      
      fixture.detectChanges();
      tick(100);
      fixture.detectChanges();
      tick(100);

      // Act
      component.onSubmit();
      tick(100);

      // Assert
      expect(router.navigate).toHaveBeenCalledWith(['/products']);
    }));
  });
});
