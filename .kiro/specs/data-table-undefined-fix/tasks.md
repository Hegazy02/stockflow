# Implementation Plan

- [ ] 1. Set up property-based testing infrastructure
  - Install fast-check library as a dev dependency
  - Create test file structure for property-based tests
  - _Requirements: All (testing infrastructure)_

- [ ] 2. Fix formatCellValue method for null/undefined handling
  - [ ] 2.1 Remove or improve debug console.log statement
    - Remove the console.log that shows undefined values
    - Or enhance it to include field name and row context for better debugging
    - _Requirements: 1.5_

  - [ ] 2.2 Add early null/undefined check
    - Add explicit check at the start of formatCellValue
    - Return "-" immediately if value is null or undefined
    - Ensure this happens before any type-specific formatting
    - _Requirements: 1.2, 2.1_

  - [ ]* 2.3 Write property test for null/undefined handling
    - **Property 2: Null and undefined values return placeholder before formatting**
    - **Validates: Requirements 1.2**

  - [ ]* 2.4 Write property test for missing nested properties
    - **Property 1: Missing nested properties return placeholder**
    - **Validates: Requirements 1.1**

- [ ] 3. Improve formatDate method error handling
  - [ ] 3.1 Add explicit null/undefined check at method start
    - Check for null/undefined before creating Date object
    - Return "-" immediately for null/undefined values
    - _Requirements: 1.4, 3.4_

  - [ ] 3.2 Update invalid date handling
    - Change return value from original value to "-" for invalid dates
    - Ensure "Invalid Date" string is never returned
    - _Requirements: 1.4_

  - [ ]* 3.3 Write property test for invalid date handling
    - **Property 4: Invalid date values handled gracefully**
    - **Validates: Requirements 1.4**

  - [ ]* 3.4 Write property test for non-date values in date columns
    - **Property 10: Non-date values in date columns handled gracefully**
    - **Validates: Requirements 3.4**

- [ ] 4. Add type-specific null/undefined handling
  - [ ] 4.1 Update number type formatting
    - Add explicit null/undefined check before toLocaleString
    - Return "-" for null/undefined numeric values
    - _Requirements: 2.2_

  - [ ] 4.2 Update currency type formatting
    - Add explicit null/undefined check before currency formatting
    - Return "-" for null/undefined currency values
    - _Requirements: 2.3_

  - [ ] 4.3 Update boolean type formatting
    - Add explicit null/undefined check before boolean symbols
    - Return "-" for null/undefined boolean values
    - _Requirements: 2.4_

  - [ ]* 4.4 Write property tests for type-specific null handling
    - **Property 6: Numeric null/undefined returns placeholder**
    - **Property 7: Currency null/undefined returns placeholder**
    - **Property 8: Boolean null/undefined returns placeholder**
    - **Validates: Requirements 2.2, 2.3, 2.4**

- [ ] 5. Verify getNestedValue safety
  - [ ] 5.1 Review getNestedValue implementation
    - Confirm optional chaining handles null/undefined correctly
    - Verify no changes needed to existing implementation
    - _Requirements: 1.3, 2.5_

  - [ ]* 5.2 Write property tests for nested value access
    - **Property 3: Nested property access never throws errors**
    - **Property 9: Null intermediate objects handled safely**
    - **Validates: Requirements 1.3, 2.5**

- [ ] 6. Integration testing with incomplete data
  - [ ]* 6.1 Write property test for incomplete data rendering
    - **Property 5: Incomplete data renders without errors**
    - **Validates: Requirements 2.1, 3.1, 3.5**

  - [ ]* 6.2 Write unit tests for edge cases
    - Test empty objects as row data
    - Test arrays with mixed complete/incomplete objects
    - Test deeply nested missing properties
    - _Requirements: 3.3, 3.5_

- [ ] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
