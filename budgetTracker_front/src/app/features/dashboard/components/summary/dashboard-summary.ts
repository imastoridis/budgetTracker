import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/material/material.module';
import { Category } from '../../../categories/models/categories.models';
import { MatDialog } from '@angular/material/dialog';
import { UpdateCategory } from '../../../categories/components/category-update.component';
import { DeleteCategory } from '../../../categories/components/category-delete.component';
import { DetailsCategory } from '../../../categories/components/details/category-details.component';
import { Utils } from '../../../../shared/utils/utils';
import { TransactionsService } from '../../../transactions/services/transactions.service';

@Component({
  selector: 'app-dashboard-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './dashboard-summary.html',
})
export class DashboardSummary {
  private dialog = inject(MatDialog);
  utils = inject(Utils);
  allCategories = input.required<Category[]>();

  /* Open Update category dialog*/
  openUpdateCategory(category: Category): void {
    this.dialog.open(UpdateCategory, {
      data: category,
    });
  }

  /* Open category details dialog */
  transactionsService = inject(TransactionsService);

  openCategoryDetails(category: Category): void {
    this.transactionsService.getTransactionsByCategory(category).subscribe({
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
}
