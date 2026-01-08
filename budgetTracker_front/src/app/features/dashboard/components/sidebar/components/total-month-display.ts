import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
} from '@angular/core';
import { MaterialModule } from '@shared/modules/material/material.module';
import { CurrencyPipe } from '@angular/common';
import { TransactionsStateService } from '@shared/services/state/transactionsStateService';

@Component({
  selector: 'app-total-month-display',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, CurrencyPipe],
  template: `
    <div class="flex flex-col gap-4">
      <div
        class="flex border-b align-items-center text-sm xl:text-xl font-semibold text-sky-700 xl:gap-2"
      >
        <mat-icon
          aria-label="face icon"
          fontIcon="paid"
          class="!text-sm xl:!text-xl"
        ></mat-icon>
        <h2>This month</h2>
      </div>

      <div class="flex flex-col gap-2 text-sm xl:text-lg">
        <div class="flex flex-row justify-between ">
          <span class="text-gray-600">Total Income:</span>
          <span class="font-medium text-green-600">{{
            totalIncome() | currency: 'EUR' : 'symbol' : '1.2-2'
          }}</span>
        </div>
        <div class="flex flex-row justify-between">
          <span class="text-gray-600 ">Total Expenses:</span>
          <span class="font-medium text-red-600">
            {{ totalExpense() | currency: 'EUR' : 'symbol' : '1.2-2' }}</span
          >
        </div>

        <div
          class="flex flex-row justify-between border-t pt-2 font-semibold text-sm xl:text-xl"
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
export class TotalMonthDisplay {
  private transactionsState = inject(TransactionsStateService);
  readonly totalIncome = this.transactionsState.totalIncome;
  readonly totalExpense = this.transactionsState.totalExpense;
  readonly balance = computed<number>(() => {
    return this.totalIncome() - this.totalExpense();
  });
}
