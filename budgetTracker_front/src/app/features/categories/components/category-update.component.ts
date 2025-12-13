//src\app\features\categories\components\category-update.component.ts

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

@Component({
  selector: 'app-dialog-category-update',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule],
  template: ` <h2 mat-dialog-title>Update category</h2>
    <form [formGroup]="categoryForm">
      <mat-dialog-content>
        <mat-form-field
          appearance="outline"
          class="!mt-5"
          [class.valid-green-border]="type?.valid"
        >
          <mat-label>Category</mat-label>
          <input matInput formControlName="name" cdkFocusInitial required />
          <!-- Validation Feedback -->
          @if (name?.touched && name?.hasError('required')) {
            <mat-error> Category name is required. </mat-error>
          }
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button matButton [mat-dialog-close] class="!text-red-700">
          Cancel
        </button>
        <button
          matButton
          (click)="updateCategory()"
          [disabled]="categoryForm.invalid"
        >
          Ok
        </button>
      </mat-dialog-actions>
    </form>`,
})
export class UpdateCategory {
  private categoriesService = inject(CategoriesService);
  private dialogRef = inject(MatDialogRef<UpdateCategory>);
  private initialData = inject(MAT_DIALOG_DATA) as Category;
  utils = inject(Utils);
  private categoryEventService = inject(CategoryEventsService);

  // Initialize the form using the imported factory function
  readonly categoryForm: CategoryForm = buildCategoryForm(this.initialData);

  /* Update category */
  updateCategory(): void {
    const updatedCategory: Category = this.categoryForm.getRawValue();

    this.categoriesService
      .updateCategory(updatedCategory as Category)
      .subscribe({
        next: (response) => {
          this.dialogRef.close();
          this.categoryEventService.notifyCategoryUpdated(response);
          this.utils.openSnackBar('Category updated successfully', '');
        },
        error: (err) => {
          this.utils.openSnackBar('Error updating category:' + err.error, '');
        },
      });
  }

  get name() {
    return this.categoryForm.get('name');
  }
  get type() {
    return this.categoryForm.get('type');
  }
}
