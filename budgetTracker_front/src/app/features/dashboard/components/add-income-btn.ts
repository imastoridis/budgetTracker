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
  selector: 'app-add-income-btn',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule],
  template: `
    <button
      (click)="openDialogAddIncome()"
      mat-raised-button
      class="!bg-green-700 hover:!bg-green-800 !text-white  !w-full"
    >
      Add income
    </button>
  `,
})
export class AddIncomeBtn {
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
