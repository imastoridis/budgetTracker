import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { MatDialog } from '@angular/material/dialog';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Transaction } from '@app/features/transactions/models/transactions.models';
import { UpdateTransaction } from '@app/features/transactions/components/transaction-update.component';
import { DeleteTransaction } from '@app/features/transactions/components/transaction-delete.component';
import { CategoriesStateService } from '@shared/services/state/categoriesStateService';
import { TransactionsStateService } from '@shared/services/state/transactionsStateService';

@Component({
  selector: 'app-dashboard-summary-expense-transactions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule, CurrencyPipe, DatePipe],
  templateUrl: './expense-transactions.html',
})
export class DashboardSummaryExpenseTransactions {
  private dialog = inject(MatDialog);

  private categoriesState = inject(CategoriesStateService);
  readonly allCategories = this.categoriesState.categories();

  private transactionsState = inject(TransactionsStateService);
  readonly allTransactionsExpense = this.transactionsState.transactionsExpense;
  readonly totalExpense = this.transactionsState.totalExpense;

  /* Table */
  dataSource = computed(() => this.allTransactionsExpense());

  displayedColumns: string[] = [
    'id',
    'date',
    'categoryName',
    'amount',
    'description',
    'action',
  ];

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
