import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { Category } from '@app/features/categories/models/categories.models';
import { MatDialog } from '@angular/material/dialog';
import { UpdateCategory } from '@app/features/categories/components/category-update.component';
import { DeleteCategory } from '@app/features/categories/components/category-delete.component';
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

  /* Open transactions details */
  openTransactionDetails(category: Category): void {
    this.dialog.open(TransactionDetailsCategory, {
      data: category,
      width: '1000px',
      maxWidth: '1000px',
    });
  }
}
