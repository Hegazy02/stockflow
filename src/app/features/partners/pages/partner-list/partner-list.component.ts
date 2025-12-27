import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { Partner } from '../../models/partner.model';
import { Pagination } from '../../../../core/models/api-response';
import {
  selectAllPartners,
  selectPartnersLoading,
  selectPartnersError,
  selectPartnersPagination,
  selectTotalRecords,
  selectCurrentPage,
  selectPageSize,
} from '../../store/partners.selectors';
import { loadPartners, deletePartners, changePage } from '../../store/partners.actions';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { Eye, Edit, Trash2 ,InfoIcon} from 'lucide-angular';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ListPageHeaderComponent } from '../../../../shared/components/list-page-header/list-page-header.component';
import { TableColumn, TableAction, PageChangeEvent, FilterChange } from '../../../../shared/models/data-table';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { CellTemplateDirective } from '../../../../shared/directives/cell-template/cell-template.directive';

@Component({
  selector: 'app-partner-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DataTableComponent,
    ConfirmDialogComponent,
    ListPageHeaderComponent,
    StatusBadgeComponent,
    CellTemplateDirective,
  ],
  templateUrl: './partner-list.component.html',
  styleUrls: ['./partner-list.component.scss'],
})
export class PartnerListComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  partners$: Observable<Partner[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  pagination$: Observable<Pagination>;
  totalRecords$: Observable<number>;
  currentPage$: Observable<number>;
  pageSize$: Observable<number>;
  partners: Partner[] = [];
  selectedPartners: Partner[] = [];

  showDeleteDialog = false;
  showBulkDeleteDialog = false;
  partnerToDelete: Partner | null = null;

  columns: TableColumn[] = [
    { field: 'name', header: 'Partner Name', width: '25%', filterable: true },
    { field: 'phoneNumber', header: 'Phone Number', width: '20%' },
    {
      field: 'type',
      header: 'Type',
      width: '20%',
      filterable: true,
      filterTypes: ['dropdown'],
      dropdownConfig: {
        options: [
          { label: 'Supplier', value: 'Supplier' },
          { label: 'Customer', value: 'Customer' },
        ],
        optionLabel: 'label',
        optionValue: 'value',
        selectedValue: null,
      },
    },
    // { field: 'description', header: 'Description', width: '30%' },
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
      icon: InfoIcon,
      label: 'View',
      styleClass: 'btn-view',
      command: (rowData: Partner) => this.navigateToDetail(rowData._id),
    },
    // {
    //   icon: Edit,
    //   label: 'Edit',
    //   styleClass: 'btn-edit',
    //   command: (rowData: Partner) => this.navigateToEdit(rowData._id),
    // },
    // {
    //   icon: Trash2,
    //   label: 'Delete',
    //   styleClass: 'btn-delete',
    //   command: (rowData: Partner) => this.confirmDeletePartner(rowData._id),
    // },
  ];

  constructor(private store: Store, private router: Router, private route: ActivatedRoute) {
    this.partners$ = this.store.select(selectAllPartners);
    this.loading$ = this.store.select(selectPartnersLoading);
    this.error$ = this.store.select(selectPartnersError);
    this.pagination$ = this.store.select(selectPartnersPagination);
    this.totalRecords$ = this.store.select(selectTotalRecords);
    this.currentPage$ = this.store.select(selectCurrentPage);
    this.pageSize$ = this.store.select(selectPageSize);
  }

  ngOnInit(): void {
    this.loadPartnersUsingURLParams();

    this.partners$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((partners) => {
      this.partners = partners;
    });
  }

  private loadPartnersUsingURLParams() {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const page = parseInt(params['page']) || 1;
      const limit = parseInt(params['limit']) || 10;

      this.store.dispatch(loadPartners({ page, limit }));
    });
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
    this.selectedPartners = rows;
  }

  confirmBulkDelete(): void {
    if (this.selectedPartners.length === 0) {
      return;
    }
    this.showBulkDeleteDialog = true;
  }

  bulkDeletePartners(): void {
    const ids = this.selectedPartners.map((p) => p._id);
    this.store.dispatch(deletePartners({ ids }));
    this.selectedPartners = [];
    this.showBulkDeleteDialog = false;
  }

  cancelBulkDelete(): void {
    this.showBulkDeleteDialog = false;
  }

  navigateToDetail(partnerId: string): void {
    this.router.navigate(['/partners', partnerId]);
  }

  navigateToEdit(partnerId: string): void {
    this.router.navigate(['/partners', partnerId, 'edit']);
  }

  navigateToCreate(): void {
    this.router.navigate(['/partners', 'new']);
  }

  confirmDeletePartner(partnerId: string): void {
    const partner = this.partners.find((p) => p._id === partnerId);
    if (partner) {
      this.partnerToDelete = partner;
      this.showDeleteDialog = true;
    }
  }

  deletePartner(): void {
    if (this.partnerToDelete) {
      this.store.dispatch(deletePartners({ ids: [this.partnerToDelete._id] }));
      this.partnerToDelete = null;
      this.showDeleteDialog = false;
    }
  }

  cancelDelete(): void {
    this.partnerToDelete = null;
    this.showDeleteDialog = false;
  }

  retryLoadPartners(): void {
    let currentPage = 1;
    let currentLimit = 10;

    this.currentPage$.pipe(take(1)).subscribe((page) => (currentPage = page));
    this.pageSize$.pipe(take(1)).subscribe((limit) => (currentLimit = limit));

    this.store.dispatch(loadPartners({ page: currentPage, limit: currentLimit }));
  }
  onFilterChange(filterChange: FilterChange) {
    const filters = filterChange.filters;
    
    
    const transactionType = filters['type'];
    filters['partnerType'] = transactionType?.['value' as any];
    
    console.log('filter', filters);
    // Get current page size from store
    let currentLimit = 10; // default
    // ✔ take(1) — auto-unsubscribe after first emission
    this.pageSize$.pipe(take(1)).subscribe((limit) => (currentLimit = limit));

    // Update URL to reset page to 1
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: 1, limit: currentLimit, ...filters },
      queryParamsHandling: 'merge',
    });

    // Dispatch loadTransactions with page 1 and current limit
    this.store.dispatch(
      loadPartners({
        page: 1,
        limit: currentLimit,
        ...filters,
      })
    );
  }
}
