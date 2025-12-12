// transaction-events.service.ts
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Transaction } from '../models/transactions.models';

@Injectable({ providedIn: 'root' })
export class TransactionEventsService {
  // Use a signal to notify about a new transaction
  private readonly newTransactionSource: WritableSignal<Transaction | null> =
    signal(null);

  readonly newTransaction$ = this.newTransactionSource.asReadonly();

  notifyTransactionAdded(transaction: Transaction): void {
    // Set the signal to the new transaction
    this.newTransactionSource.set(transaction);
  }
}
