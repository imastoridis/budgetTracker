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

import { AuthService } from '@app/core/auth/services/auth.service';
import { Credentials } from '../../models/auth.models';
import { MaterialModule } from '@shared/modules/material/material.module';

@Component({
  selector: 'app-registration',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './registration.component.html',
  imports: [ReactiveFormsModule, RouterLink, MaterialModule],
})
export class RegistrationComponent {
  private authService = inject(AuthService);
  readonly registrationError = signal<string | null>(null);
  spinnerDisabled = signal(false);
  // Regex for strong password validation
  private readonly strongPasswordRegex = new RegExp(
    '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&].{8,}',
  );

  readonly registrationForm = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(this.strongPasswordRegex),
      ],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  submitForm(): void {
    this.spinnerDisabled.set(true);
    const credentials = this.registrationForm.getRawValue() as Credentials;
    this.registrationError.set(null);

    this.authService.register(credentials).subscribe({
      error: (err) => {
        this.registrationError.set('Registration failed: ' + err.error);
        this.spinnerDisabled.set(false);
      },
      complete: () => {
        this.spinnerDisabled.set(false);
      },
    });
  }
}
