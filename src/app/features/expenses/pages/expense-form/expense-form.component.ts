import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, Observable, take } from 'rxjs';
import { Expense, ExpenseFormBody } from '../../models/expense.model';
import { selectExpenseById } from '../../store/expenses.selectors';
import { createExpense, getExpenseById, updateExpense } from '../../store/expenses.actions';
import { LucideAngularModule, ArrowLeft, Save, X } from 'lucide-angular';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { DetailsPageHeaderComponent } from '../../../../shared/components/details-page-header/details-page-header.component';
import { FormActionsComponent } from '../../../../shared/components/form-actions/form-actions.component';

@Component({
  selector: 'app-expense-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    FormInputComponent,
    DetailsPageHeaderComponent,
    FormActionsComponent,
  ],
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss'],
})
export class ExpenseFormComponent implements OnInit {
  expenseForm: FormGroup;
  isEditMode = false;
  expenseId: string | null = null;
  expense$: Observable<Expense | undefined> = new Observable();

  // Lucide icons
  readonly ArrowLeft = ArrowLeft;
  readonly Save = Save;
  readonly X = X;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.expenseForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      amount: [0, [Validators.required, Validators.min(0)]],
      category: ['General'],
      date: [new Date().toISOString().split('T')[0]],
      note: [''],
    });
  }

  ngOnInit(): void {
    this.expenseId = this.route.snapshot.paramMap.get('id');

    if (this.expenseId) {
      this.initializeEditMode(this.expenseId);
    }
  }

  private initializeEditMode(id: string): void {
    this.isEditMode = true;
    this.store.dispatch(getExpenseById({ id }));
    this.expense$ = this.store.select(selectExpenseById(id));
    this.patchForm();
  }

  private patchForm(): void {
    this.expense$
      .pipe(
        filter((expense): expense is Expense => expense !== undefined),
        take(1)
      )
      .subscribe((expense: Expense) => {
        this.expenseForm.patchValue({
          title: expense.title,
          amount: expense.amount,
          category: expense.category,
          date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : '',
          note: expense.note,
        });
      });
  }

  onSubmit(): void {
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      return;
    }

    const formValue = this.expenseForm.value;
    const expensePayload: ExpenseFormBody = {
      title: formValue.title,
      amount: formValue.amount,
      category: formValue.category,
      date: formValue.date,
      note: formValue.note,
    };

    if (this.isEditMode && this.expenseId) {
      this.store.dispatch(
        updateExpense({
          id: this.expenseId,
          expense: expensePayload,
        })
      );
    } else {
      this.store.dispatch(createExpense({ expense: expensePayload }));
    }
  }

  onCancel(): void {
    this.navigateToList();
  }

  navigateToList(): void {
    this.router.navigate(['/expenses']);
  }
}
