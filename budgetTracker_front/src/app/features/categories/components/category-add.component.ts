import {
  Component,
  ChangeDetectionStrategy,
  inject,
  output,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../shared/modules/material/material.module';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/categories.models';
import { initCategoryForm, CategoryForm } from '../forms/category-form-builder';

@Component({
  selector: 'app-add-category',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule],
  template: `
    <div class="flex flex-col">
      <form [formGroup]="categoryForm">
        <mat-accordion class="example-headers-align" multi>
          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <mat-panel-title> Add Category </mat-panel-title>
            </mat-expansion-panel-header>
            <div class="flex flex-row gap-2 items-start">
              <mat-form-field appearance="outline">
                <mat-label>Category name</mat-label>
                <input
                  matInput
                  [formControl]="categoryForm.controls.name"
                  required
                />
              </mat-form-field>
              <span
                class="material-symbols-outlined !text-4xl cursor-pointer mt-2 text-green-700"
                (click)="addCategory()"
              >
                add_circle
              </span>
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
  addedCategory = output<Category>();

  /* Add category */
  addCategory(): void {
    const categoryData: Category = this.categoryForm.getRawValue();

    this.categoriesService.addCategory(categoryData).subscribe({
      next: (response) => {
        this.categoryForm.reset();
        this.addedCategory.emit(response);
      },
      error: (err) => {
        console.error('Error adding category:', err);
      },
    });
  }
}
