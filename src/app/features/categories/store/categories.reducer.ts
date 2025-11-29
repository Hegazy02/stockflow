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
  sortComparer: false,
});

export const initialState: CategoriesState = categoriesAdapter.getInitialState({
  loading: false,
  error: null,
  loaded: false,
});

export const categoriesReducer = createReducer(
  initialState,
  // Load Categories
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
  })),

  // Get Category By ID
  on(CategoriesActions.getCategoryById, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CategoriesActions.getCategoryByIdSuccess, (state, { category }) =>
    categoriesAdapter.upsertOne(category, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(CategoriesActions.getCategoryByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Category
  on(CategoriesActions.createCategory, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CategoriesActions.createCategorySuccess, (state, { category }) =>
    categoriesAdapter.addOne(category, { ...state, loading: false, error: null })
  ),
  on(CategoriesActions.createCategoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Category
  on(CategoriesActions.updateCategory, (state) => ({ ...state, loading: true, error: null })),
  on(CategoriesActions.updateCategorySuccess, (state, { category }) =>
    categoriesAdapter.updateOne(
      {
        id: category._id,
        changes: category,
      },
      {
        ...state,
        loading: false,
        error: null,
      }
    )
  ),
  on(CategoriesActions.updateCategoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Categories
  on(CategoriesActions.deleteCategories, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CategoriesActions.deleteCategoriesSuccess, (state, { ids }) =>
    categoriesAdapter.removeMany(ids, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(CategoriesActions.deleteCategoriesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
