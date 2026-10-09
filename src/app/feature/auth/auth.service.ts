import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { API, STORAGE_KEYS } from '../../core/utils/constants';
import { AuthResponse, LoginRequest, SignupRequest } from './auth';
import { CookieService } from 'ngx-cookie-service';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = signal(false);

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.isLoggedIn.set(!!this.getRefreshToken() || !!this.getToken());
  }

  signUp(body: SignupRequest) {
    return this.http.post<AuthResponse>(`${API.AUTH}/signup`, body).pipe(
      tap((res) => {
        if (res.access_token) {
          this.saveTokens(res.access_token, res.refresh_token, false);
          this.isLoggedIn.set(true);
        }
      })
    );
  }

  login(body: LoginRequest, rememberMe: boolean) {
    return this.http.post<AuthResponse>(`${API.AUTH}/token?grant_type=password`, body).pipe(
      tap((res) => {
        if (res.access_token) {
          this.saveTokens(res.access_token, res.refresh_token, rememberMe);
          this.isLoggedIn.set(true);
        }
      })
    );
  }

  saveTokens(
    accessToken: string,
    refreshToken: string,
    rememberMe: boolean,
  ): void {
    const base = {
      secure: false,
      sameSite: 'Lax' as const,
      path: '/',
    };

    this.cookieService.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken, {
      ...base,
      expires: 1 / 24,
    });

    const longLived = rememberMe ? { ...base, expires: 30 } : base;
    this.cookieService.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken, longLived);
    this.cookieService.set(STORAGE_KEYS.REMEMBER_ME, String(rememberMe), longLived);
  }

  refreshToken() {
    const refreshToken = this.getRefreshToken();
    const rememberMe =
      this.cookieService.get(STORAGE_KEYS.REMEMBER_ME) === 'true';
    return this.http
      .post<AuthResponse>(
        `${API.AUTH}/token?grant_type=refresh_token`,
        {
          refresh_token: refreshToken,
        }
      )
      .pipe(
        tap((res) => {
          if (res.access_token && res.refresh_token) {
            this.saveTokens(
              res.access_token,
              res.refresh_token,
              rememberMe
            );

            this.isLoggedIn.set(true);
          }
        }),
        catchError((error) => {
          this.logout();
          return throwError(() => error);
        }),
      );
  }

  // Retrieve the token
  getToken(): string {
    return this.cookieService.get(STORAGE_KEYS.ACCESS_TOKEN);
  }

  getRefreshToken(): string {
    return this.cookieService.get(STORAGE_KEYS.REFRESH_TOKEN);
  }


  // Remove token on logout
  logout(): void {
    this.cookieService.delete(STORAGE_KEYS.ACCESS_TOKEN, '/');
    this.cookieService.delete(STORAGE_KEYS.REFRESH_TOKEN, '/');
    this.cookieService.delete(STORAGE_KEYS.REMEMBER_ME, '/');
    this.isLoggedIn.set(false);
  }
}
