import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '../categories/models/categories.models';
import { of } from 'rxjs';
import { MaterialModule } from '../../shared/modules/material/material.module';
/* Categories */
import { CategoriesService } from '../categories/services/categories.service';
/* Transactions */
import { TransactionsService } from '../transactions/services/transactions.service';
import { DashboardCategoriesService } from './services/dashboard-categories.service';

import { Header } from './components/header';
import { DashboardSidebar } from './components/dashboard-sidebar';
@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,

    Header,
    DashboardSidebar,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private dashboardCategoriesService = inject(DashboardCategoriesService);
  errorMessage = signal<string>('');
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
      error: () => {
        this.allCategories.set([]);
        return of([]);
      },
    });
  }

  /**
   * Handler to update the signal when a new category is added from the sidebar
   */
  onCategoryAdded(newCategory: Category): void {
    this.allCategories.update((categories) => [...categories, newCategory]);
  }

  /* Open update category dialog */
  openUpdateCategory(category: Category): void {
    this.dashboardCategoriesService
      .openUpdateCategory(category)
      .subscribe((result: Category) => {
        if (result) {
          this.allCategories.update((categories) =>
            categories.map((cat) => {
              return cat.id === result.id ? result : cat;
            }),
          );
        }
      });
  }

  /* Open delete category dialog */
  openDialogDeleteCategory(category: Category): void {
    this.dashboardCategoriesService
      .openDialogDeleteCategory(category)
      .subscribe((result: Category) => {
        console.log('Delete dialog closed with result:', result);
        this.allCategories.update((categories) =>
          categories.filter((cat) => cat.id !== category.id),
        );
      });
  }

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
