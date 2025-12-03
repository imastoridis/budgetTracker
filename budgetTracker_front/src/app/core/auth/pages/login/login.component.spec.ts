import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';

// Create a mock implementation for the AuthService
const mockAuthService = {
  login: vi.fn(),
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent, // Standalone component
        ReactiveFormsModule,
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
    // Set up the mock to return a successful Observable
    (authService.login as Mock).mockReturnValue(of({ token: 'fake-token' }));

    component.loginForm.controls.username.setValue('user');
    component.loginForm.controls.password.setValue('pass');

    component.submitForm();

    // Check pre-submission state changes
    expect(component.spinnerDisabled()).toBe(true);
    // Check service call
    expect(authService.login).toHaveBeenCalledWith({
      username: 'user',
      password: 'pass',
    });

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
  });
});
