import {
  Component,
  ChangeDetectionStrategy,
  inject,
  output,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../shared/modules/material/material.module';
import { TransactionsService } from '../services/transactions.service';
import { Category } from '../models/transactions.models';

import {} from '@angular/material/dialog';
import {
  initCategoryForm,
  CategoryForm,
} from '../forms/transactions-form-builder';

@Component({
  selector: 'app-add-transaction',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule],
  template: ` <form [formGroup]="categoryForm">
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
  </form>`,
})
export class AddCategory {
  private categoriesService = inject(TransactionsService);
  readonly categoryForm: CategoryForm = initCategoryForm();
  categoryAdded = output<Category>();

  /* Add category */
  addCategory(): void {
    const categoryData: Category = this.categoryForm.getRawValue();

    this.categoriesService.addCategory(categoryData).subscribe({
      next: (response) => {
        this.categoryForm.reset();
        //Emit response to parent component
        this.categoryAdded.emit(response);
      },
      error: (err) => {
        console.error('Error adding category:', err);
      },
    });
  }
}
