import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  input,
  computed,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../../shared/modules/material/material.module';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { DashboardEventsService } from '../../../services/dashboard-events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Transaction } from '../../../../transactions/models/transactions.models';
import { MatDialog } from '@angular/material/dialog';
import { UpdateTransaction } from '../../../../transactions/components/transaction-update.component';
import { DeleteTransaction } from '../../../../transactions/components/transaction-delete.component';
import { Category } from '../../../../categories/models/categories.models';

@Component({
  selector: 'app-dashboard-summary-income-transactions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule, CurrencyPipe, DatePipe],
  templateUrl: './income-transactions.html',
})
export class DashboardSummaryIncomeTransactions {
  //transactionsTotal = signal<number>(0);
  private dashboardEventsService = inject(DashboardEventsService);
  private date = signal<Date>(new Date());
  private dialog = inject(MatDialog);
  readonly allCategories = input.required<Category[]>();
  readonly allTransactionsIncome = input.required<Transaction[]>();

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
  /* Total amount for category */
  getTotalAmount() {
    return this.allTransactionsIncome()
      .map((t) => t.amount)
      .reduce((acc, value) => acc + value, 0);
  }

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

  constructor() {
    /* On selected date change */
    this.dashboardEventsService.changedDate$
      .pipe(takeUntilDestroyed())
      .subscribe((newDate) => {
        this.date.set(newDate);
      });
  }
}
