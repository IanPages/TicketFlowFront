import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Seat } from '../interfaces/seat.interface';

@Injectable({ providedIn: 'root' })
export class SeatService {
  private apiUrl = 'http://localhost:8080/api/seats';

  constructor(private http: HttpClient) {}

  getSeatsByEvent(eventId: number) {
    return this.http.get<Seat[]>(`${this.apiUrl}/event/${eventId}`);
  }
}