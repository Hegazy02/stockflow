import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { Product } from '../../models/product.model';
import { Pagination } from '../../../../core/models/api-response';
import {
  selectAllProducts,
  selectProductsLoading,
  selectProductsError,
  selectProductsPagination,
  selectTotalRecords,
  selectCurrentPage,
  selectPageSize,
} from '../../store/products.selectors';
import { loadProducts, deleteProducts, changePage } from '../../store/products.actions';
import {
  DataTableComponent,
  TableColumn,
  TableAction,
  FilterChange,
  PageChangeEvent,
} from '../../../../shared/components/data-table/data-table.component';
import { Eye, Edit, Trash2 } from 'lucide-angular';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent, ConfirmDialogComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  pagination$: Observable<Pagination>;
  totalRecords$: Observable<number>;
  currentPage$: Observable<number>;
  pageSize$: Observable<number>;

  products: Product[] = [];
  selectedProducts: Product[] = [];

  // Dialog state
  showDeleteDialog = false;
  showBulkDeleteDialog = false;
  productToDelete: Product | null = null;

  // Table configuration
  columns: TableColumn[] = [
    { field: 'name', header: 'Product Name', width: '25%', filterable: true },
    { field: 'sku', header: 'SKU', width: '10%' },
    { field: 'category.name', header: 'Category', width: '20%', filterable: true },
    { field: 'description', header: 'Description', width: '25%' },
    {
      field: 'createdAt',
      header: 'Created',
      width: '20%',
      type: 'date',
      dateFormat: 'short',
    },
  ];

  actions: TableAction[] = [
    {
      icon: Eye,
      label: 'View',
      styleClass: 'btn-view',
      command: (rowData: Product) => this.navigateToDetail(rowData._id),
    },
    {
      icon: Edit,
      label: 'Edit',
      styleClass: 'btn-edit',
      command: (rowData: Product) => this.navigateToEdit(rowData._id),
    },
    {
      icon: Trash2,
      label: 'Delete',
      styleClass: 'btn-delete',
      command: (rowData: Product) => this.confirmDeleteProduct(rowData._id),
    },
  ];

  constructor(private store: Store, private router: Router, private route: ActivatedRoute) {
    this.products$ = this.store.select(selectAllProducts);
    this.loading$ = this.store.select(selectProductsLoading);
    this.error$ = this.store.select(selectProductsError);
    this.pagination$ = this.store.select(selectProductsPagination);
    this.totalRecords$ = this.store.select(selectTotalRecords);
    this.currentPage$ = this.store.select(selectCurrentPage);
    this.pageSize$ = this.store.select(selectPageSize);
  }

  ngOnInit(): void {
    // Read pagination from URL query params
    this.loadProductsUsingURLParams();

    // Subscribe to products
    this.products$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((products) => (this.products = products));
  }
  private loadProductsUsingURLParams() {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const page = parseInt(params['page']) || 1;
      const limit = parseInt(params['limit']) || 10;

      this.store.dispatch(loadProducts({ page, limit }));
    });
  }

  onFilterChange(filterChange: FilterChange) {
    console.log('filter', filterChange);

    // Get current page size from store
    let currentLimit = 10; // default
    // ✔ take(1) — auto-unsubscribe after first emission
    this.pageSize$.pipe(take(1)).subscribe((limit) => (currentLimit = limit));

    // Update URL to reset page to 1
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: 1, limit: currentLimit },
      queryParamsHandling: 'merge',
    });

    // Dispatch loadProducts with page 1 and current limit
    this.store.dispatch(loadProducts({ page: 1, limit: currentLimit }));
  }

  onPageChange(event: PageChangeEvent): void {
    // Update URL query parameters without navigation
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: event.page, limit: event.pageSize },
      queryParamsHandling: 'merge',
    });

    // Dispatch action to load new page
    this.store.dispatch(changePage({ page: event.page, limit: event.pageSize }));
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
    const ids = this.selectedProducts.map((p) => p._id);
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
    const product = this.products.find((p) => p._id === productId);
    if (product) {
      this.productToDelete = product;
      this.showDeleteDialog = true;
    }
  }

  deleteProduct(): void {
    if (this.productToDelete) {
      this.store.dispatch(deleteProducts({ ids: [this.productToDelete._id] }));
      this.productToDelete = null;
      this.showDeleteDialog = false;
    }
  }

  cancelDelete(): void {
    this.productToDelete = null;
    this.showDeleteDialog = false;
  }

  retryLoadProducts(): void {
    // Get current page and limit from store
    let currentPage = 1;
    let currentLimit = 10;

    this.currentPage$.pipe(take(1)).subscribe((page) => (currentPage = page));
    this.pageSize$.pipe(take(1)).subscribe((limit) => (currentLimit = limit));

    // Re-dispatch loadProducts with current page and limit
    this.store.dispatch(loadProducts({ page: currentPage, limit: currentLimit }));
  }
}
