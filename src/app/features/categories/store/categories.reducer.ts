import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Category } from '../models/category.model';
import * as CategoriesActions from './categories.actions';

export interface CategoriesState extends EntityState<Category> {
  loading: boolean;
  error: any;
  loaded: boolean;
}

export const categoriesAdapter: EntityAdapter<Category> = createEntityAdapter<Category>({
  selectId: (category: Category) => category._id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export const initialState: CategoriesState = categoriesAdapter.getInitialState({
  loading: false,
  error: null,
  loaded: false,
});

export const categoriesReducer = createReducer(
  initialState,
  on(CategoriesActions.loadCategories, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CategoriesActions.loadCategoriesSuccess, (state, { categories }) =>
    categoriesAdapter.setAll(categories, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
    })
  ),
  on(CategoriesActions.loadCategoriesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
