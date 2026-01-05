import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MaterialModule } from '@shared/modules/material/material.module';
import { AddIncomeBtn } from './add-income-btn';
import { AddExpenseBtn } from './add-expense-btn';
import { TotalMonthDisplay } from './total-month-display';
import { PieChartDisplay } from './pie-chart-display';
import { AddCategory } from '@app/features/categories/components/category-add.component';
import { DatePickerSidebar } from './datepicker';
@Component({
  selector: 'app-dashboard-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MaterialModule,
    AddCategory,
    AddIncomeBtn,
    AddExpenseBtn,
    TotalMonthDisplay,
    PieChartDisplay,
    DatePickerSidebar,
  ],
  template: `
    <div
      class="p-4 bg-white shadow-xl rounded-xl flex flex-col gap-10 h-[90vh]  justify-between"
    >
      <!-- Datepicker -->
      <app-datepicker-sidebar></app-datepicker-sidebar>

      <!-- This month total display -->
      <app-total-month-display></app-total-month-display>

      <!-- Add Transaction (Income/Expense)-->
      <div class="flex flex-col gap-4 text-xl font-semibold text-sky-700">
        <div class="flex border-b align-items-center  gap-2">
          <mat-icon aria-label="face icon" fontIcon="add_circle"></mat-icon>
          <h2>Transactions</h2>
        </div>
        <!-- Add income btn -->
        <app-add-income-btn></app-add-income-btn>

        <!-- Add expense btn -->
        <app-add-expense-btn></app-add-expense-btn>
      </div>

      <!-- Add Category-->
      <app-add-category></app-add-category>

      <!-- Piechart -->
      <app-pie-chart-display></app-pie-chart-display>
    </div>
  `,
})
export class DashboardSidebar {}
