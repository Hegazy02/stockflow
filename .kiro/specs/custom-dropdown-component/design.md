# Custom Dropdown Component - Design Document

## Overview

The Custom Dropdown Component is a reusable, standalone Angular component that provides dropdown selection functionality with filtering, keyboard navigation, and full reactive forms integration. It will replace PrimeNG's dropdown in the product form, offering a branded, consistent user experience aligned with the application's design system.

The component implements Angular's ControlValueAccessor interface, making it seamlessly compatible with reactive forms. It features an overlay panel architecture with a trigger button, filterable options list, loading states, and comprehensive accessibility support.

## Architecture

### Component Structure

```
src/app/shared/components/
└── dropdown/
    ├── dropdown.component.ts       # Main component logic
    ├── dropdown.component.html     # Template
    ├── dropdown.component.scss     # Styles
    └── dropdown.component.spec.ts  # Tests
```

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Product Form Component                   │
│  - Uses Custom Dropdown via formControlName                 │
│  - Passes categories$ observable as [options]               │
│  - Passes loading state                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ ControlValueAccessor Interface
                     │
┌────────────────────▼────────────────────────────────────────┐
│              Custom Dropdown Component                       │
│  - Implements ControlValueAccessor                          │
│  - Manages overlay open/close state                         │
│  - Handles filtering logic                                   │
│  - Keyboard navigation                                       │
│  - Emits value changes to form control                      │
└─────────────────────────────────────────────────────────────┘
```

### Design Decisions

1. **Standalone Component**: Follow the existing pattern in the codebase for modern Angular architecture
2. **ControlValueAccessor**: Enable seamless reactive forms integration without wrapper directives
3. **Overlay Architecture**: Use absolute positioning with z-index management for the dropdown panel
4. **Click Outside Detection**: Use HostListener to detect clicks outside the component for closing
5. **Lucide Icons**: Use existing Lucide icon library for chevron and loading spinner
6. **CSS Variables**: Leverage existing design tokens from variables.scss for consistent styling
7. **No External Dependencies**: Build from scratch without PrimeNG or other UI libraries

## Components and Interfaces

### 1. Dropdown Component

**File:** `src/app/shared/components/dropdown/dropdown.component.ts`

```typescript
import { Component, Input, Output, EventEmitter, forwardRef, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideAngularModule, ChevronDown, Loader2 } from 'lucide-angular';

