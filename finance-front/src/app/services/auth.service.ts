import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/v1/auth';
  private readonly tokenKey = 'auth_token';

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<{ success: boolean; data: AuthResponse }>(`${this.apiUrl}/login`, {
        email,
        password,
      })
      .pipe(
        map((response) => {
          const authData = response.data;
          localStorage.setItem(this.tokenKey, authData.token);
          return authData;
        }),
        catchError((error: HttpErrorResponse) => {
          const message =
            error.error?.error?.message ||
            (error.status === 401
              ? 'Credenciais inválidas'
              : error.status === 400
                ? 'Erro de validação'
                : 'Erro do servidor');

          return throwError(() => new Error(message));
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
