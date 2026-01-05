import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  afterNextRender,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { MaterialModule } from '@shared/modules/material/material.module';
import { Utils } from '@shared/utils/utils';
import { DashboardEventsService } from './services/dashboard-events.service';
/* Categories */
import { CategoriesService } from '../categories/services/categories.service';
/* Transactions */
import { TransactionsService } from '../transactions/services/transactions.service';
/* Dashboard children*/
import { DashboardHeader } from './components/dashboard-header';
import { DashboardSidebar } from './components/sidebar/dashboard-sidebar';
import { DashboardSummary } from './components/summary/dashboard-summary';
import { CategoriesStateService } from '@shared/services/state/categoriesStateService';
import { TransactionsStateService } from '@shared/services/state/transactionsStateService';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MaterialModule,
    DashboardHeader,
    DashboardSidebar,
    DashboardSummary,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private utils = inject(Utils);
  readonly date = signal<Date>(new Date());
  private dashboardEventsService = inject(DashboardEventsService);

  /**
   * Categories
   */
  private categoriesState = inject(CategoriesStateService);
  private categoriesService = inject(CategoriesService);

  /* Get all categories for user with total amount of each category*/
  getCategoriesWithTotal(date: Date): void {
    this.categoriesService.getCategoriesWithTotal(date).subscribe({
      next: (categories) => {
        this.categoriesState.setCategories(categories);
      },
      error: (err) => {
        this.categoriesState.setCategories([]);
        this.utils.openSnackBar(err.error.message, '');
      },
    });
  }

  /**
   * Transactions
   */
  private transactionsState = inject(TransactionsStateService);
  private transactionsService = inject(TransactionsService);

  /* Get Income Transactions*/
  getAllTransactionsIncome(): void {
    this.transactionsService.getAllTransactionsIncome(this.date()).subscribe({
      next: (transactionsIncome) => {
        this.transactionsState.setTransactionsIncome(transactionsIncome);
      },
      error: (err) => {
        this.transactionsState.setTransactionsIncome([]);
        this.utils.openSnackBar(err.error.message, '');
      },
    });
  }

  /* Get Expense transactions   */
  getAllTransactionsExpense(): void {
    this.transactionsService.getAllTransactionsExpense(this.date()).subscribe({
      next: (transactionsExpense) => {
        this.transactionsState.setTransactionsExpense(transactionsExpense);
      },
      error: (err) => {
        this.utils.openSnackBar(err.error.message, '');
        this.transactionsState.setTransactionsExpense([]);
        return of([]);
      },
    });
  }

  /**
   * Total amounts
   * */

  /* Gets total of income for a month */
  getTotalIncomeByMonth(date: Date): void {
    this.transactionsService.getTotalIncomeByMonth(date).subscribe({
      next: (totalIncome) => {
        this.transactionsState.setTotalIncome(+totalIncome);
      },
      error: (err) => {
        this.utils.openSnackBar(err.error, '');
      },
    });
  }

  /* Gets total of expense for a month */
  getTotalExpensesByMonth(date: Date): void {
    this.transactionsService.getTotalExpensesByMonth(date).subscribe({
      next: (totalExpenses) => {
        this.transactionsState.setTotalExpense(+totalExpenses);
      },
      error: (err) => {
        this.utils.openSnackBar(err.error, '');
      },
    });
  }

  constructor() {
    /* On selected date change */
    this.dashboardEventsService.changedDate$
      .pipe(takeUntilDestroyed())
      .subscribe((newDate) => {
        this.date.set(newDate);
        this.getCategoriesWithTotal(this.date());
        this.getAllTransactionsIncome();
        this.getAllTransactionsExpense();
        this.getTotalIncomeByMonth(this.date());
        this.getTotalExpensesByMonth(this.date());
      });

    /* Initial data load */
    afterNextRender(() => {
      this.getCategoriesWithTotal(this.date());
      this.getAllTransactionsIncome();
      this.getAllTransactionsExpense();
      this.getTotalIncomeByMonth(this.date());
      this.getTotalExpensesByMonth(this.date());
    });
  }
}
