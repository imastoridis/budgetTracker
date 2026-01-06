import { TestBed } from '@angular/core/testing';
import {
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';

// 1. Mock the AuthService
const mockAuthService = {
  // isAuthenticated is a signal, so we mock it as a spy function
  isAuthenticated: vi.fn(),
};

describe('AuthGuard', () => {
  /* 
  let router: Router;
  //let authService: typeof mockAuthService;
  let authService: AuthService;

  beforeEach(() => {
    // Configure TestBed with mocks
    TestBed.configureTestingModule({
      imports: [
        // Use RouterTestingModule to mock the router dependencies
        RouterTestingModule.withRoutes([]),
      ],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    });

    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);

    // Spy on the router's redirect method
    vi.spyOn(router, 'parseUrl').mockImplementation((url: string) => {
      // Return a mock UrlTree object for the redirect test
      return { path: url } as unknown as UrlTree;
    });
  });

  // --- Test 1: Authenticated User ---
  it('should allow access for an authenticated user', () => {
    // Arrange: Set the isAuthenticated signal to return true (authenticated)
    (authService.isAuthenticated as unknown as Mock).mockReturnValue(true);

    // Act: Call the guard function
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

    // Assert: Expect the guard to return true
    expect(result).toBe(true);
    expect(router.parseUrl).not.toHaveBeenCalled();
  });

  // --- Test 2: Unauthenticated User ---
  it('should redirect an unauthenticated user to the login page', () => {
    // Arrange: Set the isAuthenticated signal to return false (not authenticated)
    (authService.isAuthenticated as unknown as Mock).mockReturnValue(false);

    // Act: Call the guard function
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

    // Assert: Expect the guard to return a UrlTree that points to the login page
    expect(router.parseUrl).toHaveBeenCalledWith('/auth/login');
    // Check that the result is the UrlTree object we returned from the mock
    expect(result).toEqual({ path: '/auth/login' } as unknown as UrlTree);
  }); */
});
