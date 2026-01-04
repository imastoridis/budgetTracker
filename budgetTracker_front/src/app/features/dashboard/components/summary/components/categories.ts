import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  effect,
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
import { CurrencyPipe } from '@angular/common';
import { CategoriesStateService } from '../../../../../shared/services/state/categoriesStateService';

@Component({
  selector: 'app-dashboard-summary-categories',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './categories.html',
})
export class DashboardSummaryCategories {
  private dialog = inject(MatDialog);
  private utils = inject(Utils);
  private date = signal<Date>(new Date());

  private categoriesState = inject(CategoriesStateService);
  readonly allCategories = this.categoriesState.categories;

  /* Open Update category dialog*/
  openUpdateCategory(category: Category): void {
    this.dialog.open(UpdateCategory, {
      data: category,
    });
  }

  /* Open Delete category dialog*/
  openDeleteCategory(category: Category): void {
    this.dialog.open(DeleteCategory, {
      data: category,
    });
  }

  /* Open transaction details dialog */
  transactionsService = inject(TransactionsService);

  openTransactionDetails(category: Category): void {
    this.transactionsService
      .getTransactionsByCategoryAndMonth(category, this.date())
      .subscribe({
        next: (transactions) => {
          this.dialog.open(TransactionDetailsCategory, {
            data: transactions,
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

  constructor() {
    effect(() => {
      console.log('Categories updated in UI:', this.allCategories());
    });
  }
}
