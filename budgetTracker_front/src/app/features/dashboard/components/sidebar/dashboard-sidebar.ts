import {
  Component,
  ChangeDetectionStrategy,
  output,
  input,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/material/material.module';
import { Transaction } from '../../../transactions/models/transactions.models';
import { AddIncomeBtn } from './add-income-btn';
import { AddExpenseBtn } from './add-expense-btn';
import { TotalMonthDisplay } from './total-month-display';
import { PieChartDisplay } from './pie-chart-display';
import { AddCategory } from '../../../categories/components/category-add.component';
import { Category } from '../../../categories/models/categories.models';
@Component({
  selector: 'app-dashboard-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    AddCategory,
    AddIncomeBtn,
    AddExpenseBtn,
    TotalMonthDisplay,
    PieChartDisplay,
  ],
  template: `
    <div
      class="p-4 bg-white shadow-xl rounded-xl flex flex-col gap-10 h-[90vh] "
    >
      <!-- Add Transaction (Income/Expense)-->
      <div class="flex flex-col gap-4 text-xl font-semibold text-sky-700">
        <div class="flex border-b align-items-center">
          <mat-icon aria-label="face icon" fontIcon="add_circle"></mat-icon>
          <h2>Transactions</h2>
        </div>
        <!-- Add income btn -->
        <app-add-income-btn
          [allCategories]="allCategories()"
        ></app-add-income-btn>
        <!-- Add expense btn -->
        <app-add-expense-btn></app-add-expense-btn>
      </div>

      <!-- This month total display -->
      <app-total-month-display></app-total-month-display>

      <!-- Piechart -->
      <app-pie-chart-display></app-pie-chart-display>

      <!-- Add Category-->
      <app-add-category
        (categoryAdded)="onCategoryAdded($any($event))"
      ></app-add-category>
    </div>
  `,
})
export class DashboardSidebar {
  allCategories = input.required<Category[]>();
  //Add an output to re-emit the event to the parent (DashboardComponent)
  categoryAdded = output<Transaction>();

  /* Handles the event emitted by the AddCategory component when a new category is added. */
  onCategoryAdded(newCategory: Transaction): void {
    this.categoryAdded.emit(newCategory);
  }
}
