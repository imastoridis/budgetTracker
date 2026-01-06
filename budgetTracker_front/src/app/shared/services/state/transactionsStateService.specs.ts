// transactionsStateService.spec.ts
import { TestBed } from '@angular/core/testing';
import { TransactionsStateService } from './transactionsStateService';
import { CategoriesStateService } from './categoriesStateService';
import { describe, it, expect, beforeEach } from 'vitest';

describe('TransactionsStateService', () => {
  let service: TransactionsStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionsStateService, CategoriesStateService],
    });
    service = TestBed.inject(TransactionsStateService);
  });

  it('should update total income when setTotalIncome is called', () => {
    service.setTotalIncome(500);
    expect(service.totalIncome()).toBe(500);
  });

  it('should filter income transactions into the income signal', () => {
    const mockTx = { id: 1, amount: 50, categoryId: 1 };
    service.setTransactionsIncome([
      mockTx as {
        id: number;
        date: Date;
        description: string;
        amount: number;
        categoryId: number;
      },
    ]);
    expect(service.transactionsIncome()).toContain(mockTx);
  });
});
