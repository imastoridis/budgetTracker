import {
  Component,
  ChangeDetectionStrategy,
  inject,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { TransactionsService } from '../../services/transactions.service';
import { Transaction } from '../../models/transactions.models';
import { TransactionForm } from '../../forms/transactions-form-builder';
import { initTransactionFormIncome } from '../../forms/transactions-income-form-builder';
import {
  DateAdapter,
  NativeDateAdapter,
  MAT_DATE_FORMATS,
  MatNativeDateModule,
} from '@angular/material/core';
import { CUSTOM_DATE_FORMATS } from '@shared/utils/date-formats';
import { Utils } from '@shared/utils/utils';
import { TransactionsStateService } from '@shared/services/state/transactionsStateService';
import { CategoriesStateService } from '@shared/services/state/categoriesStateService';

@Component({
  selector: 'app-add-transaction-income',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule, MatNativeDateModule],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ],
  templateUrl: './transaction-add-income.html',
})
export class AddTransactionIncome {
  private transactionService = inject(TransactionsService);
  private transactionsState = inject(TransactionsStateService);
  private utils = inject(Utils);

  readonly transactionFormIncome: TransactionForm = initTransactionFormIncome();

  /* Gets filtered categories for income*/
  private categoriesState = inject(CategoriesStateService);
  readonly filteredCategoriesIncome = this.categoriesState.categoriesIncome;

  /* Focus on amount after reset of form */
  @ViewChild('amountInput') amountInput!: ElementRef<HTMLInputElement>;

  /* Add transaction */
  addTransaction(): void {
    const transactionData: Transaction =
      this.transactionFormIncome.getRawValue();

    this.transactionService.addTransaction(transactionData).subscribe({
      next: (response) => {
        this.utils.openSnackBar('Transaction added successfully', '');
        this.transactionFormIncome.reset();
        this.transactionsState.addTransactionIncome(response);
        this.amountInput.nativeElement.focus();
      },
      error: (err) => {
        this.utils.openSnackBar('Error adding transaction:' + err.error, '');
      },
    });
  }

  /* Form control */
  get amount() {
    return this.transactionFormIncome.get('amount');
  }

  get categoryId() {
    return this.transactionFormIncome.get('categoryId');
  }

  get date() {
    return this.transactionFormIncome.get('date');
  }

  get description() {
    return this.transactionFormIncome.get('description');
  }
}
