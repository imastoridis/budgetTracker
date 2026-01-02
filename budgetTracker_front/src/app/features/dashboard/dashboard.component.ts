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
import { DashboardEventsService } from './services/dashboard-events.service';
/* Categories */
import { Category } from '../categories/models/categories.models';
import { CategoriesService } from '../categories/services/categories.service';
import { CategoryEventsService } from '../categories/services/category-events.service';
/* Transactions */
import { Transaction } from '../transactions/models/transactions.models';
import { TransactionsService } from '../transactions/services/transactions.service';
import { TransactionEventsService } from '../transactions/services/transaction-events.service';
/* Dashboard children*/
import { DashboardHeader } from './components/dashboard-header';
import { DashboardSidebar } from './components/sidebar/dashboard-sidebar';
import { DashboardSummary } from './components/summary/dashboard-summary';
import { TransactionType } from '../transactions/models/transaction-types.enum';

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
  readonly date = signal<Date>(new Date());
  private dashboardEventsService = inject(DashboardEventsService);

  /**
   * Categories
   */
  private categoryEventsService = inject(CategoryEventsService);
  private categoriesService = inject(CategoriesService);
  readonly allCategories = signal<Category[]>([]);

  /* Get all categories for user */
  getCategoriesWithTotal(date: Date): void {
    this.categoriesService.getCategoriesWithTotal(date).subscribe({
      next: (categories) => {
        console.log('categories', categories);
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
  /*   getTransactions(): void {
    this.transactionsService.getTransactions().subscribe({
      next: (transactions) => {
        console.log('transactions', transactions);
        this.allTransactions.set(transactions);
      },
      error: (err) => {
        this.utils.openSnackBar(err.error.message, '');
        this.allTransactions.set([]);
        return of([]);
      },
    });
  } */

  /**
   * Income Transactions
   */
  readonly allTransactionsIncome = signal<Transaction[]>([]);

  getAllTransactionsIncome(): void {
    this.transactionsService.getAllTransactionsIncome(this.date()).subscribe({
      next: (transactionsIncome) => {
        console.log('transactions', transactionsIncome);
        this.allTransactionsIncome.set(transactionsIncome);
      },
      error: (err) => {
        this.utils.openSnackBar(err.error.message, '');
        this.allTransactionsIncome.set([]);
        return of([]);
      },
    });
  }

  /**
   *  Expense transactions
   * */

  readonly allTransactionsExpense = signal<Transaction[]>([]);

  getAllTransactionsExpense(): void {
    this.transactionsService.getAllTransactionsExpense(this.date()).subscribe({
      next: (transactionsExpense) => {
        console.log('transactions', transactionsExpense);
        this.allTransactionsExpense.set(transactionsExpense);
      },
      error: (err) => {
        this.utils.openSnackBar(err.error.message, '');
        this.allTransactionsExpense.set([]);
        return of([]);
      },
    });
  }

  /**
   * Calculates and returns a new category object with the updated total amount.
   */
  private updateCategoryTotal(
    category: Category,
    oldAmount: number,
    newAmount: number,
  ): Category {
    return {
      ...category,
      totalAmount: (category.totalAmount ?? 0) - oldAmount + newAmount,
    };
  }

  /* Constructor */
  constructor() {
    /**
     * Category  Events
     * Uses the category-event.service to add, update or delete a category
     */

    /* Category added */
    this.categoryEventsService.addedCategory$
      .pipe(takeUntilDestroyed())
      .subscribe((addedCategory) => {
        this.allCategories.update((categories) => {
          const updatedCategories = [...categories, addedCategory];
          return updatedCategories.sort((a, b) => a.name.localeCompare(b.name));
        });
      });

    /* Category updated */
    this.categoryEventsService.updatedCategory$
      .pipe(takeUntilDestroyed())
      .subscribe((updatedCategory) => {
        this.allCategories.update((categories) =>
          categories.map((category) =>
            category.id === updatedCategory.id ? updatedCategory : category,
          ),
        );
      });

    /* Category deleted */
    this.categoryEventsService.deletedCategory$
      .pipe(takeUntilDestroyed())
      .subscribe((deletedCategory) => {
        this.allCategories.update((categories) =>
          categories.filter((category) => category.id !== deletedCategory.id),
        );
      });

    /**
     * Transaction Events
     * Uses the transaction-event.service to add, update or delete a transaction, updates to sum in categories
     */

    /**
     * Transaction added
     * Category total amount updated
     * Income or expense transaction list updated
     * @returns updated category list
     * */
    this.transactionEventsService.addedTransaction$
      .pipe(takeUntilDestroyed())
      .subscribe((addedTransaction) => {
        this.allCategories.update((categories) =>
          categories.map((category) => {
            if (category.id === addedTransaction.categoryId) {
              if (category.type === TransactionType.INCOME) {
                // Update Transactions income Signal
                this.allTransactionsIncome.update((transactionsIncome) => {
                  return [...transactionsIncome, addedTransaction];
                });
              } else {
                // Update Transactions expense Signal
                this.allTransactionsExpense.update((transactionsEpense) => {
                  return [...transactionsEpense, addedTransaction];
                });
              }

              //Update category total amount
              return this.updateCategoryTotal(
                category,
                0,
                addedTransaction.amount,
              );
            } else {
              return category;
            }
          }),
        );
      });

    /**
     * Transaction updated
     * Category total amount updated
     * Income or expense transaction list updated
     * @returns updated category list
     * */

    this.transactionEventsService.updatedTransaction$
      .pipe(takeUntilDestroyed())
      .subscribe((updatedTransaction) => {
        const oldTransaction = this.allTransactionsIncome().find(
          (t) => t.id === updatedTransaction.id,
        );
        console.log('Old Transaction', 'oldTransaction');

        if (oldTransaction) {
          console.log('Old Transaction', oldTransaction);
          this.allCategories.update((categories) =>
            categories.map((category) => {
              if (category.id === updatedTransaction.categoryId) {
                console.log('Category', updatedTransaction);
                if (category.type === TransactionType.INCOME) {
                  // Update Transactions income Signal
                  this.allTransactionsIncome.update((transactionsIncome) =>
                    transactionsIncome.map((t) =>
                      t.id === updatedTransaction.id ? updatedTransaction : t,
                    ),
                  );
                } else {
                  // Update Transactions expense Signal
                  this.allTransactionsExpense.update((transactionsExpense) =>
                    transactionsExpense.map((t) =>
                      t.id === updatedTransaction.id ? updatedTransaction : t,
                    ),
                  );
                }

                // Update Categories total amount
                return this.updateCategoryTotal(
                  category,
                  oldTransaction.amount,
                  updatedTransaction.amount,
                );
              } else {
                return category;
              }
            }),
          );
        }
      });

    /**
     * Transaction deleted
     * Category total amount updated
     * Income or expense transaction list updated
     * @returns updated category list
     * */
    this.transactionEventsService.deletedTransaction$
      .pipe(takeUntilDestroyed())
      .subscribe((deletedTransaction) => {
        // Update Categories Signal
        this.allCategories.update((categories) =>
          categories.map((category) =>
            category.id === deletedTransaction.categoryId
              ? this.updateCategoryTotal(category, deletedTransaction.amount, 0)
              : category,
          ),
        );

        this.allTransactions.update((transactions) =>
          transactions.filter(
            (transaction) => transaction.id !== deletedTransaction.id,
          ),
        );
      });

    /**
     * On selected date change
     */
    this.dashboardEventsService.changedDate$
      .pipe(takeUntilDestroyed())
      .subscribe((newDate) => {
        this.date.set(newDate);
        this.getCategoriesWithTotal(this.date());
        this.getAllTransactionsIncome();
      });

    /**
     *  Initial data load
     */
    afterNextRender(() => {
      this.getCategoriesWithTotal(this.date());
      this.getAllTransactionsIncome();
    });
  }
}
