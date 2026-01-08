import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Transaction, TransactionType } from '../../models/transaction.model';
import { getTransactionById, deleteTransactions } from '../../store/transactions.actions';
import {
  selectTransactionById,
  selectTransactionsLoading,
} from '../../store/transactions.selectors';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { DetailsPageHeaderComponent } from '../../../../shared/components/details-page-header/details-page-header.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { LucideAngularModule, Undo2 } from 'lucide-angular';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { TableColumn } from '../../../../shared/models/data-table';

@Component({
  selector: 'app-transaction-detail',
  standalone: true,
  imports: [
    CommonModule,
    ConfirmDialogComponent,
    DetailsPageHeaderComponent,
    StatusBadgeComponent,
    LucideAngularModule,
    CustomButtonComponent,
    DataTableComponent,
  ],
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss'],
})
export class TransactionDetailComponent implements OnInit {
  transaction$: Observable<Transaction | undefined>;
  loading$: Observable<boolean>;
  transactionId: string | null = null;
  showDeleteDialog = false;
  TransactionType = TransactionType;
  Undo2 = Undo2;
  productsColumns: TableColumn[] = [
    { field: 'name', header: 'Name', width: '20%' },
    { field: 'sku', header: 'SKU', width: '20%' },
    { field: 'quantity', header: 'Quantity', width: '20%' },
    {
      field: 'price',
      header: 'Price',
      width: '20%',
      type: 'number',
    },

    {
      field: 'total',
      header: 'Total',
      width: '20%',
      type: 'number',
    },
  ];
  constructor(private store: Store, private route: ActivatedRoute, private router: Router) {
    this.loading$ = this.store.select(selectTransactionsLoading);
    this.transaction$ = new Observable();
  }

  ngOnInit(): void {
    this.transactionId = this.route.snapshot.paramMap.get('id');
    if (this.transactionId) {
      this.store.dispatch(getTransactionById({ id: this.transactionId }));
      this.transaction$ = this.store.select(selectTransactionById(this.transactionId));
    }
  }

  onEdit(): void {
    if (this.transactionId) {
      this.router.navigate(['/transactions', this.transactionId, 'edit']);
    }
  }

  onReturns(): void {
    if (this.transactionId) {
      this.router.navigate(['/transactions', this.transactionId, 'returns']);
    }
  }

  confirmDelete(): void {
    this.showDeleteDialog = true;
  }

  onDelete(): void {
    if (this.transactionId) {
      this.store.dispatch(deleteTransactions({ ids: [this.transactionId] }));
      this.showDeleteDialog = false;
    }
  }

  cancelDelete(): void {
    this.showDeleteDialog = false;
  }

  onBack(): void {
    this.router.navigate(['/transactions']);
  }
}
