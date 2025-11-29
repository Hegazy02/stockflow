import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, tap } from 'rxjs/operators';
import { UnitService } from '../services/unit.service';
import * as UnitsActions from './units.actions';
import { Unit } from '../models/unit.model';

@Injectable()
export class UnitsEffects {
  LoadUnits$;
  ChangePage$;
  GetUnitById$;
  CreateUnit$;
  UpdateUnit$;
  DeleteUnits$;
  navigateAfterSave$;

  constructor(
    private actions$: Actions,
    private unitsService: UnitService,
    private router: Router
  ) {
    // Load Units
    this.LoadUnits$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UnitsActions.loadUnits),
        exhaustMap((action) => {
          const { page, limit, name } = action;
          const params = { page, limit, name };

          return this.unitsService.getAll(params).pipe(
            map((response) =>
              UnitsActions.loadUnitsSuccess({
                units: Array.isArray(response.data) ? response.data : [response.data],
                pagination: response.pagination,
              })
            ),
            catchError((error) => of(UnitsActions.loadUnitsFailure({ error })))
          );
        })
      )
    );

    // Change Page
    this.ChangePage$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UnitsActions.changePage),
        map((action) => UnitsActions.loadUnits({ page: action.page, limit: action.limit }))
      )
    );

    // Get Unit By ID
    this.GetUnitById$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UnitsActions.getUnitById),
        exhaustMap((action) =>
          this.unitsService.getById(action.id).pipe(
            map((unit) => UnitsActions.getUnitByIdSuccess({ unit })),
            catchError((error) => of(UnitsActions.getUnitByIdFailure({ error })))
          )
        )
      )
    );

    // Create Unit
    this.CreateUnit$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UnitsActions.createUnit),
        exhaustMap((action) =>
          this.unitsService.create(action.unit).pipe(
            map((unit) => UnitsActions.createUnitSuccess({ unit })),
            catchError((error) => of(UnitsActions.createUnitFailure({ error })))
          )
        )
      )
    );

    // Update Unit
    this.UpdateUnit$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UnitsActions.updateUnit),
        exhaustMap((action) =>
          this.unitsService.update(action.unit).pipe(
            map((unit) => UnitsActions.updateUnitSuccess({ unit })),
            catchError((error) => of(UnitsActions.updateUnitFailure({ error })))
          )
        )
      )
    );

    // Delete Units
    this.DeleteUnits$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UnitsActions.deleteUnits),
        exhaustMap((action) =>
          this.unitsService.delete(action.ids).pipe(
            map((ids) => UnitsActions.deleteUnitsSuccess(ids)),
            catchError((error) => of(UnitsActions.deleteUnitsFailure({ error })))
          )
        )
      )
    );

    // Navigate after Create/Update Unit
    this.navigateAfterSave$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(UnitsActions.updateUnitSuccess, UnitsActions.createUnitSuccess),
          tap(() => this.router.navigate(['/units']))
        ),
      { dispatch: false }
    );
  }
}
