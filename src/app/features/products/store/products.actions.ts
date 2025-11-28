import { createAction, props } from '@ngrx/store';
import { Product, ProductFormBody } from '../models/product.model';
import { Pagination } from '../../../core/models/api-response';

// Load Products
export const loadProducts = createAction(
  '[Products] Load Products',
  props<{ page?: number; limit?: number; name?: string; category?: string }>()
);
export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ products: Product[]; pagination: Pagination }>()
);
export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  props<{ error: any }>()
);

// Change Page
export const changePage = createAction(
  '[Products] Change Page',
  props<{ page: number; limit: number }>()
);

// Create Product
export const createProduct = createAction(
  '[Products] Create Product',
  props<{ product: ProductFormBody }>()
);
export const createProductSuccess = createAction(
  '[Products] Create Product Success',
  props<{ product: Product }>()
);
export const createProductFailure = createAction(
  '[Products] Create Product Failure',
  props<{ error: any }>()
);

// Update Product
export const updateProduct = createAction(
  '[Products] Update Product',
  props<{ product: ProductFormBody }>()
);
export const updateProductSuccess = createAction(
  '[Products] Update Product Success',
  props<{ product: Product }>()
);
export const updateProductFailure = createAction(
  '[Products] Update Product Failure',
  props<{ error: any }>()
);

// Get Product By ID
export const getProductById = createAction('[Products] Get Product By ID', props<{ id: string }>());
export const getProductByIdSuccess = createAction(
  '[Products] Get Product By ID Success',
  props<{ product: Product }>()
);
export const getProductByIdFailure = createAction(
  '[Products] Get Product By ID Failure',
  props<{ error: any }>()
);

// Delete Product
export const deleteProducts = createAction(
  '[Products] Delete Products',
  props<{ ids: string[] }>()
);
export const deleteProductsSuccess = createAction(
  '[Products] Delete Products Success',
  props<{ ids: string[] }>()
);
export const deleteProductsFailure = createAction(
  '[Products] Delete Products Failure',
  props<{ error: any }>()
);
