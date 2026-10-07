import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from '../../core/utils/constants';
import { AuthResponse, SignupRequest } from './auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  signUp(body: SignupRequest) {
    return this.http.post<AuthResponse>(`${API.AUTH}/signup`, body)
  }
}
