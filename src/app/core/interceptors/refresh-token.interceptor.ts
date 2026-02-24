import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take, finalize } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

// Use a closure to properly manage state
const refreshState = {
  isRefreshing: false,
  refreshTokenSubject: new BehaviorSubject<string | null>(null)
};

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Only try to refresh if we have a refresh token and got a 401
      const refreshToken = tokenService.getRefreshToken();
      
      if (error.status === 401 && !req.url.includes('/auth/refresh') && !req.url.includes('/auth/login') && refreshToken) {

        if (!refreshState.isRefreshing) {
          refreshState.isRefreshing = true;
          refreshState.refreshTokenSubject.next(null);

          return authService.refreshToken().pipe(
            switchMap((tokens) => {
              refreshState.refreshTokenSubject.next(tokens.accessToken);

              const clonedReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${tokens.accessToken}`
                }
              });
              return next(clonedReq);
            }),
            catchError((err) => {
              authService.logout();
              return throwError(() => err);
            }),
            finalize(() => {
              refreshState.isRefreshing = false;
            })
          );
        } else {
          return refreshState.refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap(token => {
              const clonedReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${token}`
                }
              });
              return next(clonedReq);
            })
          );
        }
      }

      return throwError(() => error);
    })
  );
};
