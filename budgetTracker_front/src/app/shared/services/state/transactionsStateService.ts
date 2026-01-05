import { inject, Injectable, signal } from '@angular/core';
import { Transaction } from '../../../features/transactions/models/transactions.models';
import { CategoriesStateService } from './categoriesStateService';

@Injectable({ providedIn: 'root' })
export class TransactionsStateService {
  // The private writable signal
  private _transactions = signal<Transaction[]>([]);
  private _transactionsIncome = signal<Transaction[]>([]);
  private _transactionsExpense = signal<Transaction[]>([]);
  private _totalIncome = signal<number>(0);
  private _totalExpense = signal<number>(0);
  private categoriesState = inject(CategoriesStateService);
  readonly allCategories = this.categoriesState.categories;

  // The public read-only signal that components consume
  readonly transactions = this._transactions.asReadonly();
  readonly transactionsIncome = this._transactionsIncome.asReadonly();
  readonly transactionsExpense = this._transactionsExpense.asReadonly();
  readonly totalIncome = this._totalIncome.asReadonly();
  readonly totalExpense = this._totalExpense.asReadonly();

  /* Set transactions income/expense */
  setTransactionsIncome(transactions: Transaction[]) {
    this._transactionsIncome.set(transactions);
  }

  setTransactionsExpense(transactions: Transaction[]) {
    this._transactionsExpense.set(transactions);
  }

  /* Set total income/expense */
  setTotalIncome(totalIncome: number) {
    this._totalIncome.set(totalIncome);
  }

  setTotalExpense(totalExpense: number) {
    this._totalExpense.set(totalExpense);
  }

  /* Transaction income added */
  addTransactionIncome(newTransaction: Transaction) {
    this._transactionsIncome.update((transactionsIncome) => {
      return [...transactionsIncome, newTransaction];
    });

    this.categoriesState.updateCategoryAmount(
      newTransaction.categoryId,
      0,
      newTransaction.amount,
    );

    // Update total income/expense
    this._totalIncome.update(() => this._totalIncome() + newTransaction.amount);
  }

  /* Transaction expense added */
  addTransactionExpense(newTransaction: Transaction) {
    this._transactionsExpense.update((transactionsExpense) => {
      return [...transactionsExpense, newTransaction];
    });

    this.categoriesState.updateCategoryAmount(
      newTransaction.categoryId,
      0,
      newTransaction.amount,
    );

    // Update total income/expense
    this._totalExpense.update(
      () => this._totalExpense() + newTransaction.amount,
    );
  }

  /* Transaction income updated */
  updateTransactionIncome(updatedTransaction: Transaction) {
    const oldTransaction = this._transactionsIncome().find(
      (t) => t.id === updatedTransaction.id,
    );

    if (oldTransaction) {
      this._transactionsIncome.update((transactionsIncome) =>
        transactionsIncome.map((t) =>
          t.id === updatedTransaction.id ? updatedTransaction : t,
        ),
      );

      this.categoriesState.updateCategoryAmount(
        updatedTransaction.categoryId,
        oldTransaction.amount,
        updatedTransaction.amount,
      );

      // Update total income
      this._totalIncome.update(
        (total) => total - oldTransaction.amount + updatedTransaction.amount,
      );
    }
  }

  /* Transaction expense updated */
  updateTransactionExpense(updatedTransaction: Transaction) {
    const oldTransaction = this._transactionsExpense().find(
      (t) => t.id === updatedTransaction.id,
    );

    if (oldTransaction) {
      this._transactionsExpense.update((transactionsExpense) =>
        transactionsExpense.map((t) =>
          t.id === updatedTransaction.id ? updatedTransaction : t,
        ),
      );

      this.categoriesState.updateCategoryAmount(
        updatedTransaction.categoryId,
        oldTransaction.amount,
        updatedTransaction.amount,
      );

      // Update total expense
      this._totalExpense.update(
        (total) => total - oldTransaction.amount + updatedTransaction.amount,
      );
    }
  }

  /* Transaction income deleted */
  deleteTransactionIncome(deletedTransaction: Transaction) {
    this._transactionsIncome.update((transactionsIncome) =>
      transactionsIncome.filter(
        (transaction) => transaction.id !== deletedTransaction.id,
      ),
    );

    this.categoriesState.updateCategoryAmount(
      deletedTransaction.categoryId,
      deletedTransaction.amount,
      0,
    );

    // Update total income
    this._totalIncome.update(
      () => this._totalIncome() - deletedTransaction.amount,
    );
  }

  /* Transaction expense deleted */
  deleteTransactionExpense(deletedTransaction: Transaction) {
    this._transactionsExpense.update((transactionsExpense) =>
      transactionsExpense.filter(
        (transaction) => transaction.id !== deletedTransaction.id,
      ),
    );
    this.categoriesState.updateCategoryAmount(
      deletedTransaction.categoryId,
      deletedTransaction.amount,
      0,
    );

    // Update total expense
    this._totalExpense.update(
      () => this._totalExpense() - deletedTransaction.amount,
    );
  }
}
