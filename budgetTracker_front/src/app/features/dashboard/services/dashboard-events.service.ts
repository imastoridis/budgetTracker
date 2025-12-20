import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardEventsService {
  // Private RxJS Subjects to act as event emitters
  private readonly changedDateSubject = new Subject<Date>();

  // Public Observables for components to subscribe to
  readonly changedDate$: Observable<Date> =
    this.changedDateSubject.asObservable();

  // Methods to trigger the events
  notifyDateChanged(transaction: Date): void {
    this.changedDateSubject.next(transaction);
  }
}
