import { createReducer } from '@ngrx/store';

export interface StockState {
  // State will be defined in task 10
}

export const initialState: StockState = {};

export const stockReducer = createReducer(
  initialState
);
