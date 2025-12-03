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
    // Note: In a real app, you might want to validate the token's expiry here.
    return localStorage.getItem('authToken');
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
