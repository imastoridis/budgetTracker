// src/app/core/auth/interceptors/auth.interceptor.ts

import { inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor to attach JWT and handle 401 errors from the server.
 */
export const authInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  // 1. Attach the token to the outgoing request
  const token = authService.isAuthenticated(); // The signal holds the token string or null

  let authReq = req;
  if (token) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  // 2. Handle the response and check for 401
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token was rejected by the server (invalid signature, revoked, etc.)
        console.error('Server rejected token (401). Forcing logout.');

        // This is the key: Force logout and redirect.
        authService.logout();

        // Important: Stop the error from continuing to the component's subscriber
        return throwError(() => new Error('Session Expired or Unauthorized'));
      }
      return throwError(() => error);
    }),
  );
};
