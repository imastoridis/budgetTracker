import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Transaction } from '../models/transactions.models';

/**
 * Defines the structure for the Transaction FormGroup.
 * Ensures type safety when accessing form values
 */
export type TransactionForm = FormGroup<{
  id: FormControl<number | null>;
  amount: FormControl<number>;
  description: FormControl<string | ''>;
  date: FormControl<Date>;
  categoryId: FormControl<number | null>;
}>;

/**
 * Creates and initializes the Transaction FormGroup with required validators if the form already has values.
 * @param initialData The Transaction object used to pre-fill the form controls.
 * @returns A TransactionForm instance.
 */
export function TransactionFormWithData(
  initialData: Transaction,
): TransactionForm {
  return new FormGroup({
    id: new FormControl<number | null>(initialData.id, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    amount: new FormControl<number>(initialData.amount, {
      nonNullable: true,
      validators: [
        Validators.required,
        numericValidator(),
        Validators.min(0.01),
      ],
    }),
    description: new FormControl<string | ''>(initialData.description, {
      nonNullable: false,
      validators: [],
    }),
    date: new FormControl<Date>(initialData.date, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    categoryId: new FormControl<number | null>(initialData.categoryId, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  }) as TransactionForm;
}

/**
 * Creates and initializes the Transaction FormGroup with required validators .
 * @returns A TransactionForm instance.
 */
export function initTransactionForm(): TransactionForm {
  return new FormGroup({
    id: new FormControl<number | null>(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    amount: new FormControl<number>(0, {
      nonNullable: true,
      validators: [
        Validators.required,
        numericValidator(),
        Validators.min(0.01),
      ],
    }),
    description: new FormControl<string | ''>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    date: new FormControl<Date>(new Date(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    categoryId: new FormControl<number | null>(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  }) as TransactionForm;
}

/**
 * Custom validator to check if the input contains non-numeric text.
 * Note: input type="number" allows 'e', '+', '-', and '.'
 */
export function numericValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === '') {
      return null; // Let the 'required' validator handle empty state
    }

    // Regular expression to check for any non-numeric, non-decimal, non-sign character.
    // If the value contains anything that makes it an invalid number, we fail.
    // parseFloat(value) returns NaN if the string is truly non-numeric.
    const isNumeric = !isNaN(parseFloat(value)) && isFinite(value);
    // If it is NOT numeric, return the custom error object.
    return !isNumeric ? { hasText: true } : null;
  };
}
