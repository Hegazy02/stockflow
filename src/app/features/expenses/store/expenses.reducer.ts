import { createReducer, on } from '@ngrx/store';
import { Expense, ExpenseStats } from '../models/expense.model';
import * as ExpensesActions from './expenses.actions';
import { Pagination } from '../../../core/models/api-response';

export interface ExpensesState {
  expenses: Expense[];
  selectedExpense: Expense | null;
  stats: ExpenseStats | null;
  loading: boolean;
  error: any;
  pagination: Pagination;
}

export const initialState: ExpensesState = {
  expenses: [],
  selectedExpense: null,
  stats: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  },
};

export const expensesReducer = createReducer(
  initialState,

  // Load Expenses
  on(ExpensesActions.loadExpenses, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ExpensesActions.loadExpensesSuccess, (state, { expenses, total, page, limit, pages }) => ({
    ...state,
    expenses,
    pagination: { total, page, limit, pages },
    loading: false,
  })),
  on(ExpensesActions.loadExpensesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Get Single Expense
  on(ExpensesActions.getExpenseById, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ExpensesActions.getExpenseSuccess, (state, { expense }) => ({
    ...state,
    selectedExpense: expense,
    loading: false,
  })),

  // Create Expense
  on(ExpensesActions.createExpense, (state) => ({
    ...state,
    loading: true,
  })),
  on(ExpensesActions.createExpenseSuccess, (state, { expense }) => ({
    ...state,
    expenses: [expense, ...state.expenses],
    loading: false,
  })),
  on(ExpensesActions.createExpenseFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Expense
  on(ExpensesActions.updateExpense, (state) => ({
    ...state,
    loading: true,
  })),
  on(ExpensesActions.updateExpenseSuccess, (state, { expense }) => ({
    ...state,
    expenses: state.expenses.map((e) => (e._id === expense._id ? expense : e)),
    selectedExpense: state.selectedExpense?._id === expense._id ? expense : state.selectedExpense,
    loading: false,
  })),
  on(ExpensesActions.updateExpenseFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Expenses
  on(ExpensesActions.deleteExpenses, (state) => ({
    ...state,
    loading: true,
  })),
  on(ExpensesActions.deleteExpensesSuccess, (state, { ids }) => ({
    ...state,
    expenses: state.expenses.filter((e) => !ids.includes(e._id)),
    loading: false,
  })),
  on(ExpensesActions.deleteExpensesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Stats
  on(ExpensesActions.loadExpenseStats, (state) => ({
    ...state,
    loading: true,
  })),
  on(ExpensesActions.loadExpenseStatsSuccess, (state, { stats }) => ({
    ...state,
    stats,
    loading: false,
  })),
  on(ExpensesActions.loadExpenseStatsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
