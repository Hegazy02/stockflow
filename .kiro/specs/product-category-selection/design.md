# Design Document: Product Category Selection

## Overview

This feature replaces the free-text category input in the product form with a PrimeNG Dropdown component that allows users to select from predefined categories fetched from the backend API. The implementation follows the existing architecture patterns used in the StockFlow application, including NgRx for state management, standalone components, and PrimeNG UI components.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Product Form Component                    │
│  - Displays PrimeNG Dropdown for category selection         │
│  - Dispatches loadCategories action on init                  │
│  - Subscribes to categories$ observable                      │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ├─ Dispatches Actions
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                      NgRx Store (Categories)                 │
│  - State: categories[], loading, error                       │
│  - Actions: load, loadSuccess, loadFailure                   │
│  - Selectors: selectAllCategories, selectLoading, etc.       │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ├─ Effects trigger
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                      Category Effects                        │
│  - Listens to loadCategories action                          │
│  - Calls CategoryService.getAll()                            │
│  - Dispatches success/failure actions                        │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ├─ HTTP Request
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                      Category Service                        │
│  - GET /api/categories                                       │
│  - Returns Observable<ProductCategory[]>                     │
│  - Error handling                                            │
└─────────────────────────────────────────────────────────────┘
```

### Design Decisions

1. **Separate Category Feature Module**: Create a new feature module under `src/app/features/categories` to maintain separation of concerns
2. **NgRx Entity Adapter**: Use `@ngrx/entity` for efficient category state management, following the pattern used in products
3. **Lazy Loading**: Categories are loaded on-demand when the product form initializes
4. **PrimeNG Dropdown**: Use `p-dropdown` component with filtering enabled for better UX
5. **Standalone Components**: Follow the existing pattern of standalone components in the application

## Components and Interfaces

### 1. Category Model

**File:** `src/app/features/categories/models/category.model.ts`

```typescript
export interface ProductCategory {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

**Design Decisions:**
- Reuse the existing `ProductCategory` interface from `product.model.ts`
- Optional fields for description and timestamps to support future enhancements
- `_id` field matches the MongoDB convention used in the backend

### 2. Category Service

**File:** `src/app/features/categories/services/category.service.ts`

```typescript
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
    private readonly apiUrl = `${ApiEndpoints.baseUrl}/categories`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ProductCategory[]> {
    return this.http.get<{ success: boolean; data: ProductCategory[] }>(this.apiUrl).pipe(
      map((response) => response.data),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Failed to load categories';
    
    if (error.status === 0) {
      errorMessage = 'Network error. Please check your connection.';
    } else if (error.status === 404) {
      errorMessage = 'Categories endpoint not found';
    } else if (error.status >= 500) {
      errorMessage = 'Server error. Please try again later.';
    }

    return throwError(() => ({
      code: `HTTP_${error.status}`,
      message: errorMessage,
      originalError: error,
    }));
  }
}
```

**Design Decisions:**
- Follow the same pattern as `ProductService`
- Return unwrapped array of categories (not paginated, assuming small dataset)
- Simplified error handling focused on category-specific scenarios
- Use `providedIn: 'root'` for singleton service

### 3. NgRx Store

#### 3.1 Categories State

**File:** `src/app/features/categories/store/categories.reducer.ts`

```typescript
export interface CategoriesState extends EntityState<ProductCategory> {
  loading: boolean;
  error: any;
  loaded: boolean; // Track if categories have been loaded
}

export const categoriesAdapter: EntityAdapter<ProductCategory> = 
  createEntityAdapter<ProductCategory>({
    selectId: (category: ProductCategory) => category._id,
    sortComparer: (a, b) => a.name.localeCompare(b.name), // Sort alphabetically
  });

export const initialState: CategoriesState = categoriesAdapter.getInitialState({
  loading: false,
  error: null,
  loaded: false,
});
```

**Design Decisions:**
- Use `EntityAdapter` for normalized state management
- Add `loaded` flag to prevent redundant API calls
- Sort categories alphabetically by name for better UX
- Follow the same pattern as `ProductsState`

#### 3.2 Categories Actions

**File:** `src/app/features/categories/store/categories.actions.ts`

```typescript
export const loadCategories = createAction('[Categories] Load Categories');

export const loadCategoriesSuccess = createAction(
  '[Categories] Load Categories Success',
  props<{ categories: ProductCategory[] }>()
);

export const loadCategoriesFailure = createAction(
  '[Categories] Load Categories Failure',
  props<{ error: any }>()
);
```

**Design Decisions:**
- Simple action set for read-only operations
- No create/update/delete actions (categories managed by admin separately)
- Clear action naming following NgRx conventions

#### 3.3 Categories Effects

**File:** `src/app/features/categories/store/categories.effects.ts`

```typescript
@Injectable()
export class CategoriesEffects {
  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoriesActions.loadCategories),
      exhaustMap(() =>
        this.categoryService.getAll().pipe(
          map((categories) => 
            CategoriesActions.loadCategoriesSuccess({ categories })
          ),
          catchError((error) => 
            of(CategoriesActions.loadCategoriesFailure({ error }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private categoryService: CategoryService
  ) {}
}
```

**Design Decisions:**
- Use `exhaustMap` to prevent duplicate requests while loading
- Simple effect that calls service and dispatches success/failure
- Follow the same pattern as `ProductsEffects`

#### 3.4 Categories Selectors

**File:** `src/app/features/categories/store/categories.selectors.ts`

```typescript
export const selectCategoriesState = 
  createFeatureSelector<CategoriesState>('categories');

const { selectAll, selectEntities } = categoriesAdapter.getSelectors();

export const selectAllCategories = createSelector(
  selectCategoriesState,
  selectAll
);

export const selectCategoryEntities = createSelector(
  selectCategoriesState,
  selectEntities
);

export const selectCategoriesLoading = createSelector(
  selectCategoriesState,
  (state) => state.loading
);

export const selectCategoriesError = createSelector(
  selectCategoriesState,
  (state) => state.error
);

export const selectCategoriesLoaded = createSelector(
  selectCategoriesState,
  (state) => state.loaded
);

export const selectCategoryById = (id: string) =>
  createSelector(
    selectCategoryEntities,
    (entities) => entities[id]
  );
```

**Design Decisions:**
- Provide comprehensive selectors for all state properties
- Use entity adapter selectors for efficient lookups
- Include `selectCategoryById` for finding category by ID in edit mode

### 4. Product Form Component Updates

**File:** `src/app/features/products/components/product-form/product-form.component.ts`

**New Imports:**
```typescript
import { DropdownModule } from 'primeng/dropdown';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ProductCategory } from '../../../categories/models/category.model';
import * as CategoriesActions from '../../../categories/store/categories.actions';
import {
  selectAllCategories,
  selectCategoriesLoading,
  selectCategoriesError,
} from '../../../categories/store/categories.selectors';
```

**New Properties:**
```typescript
categories$: Observable<ProductCategory[]>;
categoriesLoading$: Observable<boolean>;
categoriesError$: Observable<any>;
```

**Constructor Updates:**
```typescript
constructor(
  private fb: FormBuilder,
  private store: Store,
  private router: Router,
  private route: ActivatedRoute
) {
  this.productForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    sku: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]+$/)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    category: [null, [Validators.required]], // Changed to null for object binding
  });

  // Initialize category observables
  this.categories$ = this.store.select(selectAllCategories);
  this.categoriesLoading$ = this.store.select(selectCategoriesLoading);
  this.categoriesError$ = this.store.select(selectCategoriesError);
}
```

**ngOnInit Updates:**
```typescript
ngOnInit(): void {
  // Load categories
  this.store.dispatch(CategoriesActions.loadCategories());

  this.productId = this.route.snapshot.paramMap.get('id');

  if (this.productId) {
    this.isEditMode = true;
    this.loadProduct(this.productId);
  }
}
```

**loadProduct Updates:**
```typescript
private loadProduct(id: string): void {
  this.store
    .select(selectProductById(id))
    .pipe(
      takeUntil(this.destroy$),
      filter((product): product is Product => product !== undefined)
    )
    .subscribe((product) => {
      this.productForm.patchValue({
        name: product.name,
        sku: product.sku,
        description: product.description,
        category: product.category._id, // Use category ID for dropdown binding
      });
    });
}
```

**onSubmit Updates:**
```typescript
onSubmit(): void {
  if (this.productForm.invalid) {
    this.productForm.markAllAsTouched();
    return;
  }

  const formValue = this.productForm.value;
  
  // Transform category ID to category object
  const productData = {
    ...formValue,
    category: formValue.category, // Backend expects category ID
  };

  if (this.isEditMode && this.productId) {
    this.store
      .select(selectProductById(this.productId))
      .pipe(
        takeUntil(this.destroy$),
        filter((product): product is Product => product !== undefined)
      )
      .subscribe((product) => {
        const updatedProduct: Product = {
          ...product,
          ...productData,
          updatedAt: new Date().toISOString(),
        };
        this.store.dispatch(updateProduct({ product: updatedProduct }));
        this.navigateToList();
      });
  } else {
    this.store.dispatch(createProduct({ product: productData }));
    this.navigateToList();
  }
}
```

**Design Decisions:**
- Load categories on component initialization
- Use category `_id` as form control value for API compatibility
- Subscribe to category observables for reactive updates
- Handle loading and error states in the template

### 5. Product Form Template Updates

**File:** `src/app/features/products/components/product-form/product-form.component.html`

**Replace Category Input:**
```html
<div class="form-field">
  <label for="category">
    Category <span class="required">*</span>
  </label>
  
  <p-dropdown
    id="category"
    formControlName="category"
    [options]="categories$ | async"
    optionLabel="name"
    optionValue="_id"
    placeholder="Select a category"
    [filter]="true"
    filterBy="name"
    [showClear]="false"
    [disabled]="(categoriesLoading$ | async) || false"
    [class.invalid]="isFieldInvalid('category')"
    styleClass="w-full"
  >
    <ng-template pTemplate="empty">
      <div class="empty-state">
        @if (categoriesLoading$ | async) {
          <span>Loading categories...</span>
        } @else if (categoriesError$ | async) {
          <span class="error-text">Failed to load categories</span>
        } @else {
          <span>No categories available</span>
        }
      </div>
    </ng-template>
  </p-dropdown>

  @if (isFieldInvalid('category')) {
    <small class="error-message">{{ getErrorMessage('category') }}</small>
  }
  
  @if (categoriesError$ | async; as error) {
    <small class="error-message">{{ error.message }}</small>
  }
</div>
```

**Design Decisions:**
- Use `optionLabel="name"` to display category names
- Use `optionValue="_id"` to bind category IDs to form control
- Enable filtering for better UX with many categories
- Disable dropdown while loading
- Show appropriate empty states (loading, error, no data)
- Use Angular's new control flow syntax (`@if`, `@else`)
- Apply validation styling with `[class.invalid]`

## Data Models

### ProductCategory Interface

```typescript
export interface ProductCategory {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### Form Value Structure

**Before Submission:**
```typescript
{
  name: string;
  sku: string;
  description: string;
  category: string; // Category ID
}
```

**API Payload (Create):**
```typescript
{
  name: string;
  sku: string;
  description: string;
  category: string; // Category ID
}
```

**API Payload (Update):**
```typescript
{
  _id: string;
  name: string;
  sku: string;
  description: string;
  category: string; // Category ID
  updatedAt: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After reviewing the prework analysis, I've identified the following consolidations:

- Properties 2.3 and 4.2 both test category name display - these can be combined into a single property about correct name-to-ID mapping
- Properties 2.4, 4.3, and 4.4 all test form control value handling - these can be consolidated into properties about form value consistency
- Properties 3.2 and 3.4 both test error display - these can be combined into a general error handling property

### Correctness Properties

Property 1: Category service response mapping
*For any* successful HTTP response from the categories endpoint, the service should return an array of ProductCategory objects with valid _id and name fields
**Validates: Requirements 1.2**

Property 2: Category service error handling
*For any* HTTP error response (4xx, 5xx, network error), the service should return an error object with a descriptive message
**Validates: Requirements 1.3**

Property 3: Store state structure consistency
*For any* action dispatched (load, success, failure), the categories state should maintain the required structure with categories array, loading boolean, error field, and loaded boolean
**Validates: Requirements 1.4**

Property 4: Category name-to-ID mapping
*For any* category in the categories list, when that category's ID is selected in the dropdown, the displayed label should be the category's name
**Validates: Requirements 2.3, 4.2**

Property 5: Form control value consistency
*For any* category selection in the dropdown, the form control value should be set to the category's _id (string), not the full category object
**Validates: Requirements 2.4, 4.3**

Property 6: Form validation on empty submission
*For any* form state where the category field is empty or null, submitting the form should trigger a validation error and prevent submission
**Validates: Requirements 3.2**

Property 7: Error message display
*For any* error state (categories loading failure or validation error), an appropriate error message should be displayed to the user
**Validates: Requirements 3.4**

Property 8: Edit mode category population
*For any* product with a valid category ID, loading the form in edit mode should populate the category dropdown with that category ID
**Validates: Requirements 4.1**

Property 9: Form submission payload structure
*For any* valid form submission, the payload should contain the category as a string ID, not as a nested object
**Validates: Requirements 4.4**

Property 10: Category filtering behavior
*For any* search input in the dropdown filter, the displayed categories should only include those whose names contain the search text (case-insensitive)
**Validates: Requirements 5.2**

## Error Handling

### Category Service Errors

**Error Scenarios:**
1. Network failure (status 0)
2. Not found (status 404)
3. Server error (status 500+)
4. Timeout
5. Invalid response format

**Error Response Structure:**
```typescript
{
  code: string;        // e.g., 'HTTP_404', 'NETWORK_ERROR'
  message: string;     // User-friendly error message
  originalError: any;  // Original HTTP error for debugging
}
```

**Error Handling Strategy:**
- Service catches all HTTP errors and transforms them into consistent error objects
- Effects catch service errors and dispatch failure actions
- Reducer stores error in state
- Component displays error message to user
- User can retry by refreshing or navigating away and back

### Form Validation Errors

**Validation Rules:**
- Category is required
- Category must be a valid ID from the available categories list

**Error Messages:**
- Empty category: "Category is required"
- Invalid category ID: "Please select a valid category"
- Categories failed to load: "Failed to load categories. Please try again."

### Edge Cases

1. **Product with deleted category**: If a product's category no longer exists in the categories list, display the category ID with a warning message
2. **Empty categories list**: Show "No categories available" message and disable form submission
3. **Slow network**: Show loading indicator and disable dropdown until categories load
4. **Concurrent form submissions**: Disable submit button while request is in progress

## Testing Strategy

### Unit Testing

**Category Service Tests:**
- Test successful category fetch returns array of ProductCategory objects
- Test error handling for different HTTP status codes
- Test response mapping from API format to ProductCategory interface

**Category Reducer Tests:**
- Test initial state
- Test state updates for each action (load, success, failure)
- Test entity adapter operations (add, update, remove)

**Category Selectors Tests:**
- Test each selector returns correct slice of state
- Test memoization behavior

**Product Form Component Tests:**
- Test form initialization with category dropdown
- Test category loading on component init
- Test form submission with selected category
- Test edit mode category population
- Test validation error display

### Property-Based Testing

Property-based tests will use `fast-check` library for TypeScript to generate random test data and verify properties hold across many inputs.

**Test Configuration:**
- Minimum 100 iterations per property test
- Use custom generators for ProductCategory objects
- Use custom generators for HTTP error responses
- Use custom generators for form states

**Property Test Examples:**

```typescript
// Property 1: Category service response mapping
it('should map any valid API response to ProductCategory array', () => {
  fc.assert(
    fc.property(
      fc.array(fc.record({
        _id: fc.string(),
        name: fc.string(),
      })),
      (categories) => {
        // Test that service correctly maps response
        const response = { success: true, data: categories };
        // Verify all categories have _id and name
        return categories.every(c => c._id && c.name);
      }
    ),
    { numRuns: 100 }
  );
});

// Property 5: Form control value consistency
it('should set form control to category ID for any selected category', () => {
  fc.assert(
    fc.property(
      fc.record({
        _id: fc.string(),
        name: fc.string(),
      }),
      (category) => {
        // Simulate category selection
        component.productForm.patchValue({ category: category._id });
        // Verify form control value is the ID, not the object
        return component.productForm.value.category === category._id;
      }
    ),
    { numRuns: 100 }
  );
});
```

### Integration Testing

**Component Integration Tests:**
- Test full flow: component init → load categories → display dropdown → select category → submit form
- Test error flow: component init → load categories fails → display error → retry
- Test edit flow: load product → populate form with category → change category → submit

**Store Integration Tests:**
- Test action → effect → service → reducer flow
- Test selector composition
- Test state updates propagate to components

### Manual Testing Checklist

- [ ] Dropdown displays all categories from API
- [ ] Dropdown shows loading state while fetching
- [ ] Dropdown shows error message if fetch fails
- [ ] Dropdown filter works correctly
- [ ] Selecting a category updates form value
- [ ] Form validation prevents submission without category
- [ ] Edit mode populates correct category
- [ ] Form submits category ID (not object)
- [ ] Keyboard navigation works (tab, arrow keys, enter)
- [ ] Empty state displays when no categories available

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Categories are only loaded when product form is opened
2. **Caching**: Use `loaded` flag in state to prevent redundant API calls
3. **Entity Adapter**: Normalized state for efficient lookups by ID
4. **OnPush Change Detection**: Use OnPush strategy in product form component
5. **Memoized Selectors**: NgRx selectors are memoized for performance

### Expected Performance

- **Initial Load**: < 500ms for category fetch
- **Dropdown Render**: < 100ms for up to 1000 categories
- **Filter Performance**: < 50ms for filtering with PrimeNG's built-in filter
- **Form Submission**: < 200ms for validation and state update

### Scalability

- **Small Dataset** (< 50 categories): No special handling needed
- **Medium Dataset** (50-500 categories): Filtering is essential
- **Large Dataset** (> 500 categories): Consider virtual scrolling or server-side filtering

## Dependencies

### New Dependencies

None - all required dependencies are already in the project:
- `@ngrx/store` - Already installed
- `@ngrx/effects` - Already installed
- `@ngrx/entity` - Already installed
- `primeng` - Already installed (Dropdown component)

### PrimeNG Dropdown Component

**Import:**
```typescript
import { DropdownModule } from 'primeng/dropdown';
```

**Key Features Used:**
- `[options]` - Array of categories
- `optionLabel` - Display field (name)
- `optionValue` - Value field (_id)
- `[filter]` - Enable search/filter
- `filterBy` - Field to filter on (name)
- `placeholder` - Placeholder text
- `[disabled]` - Disable during loading
- `pTemplate="empty"` - Custom empty state

## Future Enhancements

1. **Category Management**: Add CRUD operations for categories (admin feature)
2. **Category Hierarchy**: Support parent-child category relationships
3. **Category Icons**: Add icon field to categories for visual identification
4. **Multi-Select**: Allow products to belong to multiple categories
5. **Category Descriptions**: Show category descriptions in dropdown tooltips
6. **Recently Used**: Show recently used categories at the top
7. **Category Creation**: Allow creating new categories inline from product form
8. **Lazy Loading**: Implement virtual scrolling for large category lists
9. **Offline Support**: Cache categories in localStorage for offline access
10. **Category Analytics**: Track category usage and popularity

## Migration Notes

### Breaking Changes

None - this is a new feature that enhances existing functionality.

### Data Migration

If existing products have category as a string (category name), a data migration script will be needed to:
1. Create category records in the database
2. Update product records to reference category IDs instead of names

### Backward Compatibility

The API should support both formats during migration:
- Accept category as string (name) or object ID
- Return category as object with _id and name

## Deployment Checklist

- [ ] Create categories table/collection in database
- [ ] Seed initial categories
- [ ] Deploy backend API endpoint: GET /api/categories
- [ ] Update product API to return category as object (not string)
- [ ] Deploy frontend changes
- [ ] Verify categories load in product form
- [ ] Test create/edit product with category selection
- [ ] Monitor error logs for category-related issues
- [ ] Update API documentation

## References

- [PrimeNG Dropdown Documentation](https://primeng.org/dropdown)
- [NgRx Entity Documentation](https://ngrx.io/guide/entity)
- [Angular Reactive Forms](https://angular.io/guide/reactive-forms)
- [fast-check Property Testing](https://github.com/dubzzz/fast-check)
