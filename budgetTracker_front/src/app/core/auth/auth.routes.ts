// src/app/features/auth/auth.routes.ts

import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';

// Feature routes
export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login to Application',
  },
  {
    path: 'register',
    component: RegistrationComponent,
    title: 'Register New Account',
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
