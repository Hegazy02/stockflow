import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, tap } from 'rxjs/operators';
import { ProductService } from '../services/product.service';
import * as ProductsActions from './products.actions';
import { Product } from '../models/product.model';
import { Router } from '@angular/router';

@Injectable()
export class ProductsEffects {
  LoadProducts$;
  ChangePage$;
  GetProductById$;
  CreateProduct$;
  UpdateProduct$;
  DeleteProducts$;
  navigateAfterSave$;
  constructor(
    private actions$: Actions,
    private productsService: ProductService,
    private router: Router
  ) {
    /* 
      🥇 Best Practice (NgRx Team Recommendation)

      ✔ Move navigation, notifications, logging, dialogs into Effects
      ✔ Keep components clean — no action subscriptions
      ✔ Use takeUntilDestroyed() inside components when needed
      ✔ Effects do NOT need takeUntilDestroyed()
 */
    // Load Products
    this.LoadProducts$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProductsActions.loadProducts),
        // exhaustMap cancel new request if the old one didn't finish yet
        exhaustMap((action) => {
          const page = action.page ?? 1;
          const limit = action.limit ?? 10;

          return this.productsService.getAll(page, limit).pipe(
            map((response) =>
              ProductsActions.loadProductsSuccess({
                products: response.data as Product[],
                pagination: response.pagination,
              })
            ),
            catchError((error) => of(ProductsActions.loadProductsFailure({ error })))
          );
        })
      )
    );

    // Change Page
    this.ChangePage$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProductsActions.changePage),
        map((action) => ProductsActions.loadProducts({ page: action.page, limit: action.limit }))
      )
    );

    // Get Product By ID
    this.GetProductById$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProductsActions.getProductById),
        exhaustMap((action) =>
          this.productsService.getById(action.id).pipe(
            map((response) =>
              ProductsActions.getProductByIdSuccess({ product: response.data as Product })
            ),
            catchError((error) => of(ProductsActions.getProductByIdFailure({ error })))
          )
        )
      )
    );

    // Create Product
    this.CreateProduct$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProductsActions.createProduct),
        exhaustMap((action) =>
          this.productsService.create(action.product).pipe(
            map((product) => ProductsActions.createProductSuccess({ product })),
            catchError((error) => of(ProductsActions.createProductFailure({ error })))
          )
        )
      )
    );

    // Update Product
    this.UpdateProduct$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProductsActions.updateProduct),
        exhaustMap((action) =>
          this.productsService.update(action.product).pipe(
            map((product) => ProductsActions.updateProductSuccess({ product })),
            catchError((error) => of(ProductsActions.updateProductFailure({ error })))
          )
        )
      )
    );

    // Delete Products
    this.DeleteProducts$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProductsActions.deleteProducts),
        exhaustMap((action) =>
          this.productsService.delete(action.ids).pipe(
            map((ids) => ProductsActions.deleteProductsSuccess(ids)),
            catchError((error) => of(ProductsActions.deleteProductsFailure({ error })))
          )
        )
      )
    );
    // Navigate after Create/Update Product
    this.navigateAfterSave$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(ProductsActions.updateProductSuccess, ProductsActions.createProductSuccess),
          tap(() => this.router.navigate(['/products']))
        ),
      { dispatch: false } // 🚫 "This effect does not dispatch any new actions."
    );
  }
}
