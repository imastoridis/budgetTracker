import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/material/material.module';
import { TransactionsService } from '../../services/transactions.service';
import { Transaction } from '../../models/transactions.models';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {} from '@angular/material/dialog';
import {
  TransactionFormWithData,
  TransactionForm,
} from '../../forms/transactions-form-builder';

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
  private initialData = inject(MAT_DIALOG_DATA) as Transaction;

  // Initialize the form using the imported factory function
  readonly transactionForm: TransactionForm = TransactionFormWithData(
    this.initialData,
  );

  /* Update transaction */
  deleteTransaction(): void {
    const deletedTransaction: Transaction = this.transactionForm.getRawValue();
    console.log('Deleting transaction:', deletedTransaction);
    this.transactionService
      .deleteTransaction(deletedTransaction as Transaction)
      .subscribe({
        next: (response) => {
          this.dialogRef.close(response);
        },
        error: (err) => {
          console.error('Error updating transaction:', err.error);
        },
      });
  }
}
