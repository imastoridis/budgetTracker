import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from '../models/transactions.models';

/**
 * Defines the structure for the Category FormGroup.
 * This type is exported to ensure type safety when accessing form values
 */
export type CategoryForm = FormGroup<{
  id: FormControl<number | null>;
  name: FormControl<string>;
  userId: FormControl<number | null>;
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
      validators: [Validators.required],
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
  }) as CategoryForm;
}
