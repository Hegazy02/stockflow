import { Component, OnInit, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Expense } from '../../models/expense.model';
import { selectSelectedExpense, selectExpensesLoading } from '../../store/expenses.selectors';
import { deleteExpenses, getExpenseById } from '../../store/expenses.actions';
import {
  LucideAngularModule,
  ArrowLeft,
  Edit,
  Trash2,
  Banknote,
  Calendar,
  Tag,
  FileText,
} from 'lucide-angular';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DetailsPageHeaderComponent } from '../../../../shared/components/details-page-header/details-page-header.component';

@Component({
  selector: 'app-expense-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    ConfirmDialogComponent,
    DetailsPageHeaderComponent,
  ],
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseDetailComponent implements OnInit {
  expense$ = new Observable<Expense | null | undefined>();
  loading$ = new Observable<boolean | undefined>();
  expenseId: string | null = null;
  showDeleteConfirm = false;
  expenseTitle: string = '';
  destroyRef = inject(DestroyRef);

  // Lucide icons
  readonly ArrowLeft = ArrowLeft;
  readonly Edit = Edit;
  readonly Trash2 = Trash2;
  readonly Banknote = Banknote;
  readonly Calendar = Calendar;
  readonly Tag = Tag;
  readonly FileText = FileText;

  constructor(private store: Store, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.expenseId = this.route.snapshot.paramMap.get('id');

    if (this.expenseId) {
      this.initializeExpense(this.expenseId);
    }
  }

  private initializeExpense(id: string) {
    this.store.dispatch(getExpenseById({ id }));
    this.loading$ = this.store.select(selectExpensesLoading);
    this.expense$ = this.store.select(selectSelectedExpense);

    this.expense$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((expense) => {
      if (expense) {
        this.expenseTitle = expense.title;
      }
    });
  }

  navigateToEdit(): void {
    if (this.expenseId) {
      this.router.navigate(['/expenses', this.expenseId, 'edit']);
    }
  }

  navigateToList(): void {
    this.router.navigate(['/expenses']);
  }

  confirmDelete(): void {
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  deleteExpense(): void {
    if (this.expenseId) {
      this.store.dispatch(deleteExpenses({ ids: [this.expenseId] }));
      this.showDeleteConfirm = false;
      this.navigateToList();
    }
  }
}
