import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  computed,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../../shared/modules/material/material.module';
import { Category } from '../../../../categories/models/categories.models';
import { MatDialog } from '@angular/material/dialog';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Transaction } from '../../../../transactions/models/transactions.models';
import { UpdateTransaction } from '../../../../transactions/components/transaction-update.component';
import { DeleteTransaction } from '../../../../transactions/components/transaction-delete.component';

@Component({
  selector: 'app-dashboard-summary-expense-transactions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule, CurrencyPipe, DatePipe],
  templateUrl: './expense-transactions.html',
})
export class DashboardSummaryExpenseTransactions {
  private dialog = inject(MatDialog);
  readonly allCategories = input.required<Category[]>();
  readonly allTransactionsExpense = input.required<Transaction[]>();
  readonly totalExpense = input.required<number>();

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
      data: [this.allCategories(), transaction],
    });
  }

  /* Open delete transaction dialog*/
  openDeleteTransaction(transaction: Transaction): void {
    this.dialog.open(DeleteTransaction, {
      data: transaction,
    });
  }
}
