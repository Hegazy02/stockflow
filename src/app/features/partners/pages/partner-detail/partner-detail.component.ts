import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Partner } from '../../models/partner.model';
import { getPartnerById, deletePartners } from '../../store/partners.actions';
import { selectPartnerById, selectPartnersLoading } from '../../store/partners.selectors';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { DetailsPageHeaderComponent } from '../../../../shared/components/details-page-header/details-page-header.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { TransactionService } from '../../../transactions/services/transaction.service';
import { Transaction } from '../../../transactions/models/transaction.model';
import { TableColumn, PageChangeEvent } from '../../../../shared/models/data-table';
import { Eye } from 'lucide-angular';
import { CellTemplateDirective } from '../../../../shared/directives/cell-template/cell-template.directive';

@Component({
  selector: 'app-partner-detail',
  standalone: true,
  imports: [
    CommonModule,
    ConfirmDialogComponent,
    DetailsPageHeaderComponent,
    StatusBadgeComponent,
    DataTableComponent,
    CellTemplateDirective,
  ],
  templateUrl: './partner-detail.component.html',
  styleUrls: ['./partner-detail.component.scss'],
})
export class PartnerDetailComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  partner$: Observable<Partner | undefined>;
  loading$: Observable<boolean>;
  partnerId: string | null = null;
  showDeleteDialog = false;

  // Transactions data
  transactions: Transaction[] = [];
  transactionsLoading = false;
  totals = {
    balance: 0,
    paid: 0,
    left: 0,
  };
  pagination = {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  };

  transactionColumns: TableColumn[] = [
    {
      field: 'transactionType',
      header: 'Type',
      width: '20%',
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
    },
    {
      field: 'balance',
      header: 'Balance',
      width: '15%',
      type: 'number',
    },
    {
      field: 'paid',
      header: 'Paid',
      width: '15%',
      type: 'number',
    },
    {
      field: 'left',
      header: 'Left',
      width: '15%',
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

  transactionActions = [
    {
      icon: Eye,
      label: 'View',
      styleClass: 'btn-view',
      command: (rowData: Transaction) => this.router.navigate(['/transactions', rowData._id]),
    },
  ];

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private transactionService: TransactionService
  ) {
    this.loading$ = this.store.select(selectPartnersLoading);
    this.partner$ = new Observable();
  }

  ngOnInit(): void {
    this.partnerId = this.route.snapshot.paramMap.get('id');
    if (this.partnerId) {
      this.store.dispatch(getPartnerById({ id: this.partnerId }));
      this.partner$ = this.store.select(selectPartnerById(this.partnerId));
      this.loadPartnerTransactions();
    }
  }

  loadPartnerTransactions(): void {
    if (!this.partnerId) return;

    this.transactionsLoading = true;
    this.transactionService
      .getPartnerTransactions(this.partnerId, this.pagination.page, this.pagination.limit)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            // this.transactions = this.transformTransactions(response.data.transactions);
            this.transactions = response.data.transactions;
            this.totals = response.data.totals;
            this.pagination = response.data.pagination;
          }
          this.transactionsLoading = false;
        },
        error: (error) => {
          console.error('Error loading partner transactions:', error);
          this.transactionsLoading = false;
        },
      });
  }

  onPageChange(event: PageChangeEvent): void {
    this.pagination.page = event.page;
    this.pagination.limit = event.pageSize;
    this.loadPartnerTransactions();
  }

  onEdit(): void {
    if (this.partnerId) {
      this.router.navigate(['/partners', this.partnerId, 'edit']);
    }
  }

  confirmDelete(): void {
    this.showDeleteDialog = true;
  }

  onDelete(): void {
    if (this.partnerId) {
      this.store.dispatch(deletePartners({ ids: [this.partnerId] }));
      this.showDeleteDialog = false;
      this.router.navigate(['/partners']);
    }
  }

  cancelDelete(): void {
    this.showDeleteDialog = false;
  }

  onBack(): void {
    this.router.navigate(['/partners']);
  }
}
