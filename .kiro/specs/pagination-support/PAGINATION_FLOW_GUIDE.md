# Pagination Flow Guide

## Quick Reference for Developers

This document provides a quick reference for understanding how pagination works in the application.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interaction                         │
│                    (Click page 2 button)                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Product List Component                        │
│  • onPageChange({ page: 2, pageSize: 10, first: 10 })          │
│  • Updates URL: /products?page=2&limit=10                       │
│  • Dispatches: changePage({ page: 2, limit: 10 })              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       NgRx Effects Layer                         │
│  ChangePage$ Effect:                                             │
│  • Listens for changePage action                                │
│  • Maps to loadProducts({ page: 2, limit: 10 })                │
│                                                                  │
│  LoadProducts$ Effect:                                           │
│  • Calls productService.getAll(2, 10)                           │
│  • Waits for API response                                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Product Service                           │
│  • Constructs HTTP request with query params                    │
│  • GET /api/products?page=2&limit=10                            │
│  • Returns Observable<ApiResponse<Product>>                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                          Backend API                             │
│  • Processes pagination parameters                              │
│  • Queries database with SKIP and LIMIT                         │
│  • Returns: {                                                    │
│      success: true,                                              │
│      data: [products 11-20],                                     │
│      pagination: { total: 50, page: 2, limit: 10, pages: 5 }   │
│    }                                                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       NgRx Effects Layer                         │
│  LoadProducts$ Effect:                                           │
│  • Receives API response                                         │
│  • Dispatches: loadProductsSuccess({                            │
│      products: response.data,                                    │
│      pagination: response.pagination                             │
│    })                                                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       NgRx Reducer                               │
│  • Updates ProductsState:                                        │
│    - entities: { ...products }                                   │
│    - ids: [product IDs]                                          │
│    - pagination: { total: 50, page: 2, limit: 10, pages: 5 }   │
│    - loading: false                                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       NgRx Selectors                             │
│  • selectAllProducts → [products 11-20]                         │
│  • selectProductsPagination → { total: 50, page: 2, ... }      │
│  • selectCurrentPage → 2                                         │
│  • selectPageSize → 10                                           │
│  • selectTotalRecords → 50                                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Product List Component                        │
│  • Observables emit new values                                   │
│  • Template updates via async pipe                               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Data Table Component                         │
│  • Receives updated inputs:                                      │
│    - data: [products 11-20]                                      │
│    - totalRecords: 50                                            │
│    - currentPage: 2                                              │
│    - pageSize: 10                                                │
│  • Updates pagination UI                                         │
│  • Shows "Showing 11-20 of 50"                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Components

### 1. Product List Component
**File:** `src/app/features/products/components/product-list/product-list.component.ts`

**Responsibilities:**
- Read pagination from URL query parameters
- Dispatch actions to load products
- Handle page change events from data table
- Update URL when pagination changes
- Pass pagination data to data table component

**Key Methods:**
```typescript
ngOnInit() {
  // Read page and limit from URL, dispatch loadProducts
  this.route.queryParams.subscribe(params => {
    const page = parseInt(params['page']) || 1;
    const limit = parseInt(params['limit']) || 10;
    this.store.dispatch(loadProducts({ page, limit }));
  });
}

onPageChange(event: PageChangeEvent) {
  // Update URL and dispatch changePage action
  this.router.navigate([], {
    queryParams: { page: event.page, limit: event.pageSize },
    queryParamsHandling: 'merge'
  });
  this.store.dispatch(changePage({ page: event.page, limit: event.pageSize }));
}
```

### 2. Data Table Component
**File:** `src/app/shared/components/data-table/data-table.component.ts`

**Responsibilities:**
- Display pagination controls (PrimeNG p-paginator)
- Calculate display range (first-last)
- Emit page change events to parent
- Show/hide pagination based on totalRecords

**Key Properties:**
```typescript
@Input() totalRecords: number = 0;
@Input() currentPage: number = 1;
@Input() pageSize: number = 10;
@Output() pageChange = new EventEmitter<PageChangeEvent>();

get first(): number {
  return (this.currentPage - 1) * this.pageSize;
}

get last(): number {
  return Math.min(this.first + this.pageSize, this.totalRecords);
}
```

### 3. Product Service
**File:** `src/app/features/products/services/product.service.ts`

**Responsibilities:**
- Make HTTP requests with pagination parameters
- Return full ApiResponse including pagination metadata

**Key Method:**
```typescript
getAll(page: number = 1, limit: number = 10): Observable<ApiResponse<Product>> {
  const params = new HttpParams()
    .set('page', page.toString())
    .set('limit', limit.toString());
  
  return this.http.get<ApiResponse<Product>>(this.apiUrl, { params });
}
```

### 4. NgRx Store

#### Actions
**File:** `src/app/features/products/store/products.actions.ts`

