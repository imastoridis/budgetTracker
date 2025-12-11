import {
  Component,
  ChangeDetectionStrategy,
  inject,
  output,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/material/material.module';
import { TransactionsService } from '../../../transactions/services/transactions.service';
import { UpdateCategory } from '../../../categories/components/category-update.component';

import {} from '@angular/material/dialog';

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
          <span class="font-medium text-green-600">€ {{ totalIncome() }}</span>
        </div>
        <div class="flex flex-row justify-between">
          <span class="text-gray-600">Total Expenses:</span>
          <span class="font-medium text-red-600">€ {{ totalExpenses() }}</span>
        </div>
        <div class="flex flex-row justify-between border-t pt-2">
          <span class="text-gray-800 font-semibold">Balance:</span>
          <span class="font-semibold text-gray-800">€ {{ balance() }}</span>
        </div>
      </div>
    </div>
  `,
})
export class TotalMonthDisplay {
  private categoriesService = inject(TransactionsService);
  readonly totalIncome = signal<string>('0');
  readonly totalExpenses = signal<string>('0');
  readonly balance = signal<string>('0');

  /* readonly categoryForm: CategoryForm = initCategoryForm();
  categoryAdded = output<Category>(); */

  dialog = inject(MatDialog);

  /* Open add transaction dialog for income */
  openDialogAddIncome(): void {
    const dialogRef = this.dialog.open(UpdateCategory);
  }
}
