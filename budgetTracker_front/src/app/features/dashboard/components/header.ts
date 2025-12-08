import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../shared/modules/material/material.module';
import { AuthService } from '../../../core/auth/services/auth.service';

import {} from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule],
  template: `
    <header
      class="p-4 border-b border-gray-200 mb-6 flex flex-row justify-between items-center bg-white w-screen shadow-xl h-[10%]"
    >
      <h1 class="text-xl font-extrabold text-cyan-800">
        Budget Tracker Dashboard
      </h1>
      <button
        (click)="logout()"
        mat-raised-button
        aria-label="Log out of the application"
        class="!text-white !bg-red-700 !hover:bg-red-800 "
      >
        Logout
      </button>
    </header>
  `,
})
export class Header {
  readonly authService = inject(AuthService);

  /* Calls the service's logout method to clear the token and redirect.   */
  logout(): void {
    this.authService.logout();
  }
}
