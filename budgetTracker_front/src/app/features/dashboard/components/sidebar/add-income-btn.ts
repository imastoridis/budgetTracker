import {
  Component,
  ChangeDetectionStrategy,
  inject,
  output,
  input,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/material/material.module';
import { Transaction } from '../../../transactions/models/transactions.models';
import { AddTransactionIncome } from '../../../transactions/components/income/transaction-add-income.component';
import { MatDialog } from '@angular/material/dialog';
import { Category } from '../../../categories/models/categories.models';

@Component({
  selector: 'app-add-income-btn',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule],
  template: `
    <button
      (click)="openDialogAddIncome()"
      mat-raised-button
      class="!bg-green-700 hover:!bg-green-800 !text-white  !w-full"
    >
      Add income
    </button>
  `,
})
export class AddIncomeBtn {
  categoryAdded = output<Transaction>();
  dialog = inject(MatDialog);
  allCategories = input.required<Category[]>();

  /* Open add transaction dialog for income */
  openDialogAddIncome(): void {
    this.dialog.open(AddTransactionIncome, {
      data: this.allCategories,
    });
  }
}
