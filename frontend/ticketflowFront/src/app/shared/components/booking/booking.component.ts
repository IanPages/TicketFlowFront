import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {
  bookings: any[] = [];
  loading = false;
  error = '';
  userId: number | null = null;

  constructor(
    private bookingService: BookingService, 
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    if (this.userId) {
      
      this.loadUserBookings();

    } else {
      this.error = 'Usuario no autenticado';
    }
  }

  private loadUserBookings() {
    if (!this.userId) return;
    
    this.loading = true;
    this.bookingService.getUserBookings(this.userId).subscribe({
      next: (bookings) => {
      this.bookings = bookings.sort((a, b) => {
        return b.id - a.id;
      });
      this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las reservas';
        this.loading = false;
      }
    });
  }
}
