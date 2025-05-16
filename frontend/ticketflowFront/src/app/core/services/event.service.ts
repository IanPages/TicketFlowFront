import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Event, EventCreate } from '../interfaces/event.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl = 'https://creative-youth-production.up.railway.app/api/events';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`
    );
  }

  getAllEvents() {
    return this.http.get<Event[]>(this.baseUrl);
  }

  getEventById(id: number) {
    return this.http.get<Event>(`${this.baseUrl}/${id}`);
  }

  createEvent(data: FormData) {
    return this.http.post<Event>(this.baseUrl, data, {
      headers: this.getAuthHeaders()
    });
  }

  updateEvent(id: number, formData: FormData) {
    return this.http.put<Event>(`${this.baseUrl}/${id}`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  deleteEvent(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }
}