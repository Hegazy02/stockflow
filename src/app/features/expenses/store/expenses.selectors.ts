import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ExpensesState } from './expenses.reducer';

export const selectExpensesState = createFeatureSelector<ExpensesState>('expenses');

export const selectAllExpenses = createSelector(
  selectExpensesState,
  (state: ExpensesState) => state.expenses
);

export const selectSelectedExpense = createSelector(
  selectExpensesState,
  (state: ExpensesState) => state.selectedExpense
);

export const selectExpenseById = (id: string) =>
  createSelector(selectAllExpenses, (expenses) => expenses.find((e) => e._id === id));

export const selectExpensesLoading = createSelector(
  selectExpensesState,
  (state: ExpensesState) => state.loading
);

export const selectExpensesError = createSelector(
  selectExpensesState,
  (state: ExpensesState) => state.error
);

export const selectExpensesPagination = createSelector(
  selectExpensesState,
  (state: ExpensesState) => state.pagination
);

export const selectTotalRecords = createSelector(
  selectExpensesPagination,
  (pagination) => pagination.total
);

export const selectCurrentPage = createSelector(
  selectExpensesPagination,
  (pagination) => pagination.page
);

export const selectPageSize = createSelector(
  selectExpensesPagination,
  (pagination) => pagination.limit
);

export const selectExpenseStats = createSelector(
  selectExpensesState,
  (state: ExpensesState) => state.stats
);
