import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MaterialModule } from '@shared/modules/material/material.module';
import { AddTransactionExpense } from '@app/features/transactions/components/expense/transaction-add-expense.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-expense-btn',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule],
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
  dialog = inject(MatDialog);

  /* Open add transaction dialog for expense */
  openDialogAddExpense(): void {
    this.dialog.open(AddTransactionExpense);
  }
}
