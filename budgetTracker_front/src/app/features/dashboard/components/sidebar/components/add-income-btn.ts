import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MaterialModule } from '@shared/modules/material/material.module';
import { AddTransactionIncome } from '@app/features/transactions/components/income/transaction-add-income.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-income-btn',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule],
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
  /* Open add transaction dialog for income */
  dialog = inject(MatDialog);

  openDialogAddIncome(): void {
    this.dialog.open(AddTransactionIncome);
  }
}
