import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Only try to refresh if we have a refresh token and got a 401
      const refreshToken = tokenService.getRefreshToken();
      
      if (error.status === 401 && !req.url.includes('/auth/refresh') && refreshToken) {

        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.refreshToken().pipe(
            switchMap((tokens) => {
              isRefreshing = false;
              refreshTokenSubject.next(tokens.accessToken);

              const clonedReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${tokens.accessToken}`
                }
              });
              return next(clonedReq);
            }),
            catchError((err) => {
              isRefreshing = false;
              authService.logout();
              return throwError(() => err);
            })
          );
        } else {
          return refreshTokenSubject.pipe(
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
