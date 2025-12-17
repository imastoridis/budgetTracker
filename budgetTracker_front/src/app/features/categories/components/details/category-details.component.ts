//src\app\features\categories\components\category-update.component.ts

import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/material/material.module';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Utils } from '../../../../shared/utils/utils';
import { Transaction } from '../../../transactions/models/transactions.models';
import { MatNativeDateModule } from '@angular/material/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { UpdateTransaction } from '../../../transactions/components/transaction-update.component';
import { Category } from '../../models/categories.models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TransactionEventsService } from '../../../transactions/services/transaction-events.service';
import { DeleteTransaction } from '../../../transactions/components/transaction-delete.component';

@Component({
  selector: 'app-dialog-category-update',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './category-details.html',
})
export class DetailsCategory {
  readonly TRANSACTION_ARRAY = signal<Transaction[]>(
    inject(MAT_DIALOG_DATA)[1],
  );
  private allCategories: Category[] = inject(MAT_DIALOG_DATA)[0];
  utils = inject(Utils);
  transactionEventsService = inject(TransactionEventsService);
  private dialog = inject(MatDialog);

  /* Table */
  displayedColumns: string[] = ['id', 'date', 'amount', 'action'];
  dataSource = this.TRANSACTION_ARRAY;

  /* Open Update transaction dialog*/
  openUpdateTransaction(transaction: Transaction): void {
    this.dialog.open(UpdateTransaction, {
      data: [this.allCategories, transaction],
    });
  }

  /* Open delete transaction dialog*/
  openDeleteTransaction(transaction: Transaction): void {
    this.dialog.open(DeleteTransaction, {
      data: transaction,
    });
  }

  constructor() {
    /* On Update transaction */
    this.transactionEventsService.updatedTransaction$
      .pipe(takeUntilDestroyed())
      .subscribe((updatedTransaction) => {
        this.TRANSACTION_ARRAY.update((transactions) =>
          transactions.map((transaction) =>
            transaction.id === updatedTransaction.id
              ? updatedTransaction
              : transaction,
          ),
        );
      });

    /* On delete transaction */
    this.transactionEventsService.deletedTransaction$
      .pipe(takeUntilDestroyed())
      .subscribe((deletedTransaction) => {
        this.TRANSACTION_ARRAY.update((transactions) =>
          transactions.filter(
            (transaction) => transaction.id !== deletedTransaction.id,
          ),
        );
      });
  }
}
