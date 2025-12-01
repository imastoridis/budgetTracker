import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Credentials, AuthResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/auth/login';

  // State Management: Signal for tracking the authentication status.
  private readonly jwtToken: WritableSignal<string | null> = signal(
    this.getInitialToken(),
  );

  // Public readonly signal for component access.
  readonly isAuthenticated = this.jwtToken.asReadonly();

  // Dependency Injection:
  private http = inject(HttpClient);
  private router = inject(Router);

  /**
   * Tries to retrieve a JWT from localStorage on service initialization.
   * @returns The stored JWT string or null.
   */
  private getInitialToken(): string | null {
    // Note: In a real app, you might want to validate the token's expiry here.
    return localStorage.getItem('authToken');
  }

  /**
   * Sends login credentials to the backend.
   * @param credentials The username and password.
   * @returns An Observable of the authentication response.
   */
  login(credentials: Credentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl, credentials).pipe(
      // State Management: Use tap to handle side effects (token storage/signal update)
      tap((response) => {
        const token = response.token;

        this.jwtToken.set(token);

        // Store token securely.
        localStorage.setItem('authToken', token);

        // Navigation: Redirect after successful login.
        this.router.navigate(['/dashboard']);
      }),
    );
  }

  /**
   * Clears the token and resets the auth state.
   */
  logout(): void {
    // State Management: Use set() to clear the signal.
    this.jwtToken.set(null);
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}
