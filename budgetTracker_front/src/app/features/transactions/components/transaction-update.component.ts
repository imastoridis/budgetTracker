import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../shared/modules/material/material.module';
import { TransactionsService } from '../services/transactions.service';
import { Transaction } from '../models/transactions.models';
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
} from '../forms/transactions-form-builder';

@Component({
  selector: 'app-dialog-transaction-update',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MaterialModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
  ],
  template: ` <h2 mat-dialog-title>Update transaction</h2>
    <form [formGroup]="transactionForm">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="!mt-5">
          <mat-label>Transaction</mat-label>
          <input matInput formControlName="name" cdkFocusInitial required />
          <!-- Validation Feedback -->
          @if (
            transactionForm.controls.amount.touched &&
            transactionForm.controls.amount.hasError('required')
          ) {
            <mat-error> Transaction name is required. </mat-error>
          }
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button matButton [mat-dialog-close] class="!text-red-700">
          Cancel
        </button>
        <button
          matButton
          (click)="updateTransaction()"
          [disabled]="transactionForm.invalid"
        >
          Ok
        </button>
      </mat-dialog-actions>
    </form>`,
})
export class UpdateTransaction {
  private transactionService = inject(TransactionsService);
  private dialogRef = inject(MatDialogRef<UpdateTransaction>);
  private initialData = inject(MAT_DIALOG_DATA) as Transaction;

  // Initialize the form using the imported factory function
  readonly transactionForm: TransactionForm = TransactionFormWithData(
    this.initialData,
  );

  /* Update transaction */
  updateTransaction(): void {
    const updatedTransaction: Transaction = this.transactionForm.getRawValue();

    this.transactionService
      .updateTransaction(updatedTransaction as Transaction)
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
