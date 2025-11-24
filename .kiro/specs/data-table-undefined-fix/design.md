# Design Document

## Overview

This design addresses the bug in the DataTableComponent where undefined values are not properly handled in the `formatCellValue` function. The current implementation has a console.log statement that shows undefined values, and the null/undefined check may not be catching all edge cases, particularly with nested properties.

The fix will ensure that:
- All undefined and null values are consistently displayed as "-"
- Nested property access is safe and doesn't cause errors
- Type-specific formatting only occurs after validating the value exists
- Debug logging provides meaningful context

## Architecture

The fix will be contained entirely within the `DataTableComponent` class in `src/app/shared/components/data-table/data-table.component.ts`. No changes to the component's public API or template are required.

### Component Structure

```
DataTableComponent
├── formatCellValue(rowData, column) - Main formatting method
├── getNestedValue(obj, path) - Safe nested property accessor
└── formatDate(value, format) - Date formatting with validation
```

## Components and Interfaces

### Modified Methods

#### formatCellValue
**Purpose**: Format cell values based on column type with proper null/undefined handling

**Current Issues**:
- Console.log shows undefined values without context
- Null check happens after getting nested value, but may not catch all cases
- No validation before type-specific formatting

**Proposed Changes**:
- Remove or improve debug logging to include field name and row context
- Ensure early return for null/undefined before any formatting
- Add explicit checks for each type-specific formatter

#### getNestedValue
**Purpose**: Safely traverse nested object properties using dot notation

**Current Implementation**: Uses reduce with optional chaining
**Status**: Already handles undefined correctly, no changes needed

#### formatDate
**Purpose**: Format date values with proper error handling

**Current Issues**:
- Returns original value on error, which could be undefined
- No explicit check for null/undefined before creating Date object

**Proposed Changes**:
- Add explicit null/undefined check at the start
- Return "-" for invalid dates instead of original value
- Improve error handling for non-date values

## Data Models

No changes to data models are required. The component will continue to work with:

```typescript
interface TableColumn {
  field: string;
  header: string;
  filterable?: boolean;
  width?: string;
  type?: ColumnType;
  dateFormat?: string;
}

type ColumnType = 'text' | 'date' | 'datetime' | 'number' | 'currency' | 'boolean';
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Missing nested properties return placeholder
*For any* row data object and nested property path that doesn't exist, formatCellValue should return "-"
**Validates: Requirements 1.1**

### Property 2: Null and undefined values return placeholder before formatting
*For any* column configuration and null or undefined value, formatCellValue should return "-" without attempting type-specific formatting
**Validates: Requirements 1.2**

### Property 3: Nested property access never throws errors
*For any* nested property path and object structure, getNestedValue should complete without throwing exceptions
**Validates: Requirements 1.3**

### Property 4: Invalid date values handled gracefully
*For any* invalid date value in a date column, formatDate should return "-" instead of "Invalid Date" or error messages
**Validates: Requirements 1.4**

### Property 5: Incomplete data renders without errors
*For any* array of row data objects with missing properties, the component should render all rows without throwing errors
**Validates: Requirements 2.1, 3.1, 3.5**

### Property 6: Numeric null/undefined returns placeholder
*For any* null or undefined value with column type 'number', formatCellValue should return "-"
**Validates: Requirements 2.2**

### Property 7: Currency null/undefined returns placeholder
*For any* null or undefined value with column type 'currency', formatCellValue should return "-"
**Validates: Requirements 2.3**

### Property 8: Boolean null/undefined returns placeholder
*For any* null or undefined value with column type 'boolean', formatCellValue should return "-"
**Validates: Requirements 2.4**

### Property 9: Null intermediate objects handled safely
*For any* nested path with null or undefined intermediate objects, getNestedValue should return undefined without throwing errors
**Validates: Requirements 2.5**

### Property 10: Non-date values in date columns handled gracefully
*For any* non-date value in a date or datetime column, formatDate should handle the error and return appropriate fallback text
**Validates: Requirements 3.4**

## Error Handling

### Current Error Handling
The component currently uses try-catch in the `formatDate` method to handle date parsing errors. The `getNestedValue` method uses optional chaining to prevent errors when traversing nested properties.

### Proposed Improvements

1. **Early Validation**: Add explicit null/undefined checks at the start of `formatCellValue` before any processing
2. **Type Guards**: Add type checking before applying type-specific formatters
3. **Consistent Fallbacks**: Ensure all error paths return "-" for consistency
4. **Remove Debug Logging**: Remove or improve the console.log statement that currently shows undefined values

### Error Scenarios

| Scenario | Current Behavior | Proposed Behavior |
|----------|-----------------|-------------------|
| Nested property missing | Returns undefined, logs to console | Returns "-", no logging |
| Null value | Returns "-" | Returns "-" (no change) |
| Invalid date string | Returns original value | Returns "-" |
| Non-numeric value for number type | Returns original value | Returns "-" |
| Empty object | May show undefined | Returns "-" for all fields |

## Testing Strategy

### Unit Testing Approach

Unit tests will focus on the three key methods:
- `formatCellValue`: Test each column type with null, undefined, and valid values
- `getNestedValue`: Test various nested paths including missing properties
- `formatDate`: Test valid dates, invalid dates, null, undefined, and non-date values

### Property-Based Testing Approach

We will use **fast-check** (a property-based testing library for TypeScript/JavaScript) to verify the correctness properties defined above.

**Configuration**:
- Each property test will run a minimum of 100 iterations
- Tests will generate random data structures, column configurations, and values
- Each test will be tagged with a comment referencing the specific correctness property

**Test Organization**:
- Create a new test file: `src/app/shared/components/data-table/data-table.component.pbt.spec.ts`
- Each correctness property will have its own property-based test
- Tests will use fast-check's arbitraries to generate test data

**Example Test Structure**:
```typescript
/**
 * Feature: data-table-undefined-fix, Property 1: Missing nested properties return placeholder
 */
it('should return "-" for any missing nested property', () => {
  fc.assert(
    fc.property(
      fc.record({ /* generate random objects */ }),
      fc.string(), // random field path
      (rowData, fieldPath) => {
        // Test that missing properties return "-"
      }
    ),
    { numRuns: 100 }
  );
});
```

### Integration Testing

Integration tests will verify that the component renders correctly with various data scenarios:
- Empty data arrays
- Arrays with mixed complete/incomplete objects
- Objects with deeply nested properties
- All column types with null/undefined values

## Implementation Notes

### Code Changes Required

**File**: `src/app/shared/components/data-table/data-table.component.ts`

**Changes**:
1. Update `formatCellValue` method:
   - Remove or improve console.log statement
   - Add early return for null/undefined
   - Add type validation before each formatter

2. Update `formatDate` method:
   - Add explicit null/undefined check at start
   - Return "-" for invalid dates instead of original value
   - Improve error handling

3. No changes needed to `getNestedValue` (already handles undefined correctly)

### Backward Compatibility

This fix maintains full backward compatibility:
- No changes to component inputs or outputs
- No changes to the TableColumn interface
- No changes to the component template
- Only internal implementation improvements

### Performance Considerations

The changes will have minimal performance impact:
- Early returns for null/undefined may slightly improve performance
- Additional type checks are simple comparisons
- No new dependencies or complex operations added

## Dependencies

- **fast-check**: Property-based testing library (dev dependency)
- No new runtime dependencies required

## Migration Path

No migration required. The fix is a drop-in replacement that improves existing behavior without breaking changes.
