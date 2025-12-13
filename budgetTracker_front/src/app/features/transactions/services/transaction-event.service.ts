// transaction-events.service.ts
import { Injectable } from '@angular/core';
import { Transaction } from '../models/transactions.models';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TransactionEventsService {
  // Private RxJS Subjects to act as event emitters
  private readonly addTransactionSubject = new Subject<Transaction>();
  private readonly updateTransactionSubject = new Subject<Transaction>();
  private readonly deleteTransactionSubject = new Subject<Transaction>();

  // Public Observables for components to subscribe to
  readonly addedTransaction$: Observable<Transaction> =
    this.addTransactionSubject.asObservable();
  readonly updatedTransaction$: Observable<Transaction> =
    this.updateTransactionSubject.asObservable();
  readonly deletedTransaction$: Observable<Transaction> =
    this.deleteTransactionSubject.asObservable();

  // Methods to trigger the events
  notifyTransactionAdded(transaction: Transaction): void {
    this.addTransactionSubject.next(transaction);
  }

  notifyTransactionUpdated(transaction: Transaction): void {
    this.updateTransactionSubject.next(transaction);
  }

  notifyTransactionDeleted(transaction: Transaction): void {
    this.deleteTransactionSubject.next(transaction);
  }
}
