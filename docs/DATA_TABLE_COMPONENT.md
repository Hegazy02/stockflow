# Data Table Component Documentation

## Overview

A custom reusable data table component built with PrimeNG, featuring sorting, pagination, selection, and customizable action buttons with Lucide icons. Styled to match the project's color palette.

## Features

✅ **PrimeNG Integration** - Built on PrimeNG Table
✅ **Custom Theme** - Matches project color palette
✅ **Sortable Columns** - Click headers to sort
✅ **Pagination** - Configurable rows per page
✅ **Selection** - Single or multiple row selection
✅ **Action Buttons** - Customizable with Lucide icons
✅ **Loading State** - Shows loading indicator
✅ **Empty State** - Displays message when no data
✅ **Responsive** - Mobile-friendly design
✅ **Date Formatting** - Automatic date/datetime formatting
✅ **Type Support** - Text, date, number, currency, boolean

## Installation

PrimeNG is already installed:
```bash
npm install primeng primeicons
```

## Usage

### Basic Example

```typescript
import { DataTableComponent, TableColumn, TableAction } from './shared/components/data-table/data-table.component';
import { Eye, Edit, Trash2 } from 'lucide-angular';

@Component({
  imports: [DataTableComponent]
})
export class MyComponent {
  data = [
    { id: 1, name: 'Product 1', sku: 'SKU001', category: 'Electronics' },
    { id: 2, name: 'Product 2', sku: 'SKU002', category: 'Furniture' }
  ];

  columns: TableColumn[] = [
    { field: 'name', header: 'Name', sortable: true },
    { field: 'sku', header: 'SKU', sortable: true },
    { field: 'category', header: 'Category', sortable: true }
  ];

  actions: TableAction[] = [
    {
      icon: Eye,
      label: 'View',
      styleClass: 'btn-view',
      command: (row) => this.viewItem(row)
    },
    {
      icon: Edit,
      label: 'Edit',
      styleClass: 'btn-edit',
      command: (row) => this.editItem(row)
    },
    {
      icon: Trash2,
      label: 'Delete',
      styleClass: 'btn-delete',
      command: (row) => this.deleteItem(row)
    }
  ];
}
```

```html
<app-data-table
  [data]="data"
  [columns]="columns"
  [actions]="actions"
  [loading]="false"
  [paginator]="true"
  [rows]="10"
></app-data-table>
```

## API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `data` | `any[]` | `[]` | Array of data to display |
| `columns` | `TableColumn[]` | `[]` | Column configuration |
| `actions` | `TableAction[]` | `[]` | Action buttons configuration |
| `loading` | `boolean` | `false` | Show loading state |
| `paginator` | `boolean` | `true` | Enable pagination |
| `rows` | `number` | `10` | Rows per page |
| `rowsPerPageOptions` | `number[]` | `[5,10,20,50]` | Page size options |
| `showActions` | `boolean` | `true` | Show actions column |
| `selectionMode` | `'single'\|'multiple'\|null` | `null` | Enable row selection |
| `dataKey` | `string` | `'id'` | Unique identifier field |
| `globalFilterFields` | `string[]` | `[]` | Fields for global search |
| `minHeight` | `string` | `'auto'` | Minimum height of table container (e.g., '400px', '50vh') |
| `height` | `string` | `'auto'` | Fixed height of table container (e.g., '600px', '80vh') |
| `showFilters` | `boolean` | `false` | Show filter inputs below column headers |

### Outputs

| Event | Type | Description |
|-------|------|-------------|
| `rowSelect` | `EventEmitter<any>` | Emitted when row is selected |
| `rowUnselect` | `EventEmitter<any>` | Emitted when row is unselected |
| `filterChange` | `EventEmitter<{field: string, value: string, filters: object}>` | Emitted when filter value changes |

### Interfaces

#### TableColumn

```typescript
type ColumnType = 'text' | 'date' | 'datetime' | 'number' | 'currency' | 'boolean';

interface TableColumn {
  field: string;        // Data field name
  header: string;       // Column header text
  filterable?: boolean; // Enable filtering (requires showFilters=true)
  width?: string;       // Column width (e.g., '25%', '200px')
  type?: ColumnType;    // Column data type for formatting
  dateFormat?: string;  // Date format (e.g., 'short', 'medium', 'dd/MM/yyyy')
}
```

