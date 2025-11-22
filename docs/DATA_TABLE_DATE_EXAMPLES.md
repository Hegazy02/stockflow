# Data Table - Date Handling Examples

## Quick Start

The data-table component now supports automatic date formatting. Simply specify `type: 'date'` or `type: 'datetime'` in your column configuration.

## Basic Date Column

```typescript
columns: TableColumn[] = [
  { 
    field: 'createdAt', 
    header: 'Created', 
    type: 'date',
    dateFormat: 'short' 
  }
];
```

**Result:** `1/22/25, 12:00 AM`

## Date Format Options

### Predefined Formats

```typescript
// Short format
{ field: 'date', header: 'Date', type: 'date', dateFormat: 'short' }
// Output: 1/22/25, 12:00 AM

// Medium format
{ field: 'date', header: 'Date', type: 'date', dateFormat: 'medium' }
// Output: Jan 22, 2025, 12:00:00 AM

// Long format
{ field: 'date', header: 'Date', type: 'date', dateFormat: 'long' }
// Output: January 22, 2025 at 12:00:00 AM GMT+0

// Full format
{ field: 'date', header: 'Date', type: 'date', dateFormat: 'full' }
// Output: Saturday, January 22, 2025 at 12:00:00 AM GMT+00:00
```

### Custom Formats

```typescript
// Date only (dd/MM/yyyy)
{ field: 'date', header: 'Date', type: 'date', dateFormat: 'dd/MM/yyyy' }
// Output: 22/01/2025

// US format (MM-dd-yyyy)
{ field: 'date', header: 'Date', type: 'date', dateFormat: 'MM-dd-yyyy' }
// Output: 01-22-2025

// With time (dd/MM/yyyy HH:mm)
{ field: 'date', header: 'Date', type: 'datetime', dateFormat: 'dd/MM/yyyy HH:mm' }
// Output: 22/01/2025 14:30

// ISO format (yyyy-MM-dd)
{ field: 'date', header: 'Date', type: 'date', dateFormat: 'yyyy-MM-dd' }
// Output: 2025-01-22

// Full custom (EEEE, MMMM d, y)
{ field: 'date', header: 'Date', type: 'date', dateFormat: 'EEEE, MMMM d, y' }
// Output: Saturday, January 22, 2025
```

## Real-World Examples

### Product List with Dates

```typescript
import { DataTableComponent, TableColumn } from './shared/components/data-table/data-table.component';

@Component({
  selector: 'app-product-list',
  imports: [DataTableComponent]
})
export class ProductListComponent {
  columns: TableColumn[] = [
    { field: 'name', header: 'Product Name', sortable: true },
    { field: 'sku', header: 'SKU', sortable: true },
    { field: 'price', header: 'Price', type: 'currency', sortable: true },
    { field: 'quantity', header: 'Stock', type: 'number', sortable: true },
    { field: 'isActive', header: 'Active', type: 'boolean' },
    { 
      field: 'createdAt', 
      header: 'Created', 
      type: 'date', 
      dateFormat: 'short',
      sortable: true 
    },
    { 
      field: 'updatedAt', 
      header: 'Last Updated', 
      type: 'datetime', 
      dateFormat: 'medium',
      sortable: true 
    }
  ];

  products = [
    {
      id: '1',
      name: 'Laptop',
      sku: 'LAP-001',
      price: 999.99,
      quantity: 50,
      isActive: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2025-01-22T14:30:00')
    }
  ];
}
```

### Order History with Timestamps

```typescript
columns: TableColumn[] = [
  { field: 'orderNumber', header: 'Order #', sortable: true },
  { field: 'customer', header: 'Customer', sortable: true },
  { field: 'total', header: 'Total', type: 'currency' },
  { 
    field: 'orderDate', 
    header: 'Order Date', 
    type: 'datetime',
    dateFormat: 'MMM d, y h:mm a', // Jan 22, 2025 2:30 PM
    sortable: true 
  },
  { 
    field: 'deliveryDate', 
    header: 'Delivery', 
    type: 'date',
    dateFormat: 'EEE, MMM d', // Sat, Jan 22
    sortable: true 
  }
];
```

