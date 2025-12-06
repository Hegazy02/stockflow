import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, tap } from 'rxjs/operators';
import { PartnerService } from '../services/partner.service';
import * as PartnersActions from './partners.actions';
import { Partner } from '../models/partner.model';

@Injectable()
export class PartnersEffects {
  loadPartners$;
  changePage$;
  getPartnerById$;
  createPartner$;
  updatePartner$;
  deletePartners$;
  navigateAfterSave$;

  constructor(
    private actions$: Actions,
    private partnerService: PartnerService,
    private router: Router
  ) {
    // Load Partners
    this.loadPartners$ = createEffect(() =>
      this.actions$.pipe(
        ofType(PartnersActions.loadPartners),
        exhaustMap((action) => {
          const page = action.page ?? 1;
          const limit = action.limit ?? 10;
          

          return this.partnerService
            .getAll({ page, limit, type: action.partnerType, name: action.name })
            .pipe(
              map((response) =>
                PartnersActions.loadPartnersSuccess({
                  partners: Array.isArray(response.data) ? response.data : [response.data],
                  pagination: response.pagination,
                })
              ),
              catchError((error) => of(PartnersActions.loadPartnersFailure({ error })))
            );
        })
      )
    );

    // Change Page
    this.changePage$ = createEffect(() =>
      this.actions$.pipe(
        ofType(PartnersActions.changePage),
        map((action) => PartnersActions.loadPartners({ page: action.page, limit: action.limit }))
      )
    );

    // Get Partner By ID
    this.getPartnerById$ = createEffect(() =>
      this.actions$.pipe(
        ofType(PartnersActions.getPartnerById),
        exhaustMap((action) =>
          this.partnerService.getById(action.id).pipe(
            map((response) =>
              PartnersActions.getPartnerByIdSuccess({ partner: response.data as Partner })
            ),
            catchError((error) => of(PartnersActions.getPartnerByIdFailure({ error })))
          )
        )
      )
    );

    // Create Partner
    this.createPartner$ = createEffect(() =>
      this.actions$.pipe(
        ofType(PartnersActions.createPartner),
        exhaustMap((action) =>
          this.partnerService.create(action.partner).pipe(
            map((partner) => PartnersActions.createPartnerSuccess({ partner })),
            catchError((error) => of(PartnersActions.createPartnerFailure({ error })))
          )
        )
      )
    );

    // Update Partner
    this.updatePartner$ = createEffect(() =>
      this.actions$.pipe(
        ofType(PartnersActions.updatePartner),
        exhaustMap((action) =>
          this.partnerService.update(action.partner).pipe(
            map((partner) => PartnersActions.updatePartnerSuccess({ partner })),
            catchError((error) => of(PartnersActions.updatePartnerFailure({ error })))
          )
        )
      )
    );

    // Delete Partners
    this.deletePartners$ = createEffect(() =>
      this.actions$.pipe(
        ofType(PartnersActions.deletePartners),
        exhaustMap((action) =>
          this.partnerService.delete(action.ids).pipe(
            map((ids) => PartnersActions.deletePartnersSuccess(ids)),
            catchError((error) => of(PartnersActions.deletePartnersFailure({ error })))
          )
        )
      )
    );

    // Navigate after Create/Update Partner
    this.navigateAfterSave$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(PartnersActions.updatePartnerSuccess, PartnersActions.createPartnerSuccess),
          tap(() => this.router.navigate(['/partners']))
        ),
      { dispatch: false }
    );
  }
}
