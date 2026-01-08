import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, tap } from 'rxjs/operators';
import { TransactionService } from '../services/transaction.service';
import * as TransactionsActions from './transactions.actions';
import { Transaction } from '../models/transaction.model';

@Injectable()
export class TransactionsEffects {
  LoadTransactions$;
  ChangePage$;
  GetTransactionById$;
  CreateTransaction$;
  UpdateTransaction$;
  DeleteTransactions$;
  ReturnTransaction$;
  navigateAfterSave$;

  constructor(
    private actions$: Actions,
    private transactionsService: TransactionService,
    private router: Router
  ) {
    // Load Transactions
    this.LoadTransactions$ = createEffect(() =>
      this.actions$.pipe(
        ofType(TransactionsActions.loadTransactions),
        exhaustMap((action) => {
          const { page, limit, partner, transactionType, serialNumber } = action;
          const params = { page, limit, partner, transactionType, serialNumber };

          return this.transactionsService.getAll(params).pipe(
            map((response) =>
              TransactionsActions.loadTransactionsSuccess({
                transactions: Array.isArray(response.data) ? response.data : [response.data],
                pagination: response.pagination,
              })
            ),
            catchError((error) => of(TransactionsActions.loadTransactionsFailure({ error })))
          );
        })
      )
    );

    // Change Page
    this.ChangePage$ = createEffect(() =>
      this.actions$.pipe(
        ofType(TransactionsActions.changePage),
        map((action) =>
          TransactionsActions.loadTransactions({ page: action.page, limit: action.limit })
        )
      )
    );

    // Get Transaction By ID
    this.GetTransactionById$ = createEffect(() =>
      this.actions$.pipe(
        ofType(TransactionsActions.getTransactionById),
        exhaustMap((action) =>
          this.transactionsService.getById(action.id).pipe(
            map((response) =>
              TransactionsActions.getTransactionByIdSuccess({
                transaction: response.data as Transaction,
              })
            ),
            catchError((error) => of(TransactionsActions.getTransactionByIdFailure({ error })))
          )
        )
      )
    );

    // Create Transaction
    this.CreateTransaction$ = createEffect(() =>
      this.actions$.pipe(
        ofType(TransactionsActions.createTransaction),
        exhaustMap((action) =>
          this.transactionsService.create(action.transaction).pipe(
            map((transaction) => TransactionsActions.createTransactionSuccess({ transaction })),
            catchError((error) => of(TransactionsActions.createTransactionFailure({ error })))
          )
        )
      )
    );

    // Update Transaction
    this.UpdateTransaction$ = createEffect(() =>
      this.actions$.pipe(
        ofType(TransactionsActions.updateTransaction),
        exhaustMap((action) =>
          this.transactionsService.update(action.id, action.transaction).pipe(
            map((transaction) => TransactionsActions.updateTransactionSuccess({ transaction })),
            catchError((error) => of(TransactionsActions.updateTransactionFailure({ error })))
          )
        )
      )
    );

    // Delete Transactions
    this.DeleteTransactions$ = createEffect(() =>
      this.actions$.pipe(
        ofType(TransactionsActions.deleteTransactions),
        exhaustMap((action) =>
          this.transactionsService.delete(action.ids).pipe(
            map((ids) => TransactionsActions.deleteTransactionsSuccess(ids)),
            catchError((error) => of(TransactionsActions.deleteTransactionsFailure({ error })))
          )
        )
      )
    );

    // Return Transaction
    this.ReturnTransaction$ = createEffect(() =>
      this.actions$.pipe(
        ofType(TransactionsActions.returnTransaction),
        exhaustMap((action) =>
          this.transactionsService.returnProducts(action.id, action.products).pipe(
            map((transaction) => TransactionsActions.returnTransactionSuccess({ transaction })),
            catchError((error) => of(TransactionsActions.returnTransactionFailure({ error })))
          )
        )
      )
    );

    // Navigate after Create/Update/Delete/Return Transaction
    this.navigateAfterSave$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(
            TransactionsActions.updateTransactionSuccess,
            TransactionsActions.createTransactionSuccess,
            TransactionsActions.deleteTransactionsSuccess,
            TransactionsActions.returnTransactionSuccess
          ),
          tap(() => this.router.navigate(['/transactions']))
        ),
      { dispatch: false }
    );
  }
}
