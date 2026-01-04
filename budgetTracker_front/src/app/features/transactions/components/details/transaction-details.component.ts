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
import { MatNativeDateModule } from '@angular/material/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Transaction } from '../../models/transactions.models';
import { TransactionEventsService } from '../../services/transaction-events.service';
import { UpdateTransaction } from '../transaction-update.component';
import { DeleteTransaction } from '../transaction-delete.component';
import { CategoriesStateService } from '../../../../shared/services/state/categoriesStateService';

@Component({
  selector: 'app-dialog-transaction-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './transaction-details.html',
})
export class TransactionDetailsCategory {
  readonly TRANSACTION_ARRAY = signal<Transaction[]>(inject(MAT_DIALOG_DATA));

  private categoriesState = inject(CategoriesStateService);
  readonly allCategories = this.categoriesState.categories;

  private transactionEventsService = inject(TransactionEventsService);
  private dialog = inject(MatDialog);

  /* Table */
  displayedColumns: string[] = [
    'id',
    'date',
    'amount',
    'description',
    'action',
  ];
  dataSource = this.TRANSACTION_ARRAY;

  /* Total amount for category */
  getTotalAmount() {
    return this.TRANSACTION_ARRAY()
      .map((t) => t.amount)
      .reduce((acc, value) => acc + value, 0);
  }

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
