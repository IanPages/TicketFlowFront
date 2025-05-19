import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TypeEvent } from '../interfaces/typeEvent.interface';

@Injectable({
  providedIn: 'root'
})
export class TypeEventsService {
  private apiUrl = 'https://database-ianpages-b90a5aac.koyeb.app/api/genreEvents';

  constructor(private http: HttpClient) {}

  getEventTypes(): Observable<TypeEvent[]> {
    return this.http.get<TypeEvent[]>(this.apiUrl);
  }
}