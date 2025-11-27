import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Warehouse, WarehouseManager } from '../models/warehouse.model';
import { Pagination } from '../../../core/models/api-response';
import * as WarehousesActions from './warehouses.actions';

export interface WarehousesState extends EntityState<Warehouse> {
  loading: boolean;
  error: any;
  pagination: Pagination;
  managers: WarehouseManager[];
  managersLoading: boolean;
  managersError: any;
}

export const warehousesAdapter: EntityAdapter<Warehouse> = createEntityAdapter<Warehouse>({
  selectId: (warehouse: Warehouse) => warehouse._id,
  sortComparer: false,
});

export const initialState: WarehousesState = warehousesAdapter.getInitialState({
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
  managers: [],
  managersLoading: false,
  managersError: null,
});

export const warehousesReducer = createReducer(
  initialState,
  // Load Warehouse Managers
  on(WarehousesActions.loadWarehouseManagers, (state) => ({
    ...state,
    managersLoading: true,
    managersError: null,
  })),
  on(WarehousesActions.loadWarehouseManagersSuccess, (state, { managers }) => ({
    ...state,
    managers,
    managersLoading: false,
    managersError: null,
  })),
  on(WarehousesActions.loadWarehouseManagersFailure, (state, { error }) => ({
    ...state,
    managersLoading: false,
    managersError: error,
  })),

  // Load Warehouses
  on(WarehousesActions.loadWarehouses, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(WarehousesActions.loadWarehousesSuccess, (state, { warehouses, pagination }) =>
    warehousesAdapter.setAll(warehouses, {
      ...state,
      loading: false,
      error: null,
      pagination,
    })
  ),
  on(WarehousesActions.loadWarehousesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  // Load Warehouse Managers
  on(WarehousesActions.loadWarehouseManagers, (state) => ({
    ...state,
    managersLoading: true,
    managersError: null,
  })),
  on(WarehousesActions.loadWarehouseManagersSuccess, (state, { managers }) => ({
    ...state,
    managers,
    managersLoading: false,
    managersError: null,
  })),
  on(WarehousesActions.loadWarehouseManagersFailure, (state, { error }) => ({
    ...state,
    managersLoading: false,
    managersError: error,
  })),

  // Change Page
  on(WarehousesActions.changePage, (state, { page, limit }) => ({
    ...state,
    pagination: {
      ...state.pagination,
      page,
      limit,
    },
  })),

  // Get Warehouse By ID
  on(WarehousesActions.getWarehouseById, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(WarehousesActions.getWarehouseByIdSuccess, (state, { warehouse }) =>
    warehousesAdapter.upsertOne(warehouse, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(WarehousesActions.getWarehouseByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Warehouse
  on(WarehousesActions.createWarehouse, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(WarehousesActions.createWarehouseSuccess, (state, { warehouse }) =>
    warehousesAdapter.addOne(warehouse, { ...state, loading: false, error: null })
  ),
  on(WarehousesActions.createWarehouseFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Warehouse
  on(WarehousesActions.updateWarehouse, (state) => ({ ...state, loading: true, error: null })),
  on(WarehousesActions.updateWarehouseSuccess, (state, { warehouse }) =>
    warehousesAdapter.updateOne(
      {
        id: warehouse._id,
        changes: warehouse,
      },
      {
        ...state,
        loading: false,
        error: null,
      }
    )
  ),
  on(WarehousesActions.updateWarehouseFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Warehouse
  on(WarehousesActions.deleteWarehouses, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(WarehousesActions.deleteWarehousesSuccess, (state, { ids }) =>
    warehousesAdapter.removeMany(ids, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(WarehousesActions.deleteWarehousesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
