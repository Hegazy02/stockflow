import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WarehousesState, warehousesAdapter } from './warehouses.reducer';

export const selectWarehousesState = createFeatureSelector<WarehousesState>('warehouses');

const { selectAll, selectEntities, selectIds, selectTotal } = warehousesAdapter.getSelectors();

export const selectAllWarehouses = createSelector(selectWarehousesState, selectAll);

export const selectWarehouseEntities = createSelector(selectWarehousesState, selectEntities);

export const selectWarehouseIds = createSelector(selectWarehousesState, selectIds);

export const selectWarehousesTotal = createSelector(selectWarehousesState, selectTotal);

export const selectWarehouseById = (id: string) =>
  createSelector(selectWarehouseEntities, (entities) => entities[id]);

export const selectWarehousesLoading = createSelector(
  selectWarehousesState,
  (state) => state.loading
);

export const selectWarehousesError = createSelector(selectWarehousesState, (state) => state.error);

export const selectWarehousesPagination = createSelector(
  selectWarehousesState,
  (state) => state.pagination
);

export const selectCurrentPage = createSelector(
  selectWarehousesPagination,
  (pagination) => pagination.page
);

export const selectPageSize = createSelector(
  selectWarehousesPagination,
  (pagination) => pagination.limit
);

export const selectTotalRecords = createSelector(
  selectWarehousesPagination,
  (pagination) => pagination.total
);

export const selectTotalPages = createSelector(
  selectWarehousesPagination,
  (pagination) => pagination.pages
);

// Warehouse Managers Selectors
export const selectWarehouseManagers = createSelector(
  selectWarehousesState,
  (state) => state.managers
);

export const selectWarehouseManagersLoading = createSelector(
  selectWarehousesState,
  (state) => state.managersLoading
);

export const selectWarehouseManagersError = createSelector(
  selectWarehousesState,
  (state) => state.managersError
);
