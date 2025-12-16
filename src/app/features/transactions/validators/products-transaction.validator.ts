import { ValidatorFn, AbstractControl, ValidationErrors, FormArray } from '@angular/forms';
import { TransactionType } from '../models/transaction.model';

export function productsRequiredForTransaction(): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const type = form.get('transactionType')?.value;
    const products = form.get('products') as FormArray;

    const requiresProducts = type === TransactionType.SALES || type === TransactionType.PURCHASES;

    if (requiresProducts && (!products || products.length === 0)) {
      return { productsRequired: true };
    }

    return null;
  };
}
