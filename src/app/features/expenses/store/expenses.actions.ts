import { createAction, props } from '@ngrx/store';
import { Expense, ExpenseFormBody, ExpenseStats, ExpenseFilters } from '../models/expense.model';

// Load Expenses
export const loadExpenses = createAction('[Expenses] Load Expenses', props<ExpenseFilters>());

export const loadExpensesSuccess = createAction(
  '[Expenses] Load Expenses Success',
  props<{ expenses: Expense[]; total: number; page: number; limit: number; pages: number }>()
);

export const loadExpensesFailure = createAction(
  '[Expenses] Load Expenses Failure',
  props<{ error: any }>()
);

// Get Single Expense
export const getExpenseById = createAction('[Expenses] Get Expense By Id', props<{ id: string }>());

export const getExpenseSuccess = createAction(
  '[Expenses] Get Expense Success',
  props<{ expense: Expense }>()
);

// Create Expense
export const createExpense = createAction(
  '[Expenses] Create Expense',
  props<{ expense: ExpenseFormBody }>()
);

export const createExpenseSuccess = createAction(
  '[Expenses] Create Expense Success',
  props<{ expense: Expense }>()
);

export const createExpenseFailure = createAction(
  '[Expenses] Create Expense Failure',
  props<{ error: any }>()
);

// Update Expense
export const updateExpense = createAction(
  '[Expenses] Update Expense',
  props<{ id: string; expense: Partial<ExpenseFormBody> }>()
);

export const updateExpenseSuccess = createAction(
  '[Expenses] Update Expense Success',
  props<{ expense: Expense }>()
);

export const updateExpenseFailure = createAction(
  '[Expenses] Update Expense Failure',
  props<{ error: any }>()
);

// Delete Expenses
export const deleteExpenses = createAction(
  '[Expenses] Delete Expenses',
  props<{ ids: string[] }>()
);

export const deleteExpensesSuccess = createAction(
  '[Expenses] Delete Expenses Success',
  props<{ ids: string[] }>()
);

export const deleteExpensesFailure = createAction(
  '[Expenses] Delete Expenses Failure',
  props<{ error: any }>()
);

// Stats
export const loadExpenseStats = createAction(
  '[Expenses] Load Stats',
  props<{ startDate?: string; endDate?: string }>()
);

export const loadExpenseStatsSuccess = createAction(
  '[Expenses] Load Stats Success',
  props<{ stats: ExpenseStats }>()
);

export const loadExpenseStatsFailure = createAction(
  '[Expenses] Load Stats Failure',
  props<{ error: any }>()
);
