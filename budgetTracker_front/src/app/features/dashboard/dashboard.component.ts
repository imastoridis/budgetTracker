import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  // OnPush change detection
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],

  template: `
    <div class="p-8 max-w-4xl mx-auto mt-12 bg-white shadow-xl rounded-xl">
      <header class="pb-4 border-b border-gray-200 mb-6">
        <h1 class="text-4xl font-extrabold text-indigo-700">
          🔐 Application Dashboard
        </h1>
      </header>

      @if (authService.isAuthenticated()) {
        <div
          class="bg-green-50 border border-green-200 p-4 rounded-lg mb-6"
          role="status"
        >
          <p class="font-medium text-lg text-green-700">
            You are successfully authenticated!
          </p>
          <p class="text-sm text-green-600 mt-1">Your JWT is active.</p>
        </div>
      } @else {
        <div
          class="bg-red-50 border border-red-200 p-4 rounded-lg mb-6"
          role="alert"
        >
          <p class="font-medium text-lg text-red-700">
            Authentication state is missing.
          </p>
        </div>
      }

      <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-4 border border-gray-100 rounded-lg">
          <h2 class="text-xl font-semibold text-gray-800 mb-2">
            Metrics Overview
          </h2>
          <p class="text-gray-600">
            This section shows key performance indicators for the authenticated
            user.
          </p>
        </div>
        <div class="p-4 border border-gray-100 rounded-lg">
          <h2 class="text-xl font-semibold text-gray-800 mb-2">
            Recent Activity
          </h2>
          <p class="text-gray-600">View recent actions and notifications.</p>
        </div>
      </section>

      <div class="mt-8 text-center">
        <button
          (click)="logout()"
          aria-label="Log out of the application"
          class="py-2 px-6 border border-transparent rounded-lg text-sm font-medium text-white 
                 bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  // Dependency Injection
  readonly authService = inject(AuthService);

  /**
   * Calls the service's logout method to clear the token and redirect.
   */
  logout(): void {
    this.authService.logout();
  }
}