export interface DropdownOption {
  [key: string]: any;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent implements ControlValueAccessor, AfterViewInit {
  @Input() options: DropdownOption[] = [];
  @Input() optionLabel: string = 'label';
  @Input() optionValue: string = 'value';
  @Input() placeholder: string = 'Select an option';
  @Input() filter: boolean = true;
  @Input() loading: boolean = false;
  @Input() emptyMessage: string = 'No options available';
  @Input() noResultsMessage: string = 'No results found';
  @Input() disabled: boolean = false;

  @Output() onChange = new EventEmitter<any>();

  @ViewChild('filterInput') filterInput?: ElementRef<HTMLInputElement>;

  isOpen: boolean = false;
  filterText: string = '';
  selectedValue: any = null;
  highlightedIndex: number = -1;
  
  readonly ChevronDown = ChevronDown;
  readonly Loader2 = Loader2;

  private onChangeFn: (value: any) => void = () => {};
  private onTouchedFn: () => void = () => {};

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    // Auto-focus filter input when dropdown opens
    if (this.isOpen && this.filterInput) {
      setTimeout(() => this.filterInput?.nativeElement.focus(), 0);
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleDropdown(): void {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.filterText = '';
      this.highlightedIndex = -1;
      setTimeout(() => this.filterInput?.nativeElement.focus(), 0);
    }
  }

  closeDropdown(): void {
    this.isOpen = false;
    this.filterText = '';
    this.highlightedIndex = -1;
  }

  selectOption(option: DropdownOption): void {
    const value = option[this.optionValue];
    this.selectedValue = value;
    this.onChangeFn(value);
    this.onTouchedFn();
    this.onChange.emit(value);
    this.closeDropdown();
  }

  onFilterChange(value: string): void {
    this.filterText = value;
    this.highlightedIndex = -1;
  }

  onKeyDown(event: KeyboardEvent): void {
    const filteredOptions = this.getFilteredOptions();

    switch (event.key) {
      case 'Enter':
      case ' ':
        if (!this.isOpen) {
          event.preventDefault();
          this.toggleDropdown();
        } else if (this.highlightedIndex >= 0 && this.highlightedIndex < filteredOptions.length) {
          event.preventDefault();
          this.selectOption(filteredOptions[this.highlightedIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen) {
          this.toggleDropdown();
        } else {
          this.highlightedIndex = Math.min(this.highlightedIndex + 1, filteredOptions.length - 1);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (this.isOpen) {
          this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
        }
        break;
    }
  }

  getDisplayLabel(): string {
    if (this.selectedValue === null || this.selectedValue === undefined) {
      return this.placeholder;
    }
    const selectedOption = this.options.find(opt => opt[this.optionValue] === this.selectedValue);
    return selectedOption ? selectedOption[this.optionLabel] : this.placeholder;
  }

  getFilteredOptions(): DropdownOption[] {
    if (!this.filterText) {
      return this.options;
    }
    const filterLower = this.filterText.toLowerCase();
    return this.options.filter(option => 
      option[this.optionLabel]?.toString().toLowerCase().includes(filterLower)
    );
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }
}
```

### 2. Component Template

**File:** `src/app/shared/components/dropdown/dropdown.component.html`

```html
<div class="dropdown-container" [class.disabled]="disabled">
  <!-- Trigger Button -->
  <button
    type="button"
    class="dropdown-trigger"
    [class.open]="isOpen"
    [class.placeholder]="selectedValue === null || selectedValue === undefined"
    [disabled]="disabled"
    (click)="toggleDropdown()"
    (keydown)="onKeyDown($event)"
    [attr.aria-expanded]="isOpen"
    [attr.aria-haspopup]="true"
    role="combobox"
  >
    <span class="dropdown-label">{{ getDisplayLabel() }}</span>
    <lucide-icon
      [img]="ChevronDown"
      [size]="16"
      class="dropdown-icon"
      [class.rotated]="isOpen"
    ></lucide-icon>
  </button>

  <!-- Overlay Panel -->
  @if (isOpen) {
    <div class="dropdown-overlay" role="listbox">
      <!-- Filter Input -->
      @if (filter && !loading) {
        <div class="dropdown-filter">
          <input
            type="text"
            class="filter-input"
            placeholder="Search..."
            [(ngModel)]="filterText"
            (input)="onFilterChange(filterText)"
            (keydown)="onKeyDown($event)"
            #filterInput
            aria-label="Filter options"
          />
        </div>
      }

      <!-- Loading State -->
      @if (loading) {
        <div class="dropdown-loading">
          <lucide-icon
            [img]="Loader2"
            [size]="20"
            class="spinner"
          ></lucide-icon>
          <span>Loading...</span>
        </div>
      }

      <!-- Options List -->
      @if (!loading) {
        <div class="dropdown-options">
          @if (getFilteredOptions().length > 0) {
            @for (option of getFilteredOptions(); track option[optionValue]; let i = $index) {
              <div
                class="dropdown-option"
                [class.selected]="option[optionValue] === selectedValue"
                [class.highlighted]="i === highlightedIndex"
                (click)="selectOption(option)"
                (mouseenter)="highlightedIndex = i"
                role="option"
                [attr.aria-selected]="option[optionValue] === selectedValue"
              >
                {{ option[optionLabel] }}
              </div>
            }
          } @else {
            <div class="dropdown-empty">
              {{ filterText ? noResultsMessage : emptyMessage }}
            </div>
          }
        </div>
      }
    </div>
  }
</div>
```

### 3. Component Styling

**File:** `src/app/shared/components/dropdown/dropdown.component.scss`

```scss
.dropdown-container {
  position: relative;
  width: 100%;

  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border-medium);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover:not(:disabled) {
    border-color: var(--color-primary);
  }

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &:disabled {
    cursor: not-allowed;
    background-color: var(--color-bg-tertiary);
  }

  &.open {
    border-color: var(--color-primary);
  }

  &.placeholder .dropdown-label {
    color: var(--color-text-tertiary);
  }
}

.dropdown-label {
  flex: 1;
  text-align: left;
  color: var(--color-text-primary);
}

.dropdown-icon {
  transition: transform var(--transition-fast);
  color: var(--color-text-secondary);

  &.rotated {
    transform: rotate(180deg);
  }
}

.dropdown-overlay {
  position: absolute;
  top: calc(100% + var(--spacing-xs));
  left: 0;
  right: 0;
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border-medium);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-dropdown);
  max-height: 300px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.dropdown-filter {
  padding: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border-light);
}

.filter-input {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border-medium);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
}

