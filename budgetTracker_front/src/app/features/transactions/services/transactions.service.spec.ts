import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TransactionsService } from './transactions.service';
import { Transaction } from '../models/transactions.models';
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
    httpMock.verify(); // Ensures no unmatched requests are outstanding
  });

  /* getAllTransactionsIncome */
  it('should fetch income transactions for a specific month', () => {
    const mockDate = new Date('2026-01-01');
    const mockResponse: Transaction[] = [
      {
        id: 1,
        amount: 100,
        date: new Date('2026-01-03'),
        description: 'Freelance',
        categoryId: 10,
      },
    ];

    service.getAllTransactionsIncome(mockDate).subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    // The service uses setDateParams which converts date to YYYY-MM-DD string
    const req = httpMock.expectOne((r) => r.url.includes('/income/by-month'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('date')).toBe('2026-01-01');

    req.flush(mockResponse);
  });

  /* getAllTransactionsExpense */
  it('should fetch expense transactions for a specific month', () => {
    const mockDate = new Date('2026-01-01');
    const mockResponse: Transaction[] = [
      {
        id: 1,
        amount: 100,
        date: new Date('2026-01-03'),
        description: 'Freelance',
        categoryId: 10,
      },
    ];

    service.getAllTransactionsExpense(mockDate).subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    // The service uses setDateParams which converts date to YYYY-MM-DD string
    const req = httpMock.expectOne((r) => r.url.includes('/expense/by-month'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('date')).toBe('2026-01-01');

    req.flush(mockResponse);
  });

  /* addTransaction */
  it('should add a new transaction', () => {
    const mockDate = new Date('2026-01-01');

    const mockTransaction: Transaction = {
      id: 1,
      amount: 100,
      date: mockDate,
      description: 'Freelance',
      categoryId: 10,
    };

    const mockResponse: Transaction[] = [
      {
        id: 1,
        amount: 100,
        date: mockDate,
        description: 'Freelance',
        categoryId: 10,
      },
    ];

    service.addTransaction(mockTransaction).subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    // The service uses setDateParams which converts date to YYYY-MM-DD string
    const req = httpMock.expectOne((r) => r.url.includes(''));
    expect(req.request.method).toBe('POST');

    req.flush(mockResponse);
  });
});
