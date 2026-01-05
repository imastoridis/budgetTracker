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
  private dialogRef = inject(MatDialogRef<UpdateTransaction>);
  private utils = inject(Utils);
  private initialData = inject(MAT_DIALOG_DATA) as Transaction;
  readonly transactionFormUpdate: TransactionForm = TransactionFormWithData(
    this.initialData,
  );
  private transactionsState = inject(TransactionsStateService);
  private categoriesState = inject(CategoriesStateService);
  readonly allCategories = this.categoriesState.categories;

  /*  Filters the categories for select  */
  readonly filteredCategories = signal<Category[]>([]);
  readonly filteredCategoriesIncome = this.categoriesState.categoriesIncome;
  readonly filteredCategoriesExpense = this.categoriesState.categoriesExpense;

  /* Finds transaction type*/
  getTransactionType() {
    return this.allCategories().find((category) => {
      return category.id === this.initialData.categoryId;
    })?.type;
  }

  /* Gets filtered categories */
  getFilteredCategories() {
    if (this.getTransactionType() === 'INCOME') {
      this.filteredCategories.set(this.filteredCategoriesIncome());
    } else {
      this.filteredCategories.set(this.filteredCategoriesExpense());
    }
  }

  readonly transactionType = this.allCategories().find((category) => {
    return category.id === this.initialData.categoryId;
  })?.type;

  /* Close dialog */
  /* Update transaction */
  updateTransaction(): void {
    const updatedTransaction: Transaction =
      this.transactionFormUpdate.getRawValue();

    this.transactionService
      .updateTransaction(updatedTransaction as Transaction)
      .subscribe({
        next: (response) => {
          this.dialogRef.close(response);
          this.utils.openSnackBar('Transaction updated successfully', '');
          return this.getTransactionType() === 'INCOME'
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
    this.getTransactionType();
    this.getFilteredCategories();
  }
}
