import {
  Component,
  ChangeDetectionStrategy,
  inject,
  output,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/material/material.module';
import { TransactionsService } from '../../../transactions/services/transactions.service';
import { Category } from '../../../transactions/models/transactions.models';
import { UpdateCategory } from '../../../categories/components/category-update.component';

import {} from '@angular/material/dialog';
import {
  initCategoryForm,
  CategoryForm,
} from '../../../transactions/forms/transactions-form-builder';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-total-month-display',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule],
  template: `
    <div class="flex flex-col gap-4">
      <div
        class="flex border-b align-items-center  text-xl font-semibold text-sky-700"
      >
        <mat-icon aria-label="face icon" fontIcon="calendar_month"></mat-icon>
        <h2>This month</h2>
      </div>

      <div class="flex flex-col gap-2">
        <div class="flex flex-row justify-between">
          <span class="text-gray-600">Total Income:</span>
          <span class="font-medium text-green-600">$5,000</span>
        </div>
        <div class="flex flex-row justify-between">
          <span class="text-gray-600">Total Expenses:</span>
          <span class="font-medium text-red-600">$3,200</span>
        </div>
        <div class="flex flex-row justify-between border-t pt-2">
          <span class="text-gray-800 font-semibold">Balance:</span>
          <span class="font-semibold text-gray-800">$1,800</span>
        </div>
      </div>
    </div>
  `,
})
export class TotalMonthDisplay {
  private categoriesService = inject(TransactionsService);
  readonly categoryForm: CategoryForm = initCategoryForm();
  categoryAdded = output<Category>();

  dialog = inject(MatDialog);

  /* Open add transaction dialog for income */
  openDialogAddIncome(): void {
    const dialogRef = this.dialog.open(UpdateCategory);

    //After update, update the signal
    dialogRef.afterClosed().subscribe((result: Category) => {
      /*      if (result) {
        this.allCategories.update((categories) =>
          categories.map((cat) => {
            return cat.id === result.id ? result : cat;
          }),
        );
      } */
    });
  }
}
