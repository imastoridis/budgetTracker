import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../../shared/modules/material/material.module';
import { Category } from '../../../../categories/models/categories.models';
import { MatDialog } from '@angular/material/dialog';
import { UpdateCategory } from '../../../../categories/components/category-update.component';
import { DeleteCategory } from '../../../../categories/components/category-delete.component';
import { TransactionDetailsCategory } from '../../../../transactions/components/details/transaction-details.component';
import { Utils } from '../../../../../shared/utils/utils';
import { TransactionsService } from '../../../../transactions/services/transactions.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { DashboardEventsService } from '../../../services/dashboard-events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Transaction } from '../../../../transactions/models/transactions.models';

@Component({
  selector: 'app-dashboard-summary-expense-transactions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule, CurrencyPipe, DatePipe],
  templateUrl: './expense-transactions.html',
})
export class DashboardSummaryExpenseTransactions {
  private dialog = inject(MatDialog);
  utils = inject(Utils);
  readonly allCategories = input.required<Category[]>();
  transactionsTotal = signal<number>(0);
  private dashboardEventsService = inject(DashboardEventsService);
  private date = signal<Date>(new Date());

  readonly allTransactionsIncome = signal<Transaction[]>([]);
  private transactionsService = inject(TransactionsService);

  /* Table */
  displayedColumns: string[] = [
    'id',
    'date',
    'categoryName',
    'amount',
    'description',
    'action',
  ];
  dataSource = signal<Transaction[]>([]);
  /* Total amount for category */
  getTotalAmount() {
    return this.allTransactionsIncome()
      .map((t) => t.amount)
      .reduce((acc, value) => acc + value, 0);
  }

  /* Get all income transactions */
  getAllTransactionsIncome(): void {
    this.transactionsService.getAllTransactionsIncome(this.date()).subscribe({
      next: (transactions) => {
        this.allTransactionsIncome.set(transactions);
        this.dataSource.set(transactions);
      },
      error: (err) => {
        this.utils.openSnackBar(err.error.message, '');
        this.allTransactionsIncome.set([]);
        return [];
      },
    });
  }
  /* Open Update category dialog*/
  openUpdateCategory(category: Category): void {
    this.dialog.open(UpdateCategory, {
      data: category,
    });
  }

  /* Open category details dialog */
  openTransactionDetails(category: Category): void {
    this.transactionsService
      .getTransactionsByCategoryAndMonth(category, this.date())
      .subscribe({
        next: (transactions) => {
          this.dialog.open(TransactionDetailsCategory, {
            data: [this.allCategories(), transactions],
            width: '1000px',
            maxWidth: '1000px',
          });
        },
        error: (err) => {
          this.utils.openSnackBar(
            'Error fetching transactions: ' + err.message,
            '',
          );
        },
      });
  }

  /* Open Delete category dialog*/
  openDeleteCategory(category: Category): void {
    this.dialog.open(DeleteCategory, {
      data: category,
    });
  }

  constructor() {
    /* On selected date change */
    this.dashboardEventsService.changedDate$
      .pipe(takeUntilDestroyed())
      .subscribe((newDate) => {
        this.date.set(newDate);
      });

    this.getAllTransactionsIncome();
  }
}
