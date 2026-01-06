// transactions.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TransactionsService } from './transactions.service';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransactionsService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(TransactionsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });

  it('should fetch income transactions by month', () => {
    const mockData = [{ id: 1, amount: 100, description: 'Test' }];
    const testDate = new Date('2024-01-01');

    service.getAllTransactionsIncome(testDate).subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne((r) => r.url.includes('/income/by-month'));
    expect(req.request.method).toBe('GET');
    req.flush(mockData); // Return the mock data
  });
});
