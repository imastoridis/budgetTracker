import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Transaction } from '../models/transactions.models';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private readonly apiUrlTransactions =
    'http://localhost:8080/api/transactions';
  private http = inject(HttpClient);

  /**
   * Gets categories from the backend.
   * @returns An Observable of the categories response.
   */
  getCategories(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrlTransactions);
  }

  /**
   * Adds a new category to the backend.
   * @param category
   * @returns An Observable of the categories response.
   */
  addTransaction(category: Transaction): Observable<Transaction> {
    console.log('Adding category:', category);
    return this.http.post<Transaction>(this.apiUrlTransactions, category).pipe(
      tap((response) => {
        console.log('Categories fetched:', response);
      }),
    );
  }

  /**
   * Updates an existing category in the backend.
   * @param category
   * @returns An Observable of the updated category response.
   */
  updateTransaction(category: Transaction): Observable<Transaction> {
    return this.http
      .put<Transaction>(this.apiUrlTransactions + '/' + category.id, category)
      .pipe(
        tap((response) => {
          console.log('Categories fetched:', response);
        }),
      );
  }

  /**
   * Deletes an existing category in the backend.
   * @param category
   * @returns An Observable of the updated category response.
   */
  deleteTransaction(category: Transaction): Observable<Transaction> {
    return this.http.delete<Transaction>(
      this.apiUrlTransactions + '/' + category.id,
    );
  }
}
