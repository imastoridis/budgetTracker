import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { Category } from '@app/features/categories/models/categories.models';
import { MatDialog } from '@angular/material/dialog';

import { TransactionDetailsCategory } from '@app/features/dashboard/components/summary/components/transaction-details';
import { CurrencyPipe } from '@angular/common';
import { CategoriesStateService } from '@shared/services/state/categoriesStateService';

@Component({
  selector: 'app-dashboard-summary-categories',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './categories.html',
})
export class DashboardSummaryCategories {
  private dialog = inject(MatDialog);

  private categoriesState = inject(CategoriesStateService);
  readonly allCategories = this.categoriesState.categories;

  /* Open transactions details */
  openTransactionDetails(category: Category): void {
    this.dialog.open(TransactionDetailsCategory, {
      data: category.id,
      width: '1000px',
      maxWidth: '1000px',
    });
  }
}
