import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/categories.models';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import {
  buildCategoryForm,
  CategoryForm,
} from '../forms/category-form-builder';
import { Utils } from '@shared/utils/utils';
import { switchMap, tap, EMPTY } from 'rxjs';
import { CategoriesStateService } from '@shared/services/state/categoriesStateService';

@Component({
  selector: 'app-dialog-category-delete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './category-delete.html',
})
export class DeleteCategory {
  private categoriesService = inject(CategoriesService);
  private categoriesState = inject(CategoriesStateService);
  private initialData = inject(MAT_DIALOG_DATA) as Category;
  private utils = inject(Utils);
  private dialog = inject(MatDialog);

  // Initialize the form using the imported factory function
  readonly categoryForm: CategoryForm = buildCategoryForm(this.initialData);

  /* Delete category */
  deleteCategory(): void {
    const deletedCategory: Category = this.categoryForm.getRawValue();
    this.categoriesService
      .categoryHasTransactions(deletedCategory)
      .pipe(
        switchMap((response: string) => {
          if (response) {
            this.utils.openSnackBar(
              'Cannot delete category, there are transactions associated with the category, please delete them first.',
              '',
            );
            return EMPTY;
          } else {
            return this.categoriesService.deleteCategory(deletedCategory);
          }
        }),
        tap(() => {
          this.dialog.closeAll();
          this.categoriesState.deleteCategory(deletedCategory);
          this.utils.openSnackBar('Category deleted successfully', '');
        }),
      )
      .subscribe({
        error: (err) => {
          this.utils.openSnackBar(err.error?.message, '');
        },
      });
  }
}
