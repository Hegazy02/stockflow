import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, exhaustMap } from 'rxjs/operators';
import { CategoryService } from '../services/category.service';
import * as CategoriesActions from './categories.actions';
import { Category } from '../models/category.model';

@Injectable()
export class CategoriesEffects {
  loadCategories$;
  constructor(private actions$: Actions, private categoryService: CategoryService) {
    this.loadCategories$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CategoriesActions.loadCategories),
        exhaustMap(() =>
          this.categoryService.getAll().pipe(
            map((response) =>
              CategoriesActions.loadCategoriesSuccess({ categories: response.data as Category[] })
            ),
            catchError((error) => of(CategoriesActions.loadCategoriesFailure({ error })))
          )
        )
      )
    );
  }
}
