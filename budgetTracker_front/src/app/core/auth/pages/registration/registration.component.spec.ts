import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationComponent } from './registration.component';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { Subject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

// Create a mock implementation for the AuthService
const mockAuthService = {
  register: vi.fn(),
};

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegistrationComponent, // Standalone component
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        RouterTestingModule,
      ],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // -------------------------
  // --- Form Validation Tests ---
  // -------------------------
  it('should require a valid email format', () => {
    const emailControl = component.registrationForm.controls.email;
    emailControl.setValue('not-an-email');
    expect(emailControl.hasError('email')).toBe(true);

    emailControl.setValue('valid@email.com');
    expect(emailControl.hasError('email')).toBe(false);
  });

  it('should fail password validation with weak password', () => {
    const passwordControl = component.registrationForm.controls.password;
    // Missing uppercase, number, special char, and too short (8 chars min)
    passwordControl.setValue('weakpass');
    expect(passwordControl.hasError('pattern')).toBe(true);
  });

  it('should pass password validation with strong password', () => {
    const passwordControl = component.registrationForm.controls.password;
    // Strong password: min 8, upper, lower, digit, special char
    passwordControl.setValue('StrongP@ss123');
    expect(passwordControl.hasError('pattern')).toBe(false);
    expect(passwordControl.valid).toBe(true);
  });

  // ------------------------------------------
  // --- Submission/Service Interaction Tests ---
  // ------------------------------------------
  it('should call AuthService.register and reset spinner on success', () => {
    const successSubject = new Subject<string>();

    // Mock successful registration (returns Observable<string>)
    (authService.register as Mock).mockReturnValue(
      successSubject.asObservable(),
    );

    component.registrationForm.controls.username.setValue('newuser');
    component.registrationForm.controls.email.setValue('new@user.com');
    component.registrationForm.controls.password.setValue('StrongP@ss123');

    // Ensure form is valid before submitting
    expect(component.registrationForm.valid).toBe(true);

    component.submitForm();

    expect(component.spinnerDisabled()).toBe(true);
    expect(authService.register).toHaveBeenCalled();

    // This triggers the 'complete' callback in submitForm, setting the spinner to false.
    successSubject.complete();

    // Check post-submission state changes (in the 'complete' block)
    expect(component.spinnerDisabled()).toBe(false);
  });
});
