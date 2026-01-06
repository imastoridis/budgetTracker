import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { throwError, Subject } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
// Create a mock implementation for the AuthService
const mockAuthService = {
  login: vi.fn(),
};

describe('LoginComponent', () => {
  /* 
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent, // Standalone component
        ReactiveFormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatButtonModule,
      ],
      providers: [
        // Provide the mock object instead of the real service
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
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
  it('should invalidate the form when fields are empty', () => {
    component.loginForm.controls.username.setValue('');
    component.loginForm.controls.password.setValue('');
    expect(component.loginForm.invalid).toBe(true);
  });

  it('should validate the form when all fields are filled', () => {
    component.loginForm.controls.username.setValue('testuser');
    component.loginForm.controls.password.setValue('password123');
    expect(component.loginForm.valid).toBe(true);
  });

  // ------------------------------------------
  // --- Submission/Service Interaction Tests ---
  // ------------------------------------------
  it('should call AuthService.login and reset spinner on success', () => {
    // Create a Subject to control the response flow.
    const successSubject = new Subject<{ token: string }>();

    // The Observable will not complete until successSubject.complete() is called.
    (authService.login as Mock).mockReturnValue(successSubject.asObservable());

    component.loginForm.controls.username.setValue('user');
    component.loginForm.controls.password.setValue('pass');

    // Submit the form
    component.submitForm();
    expect(component.spinnerDisabled()).toBe(true);

    // Check service call
    expect(authService.login).toHaveBeenCalledWith({
      username: 'user',
      password: 'pass',
    });

    // This triggers the 'complete' callback in submitForm, setting the spinner to false.
    successSubject.complete();

    // Check post-submission state changes (in the 'complete' block)
    // The spinner should be disabled after the observable completes
    expect(component.spinnerDisabled()).toBe(false);
  });

  it('should set loginError signal and reset spinner on API error', () => {
    const httpError = { message: 'Auth Failed' };
    // Set up the mock to return an error Observable
    (authService.login as Mock).mockReturnValue(throwError(() => httpError));

    component.loginForm.controls.username.setValue('baduser');
    component.loginForm.controls.password.setValue('badpass');
    component.submitForm();

    expect(authService.login).toHaveBeenCalled();
    // Check error signal is set (based on the string in login.component.ts)
    expect(component.loginError()).toBe(
      'Login failed. Please check your credentials and try again.',
    );
    // Check spinner disabled after error
    expect(component.spinnerDisabled()).toBe(false);
  }); */
});
