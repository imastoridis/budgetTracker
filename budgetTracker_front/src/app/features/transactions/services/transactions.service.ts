import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Transaction } from '../models/transactions.models';
import { Category } from '../../categories/models/categories.models';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private readonly apiUrlTransactions =
    'http://localhost:8080/api/transactions';
  private http = inject(HttpClient);

  /**
   * Gets transactions
   * @returns An Observable of the transactions response.
   */
  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrlTransactions);
  }

  /**
   * Gets all income transactions
   * @returns An Observable of the transactions response.
   */
  getAllTransactionsIncome(date: Date): Observable<Transaction[]> {
    const formattedDate = date.toISOString().substring(0, 10);
    const params = new HttpParams().set('date', formattedDate);

    return this.http.get<Transaction[]>(
      this.apiUrlTransactions + '/income/by-month',
      {
        params: params,
      },
    );
  }

  /**
   * Gets all expenses transactions
   * @returns An Observable of the transactions response.
   */
  getAllTransactionsExpense(date: Date): Observable<Transaction[]> {
    const formattedDate = date.toISOString().substring(0, 10);
    const params = new HttpParams().set('date', formattedDate);

    return this.http.get<Transaction[]>(
      this.apiUrlTransactions + '/expense/by-month',
      {
        params: params,
      },
    );
  }

  /**
   * Gets transactions by category and selected month
   * @returns An Observable of the transactions response.
   */
  getTransactionsByCategoryAndMonth(
    category: Category,
    date: Date,
  ): Observable<Transaction[]> {
    const formattedDate = date.toISOString().substring(0, 10);
    const params = new HttpParams().set('date', formattedDate);

    return this.http.get<Transaction[]>(
      this.apiUrlTransactions + '/by-category/by-month/' + category.id,
      {
        params: params,
      },
    );
  }
  /**
   * Adds a new transaction
   * @param transaction
   * @returns An Observable of the transactions response.
   */
  addTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrlTransactions, transaction);
  }

  /**
   * Updates an existing transaction
   * @param transaction
   * @returns An Observable of the updated transaction response.
   */
  updateTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(
      this.apiUrlTransactions + '/' + transaction.id,
      transaction,
    );
  }

  /**
   * Deletes an existing transaction
   * @param transaction
   * @returns An Observable of the updated transaction response.
   */
  deleteTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.delete<Transaction>(
      this.apiUrlTransactions + '/' + transaction.id,
    );
  }

  /**
   * Gets total income based on the month
   * @returns An Observable of the total income response.
   */
  getTotalIncomeByMonth(date: Date): Observable<string> {
    const formattedDate = date.toISOString().substring(0, 10);
    const params = new HttpParams().set('date', formattedDate);

    return this.http.get<string>(this.apiUrlTransactions + '/total-income', {
      params: params,
    });
  }

  /**
   * Gets total expenses based on the month
   * @returns An Observable of the total expense response.
   */
  getTotalExpensesByMonth(date: Date): Observable<string> {
    const formattedDate = date.toISOString().substring(0, 10);
    const params = new HttpParams().set('date', formattedDate);

    return this.http.get<string>(this.apiUrlTransactions + '/total-expense', {
      params: params,
    });
  }
}
