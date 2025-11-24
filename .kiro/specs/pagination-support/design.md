# Pagination Support Design Document

## Overview

This design document outlines the technical implementation for adding pagination support to the Inventory System. The backend API already returns paginated responses with metadata (total, page, limit, pages), but the frontend currently loads all data at once. This implementation will add proper pagination handling throughout the data flow: from the API service, through NgRx state management, to the UI components.

## Architecture

### Data Flow

```
User Interaction (Page Change)
    ↓
Product List Component
    ↓
Dispatch LoadProducts Action (with page, limit)
    ↓
Products Effects
    ↓
Product Service (HTTP Request with query params)
    ↓
Backend API (returns ApiResponse with pagination)
    ↓
Products Effects (map response)
    ↓
Products Reducer (update state with data + pagination)
    ↓
Products Selectors
    ↓
Product List Component (render with pagination controls)
    ↓
Data Table Component (display pagination UI)
```

### State Management Flow

```
NgRx Store (ProductsState)
├── entities: { [id: string]: Product }
├── ids: string[]
├── selectedProductId: string | null
├── loading: boolean
├── error: any
└── pagination: {
    │   total: number
    │   page: number
    │   limit: number
    │   pages: number
    }
```

## Components and Interfaces

### 1. API Response Model

**File:** `src/app/core/models/api-response.ts`

The existing interface already supports pagination:

```typescript
interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
}
```

**Changes:** Export these interfaces so they can be used throughout the application.

### 2. Product Service

**File:** `src/app/features/products/services/product.service.ts`

**Current Implementation:**
```typescript
getAll(): Observable<ApiResponse<Product>>
```

**Updated Implementation:**
```typescript
getAll(page: number = 1, limit: number = 10): Observable<ApiResponse<Product>> {
  const params = new HttpParams()
    .set('page', page.toString())
    .set('limit', limit.toString());
  
  return this.http.get<ApiResponse<Product>>(this.apiUrl, { params });
}
```

**Design Decisions:**
- Default page to 1 and limit to 10 for backward compatibility
- Use HttpParams to build query string
- Return the full ApiResponse object (not just data array) to preserve pagination metadata
- The service remains stateless; pagination state is managed by NgRx

### 3. NgRx Store Updates

#### 3.1 Products State

**File:** `src/app/features/products/store/products.reducer.ts`

**Current State:**
```typescript
export interface ProductsState extends EntityState<Product> {
  selectedProductId: string | null;
  loading: boolean;
  error: any;
}
```

**Updated State:**
```typescript
export interface ProductsState extends EntityState<Product> {
  selectedProductId: string | null;
  loading: boolean;
  error: any;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
```

**Initial State:**
```typescript
export const initialState: ProductsState = productsAdapter.getInitialState({
  selectedProductId: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
});
```

#### 3.2 Products Actions

**File:** `src/app/features/products/store/products.actions.ts`

**Current Action:**
```typescript
export const loadProducts = createAction('[Products] Load Products');
```

**Updated Action:**
```typescript
export const loadProducts = createAction(
  '[Products] Load Products',
  props<{ page?: number; limit?: number }>()
);
```

**Updated Success Action:**
```typescript
export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ products: Product[]; pagination: Pagination }>()
);
```

**New Action for Page Change:**
```typescript
export const changePage = createAction(
  '[Products] Change Page',
  props<{ page: number; limit: number }>()
);
```

**Design Decisions:**
- Make page and limit optional in loadProducts for backward compatibility
- Add pagination metadata to success action
- Create a separate changePage action for semantic clarity (it will trigger loadProducts)

#### 3.3 Products Reducer

**File:** `src/app/features/products/store/products.reducer.ts`

**Updated Reducer:**
```typescript
on(ProductsActions.loadProductsSuccess, (state, { products, pagination }) =>
  productsAdapter.setAll(products, {
    ...state,
    loading: false,
    error: null,
    pagination,
  })
),
```

**Design Decisions:**
- Store the complete pagination object from the API response
- Update pagination state atomically with product data to prevent inconsistencies

