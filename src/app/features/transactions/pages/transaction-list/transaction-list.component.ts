import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { Transaction, TransactionType } from '../../models/transaction.model';
import { Pagination } from '../../../../core/models/api-response';
import {
  selectAllTransactions,
  selectTransactionsLoading,
  selectTransactionsError,
  selectTransactionsPagination,
  selectTotalRecords,
  selectCurrentPage,
  selectPageSize,
} from '../../store/transactions.selectors';
import { loadTransactions, deleteTransactions } from '../../store/transactions.actions';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { Eye, Edit, Trash2 ,InfoIcon} from 'lucide-angular';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ListPageHeaderComponent } from '../../../../shared/components/list-page-header/list-page-header.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import {
  TableColumn,
  TableAction,
  FilterChange,
  PageChangeEvent,
} from '../../../../shared/models/data-table';
import { CellTemplateDirective } from '../../../../shared/directives/cell-template/cell-template.directive';

@Component({
  selector: 'app-transaction-list',
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
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
})
export class TransactionListComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  transactions$: Observable<Transaction[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  pagination$: Observable<Pagination>;
  totalRecords$: Observable<number>;
  currentPage$: Observable<number>;
  pageSize$: Observable<number>;
  transactions: Transaction[] = [];
  selectedTransactions: Transaction[] = [];

  showDeleteDialog = false;
  showBulkDeleteDialog = false;
  transactionToDelete: Transaction | null = null;

  columns: TableColumn[] = [
    {
      field: 'transactionType',
      header: 'Type',
      width: '15%',
      filterable: true,
      filterTypes: ['dropdown'],
      dropdownConfig: {
        options: [
          { label: 'Sales', value: TransactionType.SALES },
          { label: 'Purchases', value: TransactionType.PURCHASES },
          { label: 'Deposit (Customer)', value: TransactionType.DEPOSIT_CUSTOMERS },
          { label: 'Deposit (Supplier)', value: TransactionType.DEPOSIT_SUPPLIERS },
        ],
        optionLabel: 'label',
        optionValue: 'value',
        selectedValue: null,
        width: 180,
      },
    },
    {
      field: 'partner.name',
      header: 'Partner',
      width: '15%',
      filterable: true,
    },
    {
      field: 'productDisplay',
      header: 'Products',
      width: '10%',
    },

    {
      field: 'totalQuantity',
      header: 'Total Qty',
      width: '10%',
      type: 'number',
    },
    {
      field: 'balance',
      header: 'Balance',
      width: '10%',
      type: 'number',
    },
    {
      field: 'paid',
      header: 'Paid',
      width: '10%',
      type: 'number',
    },
    {
      field: 'left',
      header: 'Left',
      width: '10%',
      type: 'number',
    },
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
      icon: InfoIcon,
      label: 'View',
      styleClass: 'btn-view',
      command: (rowData: Transaction) => this.navigateToDetail(rowData._id),
    },

    // {
    //   icon: Trash2,
    //   label: 'Delete',
    //   styleClass: 'btn-delete',
    //   command: (rowData: Transaction) => this.confirmDeleteTransaction(rowData._id),
    // },
  ];

  constructor(private store: Store, private router: Router, private route: ActivatedRoute) {
    this.transactions$ = this.store.select(selectAllTransactions);
    this.loading$ = this.store.select(selectTransactionsLoading);
    this.error$ = this.store.select(selectTransactionsError);
    this.pagination$ = this.store.select(selectTransactionsPagination);
    this.totalRecords$ = this.store.select(selectTotalRecords);
    this.currentPage$ = this.store.select(selectCurrentPage);
    this.pageSize$ = this.store.select(selectPageSize);
  }

  ngOnInit(): void {
    this.loadTransactionsUsingURLParams();

    this.transactions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((transactions) => {
      this.transactions = transactions;
    });
  }

  derivedTableHeight(): string {
    return window.innerHeight - 200 + 'px';
  }

  private getTotalQuantity(transaction: Transaction): number {
    return transaction.products?.reduce((sum, p) => sum + (p.quantity || 0), 0) || 0;
  }

  private loadTransactionsUsingURLParams() {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const page = parseInt(params['page']) || 1;
      const limit = parseInt(params['limit']) || 10;
      const partner = params['partner'] || undefined;
      const transactionType = params['transactionType'] || undefined;

      this.store.dispatch(loadTransactions({ page, limit, partner, transactionType }));
    });
  }
  onFilterChange(filterChange: FilterChange) {
    const filters = filterChange.filters;
    console.log('filter', filters);

    filters['partner'] = filters['partner.name'];
    delete filters['partner.name'];

    const transactionType = filters['transactionType'];
    filters['transactionType'] = transactionType?.['value' as any];

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
      loadTransactions({
        page: 1,
        limit: currentLimit,
        ...filters,
      })
    );
  }
  onPageChange(event: PageChangeEvent): void {
    const currentParams = this.route.snapshot.queryParams;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: event.page, limit: event.pageSize },
      queryParamsHandling: 'merge',
    });

    this.store.dispatch(
      loadTransactions({
        page: event.page,
        limit: event.pageSize,
        partner: currentParams['partner'],
        transactionType: currentParams['transactionType'],
      })
    );
  }

  onRowSelect(rows: any) {
    this.selectedTransactions = rows;
  }

  confirmBulkDelete(): void {
    if (this.selectedTransactions.length === 0) {
      return;
    }
    this.showBulkDeleteDialog = true;
  }

  bulkDeleteTransactions(): void {
    const ids = this.selectedTransactions.map((t) => t._id);
    this.store.dispatch(deleteTransactions({ ids }));
    this.selectedTransactions = [];
    this.showBulkDeleteDialog = false;
  }

  cancelBulkDelete(): void {
    this.showBulkDeleteDialog = false;
  }

  navigateToDetail(transactionId: string): void {
    this.router.navigate(['/transactions', transactionId]);
  }

  navigateToEdit(transactionId: string): void {
    this.router.navigate(['/transactions', transactionId, 'edit']);
  }

  navigateToCreate(): void {
    this.router.navigate(['/transactions', 'new']);
  }

  confirmDeleteTransaction(transactionId: string): void {
    const transaction = this.transactions.find((t) => t._id === transactionId);
    if (transaction) {
      this.transactionToDelete = transaction;
      this.showDeleteDialog = true;
    }
  }

  deleteTransaction(): void {
    if (this.transactionToDelete) {
      this.store.dispatch(deleteTransactions({ ids: [this.transactionToDelete._id] }));
      this.transactionToDelete = null;
      this.showDeleteDialog = false;
    }
  }

  cancelDelete(): void {
    this.transactionToDelete = null;
    this.showDeleteDialog = false;
  }

  retryLoadTransactions(): void {
    let currentPage = 1;
    let currentLimit = 10;

    this.currentPage$.pipe(take(1)).subscribe((page) => (currentPage = page));
    this.pageSize$.pipe(take(1)).subscribe((limit) => (currentLimit = limit));

    this.store.dispatch(loadTransactions({ page: currentPage, limit: currentLimit }));
  }
}
