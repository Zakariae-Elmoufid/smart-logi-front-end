import { ApplicationConfig, provideBrowserGlobalErrorListeners, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import {refreshTokenInterceptor} from './core/interceptors/refresh-token.interceptor';

// Register French locale for CurrencyPipe
registerLocaleData(localeFr, 'fr');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient
    (
      withInterceptors([authInterceptor,refreshTokenInterceptor])
    ),
    { provide: LOCALE_ID, useValue: 'fr' }
  ]
};
