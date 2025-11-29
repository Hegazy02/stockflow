import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Unit } from '../models/unit.model';
import { Pagination } from '../../../core/models/api-response';
import * as UnitsActions from './units.actions';

export interface UnitsState extends EntityState<Unit> {
  loading: boolean;
  error: any;
  pagination: Pagination;
}

export const unitsAdapter: EntityAdapter<Unit> = createEntityAdapter<Unit>({
  selectId: (unit: Unit) => unit._id,
  sortComparer: false,
});

export const initialState: UnitsState = unitsAdapter.getInitialState({
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
});

export const unitsReducer = createReducer(
  initialState,
  // Load Units
  on(UnitsActions.loadUnits, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UnitsActions.loadUnitsSuccess, (state, { units, pagination }) =>
    unitsAdapter.setAll(units, {
      ...state,
      loading: false,
      error: null,
      pagination,
    })
  ),
  on(UnitsActions.loadUnitsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Get Unit By ID
  on(UnitsActions.getUnitById, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UnitsActions.getUnitByIdSuccess, (state, { unit }) =>
    unitsAdapter.upsertOne(unit, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(UnitsActions.getUnitByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Unit
  on(UnitsActions.createUnit, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UnitsActions.createUnitSuccess, (state, { unit }) =>
    unitsAdapter.addOne(unit, { ...state, loading: false, error: null })
  ),
  on(UnitsActions.createUnitFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Unit
  on(UnitsActions.updateUnit, (state) => ({ ...state, loading: true, error: null })),
  on(UnitsActions.updateUnitSuccess, (state, { unit }) =>
    unitsAdapter.updateOne(
      {
        id: unit._id,
        changes: unit,
      },
      {
        ...state,
        loading: false,
        error: null,
      }
    )
  ),
  on(UnitsActions.updateUnitFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Units
  on(UnitsActions.deleteUnits, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UnitsActions.deleteUnitsSuccess, (state, { ids }) =>
    unitsAdapter.removeMany(ids, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(UnitsActions.deleteUnitsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
