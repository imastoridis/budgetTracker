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
import { CategoryEventsService } from '../services/category-event.service';
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
        switchMap((response: boolean) => {
          if (response) {
            return this.categoriesService.deleteCategory(deletedCategory);
          } else {
            this.utils.openSnackBar(
              'Cannot delete category, there are transactions associated with the category',
              '',
            );
            return EMPTY;
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
          console.error(err);
          this.utils.openSnackBar(
            err.error?.message || 'Failed to delete category.',
            '',
          );
        },
      });

    /*    this.categoriesService
      .categoryHasTransactions(deletedCategory as Category)
      .subscribe({
        next: (response) => {
          console.log(response);
          if (response){}
          this.categoriesService
            .deleteCategory(deletedCategory as Category)
            .subscribe({
              next: () => {
                this.dialogRef.close();
                this.categoryEventService.notifyCategoryDeleted(
                  this.initialData,
                );
                this.utils.openSnackBar('Category deleted successfully', '');
              },
              error: (err) => {
                console.log(err);
                this.utils.openSnackBar(err.error.message, '');
              },
            });
        },
      }); */
  }
}
