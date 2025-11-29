import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UnitsState, unitsAdapter } from './units.reducer';

export const selectUnitsState = createFeatureSelector<UnitsState>('units');

const { selectAll, selectEntities } = unitsAdapter.getSelectors();

export const selectAllUnits = createSelector(selectUnitsState, selectAll);

export const selectUnitEntities = createSelector(selectUnitsState, selectEntities);

export const selectUnitsLoading = createSelector(selectUnitsState, (state) => state.loading);

export const selectUnitsError = createSelector(selectUnitsState, (state) => state.error);

export const selectUnitsPagination = createSelector(selectUnitsState, (state) => state.pagination);

export const selectTotalRecords = createSelector(
  selectUnitsPagination,
  (pagination) => pagination.total
);

export const selectCurrentPage = createSelector(
  selectUnitsPagination,
  (pagination) => pagination.page
);

export const selectPageSize = createSelector(
  selectUnitsPagination,
  (pagination) => pagination.limit
);

export const selectUnitById = (id: string) =>
  createSelector(selectUnitEntities, (entities) => entities[id]);
