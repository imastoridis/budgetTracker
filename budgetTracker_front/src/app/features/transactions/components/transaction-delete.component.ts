import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  TransactionFormWithData,
  TransactionForm,
} from '../forms/transactions-form-builder';
import { Transaction } from '../models/transactions.models';
import { TransactionsService } from '../services/transactions.service';
import { Utils } from '@shared/utils/utils';
import { TransactionsStateService } from '@shared/services/state/transactionsStateService';
import { CategoriesStateService } from '@shared/services/state/categoriesStateService';

@Component({
  selector: 'app-dialog-transaction-delete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MaterialModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
  ],
  template: ` <h2 mat-dialog-title>Delete transaction</h2>
    <form [formGroup]="transactionForm">
      <mat-dialog-content
        >Are you sure you want to delete this transaction</mat-dialog-content
      >
      <mat-dialog-actions>
        <button matButton mat-dialog-close>Close</button>
        <button matButton (click)="deleteTransaction()">Ok</button>
      </mat-dialog-actions>
    </form>`,
})
export class DeleteTransaction {
  private transactionService = inject(TransactionsService);
  private dialogRef = inject(MatDialogRef<DeleteTransaction>);
  private utils = inject(Utils);

  private initialData = inject(MAT_DIALOG_DATA) as Transaction;
  readonly transactionForm: TransactionForm = TransactionFormWithData(
    this.initialData,
  );

  private transactionsState = inject(TransactionsStateService);
  private categoriesState = inject(CategoriesStateService);
  readonly allCategories = this.categoriesState.categories;

  readonly transactionType = this.allCategories().find((category) => {
    return category.id === this.initialData.categoryId;
  })?.type;

  /* Update transaction */
  deleteTransaction(): void {
    const deletedTransaction: Transaction = this.transactionForm.getRawValue();
    this.transactionService
      .deleteTransaction(deletedTransaction as Transaction)
      .subscribe({
        next: (deletedTransaction) => {
          this.utils.openSnackBar('Transaction deleted successfully', '');
          this.dialogRef.close(deletedTransaction);
          return this.transactionType === 'INCOME'
            ? this.transactionsState.deleteTransactionIncome(this.initialData)
            : this.transactionsState.deleteTransactionExpense(this.initialData);
        },
        error: (err) => {
          this.utils.openSnackBar('Error deleting transaction' + err.error, '');
        },
      });
  }
}
