import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Transaction } from '../models/transaction.model';
import { Pagination } from '../../../core/models/api-response';
import * as TransactionsActions from './transactions.actions';

export interface TransactionsState extends EntityState<Transaction> {
  loading: boolean;
  error: any;
  pagination: Pagination;
}

export const transactionsAdapter: EntityAdapter<Transaction> = createEntityAdapter<Transaction>({
  selectId: (transaction: Transaction) => transaction._id,
  sortComparer: false,
});

export const initialState: TransactionsState = transactionsAdapter.getInitialState({
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
});

export const transactionsReducer = createReducer(
  initialState,
  // Load Transactions
  on(TransactionsActions.loadTransactions, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TransactionsActions.loadTransactionsSuccess, (state, { transactions, pagination }) =>
    transactionsAdapter.setAll(transactions, {
      ...state,
      loading: false,
      error: null,
      pagination,
    })
  ),
  on(TransactionsActions.loadTransactionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Get Transaction By ID
  on(TransactionsActions.getTransactionById, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TransactionsActions.getTransactionByIdSuccess, (state, { transaction }) =>
    transactionsAdapter.upsertOne(transaction, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(TransactionsActions.getTransactionByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Transaction
  on(TransactionsActions.createTransaction, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TransactionsActions.createTransactionSuccess, (state, { transaction }) =>
    transactionsAdapter.addOne(transaction, { ...state, loading: false, error: null })
  ),
  on(TransactionsActions.createTransactionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Transaction
  on(TransactionsActions.updateTransaction, (state) => ({ ...state, loading: true, error: null })),
  on(TransactionsActions.updateTransactionSuccess, (state, { transaction }) =>
    transactionsAdapter.updateOne(
      {
        id: transaction._id,
        changes: transaction,
      },
      {
        ...state,
        loading: false,
        error: null,
      }
    )
  ),
  on(TransactionsActions.updateTransactionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Transactions
  on(TransactionsActions.deleteTransactions, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TransactionsActions.deleteTransactionsSuccess, (state, { ids }) =>
    transactionsAdapter.removeMany(ids, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(TransactionsActions.deleteTransactionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Return Transaction
  on(TransactionsActions.returnTransaction, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TransactionsActions.returnTransactionSuccess, (state, { transaction }) =>
    transactionsAdapter.upsertOne(transaction, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(TransactionsActions.returnTransactionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
