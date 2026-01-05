import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/auth/services/auth.service';
import { Credentials } from '../../models/auth.models';
import { MaterialModule } from '@shared/modules/material/material.module';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, MaterialModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private authService = inject(AuthService);
  readonly loginError = signal<string | null>(null);
  spinnerDisabled = signal(false);

  readonly loginForm = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  submitForm(): void {
    this.spinnerDisabled.set(true);
    const credentials = this.loginForm.getRawValue() as Credentials;
    this.loginError.set(null);

    this.authService.login(credentials).subscribe({
      error: (err) => {
        console.error('Login failed:', err);
        this.loginError.set(
          'Login failed. Please check your credentials and try again.',
        );
        this.spinnerDisabled.set(false);
      },
      complete: () => {
        console.log('Login successful');
        this.spinnerDisabled.set(false);
      },
    });
  }

  // Password visibility toggle
  hidePassword = signal(true);
  clickEvent(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }
}
