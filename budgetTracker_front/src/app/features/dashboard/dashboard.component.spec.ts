// dashboard.component.spec.ts
import { render } from '@testing-library/angular';
import { DashboardComponent } from './dashboard.component';
import { TransactionsService } from '../transactions/services/transactions.service';
import { CategoriesService } from '../categories/services/categories.service';
import { of } from 'rxjs';
import { vi, describe, it, expect } from 'vitest';

describe('DashboardComponent', () => {
  it('should load initial data on render', async () => {
    // 1. Create Mocks for all services
    const mockTxService = {
      getAllTransactionsIncome: vi.fn().mockReturnValue(of([])),
      getAllTransactionsExpense: vi.fn().mockReturnValue(of([])),
      getTotalIncomeByMonth: vi.fn().mockReturnValue(of('0')),
      getTotalExpensesByMonth: vi.fn().mockReturnValue(of('0')),
    };

    const mockCatService = {
      getCategoriesWithTotal: vi.fn().mockReturnValue(of([])),
    };

    // 2. Render component with mocked providers
    await render(DashboardComponent, {
      providers: [
        { provide: TransactionsService, useValue: mockTxService },
        { provide: CategoriesService, useValue: mockCatService },
        // Add other state services if needed
      ],
    });

    // 3. Verify that the services were called (initial load)
    expect(mockCatService.getCategoriesWithTotal).toHaveBeenCalled();
    expect(mockTxService.getAllTransactionsIncome).toHaveBeenCalled();
  });
});
