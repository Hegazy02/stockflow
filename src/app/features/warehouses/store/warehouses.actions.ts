import { createAction, props } from '@ngrx/store';
import { Warehouse, WarehouseManager } from '../models/warehouse.model';
import { Pagination } from '../../../core/models/api-response';

// Load Warehouses
export const loadWarehouses = createAction(
  '[Warehouses] Load Warehouses',
  props<{ page?: number; limit?: number }>()
);
export const loadWarehousesSuccess = createAction(
  '[Warehouses] Load Warehouses Success',
  props<{ warehouses: Warehouse[]; pagination: Pagination }>()
);
export const loadWarehousesFailure = createAction(
  '[Warehouses] Load Warehouses Failure',
  props<{ error: any }>()
);
// Load Warehouse Managers
export const loadWarehouseManagers = createAction('[Warehouses] Load Warehouse Managers');
export const loadWarehouseManagersSuccess = createAction(
  '[Warehouses] Load Warehouse Managers Success',
  props<{ managers: WarehouseManager[] }>()
);
export const loadWarehouseManagersFailure = createAction(
  '[Warehouses] Load Warehouse Managers Failure',
  props<{ error: any }>()
);
// Change Page
export const changePage = createAction(
  '[Warehouses] Change Page',
  props<{ page: number; limit: number }>()
);

// Get Warehouse By ID
export const getWarehouseById = createAction(
  '[Warehouses] Get Warehouse By ID',
  props<{ id: string }>()
);
export const getWarehouseByIdSuccess = createAction(
  '[Warehouses] Get Warehouse By ID Success',
  props<{ warehouse: Warehouse }>()
);
export const getWarehouseByIdFailure = createAction(
  '[Warehouses] Get Warehouse By ID Failure',
  props<{ error: any }>()
);

// Create Warehouse
export const createWarehouse = createAction(
  '[Warehouses] Create Warehouse',
  props<{ warehouse: Omit<Warehouse, '_id' | 'createdAt' | 'updatedAt'> }>()
);
export const createWarehouseSuccess = createAction(
  '[Warehouses] Create Warehouse Success',
  props<{ warehouse: Warehouse }>()
);
export const createWarehouseFailure = createAction(
  '[Warehouses] Create Warehouse Failure',
  props<{ error: any }>()
);

// Update Warehouse
export const updateWarehouse = createAction(
  '[Warehouses] Update Warehouse',
  props<{ warehouse: Warehouse }>()
);
export const updateWarehouseSuccess = createAction(
  '[Warehouses] Update Warehouse Success',
  props<{ warehouse: Warehouse }>()
);
export const updateWarehouseFailure = createAction(
  '[Warehouses] Update Warehouse Failure',
  props<{ error: any }>()
);

// Delete Warehouse
export const deleteWarehouses = createAction(
  '[Warehouses] Delete Warehouses',
  props<{ ids: string[] }>()
);
export const deleteWarehousesSuccess = createAction(
  '[Warehouses] Delete Warehouses Success',
  props<{ ids: string[] }>()
);
export const deleteWarehousesFailure = createAction(
  '[Warehouses] Delete Warehouses Failure',
  props<{ error: any }>()
);
