import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TransactionsState, transactionsAdapter } from './transactions.reducer';

export const selectTransactionsState = createFeatureSelector<TransactionsState>('transactions');

const { selectAll, selectEntities } = transactionsAdapter.getSelectors();

export const selectAllTransactions = createSelector(selectTransactionsState, selectAll);

export const selectTransactionEntities = createSelector(selectTransactionsState, selectEntities);

export const selectTransactionsLoading = createSelector(
  selectTransactionsState,
  (state) => state.loading
);

export const selectTransactionsError = createSelector(
  selectTransactionsState,
  (state) => state.error
);

export const selectTransactionsPagination = createSelector(
  selectTransactionsState,
  (state) => state.pagination
);

export const selectTotalRecords = createSelector(
  selectTransactionsPagination,
  (pagination) => pagination.total
);

export const selectCurrentPage = createSelector(
  selectTransactionsPagination,
  (pagination) => pagination.page
);

export const selectPageSize = createSelector(
  selectTransactionsPagination,
  (pagination) => pagination.limit
);

export const selectTransactionById = (id: string) =>
  createSelector(selectTransactionEntities, (entities) => entities[id]);
