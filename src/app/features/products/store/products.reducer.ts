import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Product } from '../models/product.model';
import { Pagination } from '../../../core/models/api-response';
import * as ProductsActions from './products.actions';

// Model == Entity

// Entity State (Model State)
export interface ProductsState extends EntityState<Product> {
  selectedProductId: string | null;
  loading: boolean;
  error: any;
  pagination: Pagination;
}

// Entity Adapter (Model Adapter)
export const productsAdapter: EntityAdapter<Product> = createEntityAdapter<Product>({
  selectId: (product: Product) => product._id,
  sortComparer: false,
});

// Entity Initial State (Model Initial State)
export const initialState: ProductsState = productsAdapter.getInitialState({
  selectedProductId: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
});

// Reducers
export const productsReducer = createReducer(
  initialState,
  // Load Products
  on(ProductsActions.loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProductsActions.loadProductsSuccess, (state, { products, pagination }) =>
    productsAdapter.setAll(products, {
      ...state,
      loading: false,
      error: null,
      pagination,
    })
  ),
  on(ProductsActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Product
  on(ProductsActions.createProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProductsActions.createProductSuccess, (state, { product }) =>
    productsAdapter.addOne(product, { ...state, loading: false, error: null })
  ),
  on(ProductsActions.createProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Get Product By ID
  on(ProductsActions.getProductById, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProductsActions.getProductByIdSuccess, (state, { product }) =>
    productsAdapter.upsertOne(product, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(ProductsActions.getProductByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Product
  on(ProductsActions.updateProduct, (state) => ({ ...state, loading: true, error: null })),
  on(ProductsActions.updateProductSuccess, (state, { product }) =>
    productsAdapter.updateOne(
      {
        id: product._id,
        changes: product,
      },
      {
        ...state,
        loading: false,
        error: null,
      }
    )
  ),
  on(ProductsActions.updateProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Product
  on(ProductsActions.deleteProducts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProductsActions.deleteProductsSuccess, (state, { ids }) =>
    productsAdapter.removeMany(ids, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(ProductsActions.deleteProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
