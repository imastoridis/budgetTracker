import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MaterialModule } from '@shared/modules/material/material.module';
import { AddIncomeBtn } from './components/add-income-btn';
import { AddExpenseBtn } from './components/add-expense-btn';
import { TotalMonthDisplay } from './components/total-month-display';
import { PieChartDisplay } from './components/pie-chart-display';
import { AddCategory } from '@app/features/categories/components/category-add.component';
import { DatePickerSidebar } from './components/datepicker';
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
  templateUrl: './dashboard-sidebar.html',
})
export class DashboardSidebar {}
