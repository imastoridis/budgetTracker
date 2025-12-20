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
import {
  TransactionFormWithData,
  TransactionForm,
} from '../forms/transactions-form-builder';
import { TransactionEventsService } from '../services/transaction-events.service';
import { Utils } from '../../../shared/utils/utils';
import {
  DateAdapter,
  NativeDateAdapter,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { CUSTOM_DATE_FORMATS } from '../../../shared/utils/date-formats';

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
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ],
  templateUrl: './transaction-update.html',
})
export class UpdateTransaction {
  private transactionService = inject(TransactionsService);
  private transactionEventService = inject(TransactionEventsService);
  private dialogRef = inject(MatDialogRef<UpdateTransaction>);
  private initialData = inject(MAT_DIALOG_DATA)[1] as Transaction;
  readonly allCategories = inject(MAT_DIALOG_DATA)[0];
  private utils = inject(Utils);
  readonly transactionFormUpdate: TransactionForm = TransactionFormWithData(
    this.initialData,
  );

  /* Update transaction */
  updateTransaction(): void {
    const updatedTransaction: Transaction =
      this.transactionFormUpdate.getRawValue();

    this.transactionService
      .updateTransaction(updatedTransaction as Transaction)
      .subscribe({
        next: (response) => {
          this.dialogRef.close(response);
          this.transactionEventService.notifyTransactionUpdated(response);
          this.utils.openSnackBar('Transaction updated successfully', '');
        },
        error: (err) => {
          this.utils.openSnackBar(
            'Error updating transaction:' + err.error,
            '',
          );
        },
      });
  }

  get amount() {
    return this.transactionFormUpdate.get('amount');
  }

  get categoryId() {
    return this.transactionFormUpdate.get('categoryId');
  }

  get date() {
    return this.transactionFormUpdate.get('date');
  }
}
