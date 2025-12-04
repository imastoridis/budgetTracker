// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  // Authentication Feature (Lazy Loaded)
  {
    path: 'auth',
    loadChildren: () =>
      import('./core/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  // Dashboard Feature (Protected Route)
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/components/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
  },
  // Default Redirect
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
];
