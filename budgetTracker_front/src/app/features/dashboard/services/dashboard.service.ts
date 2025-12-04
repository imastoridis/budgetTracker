import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
//import { AuthResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authService = inject(AuthService);

  // isAuthenticate = this.authService.isAuthenticated();

  private http = inject(HttpClient);
  private router = inject(Router);
}
