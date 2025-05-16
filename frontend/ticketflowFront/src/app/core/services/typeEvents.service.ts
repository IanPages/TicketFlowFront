import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TypeEvent } from '../interfaces/typeEvent.interface';

@Injectable({
  providedIn: 'root'
})
export class TypeEventsService {
  private apiUrl = 'http://localhost:8080/api/genreEvents';

  constructor(private http: HttpClient) {}

  getEventTypes(): Observable<TypeEvent[]> {
    return this.http.get<TypeEvent[]>(this.apiUrl);
  }
}