import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { API, STORAGE_KEYS } from '../../core/utils/constants';
import { AuthResponse, LoginRequest, SignupRequest } from './auth';
import { CookieService } from 'ngx-cookie-service';
import { tap } from 'rxjs';

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
          this.saveTokens(res.access_token, res.refresh_token);
          this.isLoggedIn.set(true);
        }
      })
    );
  }

  login(body: LoginRequest) {
    return this.http.post<AuthResponse>(`${API.AUTH}/token?grant_type=password`, body).pipe(
      tap((res) => {
        if (res.access_token) {
          this.saveTokens(res.access_token, res.refresh_token);
          this.isLoggedIn.set(true);
        }
      })
    );
  }

  saveTokens(accessToken: string, refreshToken: string): void {
    // It's vital to use 'secure' and 'sameSite' properties for modern browser security
    this.cookieService.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken, {
      expires: 7,          // Cookie expires in 7 days
      secure: false,        // Requires HTTPS
      sameSite: 'Lax',     // Mitigates CSRF protection
      path: '/'
    });

    this.cookieService.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken, {
      expires: 30,
      secure: false,
      sameSite: 'Lax',
      path: '/',
    });
  }

  refreshToken() {
    const refreshToken = this.getRefreshToken();
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
            );

            this.isLoggedIn.set(true);
          }
        })
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
    this.isLoggedIn.set(false);
  }
}
