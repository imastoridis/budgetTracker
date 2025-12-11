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
import { AddTransactionExpense } from '../../../transactions/components/expense/transaction-add-expense.component';
import { MatDialog } from '@angular/material/dialog';
import { Category } from '../../../categories/models/categories.models';

@Component({
  selector: 'app-add-expense-btn',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule],
  template: `
    <button
      (click)="openDialogAddExpense()"
      mat-raised-button
      class="!bg-red-700 hover:!bg-red-800 !text-white !w-full"
    >
      Add expense
    </button>
  `,
})
export class AddExpenseBtn {
  transactionAdded = output<Transaction>();
  dialog = inject(MatDialog);
  allCategories = input.required<Category[]>();

  /* Open add transaction dialog for expense */
  openDialogAddExpense(): void {
    this.dialog.open(AddTransactionExpense, {
      data: this.allCategories,
    });
  }
}