### Audit Log with Full Timestamps

```typescript
columns: TableColumn[] = [
  { field: 'action', header: 'Action', sortable: true },
  { field: 'user', header: 'User', sortable: true },
  { 
    field: 'timestamp', 
    header: 'Timestamp', 
    type: 'datetime',
    dateFormat: 'yyyy-MM-dd HH:mm:ss', // 2025-01-22 14:30:45
    sortable: true,
    width: '200px'
  }
];
```

## Supported Date Input Formats

The component automatically handles:

1. **JavaScript Date objects**
   ```typescript
   createdAt: new Date()
   ```

2. **ISO 8601 strings**
   ```typescript
   createdAt: "2025-01-22T14:30:00Z"
   ```

3. **Timestamp numbers**
   ```typescript
   createdAt: 1705933800000
   ```

4. **Date strings**
   ```typescript
   createdAt: "January 22, 2025"
   ```

## Handling Null/Undefined Dates

Null or undefined date values automatically display as `-`:

```typescript
// If product.expiryDate is null
{ field: 'expiryDate', header: 'Expires', type: 'date' }
// Displays: -
```

## All Column Types

```typescript
columns: TableColumn[] = [
  // Text (default)
  { field: 'name', header: 'Name' },
  
  // Date
  { field: 'date', header: 'Date', type: 'date', dateFormat: 'short' },
  
  // DateTime
  { field: 'timestamp', header: 'Time', type: 'datetime', dateFormat: 'medium' },
  
  // Number (with thousand separators)
  { field: 'quantity', header: 'Qty', type: 'number' },
  
  // Currency ($ with 2 decimals)
  { field: 'price', header: 'Price', type: 'currency' },
  
  // Boolean (✓ or ✗)
  { field: 'active', header: 'Active', type: 'boolean' }
];
```

## Date Format Tokens

Common tokens for custom formats:

| Token | Description | Example |
|-------|-------------|---------|
| `yyyy` | 4-digit year | 2025 |
| `yy` | 2-digit year | 25 |
| `MMMM` | Full month name | January |
| `MMM` | Short month name | Jan |
| `MM` | 2-digit month | 01 |
| `M` | Month | 1 |
| `dd` | 2-digit day | 22 |
| `d` | Day | 22 |
| `EEEE` | Full day name | Saturday |
| `EEE` | Short day name | Sat |
| `HH` | 24-hour (00-23) | 14 |
| `hh` | 12-hour (01-12) | 02 |
| `mm` | Minutes | 30 |
| `ss` | Seconds | 45 |
| `a` | AM/PM | PM |

## Tips

1. **Always specify type** - Set `type: 'date'` or `type: 'datetime'` for date columns
2. **Choose appropriate format** - Use `'short'` for compact tables, `'medium'` for detail views
3. **Sortable dates** - Date columns work perfectly with sorting
4. **Consistent formatting** - Use the same format for similar date columns
5. **Time zones** - Dates are formatted in the user's local timezone
6. **Invalid dates** - Invalid date values display the original value unchanged

## Common Patterns

### Compact Table (Mobile-Friendly)
```typescript
dateFormat: 'short' // 1/22/25
```

### Standard Business Format
```typescript
dateFormat: 'MMM d, yyyy' // Jan 22, 2025
```

### Technical/Logs
```typescript
dateFormat: 'yyyy-MM-dd HH:mm:ss' // 2025-01-22 14:30:45
```

### User-Friendly
```typescript
dateFormat: 'EEEE, MMMM d, y' // Saturday, January 22, 2025
```

---

**Last Updated:** 2025-11-22
**Component Version:** 2.0.0
