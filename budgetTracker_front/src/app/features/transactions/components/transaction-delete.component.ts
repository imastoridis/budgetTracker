import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  TransactionFormWithData,
  TransactionForm,
} from '../forms/transactions-form-builder';
import { Transaction } from '../models/transactions.models';
import { TransactionsService } from '../services/transactions.service';
import { Utils } from '@shared/utils/utils';
import { TransactionsStateService } from '@shared/services/state/transactionsStateService';

@Component({
  selector: 'app-dialog-transaction-delete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './transaction-delete.html',
})
export class DeleteTransaction {
  private transactionService = inject(TransactionsService);
  private transactionsState = inject(TransactionsStateService);
  private dialogRef = inject(MatDialogRef<DeleteTransaction>);
  private utils = inject(Utils);

  /* Form data */
  private initialData = inject(MAT_DIALOG_DATA) as Transaction;
  readonly transactionForm: TransactionForm = TransactionFormWithData(
    this.initialData,
  );

  /* Finds the type of transaction */
  readonly transactionType = this.transactionsState.findTransactionType(
    this.initialData,
  );

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