.dropdown-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  color: var(--color-text-secondary);

  .spinner {
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.dropdown-options {
  overflow-y: auto;
  max-height: 250px;
}

.dropdown-option {
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  transition: background-color var(--transition-fast);
  color: var(--color-text-primary);

  &:hover,
  &.highlighted {
    background-color: var(--color-bg-tertiary);
  }

  &.selected {
    background-color: var(--color-primary);
    color: var(--color-text-on-primary);
    font-weight: var(--font-weight-medium);
  }
}

.dropdown-empty {
  padding: var(--spacing-lg);
  text-align: center;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
}
```

## Data Models

### DropdownOption Interface

```typescript
export interface DropdownOption {
  [key: string]: any;
}
```

**Design Rationale:**
- Flexible interface accepts any object shape
- Allows component to work with various data structures
- `optionLabel` and `optionValue` inputs specify which properties to use

### Example Usage with ProductCategory

```typescript
// In product-form.component.html
<app-dropdown
  [options]="categories$ | async"
  optionLabel="name"
  optionValue="_id"
  placeholder="Select a category"
  [filter]="true"
  [loading]="categoriesLoading$ | async"
  formControlName="category"
></app-dropdown>
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Property 1: Form control value synchronization
*For any* value written to the component via writeValue(), when the user selects an option with that value, the form control should receive the same value through the onChange callback
**Validates: Requirements 1.1, 1.4**

Property 2: Option display mapping
*For any* array of options and any valid optionLabel/optionValue configuration, the component should correctly display the label field and emit the value field when an option is selected
**Validates: Requirements 1.2, 1.3**

Property 3: Placeholder display
*For any* dropdown state where no value is selected, the component should display the placeholder text instead of an option label
**Validates: Requirements 2.1**

Property 4: Overlay toggle on selection
*For any* option selection, the overlay panel should close and the trigger button should display the selected option's label
**Validates: Requirements 2.4**

Property 5: Case-insensitive filtering
*For any* filter text and options array, the filtered results should include all options whose label contains the filter text regardless of case
**Validates: Requirements 3.2, 3.3**

Property 6: Empty filter results
*For any* filter text that matches no options, the component should display the "No results found" message
**Validates: Requirements 3.5**

Property 7: Keyboard navigation bounds
*For any* filtered options list, pressing ArrowDown should not move the highlighted index beyond the last option, and ArrowUp should not move it below the first option
**Validates: Requirements 4.2**

Property 8: Enter key selection
*For any* highlighted option, pressing Enter should select that option and close the overlay
**Validates: Requirements 4.3**

Property 9: Escape key closes overlay
*For any* open dropdown state, pressing Escape should close the overlay panel
**Validates: Requirements 4.4**

Property 10: Loading state display
*For any* dropdown state where loading is true, the component should display the loading spinner and hide the options list
**Validates: Requirements 5.2, 5.3**

## Error Handling

### Input Validation

- **Empty options array**: Display empty state message
- **Invalid optionLabel/optionValue**: Fallback to default 'label' and 'value' properties
- **Null/undefined selected value**: Display placeholder text
- **Missing option for selected value**: Display placeholder text

### Edge Cases

- **Rapid clicking**: Debounce toggle to prevent state issues
- **Filter during loading**: Disable filter input when loading is true
- **Click outside while filtering**: Close overlay and clear filter text
- **Keyboard navigation with no options**: Disable navigation, show empty state

## Testing Strategy

### Unit Testing

Unit tests will verify specific behaviors and edge cases:

- Component initialization with default values
- ControlValueAccessor methods (writeValue, registerOnChange, registerOnTouched)
- Disabled state prevents interaction
- Empty options array displays empty message
- Invalid optionLabel/optionValue handling
- Click outside closes dropdown
- Filter input auto-focus on open

### Property-Based Testing

Property-based tests will use `fast-check` library for TypeScript to generate random test data and verify properties hold across many inputs.

**Test Configuration:**
- Minimum 100 iterations per property test
- Custom generators for DropdownOption arrays
- Custom generators for filter text strings
- Custom generators for keyboard events

**Property Test Implementation:**

Each property test will:
1. Generate random test data (options, values, filter text)
2. Execute the component behavior
3. Verify the property holds true
4. Run 100+ iterations to catch edge cases

### Integration Testing

- Test dropdown in product form with real NgRx store
- Test form submission with selected category
- Test form validation with required dropdown
- Test dropdown with async data loading

## Performance Considerations

### Optimization Strategies

1. **Change Detection**: Use OnPush strategy for better performance
2. **TrackBy Function**: Use optionValue for efficient list rendering
3. **Debounce Filter**: Add debounce to filter input for large lists
4. **Virtual Scrolling**: Consider for lists > 1000 items (future enhancement)
5. **Memoization**: Cache filtered results when filter text unchanged

### Expected Performance

- **Render Time**: < 50ms for up to 500 options
- **Filter Time**: < 100ms for filtering 500 options
- **Keyboard Navigation**: < 16ms per key press (60fps)

## Dependencies

### Existing Dependencies

- `@angular/core` - Component framework
- `@angular/common` - CommonModule for directives
- `@angular/forms` - FormsModule and ControlValueAccessor
- `lucide-angular` - Icon library (ChevronDown, Loader2)

### No New Dependencies Required

All functionality built with existing dependencies.

## Integration with Product Form

### Current Implementation (PrimeNG)

```html
<p-dropdown
  formControlName="category"
  [options]="categories$ | async"
  optionLabel="name"
  optionValue="_id"
  placeholder="Select a category"
  [filter]="true"
  [disabled]="(categoriesLoading$ | async) || false"
></p-dropdown>
```

### New Implementation (Custom Dropdown)

```html
<app-dropdown
  formControlName="category"
  [options]="categories$ | async"
  optionLabel="name"
  optionValue="_id"
  placeholder="Select a category"
  [filter]="true"
  [loading]="categoriesLoading$ | async"
  [disabled]="false"
></app-dropdown>
```

### Migration Steps

1. Create custom dropdown component in shared/components
2. Import DropdownComponent in product-form.component.ts
3. Replace p-dropdown with app-dropdown in template
4. Remove DropdownModule from PrimeNG imports
5. Test form functionality with custom dropdown
6. Update styling if needed to match design

## Future Enhancements

1. **Multi-Select**: Support selecting multiple options
2. **Grouping**: Support option groups with headers
3. **Custom Templates**: Allow custom option rendering via ng-template
4. **Virtual Scrolling**: For very large lists (> 1000 items)
5. **Async Search**: Server-side filtering for large datasets
6. **Clear Button**: Add X button to clear selection
7. **Disabled Options**: Support disabling individual options
8. **Custom Empty State**: Content projection for empty state
9. **Animations**: Add smooth open/close animations
10. **Mobile Optimization**: Better touch support and mobile UX

## Accessibility

### ARIA Attributes

- `role="combobox"` on trigger button
- `aria-expanded` indicates dropdown state
- `aria-haspopup="true"` indicates popup presence
- `role="listbox"` on options container
- `role="option"` on each option
- `aria-selected` on selected option
- `aria-label` on filter input

### Keyboard Support

- **Tab**: Focus trigger button
- **Enter/Space**: Open dropdown or select highlighted option
- **Escape**: Close dropdown
- **ArrowDown**: Navigate to next option
- **ArrowUp**: Navigate to previous option
- **Type to search**: Filter options (when filter enabled)

### Screen Reader Support

- Announces selected value
- Announces number of options available
- Announces filter results count
- Announces loading state

## References

- [Angular ControlValueAccessor](https://angular.io/api/forms/ControlValueAccessor)
- [Angular Reactive Forms](https://angular.io/guide/reactive-forms)
- [ARIA Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [Lucide Icons](https://lucide.dev/)
