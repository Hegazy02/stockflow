import { createReducer } from '@ngrx/store';

export interface StockHistoryState {
  // State will be defined in task 13
}

export const initialState: StockHistoryState = {};

export const stockHistoryReducer = createReducer(
  initialState
);
