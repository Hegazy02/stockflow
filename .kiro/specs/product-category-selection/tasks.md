# Implementation Plan

- [x] 1. Create category model and service





  - Create `src/app/features/categories/models/category.model.ts` with ProductCategory interface
  - Create `src/app/features/categories/services/category.service.ts` with getAll() method
  - Implement HTTP error handling in service
  - _Requirements: 1.1, 1.2, 1.3_

- [ ]* 1.1 Write property test for category service response mapping
  - **Property 1: Category service response mapping**
  - **Validates: Requirements 1.2**

- [ ]* 1.2 Write property test for category service error handling
  - **Property 2: Category service error handling**
  - **Validates: Requirements 1.3**
-

- [x] 2. Set up NgRx store for categories




  - Create `src/app/features/categories/store/categories.actions.ts` with load actions
  - Create `src/app/features/categories/store/categories.reducer.ts` with EntityAdapter
  - Create `src/app/features/categories/store/categories.selectors.ts` with all selectors
  - Create `src/app/features/categories/store/categories.effects.ts` with load effect
  - Create `src/app/features/categories/store/index.ts` for exports
  - _Requirements: 1.4, 1.5_

- [ ]* 2.1 Write property test for store state structure consistency
  - **Property 3: Store state structure consistency**
  - **Validates: Requirements 1.4**

- [ ]* 2.2 Write unit tests for category reducer
  - Test initial state
  - Test loadCategories action sets loading to true
  - Test loadCategoriesSuccess updates state with categories
  - Test loadCategoriesFailure sets error state
  - _Requirements: 1.4_

- [ ]* 2.3 Write unit tests for category selectors
  - Test selectAllCategories returns all categories
  - Test selectCategoriesLoading returns loading state
  - Test selectCategoriesError returns error state
  - Test selectCategoryById returns correct category
  - _Requirements: 1.4_

- [x] 3. Register categories store in app configuration



  - Update `src/app/app.config.ts` to include categories reducer and effects
  - Verify store is properly configured
  - _Requirements: 1.4, 1.5_


- [x] 4. Update product form component to load categories




  - Import DropdownModule in product form component
  - Add categories$, categoriesLoading$, categoriesError$ observables
  - Dispatch loadCategories action in ngOnInit
  - Update form control for category to accept ID (string)
  - _Requirements: 2.1, 2.2_

- [ ]* 4.1 Write property test for form control value consistency
  - **Property 5: Form control value consistency**
  - **Validates: Requirements 2.4, 4.3**

- [ ]* 4.2 Write unit test for category loading on init
  - Test that loadCategories action is dispatched on ngOnInit
  - _Requirements: 2.2_


- [x] 5. Update product form template with PrimeNG dropdown




  - Replace category text input with p-dropdown component
  - Configure dropdown with options, optionLabel, optionValue
  - Add filter functionality with filterBy="name"
  - Add placeholder "Select a category"
  - Bind disabled state to categoriesLoading$
  - _Requirements: 2.1, 2.3, 2.4, 5.1, 5.2_

- [ ]* 5.1 Write property test for category name-to-ID mapping
  - **Property 4: Category name-to-ID mapping**
  - **Validates: Requirements 2.3, 4.2**

- [ ]* 5.2 Write property test for category filtering behavior
  - **Property 10: Category filtering behavior**
  - **Validates: Requirements 5.2**

- [x] 6. Implement form validation and error handling




  - Ensure category field has required validator
  - Update getErrorMessage() to handle category validation errors
  - Add error message display in template for validation errors
  - Add error message display for category loading failures
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ]* 6.1 Write property test for form validation on empty submission
  - **Property 6: Form validation on empty submission**
  - **Validates: Requirements 3.2**

- [ ]* 6.2 Write property test for error message display
  - **Property 7: Error message display**
  - **Validates: Requirements 3.4**

- [x] 7. Implement loading and empty states in dropdown



  - Add ng-template with pTemplate="empty" for empty state
  - Show "Loading categories..." when categoriesLoading$ is true
  - Show "Failed to load categories" when categoriesError$ has value
  - Show "No categories available" when categories array is empty
  - _Requirements: 2.5, 3.5, 5.4_

- [ ]* 7.1 Write unit tests for dropdown states
  - Test loading state disables dropdown
  - Test empty state shows appropriate message
  - Test error state shows error message
  - _Requirements: 2.5, 3.5, 5.4_


- [x] 8. Update edit mode to populate category dropdown




  - Modify loadProduct() to set category form control to category._id
  - Handle case where product.category is an object vs string
  - Verify dropdown displays correct category name for selected ID
  - _Requirements: 4.1, 4.2_

- [ ]* 8.1 Write property test for edit mode category population
  - **Property 8: Edit mode category population**
  - **Validates: Requirements 4.1**

- [x] 9. Update form submission to send category ID




  - Verify onSubmit() sends category as string ID (not object)
  - Test create product with category ID
  - Test update product with category ID
  - _Requirements: 4.4_

- [ ]* 9.1 Write property test for form submission payload structure
  - **Property 9: Form submission payload structure**
  - **Validates: Requirements 4.4**

- [ ]* 9.2 Write unit tests for form submission
  - Test create mode submits correct payload with category ID
  - Test edit mode submits correct payload with category ID
  - _Requirements: 4.4_

- [ ] 10. Handle edge case: product with deleted category
  - Add logic to handle when product.category._id is not in categories list
  - Display warning message if category no longer exists
  - Allow user to select a new category
  - _Requirements: 4.5_

- [ ]* 10.1 Write unit test for deleted category edge case
  - Test form handles product with non-existent category ID
  - Test warning message is displayed
  - _Requirements: 4.5_
-

- [x] 11. Add styling for category dropdown




  - Apply consistent styling with other form fields
  - Add invalid state styling for validation errors
  - Ensure dropdown follows PrimeNG Aura theme
  - Test responsive behavior on mobile
  - _Requirements: 5.5_




- [ ] 12. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Final integration testing





  - Test complete flow: open form → categories load → select category → submit
  - Test edit flow: open product → category populated → change category → submit
  - Test error flow: categories fail to load → error displayed → retry
  - Test validation flow: submit without category → error displayed → select category → submit
  - Verify dropdown filter works correctly
  - Verify keyboard navigation works
  - _Requirements: All_
