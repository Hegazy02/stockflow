# Warehouse Managers Implementation

## Overview
Warehouse managers are managed within the warehouses NgRx store as they are tightly coupled to the warehouse feature.

## Structure

### Store State
The warehouse managers are stored in the `WarehousesState`:
```typescript
export interface WarehousesState extends EntityState<Warehouse> {
  // ... warehouse fields
  managers: WarehouseManager[];
  managersLoading: boolean;
  managersError: any;
}
```

### Actions
- `loadWarehouseManagers` - Triggers loading of all managers
- `loadWarehouseManagersSuccess` - Handles successful load
- `loadWarehouseManagersFailure` - Handles errors

### Selectors
- `selectWarehouseManagers` - Returns all managers
- `selectWarehouseManagersLoading` - Returns loading state
- `selectWarehouseManagersError` - Returns error state

### Service
The `WarehouseService` includes:
```typescript
getManagers(): Observable<WarehouseManager[]>
```
Endpoint: `GET /api/warehouses/managers`

## Usage Example

### In a Component
```typescript
import { selectWarehouseManagers } from '../../store/warehouses.selectors';
import { loadWarehouseManagers } from '../../store/warehouses.actions';

export class MyComponent implements OnInit {
  managers$: Observable<WarehouseManager[]>;

  constructor(private store: Store) {
    this.managers$ = this.store.select(selectWarehouseManagers);
  }

  ngOnInit(): void {
    // Load managers when component initializes
    this.store.dispatch(loadWarehouseManagers());
  }
}
```

### In a Template
```html
<app-dropdown
  formControlName="managerId"
  [options]="managers$ | async"
  optionLabel="name"
  optionValue="_id"
  placeholder="Select manager"
></app-dropdown>
```

## Why This Approach?

1. **Co-location**: Managers are always used within the warehouse context
2. **Simplicity**: No need for a separate feature module
3. **Performance**: Managers are loaded once and cached in the store
4. **Consistency**: Follows the same patterns as other features

## Data Model
```typescript
export interface WarehouseManager {
  _id: string;
  name: string;
}

export interface Warehouse {
  _id: string;
  title: string;
  location: string;
  manager: WarehouseManager;  // Full manager object
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}
```

Note: The warehouse form uses `managerId` for the form control, but converts it to the full `manager` object when saving.
