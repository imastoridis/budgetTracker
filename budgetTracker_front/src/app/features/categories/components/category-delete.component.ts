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

@Component({
  selector: 'app-dialog-category-delete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule],
  template: ` <h2 mat-dialog-title>Delete category</h2>
    <form [formGroup]="categoryForm">
      <mat-dialog-content
        >Are you sure you want to delete this category</mat-dialog-content
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

  // Initialize the form using the imported factory function
  readonly categoryForm: CategoryForm = buildCategoryForm(this.initialData);

  /* Delete category */
  deleteCategory(): void {
    const deletedCategory: Category = this.categoryForm.getRawValue();

    this.categoriesService
      .deleteCategory(deletedCategory as Category)
      .subscribe({
        next: () => {
          this.dialogRef.close(this.initialData);
        },
        error: (err) => {
          console.error('Error updating category:', err.error);
        },
      });
  }
}
