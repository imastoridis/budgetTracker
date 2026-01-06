//src\app\features\categories\components\category-update.component.ts

import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { Category } from '../models/categories.models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  buildCategoryForm,
  CategoryForm,
} from '../forms/category-form-builder';
import { Utils } from '@shared/utils/utils';
import { CategoriesService } from '../services/categories.service';
import { CategoriesStateService } from '@shared/services/state/categoriesStateService';

@Component({
  selector: 'app-dialog-category-update',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './category-update.html',
})
export class UpdateCategory {
  private categoriesService = inject(CategoriesService);
  private categoriesState = inject(CategoriesStateService);
  private dialogRef = inject(MatDialogRef<UpdateCategory>);
  private initialData = inject(MAT_DIALOG_DATA) as Category;
  private utils = inject(Utils);

  readonly categoryForm: CategoryForm = buildCategoryForm(this.initialData);

  /* Update category */
  updateCategory(): void {
    const updatedCategory: Category = this.categoryForm.getRawValue();
    this.categoriesService
      .updateCategory(updatedCategory as Category)
      .subscribe({
        next: (response) => {
          this.dialogRef.close();
          this.categoriesState.updateCategory(response);
          this.utils.openSnackBar('Category updated successfully', '');
        },
        error: (err) => {
          this.utils.openSnackBar('Error updating category:' + err.error, '');
        },
      });
  }

  /* Form control */
  get name() {
    return this.categoryForm.get('name');
  }
  get type() {
    return this.categoryForm.get('type');
  }
}
