import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { Warehouse } from '../../models/warehouse.model';
import { Pagination } from '../../../../core/models/api-response';
import {
  selectAllWarehouses,
  selectWarehousesLoading,
  selectWarehousesError,
  selectWarehousesPagination,
  selectTotalRecords,
  selectCurrentPage,
  selectPageSize,
} from '../../store/warehouses.selectors';
import { loadWarehouses, deleteWarehouses, changePage } from '../../store/warehouses.actions';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { Eye, Edit, Trash2 } from 'lucide-angular';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ListPageHeaderComponent } from '../../../../shared/components/list-page-header/list-page-header.component';
import {
  TableColumn,
  TableAction,
  FilterChange,
  PageChangeEvent,
} from '../../../../shared/models/data-table';

@Component({
  selector: 'app-warehouse-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DataTableComponent,
    ConfirmDialogComponent,
    ListPageHeaderComponent,
  ],
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.scss'],
})
export class WarehouseListComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  warehouses$: Observable<Warehouse[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  pagination$: Observable<Pagination>;
  totalRecords$: Observable<number>;
  currentPage$: Observable<number>;
  pageSize$: Observable<number>;

  warehouses: Warehouse[] = [];
  selectedWarehouses: Warehouse[] = [];

  // Dialog state
  showDeleteDialog = false;
  showBulkDeleteDialog = false;
  warehouseToDelete: Warehouse | null = null;

  // Table configuration
  columns: TableColumn[] = [
    { field: 'title', header: 'Warehouse Name', width: '25%', filterable: true },
    { field: 'location', header: 'Location', width: '25%', filterable: true },
    { field: 'manager', header: 'Manager', width: '20%' },
    { field: 'status', header: 'Status', width: '10%' },
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
      command: (rowData: Warehouse) => this.navigateToDetail(rowData._id),
    },
    {
      icon: Edit,
      label: 'Edit',
      styleClass: 'btn-edit',
      command: (rowData: Warehouse) => this.navigateToEdit(rowData._id),
    },
    {
      icon: Trash2,
      label: 'Delete',
      styleClass: 'btn-delete',
      command: (rowData: Warehouse) => this.confirmDeleteWarehouse(rowData._id),
    },
  ];

  constructor(private store: Store, private router: Router, private route: ActivatedRoute) {
    this.warehouses$ = this.store.select(selectAllWarehouses);
    this.loading$ = this.store.select(selectWarehousesLoading);
    this.error$ = this.store.select(selectWarehousesError);
    this.pagination$ = this.store.select(selectWarehousesPagination);
    this.totalRecords$ = this.store.select(selectTotalRecords);
    this.currentPage$ = this.store.select(selectCurrentPage);
    this.pageSize$ = this.store.select(selectPageSize);
  }

  ngOnInit(): void {
    this.loadWarehousesUsingURLParams();

    this.warehouses$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((warehouses) => (this.warehouses = warehouses));
  }

  private loadWarehousesUsingURLParams() {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const page = parseInt(params['page']) || 1;
      const limit = parseInt(params['limit']) || 10;

      this.store.dispatch(loadWarehouses({ page, limit }));
    });
  }

  onFilterChange(filterChange: FilterChange) {
    let currentLimit = 10;
    this.pageSize$.pipe(take(1)).subscribe((limit) => (currentLimit = limit));

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: 1, limit: currentLimit },
      queryParamsHandling: 'merge',
    });

    this.store.dispatch(loadWarehouses({ page: 1, limit: currentLimit }));
  }

  onPageChange(event: PageChangeEvent): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: event.page, limit: event.pageSize },
      queryParamsHandling: 'merge',
    });

    this.store.dispatch(changePage({ page: event.page, limit: event.pageSize }));
  }

  onRowSelect(rows: any) {
    this.selectedWarehouses = rows;
  }

  confirmBulkDelete(): void {
    if (this.selectedWarehouses.length === 0) {
      return;
    }
    this.showBulkDeleteDialog = true;
  }

  bulkDeleteWarehouses(): void {
    const ids = this.selectedWarehouses.map((w) => w._id);
    this.store.dispatch(deleteWarehouses({ ids }));
    this.selectedWarehouses = [];
    this.showBulkDeleteDialog = false;
  }

  cancelBulkDelete(): void {
    this.showBulkDeleteDialog = false;
  }

  navigateToDetail(warehouseId: string): void {
    this.router.navigate(['/warehouses', warehouseId]);
  }

  navigateToEdit(warehouseId: string): void {
    this.router.navigate(['/warehouses', warehouseId, 'edit']);
  }

  navigateToCreate(): void {
    this.router.navigate(['/warehouses', 'new']);
  }

  confirmDeleteWarehouse(warehouseId: string): void {
    const warehouse = this.warehouses.find((w) => w._id === warehouseId);
    if (warehouse) {
      this.warehouseToDelete = warehouse;
      this.showDeleteDialog = true;
    }
  }

  deleteWarehouse(): void {
    if (this.warehouseToDelete) {
      this.store.dispatch(deleteWarehouses({ ids: [this.warehouseToDelete._id] }));
      this.warehouseToDelete = null;
      this.showDeleteDialog = false;
    }
  }

  cancelDelete(): void {
    this.warehouseToDelete = null;
    this.showDeleteDialog = false;
  }

  retryLoadWarehouses(): void {
    let currentPage = 1;
    let currentLimit = 10;

    this.currentPage$.pipe(take(1)).subscribe((page) => (currentPage = page));
    this.pageSize$.pipe(take(1)).subscribe((limit) => (currentLimit = limit));

    this.store.dispatch(loadWarehouses({ page: currentPage, limit: currentLimit }));
  }
}
