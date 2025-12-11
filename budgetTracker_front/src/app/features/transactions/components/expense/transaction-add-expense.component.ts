import {
  Component,
  ChangeDetectionStrategy,
  inject,
  output,
  computed,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/material/material.module';
import { TransactionsService } from '../../services/transactions.service';
import { Transaction } from '../../models/transactions.models';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TransactionForm } from '../../forms/transactions-form-builder';
import { initTransactionFormExpense } from '../../forms/transactions-expense-form-builder';
import { TransactionType } from '../../models/transaction-types.enum';
import {
  DateAdapter,
  NativeDateAdapter,
  MAT_DATE_FORMATS,
  MatNativeDateModule,
} from '@angular/material/core';
import { CUSTOM_DATE_FORMATS } from '../../../../shared/utils/date-formats';
import { Utils } from '../../../../shared/utils/utils';
import { Category } from '../../../categories/models/categories.models';

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
  /* Injects */
  private transactionService = inject(TransactionsService);
  private utils = inject(Utils);

  /* Variables */
  readonly transactionFormExpense: TransactionForm =
    initTransactionFormExpense();
  readonly transactionTypes = Object.values(TransactionType);
  readonly transactionAdded = output<Transaction>();
  allCategories = inject(MAT_DIALOG_DATA) as Category[];

  /* Get filtered categories for expense */
  readonly filteredCategories = computed(() => {
    return this.allCategories.filter(
      (category) => category.type === TransactionType.EXPENSE,
    );
  });

  /**
   * Functions
   */

  /* Add transaction */
  addTransaction(): void {
    const transactionData: Transaction =
      this.transactionFormExpense.getRawValue();

    this.transactionService.addTransaction(transactionData).subscribe({
      next: (response) => {
        this.utils.openSnackBar('Transaction added successfully', '');
        this.transactionFormExpense.reset();
        this.transactionAdded.emit(response);
      },
      error: (err) => {
        this.utils.openSnackBar(err.message, '');
        console.error('Error adding transaction:', err);
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
