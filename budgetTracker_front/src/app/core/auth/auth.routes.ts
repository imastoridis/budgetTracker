// src/app/features/auth/auth.routes.ts

import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';

// Angular Best Practice: Define feature routes
export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login to Application',
  },
  // Add other auth routes like 'register' or 'forgot-password' here
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
