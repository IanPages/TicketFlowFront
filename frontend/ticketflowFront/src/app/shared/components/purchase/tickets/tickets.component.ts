import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Event } from '../../../../core/interfaces/event.interface';
import { EventService } from '../../../../core/services/event.service';
import { AuthService } from '../../../../core/services/auth.service'; // Import AuthService
import { BookingService } from '../../../../core/services/booking.service';
import { BookingDTO } from '../../../../core/interfaces/booking.interface';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent implements OnInit {
  @Input() event?: Event;
  selectedTicketType: string = '';
  quantity: number = 1;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private authService: AuthService,
    private router: Router,
    private bookingService: BookingService
  ) {}

  onContinue() {
    if (!this.event) return;

    if (this.event.sala) {
      this.router.navigate(['/seleccionar-seats'], {
        queryParams: {
          eventId: this.event.id,
          quantity: this.quantity,
          ticketType: this.selectedTicketType
        }
      });
    }else{
      const bookingDTO: BookingDTO = {
        userId: this.authService.getUserId(),
        eventId: this.event.id,
        quantity: this.quantity,
        vip: this.selectedTicketType === 'vip',
        seatIds: null
      };
      this.bookingService.createBookingAndRedirect(bookingDTO);
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      this.loadEvent(id);
    });

    // Initialize with default ticket type based on event type
    if (this.event?.sala) {
      this.selectedTicketType = 'normal';
    } else {
      this.selectedTicketType = 'general';
    }
  }

  private loadEvent(id: number) {
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.event = event;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading event:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  getTicketPrice(): number {
    if (!this.selectedTicketType || !this.event) return 0;

    switch(this.selectedTicketType) {
      case 'normal': return this.event.normalPrice;
      case 'vip': return this.event.vipPrice || 0;
      case 'general': return this.event.normalPrice;
      default: return 0;
    }
  }

  getTotalPrice(): number {
    return this.getTicketPrice() * this.quantity;
  }
}
