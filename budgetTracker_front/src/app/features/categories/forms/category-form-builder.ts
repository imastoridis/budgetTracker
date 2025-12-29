import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from '../models/categories.models';
import { TransactionType } from '../../transactions/models/transaction-types.enum';

/**
 * Defines the structure for the Category FormGroup.
 * This type is exported to ensure type safety when accessing form values
 */
export type CategoryForm = FormGroup<{
  id: FormControl<number | null>;
  name: FormControl<string>;
  userId: FormControl<number | null>;
  type: FormControl<TransactionType | null>;
  totalAmount: FormControl<number | null>;
}>;

/**
 * Creates and initializes the Category FormGroup with required validators if the form already has values.
 * @param initialData The Category object used to pre-fill the form controls.
 * @returns A CategoryForm instance.
 */
export function buildCategoryForm(initialData: Category): CategoryForm {
  return new FormGroup({
    id: new FormControl<number | null>(initialData.id, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    name: new FormControl<string>(initialData.name, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    userId: new FormControl<number | null>(initialData.userId, {
      nonNullable: true,
      validators: [],
    }),
    type: new FormControl<TransactionType | null>(initialData.type, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    totalAmount: new FormControl<number | null>(initialData.totalAmount, {
      nonNullable: true,
      validators: [],
    }),
  }) as CategoryForm;
}

/**
 * Initializes an empty Category FormGroup with required validators.
 * @returns A CategoryForm instance.
 */
export function initCategoryForm(): CategoryForm {
  return new FormGroup({
    id: new FormControl<number | null>(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    userId: new FormControl<number | null>(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    type: new FormControl<TransactionType | null>(TransactionType.INCOME, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    totalAmount: new FormControl<number | null>(0, {
      nonNullable: true,
      validators: [],
    }),
  }) as CategoryForm;
}
