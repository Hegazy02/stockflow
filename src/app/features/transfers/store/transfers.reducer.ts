import { createReducer } from '@ngrx/store';

export interface TransfersState {
  // State will be defined in task 16
}

export const initialState: TransfersState = {};

export const transfersReducer = createReducer(
  initialState
);