#### 3.4 Products Selectors

**File:** `src/app/features/products/store/products.selectors.ts`

**New Selectors:**
```typescript
export const selectProductsPagination = createSelector(
  selectProductsState,
  (state) => state.pagination
);

export const selectCurrentPage = createSelector(
  selectProductsPagination,
  (pagination) => pagination.page
);

export const selectPageSize = createSelector(
  selectProductsPagination,
  (pagination) => pagination.limit
);

export const selectTotalRecords = createSelector(
  selectProductsPagination,
  (pagination) => pagination.total
);

export const selectTotalPages = createSelector(
  selectProductsPagination,
  (pagination) => pagination.pages
);
```

#### 3.5 Products Effects

**File:** `src/app/features/products/store/products.effects.ts`

**Current Effect:**
```typescript
this.LoadProducts$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ProductsActions.loadProducts),
    exhaustMap(() =>
      this.productsService.getAll().pipe(
        map((response) => ProductsActions.loadProductsSuccess({ products: response.data })),
        catchError((error) => of(ProductsActions.loadProductsFailure({ error })))
      )
    )
  )
);
```

**Updated Effect:**
```typescript
this.LoadProducts$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ProductsActions.loadProducts),
    exhaustMap((action) => {
      const page = action.page ?? 1;
      const limit = action.limit ?? 10;
      
      return this.productsService.getAll(page, limit).pipe(
        map((response) => 
          ProductsActions.loadProductsSuccess({ 
            products: response.data,
            pagination: response.pagination 
          })
        ),
        catchError((error) => of(ProductsActions.loadProductsFailure({ error })))
      );
    })
  )
);
```

**New Effect for Page Change:**
```typescript
this.ChangePage$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ProductsActions.changePage),
    map((action) => ProductsActions.loadProducts({ page: action.page, limit: action.limit }))
  )
);
```

**Design Decisions:**
- Use exhaustMap to prevent concurrent requests (ignore new requests while one is in flight)
- Provide default values for page and limit if not specified
- Create a separate effect for changePage that delegates to loadProducts for DRY principle

### 4. Data Table Component

**File:** `src/app/shared/components/data-table/data-table.component.ts`

**New Inputs:**
```typescript
@Input() totalRecords: number = 0;
@Input() currentPage: number = 1;
@Input() pageSize: number = 10;
```

**New Output:**
```typescript
@Output() pageChange = new EventEmitter<PageChangeEvent>();

interface PageChangeEvent {
  page: number;
  pageSize: number;
  first: number; // Index of first record on page (for display)
}
```

**Template Addition:**
```html
@if (paginator && totalRecords > 0) {
  <div class="pagination-container">
    <div class="pagination-info">
      Showing {{ first + 1 }}-{{ last }} of {{ totalRecords }}
    </div>
    
    <p-paginator
      [rows]="pageSize"
      [totalRecords]="totalRecords"
      [rowsPerPageOptions]="rowsPerPageOptions"
      [first]="first"
      (onPageChange)="onPageChange($event)"
    ></p-paginator>
  </div>
}
```

**Component Logic:**
```typescript
get first(): number {
  return (this.currentPage - 1) * this.pageSize;
}

get last(): number {
  return Math.min(this.first + this.pageSize, this.totalRecords);
}

onPageChange(event: any): void {
  const page = Math.floor(event.first / event.rows) + 1;
  this.pageChange.emit({
    page,
    pageSize: event.rows,
    first: event.first,
  });
}
```

**Design Decisions:**
- Use PrimeNG's p-paginator component for consistent UI
- Emit page change events to parent component (Product List)
- Calculate display range (first-last) for "Showing X-Y of Z" text
- Support both page number changes and page size changes
- Hide pagination when totalRecords is 0

### 5. Product List Component

**File:** `src/app/features/products/components/product-list/product-list.component.ts`

**New Observables:**
```typescript
pagination$: Observable<Pagination>;
totalRecords$: Observable<number>;
currentPage$: Observable<number>;
pageSize$: Observable<number>;
```

