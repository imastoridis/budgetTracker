import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Import the provider function
import { authInterceptor } from './core/auth/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    // Angular Best Practice: Use provideHttpClient() for modern setup
    provideHttpClient(),
    // Default providers (optional for Zone Change Detection)
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Register the authInterceptor globally
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
