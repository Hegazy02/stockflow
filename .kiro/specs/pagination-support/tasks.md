# Implementation Plan

- [x] 1. Update API Response Model





  - Export Pagination and ApiResponse interfaces from `src/app/core/models/api-response.ts` so they can be imported throughout the application
  - _Requirements: 1.1, 1.2_


- [x] 2. Update Product Service for Pagination



  - [x] 2.1 Modify getAll method to accept page and limit parameters with defaults


    - Add optional parameters: `page: number = 1, limit: number = 10`
    - Use HttpParams to construct query string with page and limit
    - Ensure the method returns the full `Observable<ApiResponse<Product>>` (already does)
    - _Requirements: 1.2, 1.3, 1.5_
  
  - [ ]* 2.2 Add unit tests for pagination parameters
    - Test getAll with default parameters
    - Test getAll with custom page and limit
    - Test query parameter construction
    - _Requirements: 1.2, 1.3_

- [x] 3. Update NgRx Store State and Actions




  - [x] 3.1 Add pagination to ProductsState interface


    - Add pagination object with total, page, limit, pages fields to `ProductsState` in `products.reducer.ts`
    - Update initialState to include default pagination values (page: 1, limit: 10, total: 0, pages: 0)
    - _Requirements: 2.1, 2.5_
  
  - [x] 3.2 Update products actions


    - Modify `loadProducts` action to accept optional page and limit props in `products.actions.ts`
    - Modify `loadProductsSuccess` action to accept pagination metadata
    - Add new `changePage` action with page and limit props
    - _Requirements: 2.2, 2.3_
  
  - [x] 3.3 Update products reducer to handle pagination


    - Update `loadProductsSuccess` reducer case to store pagination metadata in state
    - Ensure pagination state is preserved correctly
    - _Requirements: 2.1, 2.2_
  
  - [ ]* 3.4 Add unit tests for pagination state
    - Test pagination state initialization
    - Test pagination state updates on loadProductsSuccess
    - Test pagination state on error scenarios
    - _Requirements: 2.1, 2.2_

- [x] 4. Add Pagination Selectors




  - [x] 4.1 Create pagination selectors


    - Add `selectProductsPagination` selector in `products.selectors.ts`
    - Add `selectCurrentPage` selector
    - Add `selectPageSize` selector
    - Add `selectTotalRecords` selector
    - Add `selectTotalPages` selector
    - _Requirements: 2.3, 2.4_
  
  - [ ]* 4.2 Add unit tests for selectors
    - Test each selector returns correct state slice
    - Test selectors with different state values
    - _Requirements: 2.3_




- [x] 5. Update Products Effects


  - [x] 5.1 Modify LoadProducts effect to handle pagination

    - Extract page and limit from action payload with defaults
    - Pass page and limit to productService.getAll()
    - Map response to include both products data and pagination metadata
    - _Requirements: 1.2, 1.3, 2.2_
  

  - [x] 5.2 Add ChangePage effect

    - Create effect that listens for changePage action
    - Map changePage to loadProducts action with page and limit
    - _Requirements: 2.2, 2.3_
  
  - [ ]* 5.3 Add unit tests for effects
    - Test LoadProducts effect calls service with correct parameters
    - Test LoadProducts effect dispatches success with pagination
    - Test ChangePage effect dispatches loadProducts
    - Test error handling
    - _Requirements: 1.2, 2.2_

