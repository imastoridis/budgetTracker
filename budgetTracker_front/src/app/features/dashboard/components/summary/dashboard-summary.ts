import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/material/material.module';
import { Category } from '../../../categories/models/categories.models';
import { DashboardSummaryCategories } from './components/categories';
import { DashboardSummaryIncomeTransactions } from './components/income-transactions';
import { DashboardSummaryExpenseTransactions } from './components/expense-transactions';
import { Transaction } from '../../../transactions/models/transactions.models';
@Component({
  selector: 'app-dashboard-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    DashboardSummaryCategories,
    DashboardSummaryIncomeTransactions,
    DashboardSummaryExpenseTransactions,
  ],
  templateUrl: './dashboard-summary.html',
})
export class DashboardSummary {
  readonly allCategories = input.required<Category[]>();
  readonly allTransactionsIncome = input.required<Transaction[]>();
  // readonly allTransactionsExpense = input.required<Transaction>();
}
