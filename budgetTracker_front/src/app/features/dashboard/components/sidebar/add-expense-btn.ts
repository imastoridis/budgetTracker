import {
  Component,
  ChangeDetectionStrategy,
  inject,
  output,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/material/material.module';
import { TransactionsService } from '../../../transactions/services/transactions.service';
import { Transaction } from '../../../transactions/models/transactions.models';
import { UpdateCategory } from '../../../categories/components/category-update.component';
import {
  initTransactionForm,
  TransactionForm,
} from '../../../transactions/forms/transactions-form-builder';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-expense-btn',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule],
  template: `
    <button
      (click)="openDialogAddIncome()"
      mat-raised-button
      class="!bg-red-700 hover:!bg-red-800 !text-white !w-full"
    >
      Add expense
    </button>
  `,
})
export class AddExpenseBtn {
  private categoriesService = inject(TransactionsService);
  readonly categoryForm: TransactionForm = initTransactionForm();
  categoryAdded = output<Transaction>();

  dialog = inject(MatDialog);

  /* Open add transaction dialog for income */
  openDialogAddIncome(): void {
    const dialogRef = this.dialog.open(UpdateCategory);

    //After update, update the signal
    dialogRef.afterClosed().subscribe((result: Transaction) => {
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
