//src\app\features\categories\components\category-update.component.ts

import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/material/material.module';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Utils } from '../../../../shared/utils/utils';
import { Transaction } from '../../../transactions/models/transactions.models';
import { MatNativeDateModule } from '@angular/material/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { UpdateTransaction } from '../../../transactions/components/transaction-update.component';
import { Category } from '../../models/categories.models';

@Component({
  selector: 'app-dialog-category-update',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './category-details.html',
})
export class DetailsCategory {
  private TRANSACTION_ARRAY: Transaction[] = inject(MAT_DIALOG_DATA)[1];
  private allCategories: Category[] = inject(MAT_DIALOG_DATA)[0];
  utils = inject(Utils);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['id', 'date', 'amount', 'action'];
  dataSource = this.TRANSACTION_ARRAY;

  openUpdateTransaction(transaction: Transaction): void {
    this.dialog.open(UpdateTransaction, {
      data: [this.allCategories, transaction],
    });
  }
}