**Constructor Updates:**
```typescript
constructor(
  private store: Store,
  private router: Router,
  private route: ActivatedRoute
) {
  this.products$ = this.store.select(selectAllProducts);
  this.loading$ = this.store.select(selectProductsLoading);
  this.error$ = this.store.select(selectProductsError);
  this.pagination$ = this.store.select(selectProductsPagination);
  this.totalRecords$ = this.store.select(selectTotalRecords);
  this.currentPage$ = this.store.select(selectCurrentPage);
  this.pageSize$ = this.store.select(selectPageSize);
}
```

**ngOnInit Updates:**
```typescript
ngOnInit(): void {
  // Read pagination from URL query params
  this.route.queryParams.subscribe(params => {
    const page = parseInt(params['page']) || 1;
    const limit = parseInt(params['limit']) || 10;
    
    this.store.dispatch(loadProducts({ page, limit }));
  });

  // Subscribe to products and loading state
  this.products$.subscribe((products) => (this.products = products));
  this.loading$.subscribe((loading) => (this.loading = loading));
}
```

**New Method:**
```typescript
onPageChange(event: PageChangeEvent): void {
  // Update URL query params without navigation
  this.router.navigate([], {
    relativeTo: this.route,
    queryParams: { page: event.page, limit: event.pageSize },
    queryParamsHandling: 'merge',
  });
  
  // Dispatch action to load new page
  this.store.dispatch(changePage({ page: event.page, limit: event.pageSize }));
}
```

**Template Updates:**
```html
<app-data-table
  [data]="products"
  [columns]="columns"
  [actions]="actions"
  [loading]="loading"
  [paginator]="true"
  [totalRecords]="(totalRecords$ | async) || 0"
  [currentPage]="(currentPage$ | async) || 1"
  [pageSize]="(pageSize$ | async) || 10"
  [rows]="(pageSize$ | async) || 10"
  [rowsPerPageOptions]="[5, 10, 20, 50]"
  [selectionMode]="'multiple'"
  [dataKey]="'_id'"
  (rowSelect)="onRowSelect($event)"
  (pageChange)="onPageChange($event)"
></app-data-table>
```

**Design Decisions:**
- Use ActivatedRoute to read and write URL query parameters
- Persist pagination state in URL for bookmarking and browser back/forward
- Use queryParamsHandling: 'merge' to preserve other query params
- Dispatch changePage action which triggers loadProducts effect
- Pass pagination observables to data table using async pipe

## Data Models

### Pagination Interface

**File:** `src/app/core/models/api-response.ts`

```typescript
export interface Pagination {
  total: number;    // Total number of records
  page: number;     // Current page number (1-indexed)
  limit: number;    // Number of records per page
  pages: number;    // Total number of pages
}

export interface ApiResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
}
```

### Page Change Event

**File:** `src/app/shared/components/data-table/data-table.component.ts`

```typescript
export interface PageChangeEvent {
  page: number;      // New page number (1-indexed)
  pageSize: number;  // New page size
  first: number;     // Index of first record (0-indexed, for PrimeNG)
}
```

## Error Handling

### Service Level
- HTTP errors are caught and transformed by existing `handleError` method
- Pagination parameters are validated (must be positive integers)
- Invalid page numbers default to page 1

### Effect Level
- Errors are caught and dispatched as `loadProductsFailure` action
- Previous page data remains in state on error
- Loading state is set to false on error

### Component Level
- Display error message from store using error$ observable
- Provide "Retry" button that re-dispatches loadProducts with current page
- Disable pagination controls while loading is true
- Show empty state when totalRecords is 0

### Edge Cases
- **Page out of range:** If user navigates to page 10 but only 5 pages exist, backend should return empty array and pagination metadata. Frontend displays empty state.
- **Page size change:** Reset to page 1 when page size changes to avoid confusion
- **Concurrent requests:** Use exhaustMap to ignore new requests while one is in flight
- **URL manipulation:** Validate page and limit from URL params, default to 1 and 10 if invalid

## Testing Strategy

### Unit Tests

