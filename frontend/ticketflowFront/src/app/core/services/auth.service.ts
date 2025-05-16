import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { NotificationService } from './notification.service';

interface DecodedToken {
  sub: string;
  role: string;
  userId: number | null;
  exp: number;

}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://creative-youth-production.up.railway.app/api';

  constructor(private http: HttpClient, private router: Router, private notificationService: NotificationService) {}

  login(email: string, password: string){
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          this.notificationService.info("Has iniciado sesión correctamente")
        }),
        catchError((error: HttpErrorResponse) => {
          let errorMessage: string;
          if (error.status === 401) {
            errorMessage = 'Credenciales incorrectas';
          } else if (error.status === 404) {
            errorMessage = 'Usuario no encontrado';
          } else {
            errorMessage = 'Error en el servidor';
          }
          return throwError(() => error);
        })
      );
  }

  register(email: string, password: string){
  return this.http.post(
    `${this.apiUrl}/auth/register`,
    { email, password },
    { responseType: 'text' }
  ).pipe(
    tap(() => {
      this.notificationService.info("Registrado correctamente");
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 409) {
        return throwError(() => ({ status: 409, message: 'El correo electrónico ya está registrado' }));
      }
      return throwError(() => error);
    })
  );
}

  logout() {
    localStorage.removeItem('token');
    this.notificationService.info("Has hecho logout")
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getUserRole(): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken?.role || null;
  }

  getUserId() : number | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken?.userId || null;

  }

  isAdmin(): boolean {
    return this.getUserRole() === 'Admin';
  }

  isTokenExpired(): boolean {
    const decodedToken = this.getDecodedToken();
    if (!decodedToken) return true;
    
    // exp is in seconds, Date.now() is in milliseconds
    return (decodedToken.exp * 1000) < Date.now();
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }
}
