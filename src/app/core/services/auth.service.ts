import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';
import {  RegisterRequest } from '../models/register-request.model';
import { User } from '../models/user.model';
import {LoginRequest} from '../models/login-request.model';
import {JwtTokens} from '../models/jwt-tokens.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  isAuthenticated = signal(false);

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.loadUserFromToken();
  }


  login(credentials: LoginRequest): Observable<JwtTokens> {
    return this.http.post<JwtTokens>(`${this.apiUrl}/login`, credentials).pipe(
      tap(tokens => {
        console.log(tokens);
        this.tokenService.setTokens(tokens.accessToken, tokens.refreshToken);
        this.loadUserFromToken();
        this.isAuthenticated.set(true);
      }),
      catchError(err => {
        console.error('Login failed', err);
        return throwError(() => err);
      })
    );
  }

  register(userData: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, userData).pipe(
      tap(() => {
        console.log('Registration successful');
      }),
      catchError(err => {
        console.error('Registration failed', err);
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    this.tokenService.clearTokens();
    this.currentUserSubject.next(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<JwtTokens> {
    const refreshToken = this.tokenService.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<JwtTokens>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap(tokens => {
        this.tokenService.setTokens(tokens.accessToken, tokens.refreshToken);
        this.loadUserFromToken();
      }),
      catchError(err => {
        console.error('Token refresh failed', err);
        this.logout();
        return throwError(() => err);
      })
    );
  }

  checkAuthentication(): boolean {
    const token = this.tokenService.getAccessToken();
    const isValid = !!token && !this.tokenService.isTokenExpired(token);
    this.isAuthenticated.set(isValid);
    return isValid;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }


  private loadUserFromToken(): void {
    const token = this.tokenService.getAccessToken();

    if (token && !this.tokenService.isTokenExpired(token)) {
      try {
        const payload = this.tokenService.decodeToken(token);


        const user: User = {
          id: payload.sub || payload.userId,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          role: payload.role,
          enabled: true
        };

        this.currentUserSubject.next(user);

        this.isAuthenticated.set(true);
      } catch (error) {
        console.error('Error decoding token', error);
        this.logout();
      }
    } else {
      this.logout();
    }
  }
}
