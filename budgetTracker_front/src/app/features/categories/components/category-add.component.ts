import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/categories.models';
import { initCategoryForm, CategoryForm } from '../forms/category-form-builder';
import { Utils } from '@shared/utils/utils';
import { CategoriesStateService } from '@shared/services/state/categoriesStateService';

@Component({
  selector: 'app-add-category',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './category-add.html',
})
export class AddCategory {
  private categoriesService = inject(CategoriesService);
  private categoriesState = inject(CategoriesStateService);
  readonly categoryForm: CategoryForm = initCategoryForm();
  private utils = inject(Utils);

  /* Add category */
  addCategory(): void {
    const categoryData: Category = this.categoryForm.getRawValue();
    this.categoriesService.addCategory(categoryData).subscribe({
      next: (response) => {
        this.categoryForm.reset();
        this.categoriesState.addCategory(response);
        this.utils.openSnackBar('Category added successfully', '');
      },
      error: (err) => {
        this.utils.openSnackBar(err.message, '');
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
