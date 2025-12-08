import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Credentials, AuthResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrlLogin = 'http://localhost:8080/api/auth/login';
  private readonly apiUrlRegister = 'http://localhost:8080/api/auth/register';

  // State Management: Signal for tracking the authentication status.
  private readonly jwtToken: WritableSignal<string | null> = signal(
    this.getInitialToken(),
  );

  readonly isAuthenticated = this.jwtToken.asReadonly();

  private http = inject(HttpClient);
  private router = inject(Router);

  /**
   * Tries to retrieve a JWT from localStorage on service initialization.
   * @returns The stored JWT string or null.
   */
  private getInitialToken(): string | null {
    const token = localStorage.getItem('authToken');

    // Check if token exists AND if it is NOT expired
    if (token && !this.isTokenExpired(token)) {
      return token;
    }

    // If token is present but expired, or missing, remove it from storage.
    if (token) {
      console.log('Found token, but it is expired. Removing from storage.');
      localStorage.removeItem('authToken');
    }

    return null;
  }

  // Helper function to decode a JWT and check its expiration
  isTokenExpired(token: string): boolean {
    try {
      // JWT structure: Header.Payload.Signature. We only need the payload (index 1).
      const payload = token.split('.')[1];
      // Base64 decode the payload
      const decodedPayload = JSON.parse(atob(payload));

      if (!decodedPayload.exp) {
        // If there's no expiration claim, treat as valid or adjust as per backend rules.
        return false;
      }

      // exp is in seconds (Unix epoch time). Convert to milliseconds for Date.
      const expirationTimeMs = decodedPayload.exp * 1000;
      const currentTimeMs = new Date().getTime();

      // The token is expired if the expiration time is in the past.
      return expirationTimeMs < currentTimeMs;
    } catch (error) {
      // If decoding fails (malformed token), treat it as expired/invalid.
      console.error('JWT decoding failed:', error);
      return true;
    }
  }

  /**
   * Sends login credentials to the backend.
   * @param credentials The username and password.
   * @returns An Observable of the authentication response.
   */
  login(credentials: Credentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrlLogin, credentials).pipe(
      tap((response) => {
        const token = response.token;
        this.jwtToken.set(token);
        localStorage.setItem('authToken', token);
        this.router.navigate(['/dashboard']);
      }),
    );
  }

  /**
   * Sends register new user credentials to the backend.
   * @param credentials The username, password and email.
   * @returns An Observable of the authentication response.
   */
  register(credentials: Credentials): Observable<string> {
    return this.http
      .post<string>(this.apiUrlRegister, credentials, {
        responseType: 'text' as 'json',
      })
      .pipe(
        tap(() => {
          this.router.navigate(['/auth/login']);
        }),
      );
  }

  /**
   * Clears the token and resets the auth state.
   */
  logout(): void {
    this.jwtToken.set(null);
    localStorage.removeItem('authToken');
    this.router.navigate(['/auth/login']);
  }
}
