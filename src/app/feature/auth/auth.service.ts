import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { API } from '../../core/utils/constants';
import { AuthResponse, SignupRequest } from './auth';
import { CookieService } from 'ngx-cookie-service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = signal(false);

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.isLoggedIn.set(!!this.getToken());
  }



  signUp(body: SignupRequest) {
    return this.http.post<AuthResponse>(`${API.AUTH}/signup`, body).pipe(
      tap((res) => {
        if (res.access_token) {
          this.saveToken(res.access_token);
          this.isLoggedIn.set(true);
        }
      })
    );
  }

  saveToken(token: string): void {
    // It's vital to use 'secure' and 'sameSite' properties for modern browser security
    this.cookieService.set('auth_token', token, {
      expires: 7,          // Cookie expires in 7 days
      secure: false,        // Requires HTTPS
      sameSite: 'Lax',     // Mitigates CSRF protection
      path: '/'
    });
  }

  // Retrieve the token
  getToken(): string {
    return this.cookieService.get('auth_token');
  }

  // Remove token on logout
  logout(): void {
    this.cookieService.delete('auth_token', '/');
    this.isLoggedIn.set(false);
  }
}
