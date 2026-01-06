//src\app\features\categories\components\category-update.component.ts

import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Transaction } from '../../../../transactions/models/transactions.models';
import { UpdateTransaction } from '../../../../transactions/components/transaction-update.component';
import { DeleteTransaction } from '../../../../transactions/components/transaction-delete.component';
import { TransactionsStateService } from '@app/shared/services/state/transactionsStateService';
import { TransactionsService } from '../../../../transactions/services/transactions.service';
import { Category } from '@app/features/categories/models/categories.models';

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
  private dialog = inject(MatDialog);
  readonly category = signal<Category>(inject(MAT_DIALOG_DATA));

  /* Open transaction details dialog */
  transactionsService = inject(TransactionsService);
  private transactionState = inject(TransactionsStateService);
  private transactionsIncome = this.transactionState.transactionsIncome;
  private transactionsExpense = this.transactionState.transactionsExpense;

  /* Filters transactions */
  private TRANSACTION_ARRAY = computed(() => {
    if (this.category().type === 'INCOME') {
      return this.transactionsIncome().filter(
        (transaction) => this.category().id === transaction.categoryId,
      );
    } else {
      return this.transactionsExpense().filter(
        (transaction) => this.category().id === transaction.categoryId,
      );
    }
  });

  /* Table */
  displayedColumns: string[] = [
    'id',
    'date',
    'categoryName',
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
      data: transaction,
    });
  }

  /* Open delete transaction dialog*/
  openDeleteTransaction(transaction: Transaction): void {
    this.dialog.open(DeleteTransaction, {
      data: transaction,
    });
  }
}
