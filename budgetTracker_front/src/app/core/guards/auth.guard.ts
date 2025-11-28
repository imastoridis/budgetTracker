// src/app/core/guards/auth.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

/**
 * Functional Router Guard to check if a user is authenticated.
 * This guard uses the signal-based authentication state.
 */
export const authGuard: CanActivateFn = () => {
  // Dependency Injection: Use inject()
  const authService = inject(AuthService);
  const router = inject(Router);

  // State Management: Access the signal value directly using the function call (isAuthenticated())
  if (authService.isAuthenticated()) {
    // If the token signal has a value (is authenticated), allow access.
    return true;
  } else {
    // If not authenticated, redirect the user to the login page.
    console.log('Access denied. Redirecting to login.');
    // TypeScript Best Practice: Explicitly return the UrlTree promise result.
    return router.parseUrl('/auth/login');
  }
};
