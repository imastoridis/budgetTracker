import { inject, Injectable, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/categories.models';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly apiUrlCategories = 'http://localhost:8080/api/categories';
  private http = inject(HttpClient);

  readonly allCategories = signal<Category[]>([]);
  /**
   * Gets categories from the backend.
   * @returns An Observable of the categories response.
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrlCategories);
  }

  /**
   * Adds a new category to the backend.
   * @param category
   * @returns An Observable of the categories response.
   */
  addCategory(category: Category): Observable<Category> {
    console.log(category);
    return this.http.post<Category>(this.apiUrlCategories, category);
  }

  /**
   * Updates an existing category in the backend.
   * @param category
   * @returns An Observable of the updated category response.
   */
  updateCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(
      this.apiUrlCategories + '/' + category.id,
      category,
    );
  }

  /**
   * Deletes an existing category in the backend.
   * @param category
   * @returns An Observable of the updated category response.
   */
  deleteCategory(category: Category): Observable<Category> {
    return this.http.delete<Category>(
      this.apiUrlCategories + '/' + category.id,
    );
  }

  /**
   * Deletes an existing category in the backend.
   * @param category
   * @returns truth false
   */
  categoryHasTransactions(category: Category): Observable<boolean> {
    return this.http
      .get<{
        hasTransactions: boolean;
      }>(this.apiUrlCategories + '/has-transactions/' + category.id)
      .pipe(map((response) => response.hasTransactions));
  }
}
