import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Transaction } from '../../models/transaction.model';
import { getTransactionById, deleteTransactions } from '../../store/transactions.actions';
import {
  selectTransactionById,
  selectTransactionsLoading,
} from '../../store/transactions.selectors';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { DetailsPageHeaderComponent } from '../../../../shared/components/details-page-header/details-page-header.component';

@Component({
  selector: 'app-transaction-detail',
  standalone: true,
  imports: [CommonModule, ConfirmDialogComponent, DetailsPageHeaderComponent],
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss'],
})
export class TransactionDetailComponent implements OnInit {
  transaction$: Observable<Transaction | undefined>;
  loading$: Observable<boolean>;
  transactionId: string | null = null;
  showDeleteDialog = false;

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
