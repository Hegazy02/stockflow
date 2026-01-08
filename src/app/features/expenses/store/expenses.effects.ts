import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { ExpensesService } from '../services/expenses.service';
import * as ExpensesActions from './expenses.actions';
import { Router } from '@angular/router';

@Injectable()
export class ExpensesEffects {
  loadExpenses$;
  getExpenseById$;
  createExpense$;
  updateExpense$;
  deleteExpenses$;
  loadStats$;

  constructor(
    private actions$: Actions,
    private expensesService: ExpensesService,
    private router: Router
  ) {
    this.loadExpenses$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ExpensesActions.loadExpenses),
        mergeMap((filters) =>
          this.expensesService.getAll(filters).pipe(
            map((response: any) =>
              ExpensesActions.loadExpensesSuccess({
                expenses: response.data,
                total: response.pagination.total,
                page: response.pagination.page,
                limit: response.pagination.limit,
                pages: response.pagination.pages,
              })
            ),
            catchError((error) => of(ExpensesActions.loadExpensesFailure({ error })))
          )
        )
      )
    );

    this.getExpenseById$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ExpensesActions.getExpenseById),
        mergeMap(({ id }) =>
          this.expensesService.getById(id).pipe(
            map((response: any) => ExpensesActions.getExpenseSuccess({ expense: response.data })),
            catchError((error) => of(ExpensesActions.loadExpensesFailure({ error })))
          )
        )
      )
    );

    this.createExpense$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ExpensesActions.createExpense),
        mergeMap(({ expense }) =>
          this.expensesService.create(expense).pipe(
            map((response: any) =>
              ExpensesActions.createExpenseSuccess({ expense: response.data })
            ),
            tap(() => this.router.navigate(['/expenses'])),
            catchError((error) => of(ExpensesActions.createExpenseFailure({ error })))
          )
        )
      )
    );

    this.updateExpense$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ExpensesActions.updateExpense),
        mergeMap(({ id, expense }) =>
          this.expensesService.update(id, expense).pipe(
            map((response: any) =>
              ExpensesActions.updateExpenseSuccess({ expense: response.data })
            ),
            tap(() => this.router.navigate(['/expenses'])),
            catchError((error) => of(ExpensesActions.updateExpenseFailure({ error })))
          )
        )
      )
    );

    this.deleteExpenses$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ExpensesActions.deleteExpenses),
        mergeMap(({ ids }) =>
          this.expensesService.delete(ids).pipe(
            map(() => ExpensesActions.deleteExpensesSuccess({ ids })),
            catchError((error) => of(ExpensesActions.deleteExpensesFailure({ error })))
          )
        )
      )
    );

    this.loadStats$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ExpensesActions.loadExpenseStats),
        mergeMap(({ startDate, endDate }) =>
          this.expensesService.getStats(startDate, endDate).pipe(
            map((response: any) =>
              ExpensesActions.loadExpenseStatsSuccess({ stats: response.data })
            ),
            catchError((error) => of(ExpensesActions.loadExpenseStatsFailure({ error })))
          )
        )
      )
    );
  }
}
