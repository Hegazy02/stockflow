import { createReducer } from '@ngrx/store';

export interface WarehousesState {
  // State will be defined in task 7
}

export const initialState: WarehousesState = {};

export const warehousesReducer = createReducer(
  initialState
);
