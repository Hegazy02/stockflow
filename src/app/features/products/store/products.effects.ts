import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, exhaustMap } from 'rxjs/operators';
import { ProductService } from '../services/product.service';
import * as ProductsActions from './products.actions';

@Injectable()
export class ProductsEffects {
  LoadProducts$;
  CreateProduct$;
  UpdateProduct$;
  DeleteProducts$;
  constructor(private actions$: Actions, private productsService: ProductService) {
    // Load Products
    this.LoadProducts$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProductsActions.loadProducts),
        exhaustMap(() =>
          this.productsService.getAll().pipe(
            map((products) => ProductsActions.loadProductsSuccess({ products })),
            catchError((error) => of(ProductsActions.loadProductsFailure({ error })))
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
  }
}
