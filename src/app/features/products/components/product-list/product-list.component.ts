import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import {
  selectAllProducts,
  selectProductsLoading,
  selectProductsError,
} from '../../store/products.selectors';
import { loadProducts, deleteProducts } from '../../store/products.actions';
import {
  DataTableComponent,
  TableColumn,
  TableAction,
  FilterChange,
} from '../../../../shared/components/data-table/data-table.component';
import { Eye, Edit, Trash2 } from 'lucide-angular';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent, ConfirmDialogComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;

  products: Product[] = [];
  loading: boolean = false;
  selectedProducts: Product[] = [];

  // Dialog state
  showDeleteDialog = false;
  showBulkDeleteDialog = false;
  productToDelete: Product | null = null;

  // Table configuration
  columns: TableColumn[] = [
    { field: 'name', header: 'Product Name', width: '25%', filterable: true },
    { field: 'sku', header: 'SKU', width: '10%' },
    { field: 'category', header: 'Category', width: '20%', filterable: true },
    { field: 'description', header: 'Description', width: '30%' },
    {
      field: 'createdAt',
      header: 'Created',
      width: '15%',
      type: 'date',
      dateFormat: 'short',
    },
  ];

  actions: TableAction[] = [
    {
      icon: Eye,
      label: 'View',
      styleClass: 'btn-view',
      command: (rowData: Product) => this.navigateToDetail(rowData.id),
    },
    {
      icon: Edit,
      label: 'Edit',
      styleClass: 'btn-edit',
      command: (rowData: Product) => this.navigateToEdit(rowData.id),
    },
    {
      icon: Trash2,
      label: 'Delete',
      styleClass: 'btn-delete',
      command: (rowData: Product) => this.confirmDeleteProduct(rowData.id),
    },
  ];

  constructor(private store: Store, private router: Router) {
    this.products$ = this.store.select(selectAllProducts);
    this.loading$ = this.store.select(selectProductsLoading);
    this.error$ = this.store.select(selectProductsError);
  }

  ngOnInit(): void {
    this.store.dispatch(loadProducts());

    // Subscribe to products and loading state
    this.products$.subscribe((products) => (this.products = products));
    this.loading$.subscribe((loading) => (this.loading = loading));
  }
  onFilterChange(filterChange: FilterChange) {
    console.log('filter', filterChange);

    // Api request with switchMerge and delay 500 using ProductsService
  }
  onRowSelect(rows: any) {
    this.selectedProducts = rows;
  }

  confirmBulkDelete(): void {
    if (this.selectedProducts.length === 0) {
      return;
    }
    this.showBulkDeleteDialog = true;
  }

  bulkDeleteProducts(): void {
    const ids = this.selectedProducts.map((p) => p.id);
    this.store.dispatch(deleteProducts({ ids }));
    this.selectedProducts = [];
    this.showBulkDeleteDialog = false;
  }

  cancelBulkDelete(): void {
    this.showBulkDeleteDialog = false;
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

  confirmDeleteProduct(productId: string): void {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      this.productToDelete = product;
      this.showDeleteDialog = true;
    }
  }

  deleteProduct(): void {
    if (this.productToDelete) {
      this.store.dispatch(deleteProducts({ ids: [this.productToDelete.id] }));
      this.productToDelete = null;
      this.showDeleteDialog = false;
    }
  }

  cancelDelete(): void {
    this.productToDelete = null;
    this.showDeleteDialog = false;
  }
}
