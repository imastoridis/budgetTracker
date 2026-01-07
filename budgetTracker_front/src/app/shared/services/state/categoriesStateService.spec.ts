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

  /* Add category */
  it('should add a new category to the list', () => {
    // 1. Arrange: Initial state with some categories
    const mockDataInitialList: Category[] = [
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

    service.setCategories(mockDataInitialList);

    // 2. Act: Add the new category
    const mockDataNewcategory: Category = {
      id: 10,
      name: 'Activities',
      userId: 1,
      type: TransactionType.INCOME,
      totalAmount: 0,
    };
    service.addCategory(mockDataNewcategory);

    expect(service.categories()).toHaveLength(3);
    expect(service.categories()[2].id).toBe(10);
    expect(service.categories()[2].name).toBe('Activities');
    expect(service.categories()[2].type).toBe(TransactionType.INCOME);
    expect(service.categories()[2].totalAmount).toBe(0);
    //Alphabetical order
    expect(service.categories()[0].name).toBe('Activities');
    expect(service.categories()[1].name).toBe('Rent');
    expect(service.categories()[2].name).toBe('Salary');
  });
});
