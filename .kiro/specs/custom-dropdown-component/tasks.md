# Implementation Plan

- [x] 1. Create dropdown component structure and basic setup






  - Create dropdown component files in src/app/shared/components/dropdown/
  - Set up component as standalone with proper imports (CommonModule, FormsModule, LucideAngularModule)
  - Implement ControlValueAccessor interface with provider configuration
  - Define component inputs (@Input) for options, optionLabel, optionValue, placeholder, filter, loading, disabled
  - Define component output (@Output) for onChange event
  - Import and declare Lucide icons (ChevronDown, Loader2)
  - _Requirements: 1.1, 1.2, 1.3, 1.5_

- [ ]* 1.1 Write property test for form control value synchronization
  - **Property 1: Form control value synchronization**
  - **Validates: Requirements 1.1, 1.4**

- [x] 2. Implement ControlValueAccessor methods






  - Implement writeValue() to update selectedValue from form control
  - Implement registerOnChange() to store onChange callback
  - Implement registerOnTouched() to store onTouched callback
  - Implement setDisabledState() to handle disabled state
  - Add private properties for onChangeFn and onTouchedFn callbacks
  - _Requirements: 1.1, 1.5_

- [ ]* 2.1 Write property test for option display mapping
  - **Property 2: Option display mapping**
  - **Validates: Requirements 1.2, 1.3**


- [x] 3. Create trigger button and display logic





  - Create trigger button template with click handler
  - Implement toggleDropdown() method to open/close overlay
  - Implement getDisplayLabel() method to show selected option label or placeholder
  - Add chevron icon with rotation on open state
  - Apply CSS classes for open, disabled, and placeholder states
  - Add ARIA attributes (role, aria-expanded, aria-haspopup)
  - _Requirements: 2.1, 2.2, 6.4_

- [ ]* 3.1 Write property test for placeholder display
  - **Property 3: Placeholder display**
  - **Validates: Requirements 2.1**


- [x] 4. Implement overlay panel structure





  - Create overlay panel template with conditional rendering (@if isOpen)
  - Position overlay absolutely below trigger button
  - Add filter input section with ngModel binding
  - Add loading state section with spinner icon
  - Add options list section with @for loop
  - Add empty state section for no options/no results
  - _Requirements: 2.2, 2.3, 5.1, 5.4_


- [x] 5. Implement option selection logic





  - Create selectOption() method to handle option clicks
  - Update selectedValue when option is selected
  - Call onChangeFn with selected value
  - Call onTouchedFn to mark as touched
  - Emit onChange event
  - Close overlay after selection
  - _Requirements: 1.4, 2.4_

- [ ]* 5.1 Write property test for overlay toggle on selection
  - **Property 4: Overlay toggle on selection**
  - **Validates: Requirements 2.4**


- [x] 6. Implement filtering functionality



  - Add filterText property to track filter input value
  - Implement onFilterChange() method to update filterText
  - Implement getFilteredOptions() method with case-insensitive filtering
  - Filter options based on optionLabel field
  - Reset highlightedIndex when filter changes
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ]* 6.1 Write property test for case-insensitive filtering
  - **Property 5: Case-insensitive filtering**
  - **Validates: Requirements 3.2, 3.3**

- [ ]* 6.2 Write property test for empty filter results
  - **Property 6: Empty filter results**
  - **Validates: Requirements 3.5**


- [x] 7. Implement keyboard navigation




  - Add onKeyDown() method to handle keyboard events
  - Handle Enter/Space to open dropdown or select highlighted option
  - Handle Escape to close dropdown
  - Handle ArrowDown to navigate to next option
  - Handle ArrowUp to navigate to previous option
  - Add highlightedIndex property to track current position
  - Prevent default behavior for navigation keys
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ]* 7.1 Write property test for keyboard navigation bounds
  - **Property 7: Keyboard navigation bounds**
  - **Validates: Requirements 4.2**

- [ ]* 7.2 Write property test for Enter key selection
  - **Property 8: Enter key selection**
  - **Validates: Requirements 4.3**

- [ ]* 7.3 Write property test for Escape key closes overlay
  - **Property 9: Escape key closes overlay**
  - **Validates: Requirements 4.4**

- [x] 8. Implement click outside detection




  - Add @HostListener for document click events
  - Inject ElementRef in constructor
  - Implement onClickOutside() method
  - Check if click target is outside component
  - Close dropdown if click is outside
  - _Requirements: 2.3_


- [x] 9. Implement loading and empty states





  - Add loading state template with spinner animation
  - Disable filter input when loading is true
  - Show loading message during data fetch
  - Add empty state template for no options
  - Show "No results found" when filter produces no matches
  - Show "No options available" when options array is empty
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ]* 9.1 Write property test for loading state display
  - **Property 10: Loading state display**
  - **Validates: Requirements 5.2, 5.3**

- [x] 10. Create component styles





  - Create dropdown.component.scss file
  - Style dropdown-container with relative positioning
  - Style dropdown-trigger button with borders, padding, hover states
  - Style dropdown-label and dropdown-icon
  - Style dropdown-overlay with absolute positioning and z-index
  - Style dropdown-filter section and filter-input
  - Style dropdown-loading with spinner animation
  - Style dropdown-options with scrolling
  - Style dropdown-option with hover, highlighted, and selected states
  - Style dropdown-empty state
  - Use CSS custom properties from variables.scss
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
- [x] 11. Add accessibility features



- [ ] 11. Add accessibility features


  - Add role="combobox" to trigger button
  - Add aria-expanded attribute bound to isOpen
  - Add aria-haspopup="true" to trigger button
  - Add role="listbox" to options container
  - Add role="option" to each option element
  - Add aria-selected attribute to selected option
  - Add aria-label to filter input
  - _Requirements: 4.5_


- [x] 12. Implement auto-focus for filter input




  - Add @ViewChild reference to filter input
  - Implement AfterViewInit lifecycle hook
  - Focus filter input when dropdown opens
  - Use setTimeout to ensure DOM is ready
  - _Requirements: 3.1_


- [x] 13. Checkpoint - Ensure all tests pass




  - Ensure all tests pass, ask the user if questions arise.

-

- [x] 14. Integrate custom dropdown into product form




  - Import DropdownComponent in product-form.component.ts
  - Replace p-dropdown with app-dropdown in product-form.component.html
  - Configure optionLabel="name" and optionValue="_id"
  - Bind [options]="categories$ | async"
  - Bind [loading]="categoriesLoading$ | async"
  - Set placeholder="Select a category"
  - Enable filter with [filter]="true"
  - Keep formControlName="category" binding
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
-

- [x] 15. Remove PrimeNG dropdown dependency from product form





  - Remove DropdownModule import from product-form.component.ts
  - Verify form validation still works correctly
  - Verify error messages display correctly
  - Test edit mode with existing category selection
  - Test create mode with new category selection
  - _Requirements: 7.1_

- [x] 16. Final checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.