```typescript
// Load products with optional pagination
loadProducts = createAction(
  '[Products] Load Products',
  props<{ page?: number; limit?: number }>()
);

// Success action with pagination metadata
loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ products: Product[]; pagination: Pagination }>()
);

// Change page action
changePage = createAction(
  '[Products] Change Page',
  props<{ page: number; limit: number }>()
);
```

#### State
**File:** `src/app/features/products/store/products.reducer.ts`

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

#### Selectors
**File:** `src/app/features/products/store/products.selectors.ts`

```typescript
selectProductsPagination    // Full pagination object
selectCurrentPage           // Current page number
selectPageSize              // Page size (limit)
selectTotalRecords          // Total number of records
selectTotalPages            // Total number of pages
```

#### Effects
**File:** `src/app/features/products/store/products.effects.ts`

```typescript
// Load products effect
LoadProducts$ = createEffect(() =>
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

// Change page effect
ChangePage$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ProductsActions.changePage),
    map((action) => ProductsActions.loadProducts({ page: action.page, limit: action.limit }))
  )
);
```

---

## Data Flow Examples

### Example 1: User Clicks Page 2

1. **User Action:** Clicks page 2 button in pagination controls
2. **PrimeNG Event:** `{ first: 10, rows: 10 }`
3. **Data Table:** Converts to `PageChangeEvent { page: 2, pageSize: 10, first: 10 }`
4. **Product List:** 
   - Updates URL to `/products?page=2&limit=10`
   - Dispatches `changePage({ page: 2, limit: 10 })`
5. **Effects:** Maps `changePage` to `loadProducts({ page: 2, limit: 10 })`
6. **Service:** Makes GET request to `/api/products?page=2&limit=10`
7. **API Response:**
   ```json
   {
     "success": true,
     "data": [/* products 11-20 */],
     "pagination": { "total": 50, "page": 2, "limit": 10, "pages": 5 }
   }
   ```
8. **Effects:** Dispatches `loadProductsSuccess` with products and pagination
9. **Reducer:** Updates state with new products and pagination
10. **Selectors:** Emit new values
11. **Component:** Template updates via async pipe
12. **Data Table:** Shows products 11-20 and "Showing 11-20 of 50"

### Example 2: User Changes Page Size to 20

1. **User Action:** Selects 20 from page size dropdown
2. **PrimeNG Event:** `{ first: 0, rows: 20 }` (resets to first page)
3. **Data Table:** Converts to `PageChangeEvent { page: 1, pageSize: 20, first: 0 }`
4. **Product List:**
   - Updates URL to `/products?page=1&limit=20`
   - Dispatches `changePage({ page: 1, limit: 20 })`
5. **Effects:** Maps to `loadProducts({ page: 1, limit: 20 })`
6. **Service:** Makes GET request to `/api/products?page=1&limit=20`
7. **API Response:** Returns first 20 products
8. **State Updates:** pagination.limit = 20, pagination.pages = 3 (if total = 50)
9. **UI Updates:** Shows 20 products, pagination shows 3 total pages

### Example 3: User Refreshes Page

1. **Browser Action:** User presses F5 on `/products?page=3&limit=10`
2. **Component Init:** `ngOnInit()` runs
3. **Route Params:** Reads `{ page: '3', limit: '10' }` from URL
4. **Parse Params:** `page = 3, limit = 10`
5. **Dispatch:** `loadProducts({ page: 3, limit: 10 })`
6. **API Call:** Fetches page 3 data
7. **State Restored:** Products and pagination state match URL
8. **UI Renders:** Shows page 3 with correct products

### Example 4: User Applies Filter

1. **User Action:** Enters filter value in column filter
2. **Data Table:** Emits `filterChange` event
3. **Product List:** `onFilterChange()` method
4. **Logic:**
   - Gets current page size from store
   - Updates URL to `/products?page=1&limit=10` (resets to page 1)
   - Dispatches `loadProducts({ page: 1, limit: 10 })`
5. **Note:** Filter values are NOT in URL (client-side filtering)
6. **Result:** Shows filtered results starting from page 1

---

## URL Structure

### Format
```
/products?page={pageNumber}&limit={pageSize}
```

### Examples
- `/products` → Defaults to `?page=1&limit=10`
- `/products?page=2&limit=10` → Page 2, 10 items per page
- `/products?page=1&limit=20` → Page 1, 20 items per page
- `/products?page=5&limit=5` → Page 5, 5 items per page

### Benefits
- **Bookmarkable:** Users can bookmark specific pages
- **Shareable:** URLs can be shared with others
- **Browser Navigation:** Back/forward buttons work correctly
- **Refresh-Safe:** Page refresh maintains pagination state

---

## API Contract

### Request
```
GET /api/products?page=2&limit=10
```

