import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  output,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../shared/modules/material/material.module';
import { Category } from '../../transactions/models/transactions.models';
import {} from '@angular/material/dialog';
import { DashboardCategoriesService } from '../services/dashboard-categories.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UpdateCategory } from '../../categories/components/category-update.component';

@Component({
  selector: 'app-dashboard-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule],
  template: `
    <div class="p-4 flex flex-col bg-white shadow-xl rounded-xl h-[90vh]">
      <div
        class="flex border-b align-items-center text-xl font-semibold text-sky-700"
      >
        <mat-icon aria-label="face icon" fontIcon="business_center"></mat-icon>
        <h2>Monthly Summary</h2>
      </div>

      <div class="flex my-4 gap-1">
        <mat-icon aria-label="face icon" fontIcon="category"></mat-icon>
        <div class="text-gray-600 text-xl">Categories</div>
      </div>

      <div class="flex flex-wrap gap-10">
        @for (category of allCategories(); track category.id) {
          <div
            class="flex flex-col border p-4 rounded-lg shadow-md w-1/6 justify-between"
          >
            <div class="flex flex-row gap-4 justify-between items-center mb-2">
              <span class="flex items-center gap-2">
                <mat-icon
                  aria-label="face icon"
                  fontIcon="label"
                  class="!text-cyan-700"
                ></mat-icon>
                <span class="text-cyan-700 text-xl">{{ category.name }}</span>
              </span>
              <span class="flex flex row ">
                <button
                  mat-icon-button
                  aria-label="Update category"
                  class="-me-2"
                  (click)="openUpdateCategory(category)"
                >
                  <mat-icon
                    fontIcon="autorenew"
                    class="!text-indigo-700"
                  ></mat-icon>
                </button>
                <button mat-icon-button aria-label="Delete category">
                  <mat-icon
                    fontIcon="delete"
                    class="!text-red-700"
                    (click)="openDeleteCategory(category)"
                  ></mat-icon>
                </button>
              </span>
            </div>
            <div class="text-green-600 font-medium">$2,000</div>
            <!-- (click)="deleteCategory(item.id)" -->
            <div class="text-green-600 font-medium">%</div>
          </div>
        }
      </div>
    </div>
  `,
})
export class DashboardSummary {
  dashboardCategoriesService = inject(DashboardCategoriesService);
  private dialog = inject(MatDialog);

  allCategories = input.required<Category[]>();

  /* Add category */
  //Add an output to re-emit the event to the parent (DashboardComponent)
  categoryAdded = output<Category>();
  categoryUpdated = output<Category>();

  // Handles the event emitted by the AddCategory component when a new category is added.
  onCategoryAdded(newCategory: Category): void {
    console.log(newCategory);
    this.categoryAdded.emit(newCategory);
  }

  /* Update category */

  openUpdateCategory(category: Category): void {
    /* Open update category dialog */
    const dialogRef = this.dialog.open(UpdateCategory, {
      data: category,
    });

    //Emit when save
    dialogRef.componentInstance.categoryUpdated.subscribe(
      (updatedCategory: Category) => {
        this.categoryUpdated.emit(updatedCategory);
      },
    );
  }

  /* Open delete category dialog */
  openDeleteCategory(category: Category): void {
    /*    this.dashboardCategoriesService
      .openDeleteCategory(category)
      .subscribe((result: Category) => {
        console.log('Delete dialog closed with result:', result);
        this.allCategories.update((categories) =>
          categories.filter((cat) => cat.id !== category.id),
        );
      }); */
  }
}
