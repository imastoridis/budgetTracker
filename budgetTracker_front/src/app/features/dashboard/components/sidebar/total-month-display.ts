import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
  computed,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/material/material.module';
import { TransactionsService } from '../../../transactions/services/transactions.service';
import { Utils } from '../../../../shared/utils/utils';
import { TransactionEventsService } from '../../../transactions/services/transaction-events.service';
import { CurrencyPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-total-month-display',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule, CurrencyPipe],
  template: `
    <div class="flex flex-col gap-4">
      <div
        class="flex border-b align-items-center  text-xl font-semibold text-sky-700"
      >
        <mat-icon aria-label="face icon" fontIcon="calendar_month"></mat-icon>
        <h2>This month</h2>
      </div>

      <div class="flex flex-col gap-2">
        <div class="flex flex-row justify-between">
          <span class="text-gray-600">Total Income:</span>
          <span class="font-medium text-green-600">{{
            totalIncome() | currency: 'EUR' : 'symbol' : '1.2-2'
          }}</span>
        </div>
        <div class="flex flex-row justify-between">
          <span class="text-gray-600">Total Expenses:</span>
          <span class="font-medium text-red-600">
            {{ totalExpenses() | currency: 'EUR' : 'symbol' : '1.2-2' }}</span
          >
        </div>

        <div
          class="flex flex-row justify-between border-t pt-2  text-xl font-semibold"
          [class]="balance() >= 0 ? 'text-green-600' : 'text-red-600'"
        >
          <span>Balance:</span>
          <span>
            {{ balance() | currency: 'EUR' : 'symbol' : '1.2-2' }}
          </span>
        </div>
      </div>
    </div>
  `,
})
export class TotalMonthDisplay implements OnInit {
  private transactionsService = inject(TransactionsService);
  private utils = inject(Utils);
  private transactionEventsService = inject(TransactionEventsService);
  readonly totalIncome = signal<number>(0);
  readonly totalExpenses = signal<number>(0);
  readonly date = signal<Date>(new Date());
  readonly balance = computed<number>(() => {
    return this.totalIncome() - this.totalExpenses();
  });

  /* Gets total of income for a month */
  getTotalIncomeByMonth(date: Date): void {
    this.transactionsService.getTotalIncomeByMonth(date).subscribe({
      next: (totalIncome) => {
        this.totalIncome.set(+totalIncome);
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
        this.totalExpenses.set(+totalExpenses);
      },
      error: (err) => {
        this.utils.openSnackBar(err.error, '');
      },
    });
  }

  /* Gets total by month */
  getTotalByMonth() {
    this.getTotalIncomeByMonth(this.date());
    this.getTotalExpensesByMonth(this.date());
  }

  /* Constructor */
  constructor() {
    //Uses the category-event.service to add, update or delete a category
    this.transactionEventsService.updatedTransaction$
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.getTotalByMonth();
      });

    this.transactionEventsService.addedTransaction$
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.getTotalByMonth();
      });

    this.transactionEventsService.deletedTransaction$
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.getTotalByMonth();
      });
  }

  /* On init */
  ngOnInit(): void {
    //Get total income for current month
    this.getTotalByMonth();
  }
}
