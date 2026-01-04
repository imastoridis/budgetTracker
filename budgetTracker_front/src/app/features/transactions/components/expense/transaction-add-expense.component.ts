import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/material/material.module';
import { TransactionsService } from '../../services/transactions.service';
import { Transaction } from '../../models/transactions.models';
import { TransactionForm } from '../../forms/transactions-form-builder';
import { initTransactionFormExpense } from '../../forms/transactions-expense-form-builder';
import {
  DateAdapter,
  NativeDateAdapter,
  MAT_DATE_FORMATS,
  MatNativeDateModule,
} from '@angular/material/core';
import { CUSTOM_DATE_FORMATS } from '../../../../shared/utils/date-formats';
import { Utils } from '../../../../shared/utils/utils';
import { TransactionEventsService } from '../../services/transaction-events.service';
import { CategoriesStateService } from '../../../../shared/services/state/categoriesStateService';
@Component({
  selector: 'app-add-transaction-expense',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule, MatNativeDateModule],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ],
  templateUrl: './transaction-add-expense.html',
})
export class AddTransactionExpense {
  private transactionService = inject(TransactionsService);
  private utils = inject(Utils);
  private transactionEventsService = inject(TransactionEventsService);
  readonly transactionFormExpense: TransactionForm =
    initTransactionFormExpense();

  /* Categories */
  private categoriesState = inject(CategoriesStateService);
  readonly allCategories = this.categoriesState.categories;
  readonly allCategoriesFiltered = this.allCategories().filter(
    (category) => category.type === 'EXPENSE',
  );

  /* Add transaction */
  addTransaction(): void {
    const transactionData: Transaction =
      this.transactionFormExpense.getRawValue();

    this.transactionService.addTransaction(transactionData).subscribe({
      next: (newTransaction) => {
        this.utils.openSnackBar('Transaction added successfully', '');
        this.transactionFormExpense.reset();

        this.transactionEventsService.notifyTransactionAdded(newTransaction);
      },
      error: (err) => {
        this.utils.openSnackBar(err.message, '');
      },
    });
  }

  /* Functions for forms */
  get amount() {
    return this.transactionFormExpense.get('amount');
  }
  get categoryId() {
    return this.transactionFormExpense.get('categoryId');
  }
  get date() {
    return this.transactionFormExpense.get('date');
  }
}
