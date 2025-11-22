import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { selectAllProducts, selectProductsLoading, selectProductsError } from '../../store/products.selectors';
import { loadProducts } from '../../store/products.actions';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;

  constructor(
    private store: Store,
    private router: Router
  ) {
    this.products$ = this.store.select(selectAllProducts);
    this.loading$ = this.store.select(selectProductsLoading);
    this.error$ = this.store.select(selectProductsError);
  }

  ngOnInit(): void {
    this.store.dispatch(loadProducts());
  }

  navigateToDetail(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  navigateToEdit(productId: string): void {
    this.router.navigate(['/products', productId, 'edit']);
  }

  navigateToCreate(): void {
    this.router.navigate(['/products', 'new']);
  }

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }
}
