import {
  Component,
  ChangeDetectionStrategy,
  inject,
  output,
  input,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../shared/modules/material/material.module';
import { TransactionsService } from '../services/transactions.service';
import { Transaction } from '../models/transactions.models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  initTransactionFormIncome,
  TransactionForm,
} from '../forms/transactions-form-builder';
import { TransactionType } from '../models/transaction-types.enum';
import { AddIncomeBtn } from '../../dashboard/components/sidebar/add-income-btn';
import {
  DateAdapter,
  NativeDateAdapter,
  MAT_DATE_FORMATS,
  MatNativeDateModule,
} from '@angular/material/core';
import { CUSTOM_DATE_FORMATS } from '../../../shared/utils/date-formats';
import { Utils } from '../../../shared/utils/utils';

@Component({
  selector: 'app-add-transaction-income',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule, MatNativeDateModule],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ],
  template: ` <h2 mat-dialog-title>Add Income</h2>
    <form [formGroup]="transactionFormIncome">
      <div>
        <mat-dialog-content class="!flex !flex-col !gap-5">
          <!-- Amοunt -->
          <mat-form-field appearance="outline" class="!align-center">
            <mat-label>Amount</mat-label>
            <mat-icon matSuffix fontIcon="euro_symbol" class="!me-2"></mat-icon>
            <input matInput cdkFocusInitial formControlName="amount" required />
            @if (transactionFormIncome.controls.amount.hasError('hasText')) {
              <mat-error> Add an amount </mat-error>
            }
          </mat-form-field>
          <!-- category -->
          <mat-form-field appearance="outline">
            <mat-label>Categories</mat-label>
            <mat-select formControlName="categoryId">
              @for (category of allCategories(); track category) {
                <mat-option [value]="category.id">{{
                  category.name
                }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <!-- Description -->
          <mat-form-field appearance="outline">
            <mat-label>Description</mat-label>
            <textarea matInput></textarea>
          </mat-form-field>
          <!-- Date -->
          <mat-form-field appearance="outline">
            <mat-label>Date</mat-label>
            <input
              matInput
              [matDatepicker]="picker"
              formControlName="date"
              required
            />
            <mat-datepicker-toggle
              matSuffix
              [for]="picker"
            ></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </mat-dialog-content>
      </div>
      <mat-dialog-actions>
        <button matButton [mat-dialog-close] class="!text-red-700">
          Cancel
        </button>
        <button
          matButton
          (click)="addTransaction()"
          [disabled]="transactionFormIncome.invalid"
        >
          Ok
        </button>
      </mat-dialog-actions>
    </form>`,
})
export class AddTransactionIncome {
  private transactionService = inject(TransactionsService);
  private utils = inject(Utils);

  readonly transactionFormIncome: TransactionForm = initTransactionFormIncome();
  readonly transactionTypes = Object.values(TransactionType);
  readonly transactionAdded = output<Transaction>();
  allCategories = inject(MAT_DIALOG_DATA);

  /* Add transaction */
  addTransaction(): void {
    const transactionData: Transaction =
      this.transactionFormIncome.getRawValue();

    this.transactionService.addTransaction(transactionData).subscribe({
      next: (response) => {
        this.utils.openSnackBar('Transaction added successfully', '');
        this.transactionFormIncome.reset();
        this.transactionAdded.emit(response);
      },
      error: (err) => {
        this.utils.openSnackBar(err.message, '');
        console.error('Error adding transaction:', err);
      },
    });
  }

  get amount() {
    return this.transactionFormIncome.get('amount');
  }

  get categoryId() {
    return this.transactionFormIncome.get('categoryId');
  }

  get date() {
    return this.transactionFormIncome.get('date');
  }
}
