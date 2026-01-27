import { ApplicationConfig, provideBrowserGlobalErrorListeners, LOCALE_ID, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import {refreshTokenInterceptor} from './core/interceptors/refresh-token.interceptor';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import {ProductsEffects} from './features/client/client-product-list/store/products.effects';
import {productsReducer} from './features/client/client-product-list/store/products.reducer';


// Register French locale for CurrencyPipe
registerLocaleData(localeFr, 'fr');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, refreshTokenInterceptor])),
    { provide: LOCALE_ID, useValue: 'fr' },
    provideStore({
      products: productsReducer
    }),
    provideEffects([ProductsEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
  ]
};
