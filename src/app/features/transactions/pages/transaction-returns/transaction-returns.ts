import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Transaction, TransactionProduct, TransactionType } from '../../models/transaction.model';
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
  transactionType: TransactionType | undefined;
  TransactionType = TransactionType;
  returnedProductsForm: FormGroup;
  stableProducts: any[] = [];

  productsColumns: TableColumn[] = [
    { field: 'name', header: 'Name', width: '10%' },
    { field: 'sku', header: 'SKU', width: '10%' },
    { field: 'price', header: 'Price', width: '10%', type: 'number' },
    { field: 'originalQuantity', header: 'Bought Qty', width: '10%', type: 'number' },
    { field: 'total', header: 'Total', width: '10%', type: 'number' },
    {
      field: 'alreadyReturnedQuantity',
      header: 'Returned Qty',
      width: '10%',
      type: 'number',
    },
    { field: 'currentStock', header: 'Current Stock', width: '10%', type: 'number' },
    { field: 'quantity', header: 'Return Qty', width: '10%' },
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
            this.transactionType = transaction.transactionType;
            this.setProductsData(transaction.products, transaction.transactionType);
          }
        });
    }
  }

  get productsFormArray(): FormArray {
    return this.returnedProductsForm.get('products') as FormArray;
  }

  private setProductsData(products: TransactionProduct[], transactionType: TransactionType) {
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
            alreadyReturnedQuantity: [p.alreadyReturnedQuantity || 0],
            currentStock: [p.currentStock || 0],
            quantity: [null, [Validators.required, Validators.min(0)]],
          },
          { validators: [this.quantityExceededValidator(transactionType)] }
        )
      );
    });
  }

  getQuantityControl(index: number): any {
    const group = this.productsFormArray.at(index);
    return group ? group.get('quantity') : null;
  }

  quantityExceededValidator(transactionType: TransactionType): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const quantityCtrl = group.get('quantity');
      const originalQuantity = group.get('originalQuantity')?.value || 0;
      const alreadyReturnedQuantity = group.get('alreadyReturnedQuantity')?.value || 0;
      const currentStock = group.get('currentStock')?.value || 0;
      const quantity = quantityCtrl?.value || 0;

      const remainingToReturn = originalQuantity - alreadyReturnedQuantity;
      console.log('remainingToReturn', remainingToReturn);
      console.log('quantity', quantity);

      let error: ValidationErrors | null = null;

      if (quantity > remainingToReturn) {
        error = { quantityExceeded: true, max: { max: remainingToReturn } };
      } else if (transactionType === TransactionType.PURCHASES && quantity > currentStock) {
        error = { stockExceeded: true, max: { max: currentStock } };
      }

      if (error) {
        if (!quantityCtrl?.hasError(Object.keys(error)[0])) {
          quantityCtrl?.setErrors({ ...quantityCtrl?.errors, ...error });
          console.log(error);
        }
        return error;
      } else {
        if (quantityCtrl?.hasError('quantityExceeded') || quantityCtrl?.hasError('stockExceeded')) {
          const errors = { ...quantityCtrl?.errors };
          delete errors['quantityExceeded'];
          delete errors['stockExceeded'];
          quantityCtrl?.setErrors(Object.keys(errors).length ? errors : null);
        }
      }
      return null;
    };
  }

  getMaxReturnable(rowData: any): number {
    const remaining = rowData.originalQuantity - (rowData.alreadyReturnedQuantity || 0);
    if (this.transactionType === TransactionType.PURCHASES) {
      return Math.min(remaining, rowData.currentStock || 0);
    }
    return remaining;
  }

  onSubmit(): void {
    if (this.transactionId && this.returnedProductsForm.valid) {
      const productsToReturn = this.productsFormArray.value
        .filter((p: any) => p.quantity > 0)
        .map((p: any) => ({
          productId: p.productId,
          quantity: p.quantity,
        }));

      this.store.dispatch(
        returnTransaction({
          id: this.transactionId,
          products: productsToReturn,
        })
      );
    } else {
      this.returnedProductsForm.markAllAsTouched();
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
