import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { Expense, ExpenseFilters } from '../../models/expense.model';
import { Pagination } from '../../../../core/models/api-response';
import {
  selectAllExpenses,
  selectExpensesLoading,
  selectExpensesError,
  selectExpensesPagination,
  selectTotalRecords,
  selectCurrentPage,
  selectPageSize,
} from '../../store/expenses.selectors';
import { loadExpenses, deleteExpenses } from '../../store/expenses.actions';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { Edit, Trash2, InfoIcon, BarChart3 } from 'lucide-angular';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ListPageHeaderComponent } from '../../../../shared/components/list-page-header/list-page-header.component';
import {
  TableColumn,
  TableAction,
  FilterChange,
  PageChangeEvent,
} from '../../../../shared/models/data-table';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DataTableComponent,
    ConfirmDialogComponent,
    ListPageHeaderComponent,
    CustomButtonComponent,
    LucideAngularModule,
  ],
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss'],
})
export class ExpenseListComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  readonly BarChart3 = BarChart3;

  expenses$: Observable<Expense[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  pagination$: Observable<Pagination>;
  totalRecords$: Observable<number>;
  currentPage$: Observable<number>;
  pageSize$: Observable<number>;

  expenses: Expense[] = [];
  selectedExpenses: Expense[] = [];

  // Dialog state
  showDeleteDialog = false;
  showBulkDeleteDialog = false;
  expenseToDelete: Expense | null = null;

  // Table configuration
  columns: TableColumn[] = [
    { field: 'title', header: 'Title', width: '25%', filterable: true },
    { field: 'amount', header: 'Amount', width: '25%', type: 'number' },
    { field: 'category', header: 'Category', width: '20%', filterable: true },
    { field: 'date', header: 'Date', width: '20%', type: 'date', dateFormat: 'mediumDate' },
    // { field: 'note', header: 'Note', width: '20%' },
  ];

  actions: TableAction[] = [
    {
      icon: InfoIcon,
      label: 'View',
      styleClass: 'btn-view',
      command: (rowData: Expense) => this.navigateToDetail(rowData._id),
    },
    // {
    //   icon: Edit,
    //   label: 'Edit',
    //   styleClass: 'btn-edit',
    //   command: (rowData: Expense) => this.navigateToEdit(rowData._id),
    // },
    // {
    //   icon: Trash2,
    //   label: 'Delete',
    //   styleClass: 'btn-delete',
    //   command: (rowData: Expense) => this.confirmDeleteExpense(rowData),
    // },
  ];

  constructor(private store: Store, private router: Router, private route: ActivatedRoute) {
    this.expenses$ = this.store.select(selectAllExpenses);
    this.loading$ = this.store.select(selectExpensesLoading);
    this.error$ = this.store.select(selectExpensesError);
    this.pagination$ = this.store.select(selectExpensesPagination);
    this.totalRecords$ = this.store.select(selectTotalRecords);
    this.currentPage$ = this.store.select(selectCurrentPage);
    this.pageSize$ = this.store.select(selectPageSize);
  }

  ngOnInit(): void {
    this.loadExpensesUsingURLParams();

    this.expenses$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((expenses) => {
      this.expenses = expenses;
    });
  }

  private loadExpensesUsingURLParams() {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const page = parseInt(params['page']) || 1;
      const limit = parseInt(params['limit']) || 10;
      const search = params['search'] || undefined;
      const category = params['category'] || undefined;
      const startDate = params['startDate'] || undefined;
      const endDate = params['endDate'] || undefined;

      this.store.dispatch(loadExpenses({ page, limit, search, category, startDate, endDate }));
    });
  }

  onFilterChange(filterChange: FilterChange) {
    const filters = filterChange.filters;
    let currentLimit = 10;
    this.pageSize$.pipe(take(1)).subscribe((limit) => (currentLimit = limit));

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: 1, limit: currentLimit, ...filters },
      queryParamsHandling: 'merge',
    });
  }

  onPageChange(event: PageChangeEvent): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: event.page, limit: event.pageSize },
      queryParamsHandling: 'merge',
    });
  }

  onRowSelect(rows: any) {
    this.selectedExpenses = rows;
  }

  confirmBulkDelete(): void {
    if (this.selectedExpenses.length === 0) return;
    this.showBulkDeleteDialog = true;
  }

  bulkDeleteExpenses(): void {
    const ids = this.selectedExpenses.map((e) => e._id);
    this.store.dispatch(deleteExpenses({ ids }));
    this.selectedExpenses = [];
    this.showBulkDeleteDialog = false;
  }

  cancelBulkDelete(): void {
    this.showBulkDeleteDialog = false;
  }

  navigateToEdit(expenseId: string): void {
    this.router.navigate(['/expenses', expenseId, 'edit']);
  }

  navigateToDetail(expenseId: string): void {
    this.router.navigate(['/expenses', expenseId]);
  }

  navigateToCreate(): void {
    this.router.navigate(['/expenses', 'new']);
  }

  navigateToStats(): void {
    this.router.navigate(['/expenses/stats']);
  }

  confirmDeleteExpense(expense: Expense): void {
    this.expenseToDelete = expense;
    this.showDeleteDialog = true;
  }

  deleteExpense(): void {
    if (this.expenseToDelete) {
      this.store.dispatch(deleteExpenses({ ids: [this.expenseToDelete._id] }));
      this.expenseToDelete = null;
      this.showDeleteDialog = false;
    }
  }

  cancelDelete(): void {
    this.expenseToDelete = null;
    this.showDeleteDialog = false;
  }
}
