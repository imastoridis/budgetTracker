import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  signal,
} from '@angular/core';
//import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { Utils } from '../../shared/utils/utils';
/* Categories */
import { Category } from '../categories/models/categories.models';
import { CategoriesService } from '../categories/services/categories.service';
/* Transactions */
import { TransactionsService } from '../transactions/services/transactions.service';
/* Dashboard children*/
import { DashboardHeader } from './components/dashboard-header';
import { DashboardSidebar } from './components/sidebar/dashboard-sidebar';
import { DashboardSummary } from './components/summary/dashboard-summary';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MaterialModule,
    DashboardHeader,
    DashboardSidebar,
    DashboardSummary,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  utils = inject(Utils);

  /**
   * Categories
   */
  private categoriesService = inject(CategoriesService);
  readonly allCategories = signal<Category[]>([]);

  /* Get all categories for user */ /* TO DO ALPHABETICALLY */
  getCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (categories) => {
        this.allCategories.set(categories);
      },
      error: (err) => {
        this.utils.openSnackBar(err, '');
        this.allCategories.set([]);
        return of([]);
      },
    });
  }

  /* Handler to update the signal when a new category is added from the sidebar */
  onCategoryAdded(newCategory: Category): void {
    this.allCategories.update((categories) => [...categories, newCategory]);
  }

  /* Handler to update the signal when a new category is udpated from the sidebar */
  onCategoryUpdated(updatedCategory: Category): void {
    this.allCategories.update((categories) =>
      categories.map((category) => {
        return category.id === updatedCategory.id ? updatedCategory : category;
      }),
    );
  }

  /* Open delete category dialog */
  /*   openDeleteCategory(category: Category): void {
    this.dashboardCategoriesService
      .openDeleteCategory(category)
      .subscribe((result: Category) => {
        console.log('Delete dialog closed with result:', result);
        this.allCategories.update((categories) =>
          categories.filter((cat) => cat.id !== category.id),
        );
      });
  } */

  /**
   * Transactions
   */
  private transactionsService = inject(TransactionsService);
  readonly allExpenses = signal<Category[]>([]);
  readonly allIncome = signal<Category[]>([]);

  /* Get all transactoins for user */
  getAllTransactions(): void {
    this.categoriesService.getCategories().subscribe({
      next: (categories) => {
        this.allCategories.set(categories);
      },
      error: (err) => {
        console.error('Error fetching categories in dashboard:', err);
        this.allCategories.set([]);
        return of([]);
      },
    });
  }

  /* On init */
  ngOnInit(): void {
    this.getCategories();
  }
}
