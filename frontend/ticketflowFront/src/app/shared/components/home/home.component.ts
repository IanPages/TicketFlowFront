import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Event } from '../../../core/interfaces/event.interface';
import { EventService } from '../../../core/services/event.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink,MatIcon],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  currentSlide = 0;
  events: Event[] = [];
  featuredEvents: Event[] = [];
  limitedEvents: Event[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.loadEvents();
  }

  private loadEvents() {
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.events = events;
        
        this.limitedEvents = this.getRandomEvents(events, 8);
      },
      error: (error) => {
        console.error('Error al cargar eventos:', error);
      }
    });
  }

  private getRandomEvents(events: Event[], count: number): Event[] {
    const shuffled = [...events].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

}
