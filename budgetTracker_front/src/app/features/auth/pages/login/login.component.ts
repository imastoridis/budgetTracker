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
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../../core/services/auth.service';
import { Credentials } from '../../../../core/models/auth.models';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  /*  host: {
    '[class.active-counter]': 'false',
    class: 'block',
  }, */
})
export class LoginComponent {
  private authService = inject(AuthService);
  readonly loginError = signal<string | null>(null);

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

  onSubmit(): void {
    const credentials = this.loginForm.getRawValue() as Credentials;
    this.loginError.set(null);

    this.authService.login(credentials).subscribe({
      error: (err) => {
        console.error('Login failed:', err);
        this.loginError.set(
          'Login failed. Please check your credentials and try again.',
        );
      },
    });
  }
}
