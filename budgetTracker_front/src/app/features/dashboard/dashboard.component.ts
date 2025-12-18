import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  afterNextRender,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { Utils } from '../../shared/utils/utils';
/* Categories */
import { Category } from '../categories/models/categories.models';
import { CategoriesService } from '../categories/services/categories.service';
import { CategoryEventsService } from '../categories/services/category-events.service';
/* Transactions */
import { TransactionsService } from '../transactions/services/transactions.service';
import { TransactionEventsService } from '../transactions/services/transaction-events.service';
/* Dashboard children*/
import { DashboardHeader } from './components/dashboard-header';
import { DashboardSidebar } from './components/sidebar/dashboard-sidebar';
import { DashboardSummary } from './components/summary/dashboard-summary';
import { Transaction } from '../transactions/models/transactions.models';

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
export class DashboardComponent {
  utils = inject(Utils);
  private categoryEventsService = inject(CategoryEventsService);
  private categoriesService = inject(CategoriesService);
  readonly allCategories = signal<Category[]>([]);
  readonly date = signal<Date>(new Date());

  /* Get all categories for user */
  getCategories(): void {
    this.categoriesService.getCategoriesWithTotal(this.date()).subscribe({
      next: (categories) => {
        console.log(categories);
        this.allCategories.set(categories);
      },
      error: (err) => {
        this.utils.openSnackBar(err.error.message, '');
        this.allCategories.set([]);
        return of([]);
      },
    });
  }

  /**
   * Transactions
   */
  private transactionsService = inject(TransactionsService);
  private transactionEventsService = inject(TransactionEventsService);
  readonly allTransactions = signal<Transaction[]>([]);

  /* Get all transactoins for user */
  getTransactions(): void {
    this.transactionsService.getTransactions().subscribe({
      next: (transactions) => {
        this.allTransactions.set(transactions);
      },
      error: (err) => {
        this.utils.openSnackBar(err.error.message, '');
        this.allTransactions.set([]);
        return of([]);
      },
    });
  }

  /* Constructor */
  constructor() {
    //Uses the category-event.service to add, update or delete a category
    this.categoryEventsService.updatedCategory$
      .pipe(takeUntilDestroyed())
      .subscribe((updatedCategory) => {
        this.allCategories.update((categories) =>
          categories.map((category) =>
            category.id === updatedCategory.id ? updatedCategory : category,
          ),
        );
      });

    this.categoryEventsService.addedCategory$
      .pipe(takeUntilDestroyed())
      .subscribe((addedCategory) => {
        this.allCategories.update((categories) => {
          const updatedCategories = [...categories, addedCategory];
          return updatedCategories.sort((a, b) => a.name.localeCompare(b.name));
        });
      });

    this.categoryEventsService.deletedCategory$
      .pipe(takeUntilDestroyed())
      .subscribe((deletedCategory) => {
        this.allCategories.update((categories) =>
          categories.filter((category) => category.id !== deletedCategory.id),
        );
      });

    //Uses the transaction-event.service to add, update or delete a transaction
    this.transactionEventsService.updatedTransaction$
      .pipe(takeUntilDestroyed())
      .subscribe((updatedTransaction) => {
        this.allTransactions.update((transactions) =>
          transactions.map((transaction) =>
            transaction.id === updatedTransaction.id
              ? updatedTransaction
              : transaction,
          ),
        );
      });

    this.transactionEventsService.addedTransaction$
      .pipe(takeUntilDestroyed())
      .subscribe((addedTransaction) => {
        this.allTransactions.update((transactions) => {
          return [...transactions, addedTransaction];
        });
      });

    this.transactionEventsService.deletedTransaction$
      .pipe(takeUntilDestroyed())
      .subscribe((deletedTransaction) => {
        this.allTransactions.update((transactions) =>
          transactions.filter(
            (transaction) => transaction.id !== deletedTransaction.id,
          ),
        );
      });

    afterNextRender(() => {
      this.getCategories();
      //  this.getTransactions();
    });
  }
}
