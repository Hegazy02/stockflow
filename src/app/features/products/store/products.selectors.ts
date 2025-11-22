import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState, productsAdapter } from './products.reducer';

// selects the products slice from the store
export const selectProductsState = createFeatureSelector<ProductsState>('products');

// NgRx Entity getSelectors() provides basic helper functions (selectAll, selectEntities, etc.).
const { selectAll, selectEntities, selectIds, selectTotal } = productsAdapter.getSelectors();

// We wrap those helpers with createSelector to produce custom selectors that components can use.
// Components subscribe to these selectors.
// ✅ Result: Components stay simple and don’t care about how state is stored internally.
export const selectAllProducts = createSelector(
  selectProductsState,
  selectAll
);

export const selectProductEntities = createSelector(
  selectProductsState,
  selectEntities
);

export const selectProductIds = createSelector(
  selectProductsState,
  selectIds
);

export const selectProductsTotal = createSelector(
  selectProductsState,
  selectTotal
);

export const selectProductById = (id: string) =>
  createSelector(selectProductEntities, (entities) => entities[id]);

export const selectProductsLoading = createSelector(
  selectProductsState,
  (state) => state.loading
);

export const selectProductsError = createSelector(
  selectProductsState,
  (state) => state.error
);

export const selectSelectedProductId = createSelector(
  selectProductsState,
  (state) => state.selectedProductId
);
