import { createAction, props } from '@ngrx/store';
import { Product } from '../models/product.model';

// // Load Products
// export const loadProducts = createAction('[Products] Load Products');

// export const loadProductsSuccess = createAction(
//   '[Products] Load Products Success',
//   props<{ products: Product[] }>()
// );

// export const loadProductsFailure = createAction(
//   '[Products] Load Products Failure',
//   props<{ error: any }>()
// );

// Create Product
// export const createProduct = createAction(
//   '[Products] Create Product',
//   props<{ product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> }>()
// );

// export const createProductSuccess = createAction(
//   '[Products] Create Product Success',
//   props<{ product: Product }>()
// );

// export const createProductFailure = createAction(
//   '[Products] Create Product Failure',
//   props<{ error: any }>()
// );

// Update Product
// export const updateProduct = createAction(
//   '[Products] Update Product',
//   props<{ product: Product }>()
// );

// export const updateProductSuccess = createAction(
//   '[Products] Update Product Success',
//   props<{ product: Product }>()
// );

// export const updateProductFailure = createAction(
//   '[Products] Update Product Failure',
//   props<{ error: any }>()
// );

// // Delete Product
// export const deleteProduct = createAction('[Products] Delete Product', props<{ id: string }>());

// export const deleteProductSuccess = createAction(
//   '[Products] Delete Product Success',
//   props<{ id: string }>()
// );

// export const deleteProductFailure = createAction(
//   '[Products] Delete Product Failure',
//   props<{ error: any }>()
// );

// Load Products
export const loadProducts = createAction('[Products] Load Products');
export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ products: Product[] }>()
);
export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  props<{ error: any }>()
);

// Create Product
export const createProduct = createAction(
  '[Products] Create Product',
  props<{ product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> }>()
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
  props<{ product: Product }>()
);
export const updateProductSuccess = createAction(
  '[Products] Update Product Success',
  props<{ product: Product }>()
);
export const updateProductFailure = createAction(
  '[Products] Update Product Failure',
  props<{ error: any }>()
);

// Delete Product
export const deleteProducts = createAction('[Products] Delete Products', props<{ ids: string[] }>());
export const deleteProductsSuccess = createAction(
  '[Products] Delete Products Success',
  props<{ ids: string[] }>()
);
export const deleteProductsFailure = createAction(
  '[Products] Delete Products Failure',
  props<{ error: any }>()
);
