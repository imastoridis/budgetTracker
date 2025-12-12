import {
  Component,
  ChangeDetectionStrategy,
  inject,
  output,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/material/material.module';
import { TransactionsService } from '../../services/transactions.service';
import { Transaction } from '../../models/transactions.models';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TransactionForm } from '../../forms/transactions-form-builder';
import { initTransactionFormIncome } from '../../forms/transactions-income-form-builder';
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
  private utils = inject(Utils);

  readonly transactionFormIncome: TransactionForm = initTransactionFormIncome();
  readonly transactionTypes = Object.values(TransactionType);
  readonly transactionAdded = output<Transaction>();

  allCategories: Category[] = inject(MAT_DIALOG_DATA);

  /* Add transaction */
  addTransaction(): void {
    const transactionData: Transaction =
      this.transactionFormIncome.getRawValue();

    this.transactionService.addTransaction(transactionData).subscribe({
      next: (response) => {
        this.utils.openSnackBar('Transaction added successfully', '');
        this.transactionFormIncome.reset();
        this.transactionAdded.emit(response);
      },
      error: (err) => {
        this.utils.openSnackBar(err.message, '');
      },
    });
  }

  get amount() {
    return this.transactionFormIncome.get('amount');
  }

  get categoryId() {
    return this.transactionFormIncome.get('categoryId');
  }

  get date() {
    return this.transactionFormIncome.get('date');
  }
}
