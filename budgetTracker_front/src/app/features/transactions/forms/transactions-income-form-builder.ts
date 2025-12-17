import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TransactionForm } from './transactions-form-builder';
import { numericValidator } from './transactions-form-builder';

/**
 * Creates and initializes the Transaction FormGroup with required validators .
 * @returns A TransactionForm instance.
 */
export function initTransactionFormIncome(): TransactionForm {
  return new FormGroup({
    id: new FormControl<number | null>(null),
    amount: new FormControl<number>(0, {
      nonNullable: true,
      validators: [
        Validators.required,
        numericValidator(),
        Validators.min(0.01),
      ],
    }),
    description: new FormControl<string>(''),
    date: new FormControl<Date>(new Date(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    categoryId: new FormControl<number | null>(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    userId: new FormControl<number | null>(null),
  }) as TransactionForm;
}
