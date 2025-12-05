import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CategoryCreate, Category } from '../models/categories.models';

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
  getCategories(): Observable<Category> {
    return this.http.get<Category>(this.apiUrlCategories).pipe(
      tap((response) => {
        console.log('Categories fetched:', response);
      }),
    );
  }

  /**
   * Adds a new category to the backend.
   * @param category
   * @returns An Observable of the categories response.
   */
  addCategory(category: CategoryCreate): Observable<Category> {
    return this.http.post<Category>(this.apiUrlCategories, category).pipe(
      tap((response) => {
        console.log('Categories fetched:', response);
      }),
    );
  }
}
