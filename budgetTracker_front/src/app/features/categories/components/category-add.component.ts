import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../shared/modules/material/material.module';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/categories.models';
import { initCategoryForm, CategoryForm } from '../forms/category-form-builder';
import { Utils } from '../../../shared/utils/utils';
import { CategoryEventsService } from '../services/category-events.service';

@Component({
  selector: 'app-add-category',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule],
  template: `
    <div class="flex flex-col gap-4">
      <div
        class="flex border-b align-items-center  text-xl font-semibold text-sky-700 gap-2"
      >
        <mat-icon aria-label="face icon" fontIcon="category"></mat-icon>
        <h2>Category</h2>
      </div>
      <form [formGroup]="categoryForm" appearance="outline">
        <mat-accordion class="example-headers-align" multi>
          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <mat-panel-title> Add Category </mat-panel-title>
            </mat-expansion-panel-header>
            <div class="flex flex-col gap-2 ">
              <mat-form-field
                appearance="outline"
                [class.valid-green-border]="name?.valid"
              >
                <mat-label>Category name</mat-label>
                <input
                  matInput
                  formControlName="name"
                  required
                  cdkFocusInitial
                />
              </mat-form-field>
              <mat-form-field
                appearance="outline"
                [class.valid-green-border]="type?.valid"
              >
                <mat-label>Categories</mat-label>
                <mat-select formControlName="type" required>
                  <mat-option value="INCOME">Income</mat-option>
                  <mat-option value="EXPENSE">Expense</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-dialog-actions class="text-end">
                <button matButton (click)="addCategory()">Add</button>
              </mat-dialog-actions>
            </div>
          </mat-expansion-panel>
        </mat-accordion>
      </form>
    </div>
  `,
})
export class AddCategory {
  private categoriesService = inject(CategoriesService);
  readonly categoryForm: CategoryForm = initCategoryForm();
  private utils = inject(Utils);
  private categoryEventService = inject(CategoryEventsService);

  /* Add category */
  addCategory(): void {
    const categoryData: Category = this.categoryForm.getRawValue();
    this.categoriesService.addCategory(categoryData).subscribe({
      next: (response) => {
        this.categoryForm.reset();
        this.categoryEventService.notifyCategoryAdded(response);
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