- [x] 6. Update Data Table Component for Pagination UI






  - [x] 6.1 Add pagination inputs and outputs

    - Add `@Input() totalRecords: number = 0` to `data-table.component.ts`
    - Add `@Input() currentPage: number = 1`
    - Add `@Input() pageSize: number = 10`
    - Add `@Output() pageChange = new EventEmitter<PageChangeEvent>()`
    - Create PageChangeEvent interface with page, pageSize, and first fields
    - Export PageChangeEvent interface
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 6.2 Add pagination template and logic


    - Add computed properties: `first` and `last` for display range calculation
    - Add `onPageChange` method to handle PrimeNG paginator events
    - Add pagination container in template with PrimeNG p-paginator component
    - Display "Showing X-Y of Z" information
    - Hide pagination when totalRecords is 0
    - Import PrimeNG Paginator module
    - _Requirements: 3.1, 3.3, 3.4, 3.5, 8.2_
  
  - [ ]* 6.3 Add unit tests for pagination UI
    - Test pageChange event emission
    - Test first and last calculations
    - Test pagination visibility based on totalRecords
    - Test pagination disabled state during loading
    - _Requirements: 3.1, 3.3_
-

- [x] 7. Update Product List Component for Pagination Integration





  - [x] 7.1 Add pagination observables

    - Add `pagination$`, `totalRecords$`, `currentPage$`, and `pageSize$` observables
    - Select pagination data from store in constructor using new selectors
    - _Requirements: 4.2, 4.3_
  

  - [x] 7.2 Update ngOnInit to handle URL query parameters

    - Inject ActivatedRoute in constructor
    - Subscribe to route.queryParams in ngOnInit
    - Read page and limit from query params with defaults
    - Dispatch loadProducts with page and limit from URL
    - _Requirements: 4.4, 4.5, 6.2_
  

  - [x] 7.3 Add onPageChange handler


    - Create onPageChange method that accepts PageChangeEvent
    - Update URL query parameters using Router.navigate with queryParamsHandling: 'merge'
    - Dispatch changePage action with new page and limit
    - _Requirements: 4.2, 4.4, 6.3_

  
  - [x] 7.4 Update template to pass pagination props

    - Pass totalRecords$, currentPage$, and pageSize$ to app-data-table using async pipe
    - Bind (pageChange) event to onPageChange handler
    - Pass rowsPerPageOptions array [5, 10, 20, 50]
    - _Requirements: 4.1, 4.2, 5.1, 5.2_
  
  - [ ]* 7.5 Add unit tests for pagination integration
    - Test ngOnInit reads pagination from URL
    - Test onPageChange updates URL and dispatches action
    - Test pagination observables are passed to data table
    - _Requirements: 4.2, 4.4, 6.2_

- [-] 8. Handle Pagination with Filters and Sorting


  - [x] 8.1 Reset to page 1 when filters change



    - Update onFilterChange method in product-list.component.ts
    - When filter changes, dispatch loadProducts with page: 1 and current limit
    - Update URL to reset page to 1
    - _Requirements: 6.4, 6.5_
  
  - [ ]* 8.2 Add integration tests for filter + pagination
    - Test that applying filter resets to page 1
    - Test that pagination state is maintained when filter is cleared
    - _Requirements: 6.4, 6.5_

- [x] 9. Add Loading States and Error Handling






  - [x] 9.1 Disable pagination during loading

    - Pass loading state to data-table component
    - Disable pagination controls when loading is true in data-table template
    - _Requirements: 7.2, 7.3_
  
  - [x] 9.2 Add error handling UI


    - Display error message when error$ observable has value
    - Add retry button that re-dispatches loadProducts with current page
    - Maintain previous page data on error
    - _Requirements: 8.3, 8.4, 8.5_
  
  - [x] 9.3 Add empty state handling


    - Show empty state message when totalRecords is 0
    - Hide pagination controls when totalRecords is 0
    - _Requirements: 8.1, 8.2_


- [-] 10. Final Integration and Testing





  - [x] 10.1 Verify complete pagination flow


    - Test navigation between pages
    - Test page size changes
    - Test URL synchronization
    - Test browser back/forward buttons
    - Test page refresh maintains state
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 6.1, 6.2_
  
  - [ ]* 10.2 Add E2E tests
    - Test complete user flow: load page → change page → change page size → refresh
    - Test URL updates correctly
    - Test pagination with filters
    - Test error scenarios
    - _Requirements: All requirements_