#### TableAction

```typescript
interface TableAction {
  icon: any;                      // Lucide icon component
  label: string;                  // Button tooltip
  command: (rowData: any) => void; // Click handler
  styleClass?: string;            // CSS class for styling
}
```

## Styling

### Action Button Classes

```scss
.btn-view    // Primary color on hover
.btn-edit    // Orange color on hover
.btn-delete  // Coral/red color on hover
```

### Custom Styling

```scss
// Override table styles
::ng-deep .p-datatable {
  .p-datatable-thead > tr > th {
    background: your-color;
  }
}
```

## Column Types & Formatting

### Date Columns

```typescript
columns: TableColumn[] = [
  { 
    field: 'createdAt', 
    header: 'Created', 
    type: 'date',
    dateFormat: 'short' // 1/1/24, 12:00 AM
  },
  { 
    field: 'updatedAt', 
    header: 'Last Updated', 
    type: 'datetime',
    dateFormat: 'medium' // Jan 1, 2024, 12:00:00 AM
  },
  { 
    field: 'expiryDate', 
    header: 'Expires', 
    type: 'date',
    dateFormat: 'dd/MM/yyyy' // 01/01/2024
  }
];
```

**Available Date Formats:**
- `'short'` - 1/1/24, 12:00 AM
- `'medium'` - Jan 1, 2024, 12:00:00 AM
- `'long'` - January 1, 2024 at 12:00:00 AM GMT+0
- `'full'` - Monday, January 1, 2024 at 12:00:00 AM GMT+00:00
- Custom: `'dd/MM/yyyy'`, `'MM-dd-yyyy HH:mm'`, etc.

### Number Columns

```typescript
columns: TableColumn[] = [
  { 
    field: 'quantity', 
    header: 'Quantity', 
    type: 'number' // Formats with thousand separators: 1,234
  },
  { 
    field: 'price', 
    header: 'Price', 
    type: 'currency' // Formats as currency: $1,234.56
  }
];
```

### Boolean Columns

```typescript
columns: TableColumn[] = [
  { 
    field: 'isActive', 
    header: 'Active', 
    type: 'boolean' // Shows ✓ or ✗
  }
];
```

### Mixed Types Example

```typescript
columns: TableColumn[] = [
  { field: 'name', header: 'Product Name', sortable: true },
  { field: 'sku', header: 'SKU', sortable: true },
  { field: 'price', header: 'Price', type: 'currency', sortable: true },
  { field: 'quantity', header: 'Stock', type: 'number', sortable: true },
  { field: 'isActive', header: 'Active', type: 'boolean' },
  { field: 'createdAt', header: 'Created', type: 'date', dateFormat: 'short', sortable: true }
];
```

## Examples

### With Selection

```html
<app-data-table
  [data]="data"
  [columns]="columns"
  [selectionMode]="'multiple'"
  (rowSelect)="onRowSelect($event)"
></app-data-table>
```

### Without Actions

```html
<app-data-table
  [data]="data"
  [columns]="columns"
  [showActions]="false"
></app-data-table>
```

### Custom Page Sizes

```html
<app-data-table
  [data]="data"
  [columns]="columns"
  [rows]="25"
  [rowsPerPageOptions]="[10, 25, 50, 100]"
></app-data-table>
```

### With Popup Filters

```html
<!-- Enable popup filters for filterable columns -->
<app-data-table
  [data]="data"
  [columns]="columns"
  [showFilters]="true"
></app-data-table>
```

```typescript
// Define which columns are filterable
columns: TableColumn[] = [
  { field: 'name', header: 'Name', filterable: true },
  { field: 'sku', header: 'SKU', filterable: true },
  { field: 'category', header: 'Category', filterable: true },
  { field: 'price', header: 'Price', type: 'currency', filterable: false }
];
```

**Features:**
- Click filter icon in column header to open popup
- Real-time filtering as you type
- Active filter indicator (blue icon)
- Clear button to reset filter
- Popup closes automatically

### With Height Control

