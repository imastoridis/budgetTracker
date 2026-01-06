import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
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
import { Utils } from '@shared/utils/utils';
import {
  DateAdapter,
  NativeDateAdapter,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { CUSTOM_DATE_FORMATS } from '@shared/utils/date-formats';
import { TransactionsStateService } from '@shared/services/state/transactionsStateService';
import { CategoriesStateService } from '@shared/services/state/categoriesStateService';
import { Category } from '@app/features/categories/models/categories.models';

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
  private transactionsState = inject(TransactionsStateService);
  private categoriesState = inject(CategoriesStateService);
  private dialogRef = inject(MatDialogRef<UpdateTransaction>);
  private utils = inject(Utils);

  /* Form data */
  private initialData = inject(MAT_DIALOG_DATA) as Transaction;
  readonly transactionFormUpdate: TransactionForm = TransactionFormWithData(
    this.initialData,
  );

  /*  Filters the categories for select  */
  readonly filteredCategories = signal<Category[]>([]);
  readonly filteredCategoriesIncome = this.categoriesState.categoriesIncome;
  readonly filteredCategoriesExpense = this.categoriesState.categoriesExpense;

  /* Finds the type of transaction */
  readonly transactionType = this.transactionsState.findTransactionType(
    this.initialData,
  );

  /* Update transaction */
  updateTransaction(): void {
    const rawValues = this.transactionFormUpdate.getRawValue();

    //Modifiy date for back
    const dateValue = rawValues.date as string | Date;
    const updatedTransaction: Transaction = {
      ...rawValues,
      date: this.utils.formatDate(new Date(dateValue)) as unknown as Date,
    };

    this.transactionService
      .updateTransaction(updatedTransaction as Transaction)
      .subscribe({
        next: (response) => {
          this.dialogRef.close(response);
          this.utils.openSnackBar('Transaction updated successfully', '');
          return this.transactionType === 'INCOME'
            ? this.transactionsState.updateTransactionIncome(response)
            : this.transactionsState.updateTransactionExpense(response);
        },
        error: (err) => {
          this.utils.openSnackBar(
            'Error updating transaction:' + err.error,
            '',
          );
        },
      });
  }

  /* Gets filtered categories */
  getFilteredCategories() {
    if (this.transactionType === 'INCOME') {
      this.filteredCategories.set(this.filteredCategoriesIncome());
    } else {
      this.filteredCategories.set(this.filteredCategoriesExpense());
    }
  }

  /* Form control */
  get amount() {
    return this.transactionFormUpdate.get('amount');
  }

  get categoryId() {
    return this.transactionFormUpdate.get('categoryId');
  }

  get date() {
    return this.transactionFormUpdate.get('date');
  }

  get description() {
    return this.transactionFormUpdate.get('description');
  }

  constructor() {
    this.getFilteredCategories();
  }
}
