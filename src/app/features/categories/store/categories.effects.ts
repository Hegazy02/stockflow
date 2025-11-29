import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, tap } from 'rxjs/operators';
import { CategoryService } from '../services/category.service';
import * as CategoriesActions from './categories.actions';
import { Category } from '../models/category.model';

@Injectable()
export class CategoriesEffects {
  loadCategories$;
  getCategoryById$;
  createCategory$;
  updateCategory$;
  deleteCategories$;
  navigateAfterSave$;

  constructor(
    private actions$: Actions,
    private categoryService: CategoryService,
    private router: Router
  ) {
    // Load Categories
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

    // Get Category By ID
    this.getCategoryById$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CategoriesActions.getCategoryById),
        exhaustMap((action) =>
          this.categoryService.getById(action.id).pipe(
            map((response) =>
              CategoriesActions.getCategoryByIdSuccess({ category: response.data as Category })
            ),
            catchError((error) => of(CategoriesActions.getCategoryByIdFailure({ error })))
          )
        )
      )
    );

    // Create Category
    this.createCategory$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CategoriesActions.createCategory),
        exhaustMap((action) =>
          this.categoryService.create(action.category).pipe(
            map((category) => CategoriesActions.createCategorySuccess({ category })),
            catchError((error) => of(CategoriesActions.createCategoryFailure({ error })))
          )
        )
      )
    );

    // Update Category
    this.updateCategory$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CategoriesActions.updateCategory),
        exhaustMap((action) =>
          this.categoryService.update(action.category).pipe(
            map((category) => CategoriesActions.updateCategorySuccess({ category })),
            catchError((error) => of(CategoriesActions.updateCategoryFailure({ error })))
          )
        )
      )
    );

    // Delete Categories
    this.deleteCategories$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CategoriesActions.deleteCategories),
        exhaustMap((action) =>
          this.categoryService.delete(action.ids).pipe(
            map((ids) => CategoriesActions.deleteCategoriesSuccess(ids)),
            catchError((error) => of(CategoriesActions.deleteCategoriesFailure({ error })))
          )
        )
      )
    );

    // Navigate after Create/Update Category
    this.navigateAfterSave$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(CategoriesActions.updateCategorySuccess, CategoriesActions.createCategorySuccess),
          tap(() => this.router.navigate(['/categories']))
        ),
      { dispatch: false }
    );
  }
}
