import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../../shared/modules/material/material.module';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Transaction } from '../../../../transactions/models/transactions.models';
import { MatDialog } from '@angular/material/dialog';
import { UpdateTransaction } from '../../../../transactions/components/transaction-update.component';
import { DeleteTransaction } from '../../../../transactions/components/transaction-delete.component';
import { CategoriesStateService } from '../../../../../shared/services/state/categoriesStateService';
import { TransactionsStateService } from '../../../../../shared/services/state/transactionsStateService';

@Component({
  selector: 'app-dashboard-summary-income-transactions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule, CurrencyPipe, DatePipe],
  templateUrl: './income-transactions.html',
})
export class DashboardSummaryIncomeTransactions {
  private dialog = inject(MatDialog);

  private categoriesState = inject(CategoriesStateService);
  readonly allCategories = this.categoriesState.categories();

  private transactionsState = inject(TransactionsStateService);
  readonly allTransactionsIncome = this.transactionsState.transactionsIncome;
  readonly totalIncome = this.transactionsState.totalIncome;

  /* Table */
  dataSource = computed(() => this.allTransactionsIncome());

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
