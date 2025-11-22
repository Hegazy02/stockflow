import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { selectAllProducts, selectProductsLoading, selectProductsError } from '../../store/products.selectors';
import { loadProducts, deleteProducts } from '../../store/products.actions';
import { DataTableComponent, TableColumn, TableAction } from '../../../../shared/components/data-table/data-table.component';
import { Eye, Edit, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  
  products: Product[] = [];
  loading: boolean = false;

  // Table configuration
  columns: TableColumn[] = [
    { field: 'name', header: 'Product Name', sortable: true, width: '25%' },
    { field: 'sku', header: 'SKU', sortable: true, width: '10%' },
    { field: 'category', header: 'Category', sortable: true, width: '20%' },
    { field: 'description', header: 'Description', sortable: false, width: '30%' },
    { field: 'createdAt', header: 'Created', sortable: true, width: '15%', type: 'date', dateFormat: 'short' }
  ];

  actions: TableAction[] = [
    {
      icon: Eye,
      label: 'View',
      styleClass: 'btn-view',
      command: (rowData: Product) => this.navigateToDetail(rowData.id)
    },
    {
      icon: Edit,
      label: 'Edit',
      styleClass: 'btn-edit',
      command: (rowData: Product) => this.navigateToEdit(rowData.id)
    },
    {
      icon: Trash2,
      label: 'Delete',
      styleClass: 'btn-delete',
      command: (rowData: Product) => this.deleteProduct(rowData.id)
    }
  ];

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
    
    // Subscribe to products and loading state
    this.products$.subscribe(products => this.products = products);
    this.loading$.subscribe(loading => this.loading = loading);
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

  deleteProduct(productId: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.store.dispatch(deleteProducts({ ids: [productId] }));
    }
  }
}
