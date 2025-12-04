import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '../models/categories.models';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly apiUrlGetCategories = 'http://localhost:8080/api/categories';
  private http = inject(HttpClient);

  /**
   * Gets categories from the backend.
   * @returns An Observable of the categories response.
   */
  getCategories(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(this.apiUrlGetCategories).pipe(
      tap((response) => {
        console.log('Categories fetched:', response);
      }),
    );
  }
}
