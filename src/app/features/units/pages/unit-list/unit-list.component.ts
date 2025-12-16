import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { Unit } from '../../models/unit.model';
import { Pagination } from '../../../../core/models/api-response';
import {
  selectAllUnits,
  selectUnitsLoading,
  selectUnitsError,
  selectUnitsPagination,
  selectTotalRecords,
  selectCurrentPage,
  selectPageSize,
} from '../../store/units.selectors';
import { loadUnits, deleteUnits, changePage } from '../../store/units.actions';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { Eye, Edit, Trash2 } from 'lucide-angular';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ListPageHeaderComponent } from '../../../../shared/components/list-page-header/list-page-header.component';
import { TableColumn, TableAction, PageChangeEvent } from '../../../../shared/models/data-table';

@Component({
  selector: 'app-unit-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DataTableComponent,
    ConfirmDialogComponent,
    ListPageHeaderComponent,
  ],
  templateUrl: './unit-list.component.html',
  styleUrls: ['./unit-list.component.scss'],
})
export class UnitListComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  units$: Observable<Unit[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  pagination$: Observable<Pagination>;
  totalRecords$: Observable<number>;
  currentPage$: Observable<number>;
  pageSize$: Observable<number>;
  units: Unit[] = [];
  selectedUnits: Unit[] = [];

  showDeleteDialog = false;
  showBulkDeleteDialog = false;
  unitToDelete: Unit | null = null;

  columns: TableColumn[] = [
    { field: 'name', header: 'Unit Name', width: '25%', filterable: true },
    { field: 'abbreviation', header: 'Abbreviation', width: '15%' },
    { field: 'x', header: '', width: '50%' },
  ];

  actions: TableAction[] = [
    {
      icon: Eye,
      label: 'View',
      styleClass: 'btn-view',
      command: (rowData: Unit) => this.navigateToDetail(rowData._id),
    },
    {
      icon: Edit,
      label: 'Edit',
      styleClass: 'btn-edit',
      command: (rowData: Unit) => this.navigateToEdit(rowData._id),
    },
    {
      icon: Trash2,
      label: 'Delete',
      styleClass: 'btn-delete',
      command: (rowData: Unit) => this.confirmDeleteUnit(rowData._id),
    },
  ];

  constructor(private store: Store, private router: Router, private route: ActivatedRoute) {
    this.units$ = this.store.select(selectAllUnits);
    this.loading$ = this.store.select(selectUnitsLoading);
    this.error$ = this.store.select(selectUnitsError);
    this.pagination$ = this.store.select(selectUnitsPagination);
    this.totalRecords$ = this.store.select(selectTotalRecords);
    this.currentPage$ = this.store.select(selectCurrentPage);
    this.pageSize$ = this.store.select(selectPageSize);
  }

  ngOnInit(): void {
    this.loadUnitsUsingURLParams();

    this.units$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((units) => {
      this.units = units;
    });
  }

  private loadUnitsUsingURLParams() {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const page = parseInt(params['page']) || 1;
      const limit = parseInt(params['limit']) || 10;
      const name = params['name'] || undefined;

      this.store.dispatch(loadUnits({ page, limit, name }));
    });
  }

  onPageChange(event: PageChangeEvent): void {
    const currentParams = this.route.snapshot.queryParams;
    const name = currentParams['name'] || undefined;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: event.page, limit: event.pageSize },
      queryParamsHandling: 'merge',
    });

    this.store.dispatch(
      loadUnits({
        page: event.page,
        limit: event.pageSize,
        name,
      })
    );
  }

  onRowSelect(rows: any) {
    this.selectedUnits = rows;
  }

  confirmBulkDelete(): void {
    if (this.selectedUnits.length === 0) {
      return;
    }
    this.showBulkDeleteDialog = true;
  }

  bulkDeleteUnits(): void {
    const ids = this.selectedUnits.map((u) => u._id);
    this.store.dispatch(deleteUnits({ ids }));
    this.selectedUnits = [];
    this.showBulkDeleteDialog = false;
  }

  cancelBulkDelete(): void {
    this.showBulkDeleteDialog = false;
  }

  navigateToDetail(unitId: string): void {
    this.router.navigate(['/units', unitId]);
  }

  navigateToEdit(unitId: string): void {
    this.router.navigate(['/units', unitId, 'edit']);
  }

  navigateToCreate(): void {
    this.router.navigate(['/units', 'new']);
  }

  confirmDeleteUnit(unitId: string): void {
    const unit = this.units.find((u) => u._id === unitId);
    if (unit) {
      this.unitToDelete = unit;
      this.showDeleteDialog = true;
    }
  }

  deleteUnit(): void {
    if (this.unitToDelete) {
      this.store.dispatch(deleteUnits({ ids: [this.unitToDelete._id] }));
      this.unitToDelete = null;
      this.showDeleteDialog = false;
    }
  }

  cancelDelete(): void {
    this.unitToDelete = null;
    this.showDeleteDialog = false;
  }

  retryLoadUnits(): void {
    let currentPage = 1;
    let currentLimit = 10;

    this.currentPage$.pipe(take(1)).subscribe((page) => (currentPage = page));
    this.pageSize$.pipe(take(1)).subscribe((limit) => (currentLimit = limit));

    this.store.dispatch(loadUnits({ page: currentPage, limit: currentLimit }));
  }
}
