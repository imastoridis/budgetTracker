import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MaterialModule } from '@shared/modules/material/material.module';
import { DashboardSummaryCategories } from './components/categories';
import { DashboardSummaryIncomeTransactions } from './components/income-transactions';
import { DashboardSummaryExpenseTransactions } from './components/expense-transactions';
@Component({
  selector: 'app-dashboard-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MaterialModule,
    DashboardSummaryCategories,
    DashboardSummaryIncomeTransactions,
    DashboardSummaryExpenseTransactions,
  ],
  templateUrl: './dashboard-summary.html',
})
export class DashboardSummary {}
