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
import { DetailsCategory } from '../../../../categories/components/details/category-details.component';
import { Utils } from '../../../../../shared/utils/utils';
import { TransactionsService } from '../../../../transactions/services/transactions.service';
import { CurrencyPipe } from '@angular/common';
import { DashboardEventsService } from '../../../services/dashboard-events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard-summary-income-transactions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './categories.html',
})
export class DashboardSummaryIncomeTransactions {
  private dialog = inject(MatDialog);
  utils = inject(Utils);
  allCategories = input.required<Category[]>();
  transactionsTotal = signal<number>(0);
  private dashboardEventsService = inject(DashboardEventsService);
  private date = signal<Date>(new Date());

  /* Open Update category dialog*/
  openUpdateCategory(category: Category): void {
    this.dialog.open(UpdateCategory, {
      data: category,
    });
  }

  /* Open category details dialog */
  transactionsService = inject(TransactionsService);

  openCategoryDetails(category: Category): void {
    this.transactionsService
      .getTransactionsByCategoryAndMonth(category, this.date())
      .subscribe({
        next: (transactions) => {
          this.dialog.open(DetailsCategory, {
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
  }
}
