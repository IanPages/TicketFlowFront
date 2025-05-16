import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { EventService } from '../../../core/services/event.service';
import { SeatService } from '../../../core/services/seat.service';
import { Seat } from '../../../core/interfaces/seat.interface';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { BookingDTO } from '../../../core/interfaces/booking.interface';


@Component({
  selector: 'app-seleccionar-seats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seleccionar-seats.component.html',
  styleUrls: ['./seleccionar-seats.component.css']
})
export class SeleccionarSeatsComponent implements OnInit {
  eventId!: number;
  quantity!: number;
  ticketType!: string;
  event: any;
  seats: Seat[] = [];
  selectedSeats: Seat[] = [];
  seatMatrix: Seat[][] = [];

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.eventId = +params['eventId'];
      this.quantity = +params['quantity'];
      this.ticketType = params['ticketType'];
      this.loadEvent();
    });
  }

  loadEvent() {
    this.eventService.getEventById(this.eventId).subscribe({
      next: (event) => {
        this.event = event;
        this.seats = event.seats || [];
        this.organizeSeats();
        console.log(this.seats);
      }
    });
  }

  organizeSeats() {
    const maxFila = Math.max(...this.seats.map(s => s.fila));
    const matrix: Seat[][] = [];

    for (let i = 1; i <= maxFila; i++) {
      const filaSeats = this.seats
        .filter(s => s.fila === i)
        .sort((a, b) => a.numero - b.numero);
      matrix.push(filaSeats);
    }

    this.seatMatrix = matrix;
  }

  toggleSeat(seat: Seat) {
    if (seat.ocupado) return;
  
    const tipoSeleccionado = this.ticketType.toLowerCase().trim();
    const tipoAsiento = (seat.tipo || '').toLowerCase().trim();
  
    if (tipoAsiento !== tipoSeleccionado) {
      return;
    }
  
    const index = this.selectedSeats.findIndex(s => s.id === seat.id);
    if (index >= 0) {
      this.selectedSeats.splice(index, 1);
    } else if (this.selectedSeats.length < this.quantity) {
      this.selectedSeats.push(seat);
    }
  }

  getSeatClass(seat: Seat): string {
    if (seat.ocupado) {
      return 'bg-gray-400 text-white cursor-not-allowed';
    }
  
    if (this.isSelected(seat)) {
      return 'bg-green-500 text-white';
    }
  
    const tipo = (seat.tipo || '').toLowerCase().trim();
    if (tipo === 'vip') {
      return 'bg-yellow-400 text-black';
    }
  
    return 'bg-white text-black';
  }

  isSelected(seat: Seat): boolean {
    return this.selectedSeats.some(s => s.id === seat.id);
  }

  confirmarCompra() {
    const bookingDTO: BookingDTO = {
      userId: this.authService.getUserId(),
      eventId: this.eventId,
      quantity: this.quantity,
      vip: this.ticketType === 'vip',
      seatIds: this.selectedSeats.map(s => s.id)
    };

    this.bookingService.createBookingAndRedirect(bookingDTO);
  }
}