```html
<!-- Fixed height (table will scroll if content exceeds) -->
<app-data-table
  [data]="data"
  [columns]="columns"
  [height]="'600px'"
></app-data-table>

<!-- Viewport-based height -->
<app-data-table
  [data]="data"
  [columns]="columns"
  [height]="'80vh'"
></app-data-table>

<!-- Minimum height (grows with content, but never smaller) -->
<app-data-table
  [data]="data"
  [columns]="columns"
  [minHeight]="'400px'"
></app-data-table>

<!-- Both min and max height -->
<app-data-table
  [data]="data"
  [columns]="columns"
  [minHeight]="'300px'"
  [height]="'600px'"
></app-data-table>

<!-- Auto-fill remaining space (default behavior) -->
<app-data-table
  [data]="data"
  [columns]="columns"
></app-data-table>
```

### With Loading State

```typescript
loading = true;

ngOnInit() {
  this.dataService.getData().subscribe(data => {
    this.data = data;
    this.loading = false;
  });
}
```

```html
<app-data-table
  [data]="data"
  [columns]="columns"
  [loading]="loading"
></app-data-table>
```

## PrimeNG Theme

The custom theme is located at `src/styles/primeng-theme.scss` and includes:

- Table borders and backgrounds
- Header styling
- Row hover effects
- Pagination styling
- Sort icons
- Selection checkboxes
- Loading indicators

All colors match the project palette:
- Primary: `#6366f1`
- Background: `#f8fafc`
- Borders: `#e2e8f0`
- Text: `#1e293b`

## Available Icons

Common Lucide icons for actions:
- `Eye` - View/Preview
- `Edit` - Edit/Modify
- `Trash2` - Delete/Remove
- `Copy` - Duplicate
- `Download` - Export
- `Upload` - Import
- `MoreVertical` - More options

## Tips

1. **Performance**: Use `dataKey` for better performance with large datasets
2. **Width**: Set column widths to prevent layout shifts
4. **Actions**: Keep actions to 3-4 buttons for better UX
5. **Loading**: Always show loading state during data fetch
6. **Dates**: Always specify `type: 'date'` or `type: 'datetime'` for date columns
7. **Format**: Use `dateFormat` to customize date display format
8. **Null Values**: Null/undefined values display as '-'
9. **Currency**: Currency type automatically formats with $ and 2 decimals
10. **Boolean**: Boolean type shows checkmark (✓) or cross (✗)
11. **Min Height**: Use `minHeight` to prevent layout shifts during loading or with dynamic data
12. **Fixed Height**: Use `height` to set a specific table height with scrolling
13. **Auto-fill**: Leave both `height` and `minHeight` as default to auto-fill parent container
14. **Height Units**: Supports any CSS unit - px, vh, rem, etc.
15. **Popup Filters**: Set `showFilters="true"` and mark columns as `filterable: true` to enable popup filters
16. **Filter Icon**: Click the filter icon in column headers to open filter popup
17. **Active Filters**: Filter icon turns blue when a filter is active
18. **Filter Behavior**: Filters use "contains" matching and work in real-time
19. **No Sorting**: Sorting has been removed - data displays in the order provided

## Troubleshooting

### Table not showing
- Check that PrimeNG is imported in styles.scss
- Verify data array is not empty
- Check console for errors

### Styles not applied
- Ensure primeng-theme.scss is imported
- Check that CSS variables are defined
- Verify component styleUrls path

### Icons not displaying
- Import Lucide icons in component
- Pass icon component (not string) to action
- Check LucideAngularModule is imported

## Type Formatting Details

### How It Works

The component automatically formats cell values based on the `type` property:

```typescript
formatCellValue(value: any, column: TableColumn): any {
  if (value === null || value === undefined) {
    return '-';
  }

  switch (column.type) {
    case 'date':
    case 'datetime':
      return this.formatDate(value, column.dateFormat || 'short');
    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : value;
    case 'currency':
      return typeof value === 'number' ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : value;
    case 'boolean':
      return value ? '✓' : '✗';
    default:
      return value;
  }
}
```

### Date Parsing

The component handles various date formats:
- JavaScript `Date` objects
- ISO 8601 strings (`"2024-01-01T00:00:00Z"`)
- Timestamp numbers
- Date strings (`"January 1, 2024"`)

Invalid dates display the original value.

---

**Status**: ✅ Complete with Date Handling
**Last Updated**: 2025-11-22
**Version**: 2.0.0
