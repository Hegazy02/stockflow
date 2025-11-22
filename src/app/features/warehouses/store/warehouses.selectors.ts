import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Warehouse } from '../models/warehouse.model';

export interface WarehousesState {
  // State will be defined in task 7
}

export const selectWarehousesState = createFeatureSelector<WarehousesState>('warehouses');

// Selector to get all warehouses
export const selectAllWarehouses = createSelector(
  selectWarehousesState,
  (state: any): Warehouse[] => {
    // This will be implemented when warehouses reducer is complete
    // For now, return empty array
    return [];
  }
);

// Selector to get warehouse by ID
export const selectWarehouseById = (id: string) =>
  createSelector(selectWarehousesState, (state: any): Warehouse | undefined => {
    // This will be implemented when warehouses reducer is complete
    return undefined;
  });
