import { FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * Defines the structure for the Date FormGroup.
 * This type is exported to ensure type safety when accessing form values
 */
export type DateForm = FormGroup<{
  date: FormControl<Date>;
}>;

/**
 * Creates and initializes the Date FormGroup with required validators if the form already has values.
 * @param initialData The Date object used to pre-fill the form controls.
 * @returns A DateForm instance.
 */
export function DateFormWithData(initialData: Date): DateForm {
  return new FormGroup({
    date: new FormControl<Date>(initialData, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  }) as DateForm;
}

/**
 * Creates and initializes the Date FormGroup with required validators .
 * @returns A DateForm instance.
 */
export function initDateForm(): DateForm {
  return new FormGroup({
    date: new FormControl<Date>(new Date(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
  }) as DateForm;
}
