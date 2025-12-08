import {
  Component,
  ChangeDetectionStrategy,
  inject,
  output,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../shared/modules/material/material.module';
import { TransactionsService } from '../../transactions/services/transactions.service';
import { Category } from '../../transactions/models/transactions.models';
import { UpdateCategory } from '../../categories/components/category-update.component';

import {} from '@angular/material/dialog';
import {
  initCategoryForm,
  CategoryForm,
} from '../../transactions/forms/transactions-form-builder';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-pie-chart-display',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule],
  template: `
    <div>
      <div
        class="flex border-b align-items-center  text-xl font-semibold text-sky-700"
      >
        <mat-icon aria-label="face icon" fontIcon="pie_chart"></mat-icon>
        <h2>Repartition</h2>
      </div>

      <div
        class="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-500"
      >
        [Pie Chart Placeholder]
      </div>
    </div>
  `,
})
export class PieChartDisplay {
  private categoriesService = inject(TransactionsService);
  readonly categoryForm: CategoryForm = initCategoryForm();
  categoryAdded = output<Category>();

  dialog = inject(MatDialog);

  /* Open add transaction dialog for income */
  openDialogAddIncome(): void {
    const dialogRef = this.dialog.open(UpdateCategory);

    //After update, update the signal
    dialogRef.afterClosed().subscribe((result: Category) => {
      /*      if (result) {
        this.allCategories.update((categories) =>
          categories.map((cat) => {
            return cat.id === result.id ? result : cat;
          }),
        );
      } */
    });
  }
}
