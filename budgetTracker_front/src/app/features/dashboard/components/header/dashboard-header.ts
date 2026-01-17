import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { AuthService } from '@app/core/auth/services/auth.service';

@Component({
  selector: 'app-dashboard-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule],
  template: `
    <header
      class="p-4 border-b border-gray-200 mb-1 xl:mb-6 flex flex-row justify-between items-center bg-white w-full shadow-xl h-16"
    >
      <h1 class="text-xl font-extrabold text-cyan-800">
        Budget Tracker Dashboard
      </h1>
      <button
        (click)="logout()"
        mat-raised-button
        aria-label="Log out of the application"
        class="text-white! bg-red-700! hover:bg-red-800! "
      >
        Logout
      </button>
    </header>
  `,
})
export class DashboardHeader {
  readonly authService = inject(AuthService);

  /*Logout, clear the token and redirect.   */
  logout(): void {
    this.authService.logout();
  }
}
