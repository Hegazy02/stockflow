import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CategoriesState, categoriesAdapter } from './categories.reducer';

export const selectCategoriesState =
  createFeatureSelector<CategoriesState>('categories');

const { selectAll, selectEntities } = categoriesAdapter.getSelectors();

export const selectAllCategories = createSelector(
  selectCategoriesState,
  selectAll
);

export const selectCategoryEntities = createSelector(
  selectCategoriesState,
  selectEntities
);

export const selectCategoriesLoading = createSelector(
  selectCategoriesState,
  (state) => state.loading
);

export const selectCategoriesError = createSelector(
  selectCategoriesState,
  (state) => state.error
);

export const selectCategoriesLoaded = createSelector(
  selectCategoriesState,
  (state) => state.loaded
);

export const selectCategoryById = (id: string) =>
  createSelector(selectCategoryEntities, (entities) => entities[id]);
