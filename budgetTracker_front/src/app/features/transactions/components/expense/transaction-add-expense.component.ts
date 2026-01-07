import {
  Component,
  ChangeDetectionStrategy,
  inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
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
import { CUSTOM_DATE_FORMATS } from '@shared/utils/date-formats';
import { Utils } from '@shared/utils/utils';
import { CategoriesStateService } from '@shared/services/state/categoriesStateService';
import { TransactionsStateService } from '@app/shared/services/state/transactionsStateService';
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
  private transactionsState = inject(TransactionsStateService);
  private utils = inject(Utils);

  readonly transactionFormExpense: TransactionForm =
    initTransactionFormExpense();

  /* Filtered Categories */
  private categoriesState = inject(CategoriesStateService);
  readonly filteredCategoriesExpense = this.categoriesState.categoriesExpense;

  /* Focus on amount after reset of form */
  @ViewChild('amountInput') amountInput!: ElementRef<HTMLInputElement>;

  /* Add transaction */
  addTransaction(): void {
    const transactionData: Transaction =
      this.transactionFormExpense.getRawValue();

    this.transactionService
      .addTransaction(transactionData)

      .subscribe({
        next: (newTransaction) => {
          this.utils.openSnackBar('Transaction added successfully', '');
          this.transactionFormExpense.reset();
          this.transactionsState.addTransactionExpense(newTransaction);
          this.amountInput.nativeElement.focus();
        },
        error: (err) => {
          this.utils.openSnackBar('Error adding transaction:' + err.error, '');
        },
      });
  }

  /* Form control */
  get amount() {
    return this.transactionFormExpense.get('amount');
  }
  get categoryId() {
    return this.transactionFormExpense.get('categoryId');
  }
  get date() {
    return this.transactionFormExpense.get('date');
  }

  get description() {
    return this.transactionFormExpense.get('description');
  }
}
