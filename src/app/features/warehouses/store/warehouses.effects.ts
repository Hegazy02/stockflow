import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, tap } from 'rxjs/operators';
import { WarehouseService } from '../services/warehouse.service';
import * as WarehousesActions from './warehouses.actions';
import { WarehouseManager } from '../models/warehouse.model';

@Injectable()
export class WarehousesEffects {
  LoadWarehouseManagers$;
  LoadWarehouses$;
  ChangePage$;
  GetWarehouseById$;
  CreateWarehouse$;
  UpdateWarehouse$;
  DeleteWarehouses$;
  navigateAfterSave$;

  constructor(
    private actions$: Actions,
    private warehousesService: WarehouseService,
    private router: Router
  ) {
    // Load Warehouse Managers
    this.LoadWarehouseManagers$ = createEffect(() =>
      this.actions$.pipe(
        ofType(WarehousesActions.loadWarehouseManagers),
        exhaustMap(() =>
          this.warehousesService.getManagers().pipe(
            map((response) =>
              WarehousesActions.loadWarehouseManagersSuccess({
                managers: response.data as WarehouseManager[],
              })
            ),
            catchError((error) => of(WarehousesActions.loadWarehouseManagersFailure({ error })))
          )
        )
      )
    );

    // Load Warehouses
    this.LoadWarehouses$ = createEffect(() =>
      this.actions$.pipe(
        ofType(WarehousesActions.loadWarehouses),
        exhaustMap((action) => {
          const page = action.page ?? 1;
          const limit = action.limit ?? 10;

          return this.warehousesService.getAll(page, limit).pipe(
            map((response) =>
              WarehousesActions.loadWarehousesSuccess({
                warehouses: Array.isArray(response.data) ? response.data : [response.data],
                pagination: response.pagination,
              })
            ),
            catchError((error) => of(WarehousesActions.loadWarehousesFailure({ error })))
          );
        })
      )
    );

    // Change Page
    this.ChangePage$ = createEffect(() =>
      this.actions$.pipe(
        ofType(WarehousesActions.changePage),
        map((action) =>
          WarehousesActions.loadWarehouses({ page: action.page, limit: action.limit })
        )
      )
    );

    // Get Warehouse By ID
    this.GetWarehouseById$ = createEffect(() =>
      this.actions$.pipe(
        ofType(WarehousesActions.getWarehouseById),
        exhaustMap((action) =>
          this.warehousesService.getById(action.id).pipe(
            map((warehouse) => WarehousesActions.getWarehouseByIdSuccess({ warehouse })),
            catchError((error) => of(WarehousesActions.getWarehouseByIdFailure({ error })))
          )
        )
      )
    );

    // Create Warehouse
    this.CreateWarehouse$ = createEffect(() =>
      this.actions$.pipe(
        ofType(WarehousesActions.createWarehouse),
        exhaustMap((action) =>
          this.warehousesService.create(action.warehouse).pipe(
            map((warehouse) => WarehousesActions.createWarehouseSuccess({ warehouse })),
            catchError((error) => of(WarehousesActions.createWarehouseFailure({ error })))
          )
        )
      )
    );

    // Update Warehouse
    this.UpdateWarehouse$ = createEffect(() =>
      this.actions$.pipe(
        ofType(WarehousesActions.updateWarehouse),
        exhaustMap((action) =>
          this.warehousesService.update(action.warehouse).pipe(
            map((warehouse) => WarehousesActions.updateWarehouseSuccess({ warehouse })),
            catchError((error) => of(WarehousesActions.updateWarehouseFailure({ error })))
          )
        )
      )
    );

    // Delete Warehouses
    this.DeleteWarehouses$ = createEffect(() =>
      this.actions$.pipe(
        ofType(WarehousesActions.deleteWarehouses),
        exhaustMap((action) =>
          this.warehousesService.delete(action.ids).pipe(
            map((ids) => WarehousesActions.deleteWarehousesSuccess(ids)),
            catchError((error) => of(WarehousesActions.deleteWarehousesFailure({ error })))
          )
        )
      )
    );

    // Navigate after Create/Update Warehouse
    this.navigateAfterSave$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(
            WarehousesActions.updateWarehouseSuccess,
            WarehousesActions.createWarehouseSuccess
          ),
          tap(() => this.router.navigate(['/warehouses']))
        ),
      { dispatch: false }
    );
  }
}