**Product Service:**
- Test getAll with default parameters (page=1, limit=10)
- Test getAll with custom parameters
- Test query parameter construction
- Test error handling

**Products Reducer:**
- Test pagination state initialization
- Test pagination state update on loadProductsSuccess
- Test pagination state preservation on error

**Products Selectors:**
- Test selectProductsPagination returns correct state slice
- Test selectCurrentPage, selectPageSize, selectTotalRecords, selectTotalPages

**Products Effects:**
- Test LoadProducts$ calls service with correct parameters
- Test LoadProducts$ dispatches success action with pagination
- Test LoadProducts$ dispatches failure action on error
- Test ChangePage$ dispatches loadProducts action

**Data Table Component:**
- Test pageChange event emission
- Test first and last getters calculate correct ranges
- Test pagination controls are hidden when totalRecords is 0
- Test pagination controls are disabled when loading is true

**Product List Component:**
- Test ngOnInit reads page and limit from URL
- Test onPageChange updates URL and dispatches action
- Test pagination observables are passed to data table

### Integration Tests

- Test complete pagination flow: user clicks page 2 → action dispatched → service called → state updated → UI re-renders
- Test URL synchronization: URL changes → component loads correct page
- Test browser back/forward buttons work correctly with pagination
- Test page size change resets to page 1

### E2E Tests

- Navigate to products list
- Verify first page loads with default page size
- Click "Next Page" button
- Verify URL updates to ?page=2
- Verify correct products are displayed
- Change page size to 20
- Verify URL updates to ?page=1&limit=20
- Verify correct number of products displayed
- Refresh page
- Verify pagination state is restored from URL

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading:** Only load data for current page, not all pages
2. **Request Cancellation:** Use exhaustMap to prevent concurrent requests
3. **Memoization:** NgRx selectors are memoized by default
4. **Change Detection:** Use OnPush strategy in components (future enhancement)
5. **Virtual Scrolling:** Consider for very large page sizes (future enhancement)

### Caching Strategy (Future Enhancement)

- Cache pages in NgRx store with timestamp
- Invalidate cache after 5 minutes or on data mutation
- Prefetch next page on idle

## Accessibility

- Pagination controls are keyboard navigable
- Screen reader announces page changes
- Focus management when page changes
- ARIA labels on pagination buttons
- Visible focus indicators

## Browser Compatibility

- URL query parameter handling works in all modern browsers
- PrimeNG paginator is tested across browsers
- No browser-specific code required

## Migration Path

### Phase 1: Backend Integration (This Design)
- Update service to accept pagination parameters
- Update NgRx store to handle pagination state
- Update components to display pagination controls

### Phase 2: Advanced Features (Future)
- Add sorting with pagination
- Add filtering with pagination (reset to page 1 on filter change)
- Add caching strategy
- Add prefetching

### Phase 3: Optimization (Future)
- Implement virtual scrolling for large datasets
- Add infinite scroll option
- Optimize for mobile devices

## Dependencies

### Required Packages
- `@angular/common/http` - Already installed
- `@ngrx/store` - Already installed
- `@ngrx/effects` - Already installed
- `primeng` - Already installed (for p-paginator)

### No New Dependencies Required

## Rollout Plan

1. **Update API Response Model** - Export interfaces
2. **Update Product Service** - Add pagination parameters
3. **Update NgRx Store** - Add pagination state, actions, selectors
4. **Update Products Effects** - Handle pagination in effects
5. **Update Data Table Component** - Add pagination UI
6. **Update Product List Component** - Wire up pagination
7. **Test** - Unit, integration, and E2E tests
8. **Deploy** - No breaking changes, backward compatible

## Open Questions

1. Should we persist page size preference in localStorage? (Decision: Not in MVP, add in Phase 2)
2. Should we show "Go to page" input field? (Decision: Not in MVP, PrimeNG paginator has this built-in)
3. Should we add "Show all" option? (Decision: No, defeats purpose of pagination)
4. Should pagination state reset when navigating away and back? (Decision: Yes, unless preserved in URL)
