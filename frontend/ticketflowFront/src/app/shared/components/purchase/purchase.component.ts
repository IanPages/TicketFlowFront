import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TicketsComponent } from './tickets/tickets.component';
import { Event } from '../../../core/interfaces/event.interface';
import { EventService } from '../../../core/services/event.service';

@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [CommonModule, RouterLink, TicketsComponent],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.css'
})
export class PurchaseComponent implements OnInit {
  event?: Event;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      this.loadEvent(id);
    });
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
}
