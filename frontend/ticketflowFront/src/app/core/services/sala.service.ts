import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sala, salaCreate } from '../interfaces/sala.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SalaService {
  private apiUrl = 'http://localhost:8080/api/salas';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`
    );
  }

  getAllSalas() {
    return this.http.get<Sala[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  getSalaById(id: number) {
    return this.http.get<Sala>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  createSala(sala: salaCreate) {
    return this.http.post<Sala>(this.apiUrl, sala, {
      headers: this.getAuthHeaders()
    });
  }

  updateSala(id: number, sala: Sala) {
    return this.http.put<Sala>(`${this.apiUrl}/${id}`, sala, {
      headers: this.getAuthHeaders()
    });
  }

  deleteSala(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }
}