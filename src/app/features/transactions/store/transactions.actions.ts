import { createAction, props } from '@ngrx/store';
import { Transaction, TransactionFormData } from '../models/transaction.model';
import { Pagination } from '../../../core/models/api-response';

// Load Transactions
export const loadTransactions = createAction(
  '[Transactions] Load Transactions',
  props<{
    page?: number;
    limit?: number;
    partner?: string;
    transactionType?: string;
    serialNumber?: string;
  }>()
);
export const loadTransactionsSuccess = createAction(
  '[Transactions] Load Transactions Success',
  props<{ transactions: Transaction[]; pagination: Pagination }>()
);
export const loadTransactionsFailure = createAction(
  '[Transactions] Load Transactions Failure',
  props<{ error: any }>()
);

// Change Page
export const changePage = createAction(
  '[Transactions] Change Page',
  props<{ page: number; limit: number }>()
);

// Get Transaction By ID
export const getTransactionById = createAction(
  '[Transactions] Get Transaction By ID',
  props<{ id: string }>()
);
export const getTransactionByIdSuccess = createAction(
  '[Transactions] Get Transaction By ID Success',
  props<{ transaction: Transaction }>()
);
export const getTransactionByIdFailure = createAction(
  '[Transactions] Get Transaction By ID Failure',
  props<{ error: any }>()
);

// Create Transaction
export const createTransaction = createAction(
  '[Transactions] Create Transaction',
  props<{ transaction: TransactionFormData }>()
);
export const createTransactionSuccess = createAction(
  '[Transactions] Create Transaction Success',
  props<{ transaction: Transaction }>()
);
export const createTransactionFailure = createAction(
  '[Transactions] Create Transaction Failure',
  props<{ error: any }>()
);

// Update Transaction
export const updateTransaction = createAction(
  '[Transactions] Update Transaction',
  props<{ id: string; transaction: TransactionFormData }>()
);
export const updateTransactionSuccess = createAction(
  '[Transactions] Update Transaction Success',
  props<{ transaction: Transaction }>()
);
export const updateTransactionFailure = createAction(
  '[Transactions] Update Transaction Failure',
  props<{ error: any }>()
);

// Delete Transactions
export const deleteTransactions = createAction(
  '[Transactions] Delete Transactions',
  props<{ ids: string[] }>()
);
export const deleteTransactionsSuccess = createAction(
  '[Transactions] Delete Transactions Success',
  props<{ ids: string[] }>()
);
export const deleteTransactionsFailure = createAction(
  '[Transactions] Delete Transactions Failure',
  props<{ error: any }>()
);

// Return Transaction
export const returnTransaction = createAction(
  '[Transactions] Return Transaction',
  props<{
    id: string;
    products: {
      productId: string;
      quantity: number;
    }[];
  }>()
);
export const returnTransactionSuccess = createAction(
  '[Transactions] Return Transaction Success',
  props<{ transaction: Transaction }>()
);
export const returnTransactionFailure = createAction(
  '[Transactions] Return Transaction Failure',
  props<{ error: any }>()
);
