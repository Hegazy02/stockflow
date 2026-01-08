import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ExpenseStats } from '../../models/expense.model';
import { selectExpenseStats, selectExpensesLoading } from '../../store/expenses.selectors';
import { loadExpenseStats } from '../../store/expenses.actions';
import { LucideAngularModule, ArrowLeft, TrendingUp, DollarSign, List } from 'lucide-angular';
import { Router } from '@angular/router';
import { DetailsPageHeaderComponent } from '../../../../shared/components/details-page-header/details-page-header.component';

@Component({
  selector: 'app-expense-stats',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, DetailsPageHeaderComponent],
  templateUrl: './expense-stats.component.html',
  styleUrls: ['./expense-stats.component.scss'],
})
export class ExpenseStatsComponent implements OnInit {
  stats$: Observable<ExpenseStats | null>;
  loading$: Observable<boolean>;

  readonly TrendingUp = TrendingUp;
  readonly DollarSign = DollarSign;
  readonly List = List;

  constructor(private store: Store, private router: Router) {
    this.stats$ = this.store.select(selectExpenseStats);
    this.loading$ = this.store.select(selectExpensesLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(loadExpenseStats({}));
  }

  onBack(): void {
    this.router.navigate(['/expenses']);
  }
}
