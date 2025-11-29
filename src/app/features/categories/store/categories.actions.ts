import { createAction, props } from '@ngrx/store';
import { Category } from '../models/category.model';

// Load Categories
export const loadCategories = createAction('[Categories] Load Categories');
export const loadCategoriesSuccess = createAction(
  '[Categories] Load Categories Success',
  props<{ categories: Category[] }>()
);
export const loadCategoriesFailure = createAction(
  '[Categories] Load Categories Failure',
  props<{ error: any }>()
);

// Get Category By ID
export const getCategoryById = createAction(
  '[Categories] Get Category By ID',
  props<{ id: string }>()
);
export const getCategoryByIdSuccess = createAction(
  '[Categories] Get Category By ID Success',
  props<{ category: Category }>()
);
export const getCategoryByIdFailure = createAction(
  '[Categories] Get Category By ID Failure',
  props<{ error: any }>()
);

// Create Category
export const createCategory = createAction(
  '[Categories] Create Category',
  props<{ category: Omit<Category, '_id' | 'createdAt' | 'updatedAt'> }>()
);
export const createCategorySuccess = createAction(
  '[Categories] Create Category Success',
  props<{ category: Category }>()
);
export const createCategoryFailure = createAction(
  '[Categories] Create Category Failure',
  props<{ error: any }>()
);

// Update Category
export const updateCategory = createAction(
  '[Categories] Update Category',
  props<{ category: Category }>()
);
export const updateCategorySuccess = createAction(
  '[Categories] Update Category Success',
  props<{ category: Category }>()
);
export const updateCategoryFailure = createAction(
  '[Categories] Update Category Failure',
  props<{ error: any }>()
);

// Delete Categories
export const deleteCategories = createAction(
  '[Categories] Delete Categories',
  props<{ ids: string[] }>()
);
export const deleteCategoriesSuccess = createAction(
  '[Categories] Delete Categories Success',
  props<{ ids: string[] }>()
);
export const deleteCategoriesFailure = createAction(
  '[Categories] Delete Categories Failure',
  props<{ error: any }>()
);
