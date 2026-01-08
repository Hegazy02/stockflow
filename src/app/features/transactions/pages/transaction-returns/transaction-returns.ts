import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Transaction, TransactionProduct } from '../../models/transaction.model';
import { getTransactionById, returnTransaction } from '../../store/transactions.actions';
import {
  selectTransactionById,
  selectTransactionsLoading,
} from '../../store/transactions.selectors';
import { DetailsPageHeaderComponent } from '../../../../shared/components/details-page-header/details-page-header.component';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { TableColumn } from '../../../../shared/models/data-table';
import { CellTemplateDirective } from '../../../../shared/directives/cell-template/cell-template.directive';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { filter, take } from 'rxjs/operators';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';

@Component({
  selector: 'app-transaction-returns',
  standalone: true,
  imports: [
    CommonModule,
    DetailsPageHeaderComponent,
    DataTableComponent,
    CellTemplateDirective,
    CustomButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    FormInputComponent,
  ],
  templateUrl: './transaction-returns.html',
  styleUrl: './transaction-returns.scss',
})
export class TransactionReturnsComponent implements OnInit {
  transaction$: Observable<Transaction | undefined>;
  loading$: Observable<boolean>;
  transactionId: string | null = null;
  returnedProductsForm: FormGroup;
  stableProducts: any[] = [];

  productsColumns: TableColumn[] = [
    { field: 'name', header: 'Name', width: '15%' },
    { field: 'sku', header: 'SKU', width: '15%' },
    { field: 'price', header: 'Price', width: '15%', type: 'number' },
    { field: 'originalQuantity', header: 'Bought Quantity', width: '15%', type: 'number' },
    { field: 'total', header: 'Total', width: '15%', type: 'number' },
    { field: 'quantity', header: 'Return Quantity', width: '15%' },
  ];

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loading$ = this.store.select(selectTransactionsLoading);
    this.transaction$ = new Observable();
    this.returnedProductsForm = this.fb.group({
      products: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.transactionId = this.route.snapshot.paramMap.get('id');
    if (this.transactionId) {
      this.store.dispatch(getTransactionById({ id: this.transactionId }));
      this.transaction$ = this.store.select(selectTransactionById(this.transactionId));

      this.transaction$
        .pipe(
          filter((transaction) => !!transaction),
          take(1)
        )
        .subscribe((transaction) => {
          if (transaction && transaction.products) {
            this.setProductsData(transaction.products);
          }
        });
    }
  }

  get productsFormArray(): FormArray {
    return this.returnedProductsForm.get('products') as FormArray;
  }

  private setProductsData(products: TransactionProduct[]) {
    this.productsFormArray.clear();
    this.stableProducts =
      products?.map((p) => ({
        ...p,
        originalQuantity: p.quantity,
      })) || [];

    products?.forEach((p) => {
      this.productsFormArray.push(
        this.fb.group(
          {
            productId: [p._id],
            name: [p.name],
            sku: [p.sku],
            originalQuantity: [p.quantity],
            quantity: [0, [Validators.required, Validators.min(0)]],
          },
          { validators: [this.quantityExceededValidator()] }
        )
      );
    });
  }

  getQuantityControl(index: number): any {
    const group = this.productsFormArray.at(index);
    return group ? group.get('quantity') : null;
  }

  quantityExceededValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const quantityCtrl = group.get('quantity');
      const originalQuantity = group.get('originalQuantity')?.value;
      const quantity = quantityCtrl?.value;

      if (quantity !== null && originalQuantity !== null && quantity > originalQuantity) {
        const error = { quantityExceeded: true };
        if (!quantityCtrl?.hasError('quantityExceeded')) {
          quantityCtrl?.setErrors({ ...quantityCtrl?.errors, ...error });
        }
        return error;
      } else {
        if (quantityCtrl?.hasError('quantityExceeded')) {
          const errors = { ...quantityCtrl?.errors };
          delete errors['quantityExceeded'];
          quantityCtrl?.setErrors(Object.keys(errors).length ? errors : null);
        }
      }
      return null;
    };
  }

  onSubmit(): void {
    if (this.transactionId && this.returnedProductsForm.valid) {
      const productsToReturn = this.productsFormArray.value
        .filter((p: any) => p.quantity > 0)
        .map((p: any) => ({
          productId: p.productId,
          quantity: p.quantity,
        }));

      if (productsToReturn.length === 0) {
        return;
      }

      this.store.dispatch(
        returnTransaction({
          id: this.transactionId,
          products: productsToReturn,
        })
      );
    }
  }

  onBack(): void {
    if (this.transactionId) {
      this.router.navigate(['/transactions', this.transactionId]);
    } else {
      this.router.navigate(['/transactions']);
    }
  }
}
