import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop'; // Add this import

export interface User {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  private readonly USER_DATA_KEY = 'user_data';
  
  // Use signals for state management
  private _isAuthenticated = signal<boolean>(false);
  private _currentUser = signal<any>(null);
  
  // Create observables from signals for subscription
  isAuthenticated = toObservable(this._isAuthenticated);
  currentUser = toObservable(this._currentUser);

  constructor(private http: HttpClient) {
    this.checkAuthentication();
  }

  login(credentials: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', credentials).pipe(
      tap(response => {
        this.setAuthData(response);
      })
    );
  }

  logout(): void {
    this.deleteCookie(this.AUTH_TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
    this._isAuthenticated.set(false);
    this._currentUser.set(null);
  }

  getToken(): string | null {
    return this.getCookie(this.AUTH_TOKEN_KEY) || null;
  }

  // Helper method to check if user is authenticated (for guards)
  isAuthenticatedValue(): boolean {
    return this._isAuthenticated();
  }

  private checkAuthentication(): void {
    const token = this.getCookie(this.AUTH_TOKEN_KEY);
    const userData = localStorage.getItem(this.USER_DATA_KEY);
    
    if (token && userData) {
      this._isAuthenticated.set(true);
      this._currentUser.set(JSON.parse(userData));
    }
  }

  private setAuthData(authResponse: AuthResponse): void {
    // Set token in cookie with expiration
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // 7 days expiration
    
    this.setCookie(
      this.AUTH_TOKEN_KEY, 
      authResponse.token, 
      expirationDate
    );
    
    // Store user data in local storage
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(authResponse.user));
    
    this._isAuthenticated.set(true);
    this._currentUser.set(authResponse.user);
  }

  // Helper methods for cookie handling
  private setCookie(name: string, value: string, expirationDate: Date): void {
    const cookieValue = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`;
    document.cookie = cookieValue;
  }

  private getCookie(name: string): string | null {
    const nameEQ = encodeURIComponent(name) + "=";
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    
    return null;
  }

  private deleteCookie(name: string): void {
    this.setCookie(name, '', new Date(0));
  }
}