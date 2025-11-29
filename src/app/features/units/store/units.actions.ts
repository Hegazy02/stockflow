import { createAction, props } from '@ngrx/store';
import { Unit } from '../models/unit.model';
import { Pagination } from '../../../core/models/api-response';

// Load Units
export const loadUnits = createAction(
  '[Units] Load Units',
  props<{ page?: number; limit?: number; name?: string }>()
);
export const loadUnitsSuccess = createAction(
  '[Units] Load Units Success',
  props<{ units: Unit[]; pagination: Pagination }>()
);
export const loadUnitsFailure = createAction(
  '[Units] Load Units Failure',
  props<{ error: any }>()
);

// Change Page
export const changePage = createAction(
  '[Units] Change Page',
  props<{ page: number; limit: number }>()
);

// Get Unit By ID
export const getUnitById = createAction('[Units] Get Unit By ID', props<{ id: string }>());
export const getUnitByIdSuccess = createAction(
  '[Units] Get Unit By ID Success',
  props<{ unit: Unit }>()
);
export const getUnitByIdFailure = createAction(
  '[Units] Get Unit By ID Failure',
  props<{ error: any }>()
);

// Create Unit
export const createUnit = createAction(
  '[Units] Create Unit',
  props<{ unit: Omit<Unit, '_id' | 'createdAt' | 'updatedAt'> }>()
);
export const createUnitSuccess = createAction(
  '[Units] Create Unit Success',
  props<{ unit: Unit }>()
);
export const createUnitFailure = createAction(
  '[Units] Create Unit Failure',
  props<{ error: any }>()
);

// Update Unit
export const updateUnit = createAction('[Units] Update Unit', props<{ unit: Unit }>());
export const updateUnitSuccess = createAction(
  '[Units] Update Unit Success',
  props<{ unit: Unit }>()
);
export const updateUnitFailure = createAction(
  '[Units] Update Unit Failure',
  props<{ error: any }>()
);

// Delete Units
export const deleteUnits = createAction('[Units] Delete Units', props<{ ids: string[] }>());
export const deleteUnitsSuccess = createAction(
  '[Units] Delete Units Success',
  props<{ ids: string[] }>()
);
export const deleteUnitsFailure = createAction(
  '[Units] Delete Units Failure',
  props<{ error: any }>()
);