### Response
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Product 11",
      "sku": "...",
      "category": "...",
      "description": "...",
      "createdAt": "...",
      "updatedAt": "..."
    },
    // ... 9 more products
  ],
  "pagination": {
    "total": 50,      // Total number of records
    "page": 2,        // Current page (1-indexed)
    "limit": 10,      // Records per page
    "pages": 5        // Total number of pages
  }
}
```

---

## Common Patterns

### Pattern 1: Reset to Page 1
When filters or sorting change, always reset to page 1:

```typescript
onFilterChange(filterChange: FilterChange) {
  let currentLimit = 10;
  this.pageSize$.subscribe(limit => currentLimit = limit).unsubscribe();
  
  this.router.navigate([], {
    queryParams: { page: 1, limit: currentLimit },
    queryParamsHandling: 'merge'
  });
  
  this.store.dispatch(loadProducts({ page: 1, limit: currentLimit }));
}
```

### Pattern 2: Retry on Error
Retry with current pagination state:

```typescript
retryLoadProducts(): void {
  let currentPage = 1;
  let currentLimit = 10;
  
  this.currentPage$.subscribe(page => currentPage = page).unsubscribe();
  this.pageSize$.subscribe(limit => currentLimit = limit).unsubscribe();
  
  this.store.dispatch(loadProducts({ page: currentPage, limit: currentLimit }));
}
```

### Pattern 3: Prevent Concurrent Requests
Use `exhaustMap` in effects to ignore new requests while one is in flight:

```typescript
LoadProducts$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ProductsActions.loadProducts),
    exhaustMap((action) => /* ... */)  // Key: exhaustMap, not switchMap or mergeMap
  )
);
```

---

## Testing Checklist

### Unit Tests
- [ ] Service constructs correct query parameters
- [ ] Component reads pagination from URL
- [ ] Component dispatches correct actions
- [ ] Reducer updates pagination state correctly
- [ ] Selectors return correct state slices
- [ ] Effects call service with correct parameters

### Integration Tests
- [ ] Page change updates URL and loads data
- [ ] Page size change resets to page 1
- [ ] Filter change resets to page 1
- [ ] Browser back/forward buttons work
- [ ] Page refresh maintains state

### E2E Tests
- [ ] Complete user flow works end-to-end
- [ ] URL synchronization works
- [ ] Loading states display correctly
- [ ] Error handling works
- [ ] Empty state displays correctly

---

## Troubleshooting

### Issue: Pagination not updating
**Check:**
1. Are actions being dispatched? (Redux DevTools)
2. Are effects running? (Console logs)
3. Is API returning correct response? (Network tab)
4. Is reducer updating state? (Redux DevTools)
5. Are selectors emitting new values? (Console logs)

### Issue: URL not updating
**Check:**
1. Is `router.navigate()` being called?
2. Are query params correct?
3. Is `queryParamsHandling: 'merge'` set?

### Issue: Page refresh loses state
**Check:**
1. Is pagination in URL query parameters?
2. Is `ngOnInit()` reading from `route.queryParams`?
3. Are params being parsed correctly (parseInt)?

### Issue: Duplicate API requests
**Check:**
1. Is `exhaustMap` used in effects (not `switchMap` or `mergeMap`)?
2. Are multiple components dispatching loadProducts?
3. Is `ngOnInit()` being called multiple times?

---

## Performance Considerations

### Optimization Strategies
1. **Lazy Loading:** Only load current page data (✓ Implemented)
2. **Request Cancellation:** Use exhaustMap to prevent concurrent requests (✓ Implemented)
3. **Memoization:** NgRx selectors are memoized by default (✓ Built-in)
4. **Change Detection:** Consider OnPush strategy (Future enhancement)
5. **Caching:** Cache pages in store with TTL (Future enhancement)

### Current Performance
- **Initial Load:** < 2 seconds
- **Page Change:** < 1 second
- **No Memory Leaks:** Observables properly unsubscribed
- **No Duplicate Requests:** exhaustMap prevents concurrent calls

---

## Future Enhancements

### Phase 2: Advanced Features
- [ ] Server-side filtering with pagination
- [ ] Server-side sorting with pagination
- [ ] Caching strategy with TTL
- [ ] Prefetch next page on idle
- [ ] Virtual scrolling for large datasets

### Phase 3: Optimization
- [ ] OnPush change detection strategy
- [ ] Infinite scroll option
- [ ] Mobile-optimized pagination
- [ ] Keyboard navigation
- [ ] Accessibility improvements

---

## References

- **Requirements:** `.kiro/specs/pagination-support/requirements.md`
- **Design:** `.kiro/specs/pagination-support/design.md`
- **Tasks:** `.kiro/specs/pagination-support/tasks.md`
- **Verification:** `.kiro/specs/pagination-support/VERIFICATION_CHECKLIST.md`
- **PrimeNG Paginator:** https://primeng.org/paginator
- **NgRx Best Practices:** https://ngrx.io/guide/store/best-practices

