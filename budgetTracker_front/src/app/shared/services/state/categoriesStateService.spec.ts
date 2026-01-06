import { TestBed } from '@angular/core/testing';
import { CategoriesStateService } from './categoriesStateService';
import { Category } from '../../../features/categories/models/categories.models';
import { describe, it, expect, beforeEach } from 'vitest';
import { TransactionType } from '@app/features/transactions/models/transaction-types.enum';

describe('CategoriesStateService', () => {
  let service: CategoriesStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoriesStateService],
    });
    service = TestBed.inject(CategoriesStateService);
  });

  it('should separate Income and Expense categories when set', () => {
    const mockData: Category[] = [
      {
        id: 1,
        name: 'Salary',
        userId: 1,
        type: TransactionType.INCOME,
        totalAmount: 0,
      },
      {
        id: 2,
        name: 'Rent',
        userId: 1,
        type: TransactionType.EXPENSE,
        totalAmount: 0,
      },
    ];

    service.setCategories(mockData);

    expect(service.categoriesIncome()).toHaveLength(1);
    expect(service.categoriesIncome()[0].name).toBe('Salary');
    expect(service.categoriesIncome()[0].type).toBe(TransactionType.INCOME);
    expect(service.categoriesIncome()[0].totalAmount).toBe(0);

    expect(service.categoriesExpense()).toHaveLength(1);
    expect(service.categoriesExpense()[0].name).toBe('Rent');
    expect(service.categoriesExpense()[0].type).toBe(TransactionType.EXPENSE);
    expect(service.categoriesExpense()[0].totalAmount).toBe(0);
  });
});
