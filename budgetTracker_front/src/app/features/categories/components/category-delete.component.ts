import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../shared/modules/material/material.module';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/categories.models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  buildCategoryForm,
  CategoryForm,
} from '../forms/category-form-builder';
import { Utils } from '../../../shared/utils/utils';
import { CategoryEventsService } from '../services/category-events.service';
import { switchMap, tap, EMPTY } from 'rxjs';
@Component({
  selector: 'app-dialog-category-delete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule],
  template: ` <h2 mat-dialog-title>Delete category</h2>
    <form [formGroup]="categoryForm">
      <mat-dialog-content
        >Are you sure you want to delete this category?</mat-dialog-content
      >
      <mat-dialog-actions>
        <button matButton mat-dialog-close>Close</button>
        <button matButton (click)="deleteCategory()">Ok</button>
      </mat-dialog-actions>
    </form>`,
})
export class DeleteCategory {
  private categoriesService = inject(CategoriesService);
  private dialogRef = inject(MatDialogRef<DeleteCategory>);
  private initialData = inject(MAT_DIALOG_DATA) as Category;
  private utils = inject(Utils);
  private categoryEventService = inject(CategoryEventsService);

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
          this.categoryEventService.notifyCategoryDeleted(deletedCategory);
          this.utils.openSnackBar('Category deleted successfully', '');
          this.dialogRef.close();
        }),
      )
      .subscribe({
        error: (err) => {
          this.utils.openSnackBar(err.error?.message, '');
        },
      });
  }
}
