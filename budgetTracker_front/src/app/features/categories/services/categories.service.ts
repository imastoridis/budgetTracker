import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/categories.models';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly apiUrlCategories = 'http://localhost:8080/api/categories';
  private http = inject(HttpClient);

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
    console.log('Adding category:', category);
    return this.http.post<Category>(this.apiUrlCategories, category).pipe(
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
  updateCategory(category: Category): Observable<Category> {
    return this.http
      .put<Category>(this.apiUrlCategories + '/' + category.id, category)
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
  deleteCategory(category: Category): Observable<Category> {
    return this.http.delete<Category>(
      this.apiUrlCategories + '/' + category.id,
    );
  }
}
