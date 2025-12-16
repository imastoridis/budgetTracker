// transaction-events.service.ts
import { Injectable } from '@angular/core';
import { Category } from '../models/categories.models';
import { Subject, Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class CategoryEventsService {
  // Private RxJS Subjects to act as event emitters
  private readonly addCategorySubject = new Subject<Category>();
  private readonly updateCategorySubject = new Subject<Category>();
  private readonly deleteCategorySubject = new Subject<Category>();

  // Public Observables for components to subscribe to
  readonly addedCategory$: Observable<Category> =
    this.addCategorySubject.asObservable();
  readonly updatedCategory$: Observable<Category> =
    this.updateCategorySubject.asObservable();
  readonly deletedCategory$: Observable<Category> =
    this.deleteCategorySubject.asObservable();

  // Methods to trigger the events
  notifyCategoryAdded(category: Category): void {
    this.addCategorySubject.next(category);
  }

  notifyCategoryUpdated(category: Category): void {
    this.updateCategorySubject.next(category);
  }

  notifyCategoryDeleted(category: Category): void {
    this.deleteCategorySubject.next(category);
  }
}
