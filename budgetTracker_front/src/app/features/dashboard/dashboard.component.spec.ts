import { TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { TransactionsService } from '../transactions/services/transactions.service';
import { CategoriesService } from '../categories/services/categories.service';
import { TransactionsStateService } from '@shared/services/state/transactionsStateService';
import { CategoriesStateService } from '@shared/services/state/categoriesStateService';
import { DashboardEventsService } from './services/dashboard-events.service';
import { of, Subject } from 'rxjs';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import { Utils } from '@app/shared/utils/utils';

describe('DashboardComponent', () => {
  let component: DashboardComponent;

  // Create a Subject to control date change emissions
  const changedDateSubject = new Subject<Date>();

  const mockTransactionsService = {
    getAllTransactionsIncome: vi.fn(),
    getAllTransactionsExpense: vi.fn(),
    getTotalIncomeByMonth: vi.fn(),
    getTotalExpensesByMonth: vi.fn(),
  };

  const mockCategoriesService = {
    getCategoriesWithTotal: vi.fn(),
  };

  const mockTransactionsState = {
    setTransactionsIncome: vi.fn(),
    setTransactionsExpense: vi.fn(),
    setTotalIncome: vi.fn(),
    setTotalExpense: vi.fn(),
  };

  const mockCategoriesState = {
    setCategories: vi.fn(),
  };

  const mockDashboardEvents = {
    changedDate$: changedDateSubject.asObservable(),
  };

  const mockUtils = {
    openSnackBar: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    // Default mock returns
    mockTransactionsService.getAllTransactionsIncome.mockReturnValue(of([]));
    mockTransactionsService.getAllTransactionsExpense.mockReturnValue(of([]));
    mockTransactionsService.getTotalIncomeByMonth.mockReturnValue(of('0'));
    mockTransactionsService.getTotalExpensesByMonth.mockReturnValue(of('0'));
    mockCategoriesService.getCategoriesWithTotal.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      providers: [
        DashboardComponent,
        { provide: TransactionsService, useValue: mockTransactionsService },
        { provide: CategoriesService, useValue: mockCategoriesService },
        { provide: TransactionsStateService, useValue: mockTransactionsState },
        { provide: CategoriesStateService, useValue: mockCategoriesState },
        { provide: DashboardEventsService, useValue: mockDashboardEvents },
        { provide: Utils, useValue: mockUtils },
      ],
    }).compileComponents();

    component = TestBed.inject(DashboardComponent);
  });

  it('should fetch data when DashboardEventsService emits a new date', () => {
    const testDate = new Date('2026-01-01');

    // Act: Emit a new date through the shared event service
    // This triggers the subscription in the constructor
    changedDateSubject.next(testDate);

    // Assert: Verify internal signal update
    expect(component.date()).toEqual(testDate);

    // Assert: Verify all data-fetching methods were called with correct date
    expect(mockCategoriesService.getCategoriesWithTotal).toHaveBeenCalledWith(
      testDate,
    );
    expect(mockTransactionsService.getAllTransactionsIncome).toHaveBeenCalled();
    expect(
      mockTransactionsService.getAllTransactionsExpense,
    ).toHaveBeenCalled();
    expect(mockTransactionsService.getTotalIncomeByMonth).toHaveBeenCalledWith(
      testDate,
    );
    expect(
      mockTransactionsService.getTotalExpensesByMonth,
    ).toHaveBeenCalledWith(testDate);
  });

  it('should update transactions state when fetching transactions is successful', () => {
    const mockTransactionIncome = [
      {
        id: 1,
        date: new Date('2026-01-01'),
        description: 'test',
        amount: 100,
        categoryId: 1,
      },
    ];
    (mockTransactionsService.getAllTransactionsIncome as Mock).mockReturnValue(
      of(mockTransactionIncome),
    );

    // Act: Trigger data load via date change
    changedDateSubject.next(new Date());

    // Assert: Verify the state service was updated
    expect(mockTransactionsState.setTransactionsIncome).toHaveBeenCalledWith(
      mockTransactionIncome,
    );
  });

  it('should update categories state when fetching categories is successful', () => {
    const mockCats = [{ id: 1, name: 'Food', totalAmount: 50 }];
    (mockCategoriesService.getCategoriesWithTotal as Mock).mockReturnValue(
      of(mockCats),
    );

    // Act
    changedDateSubject.next(new Date());

    // Assert
    expect(mockCategoriesState.setCategories).toHaveBeenCalledWith(mockCats);
  });
});
