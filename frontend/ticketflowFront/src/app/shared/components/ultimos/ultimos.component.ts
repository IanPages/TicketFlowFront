import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Event } from '../../../core/interfaces/event.interface';
import { EventService } from '../../../core/services/event.service';
import { MatIcon } from '@angular/material/icon';
@Component({
  selector: 'app-ultimos',
  standalone: true,
  imports: [CommonModule, RouterLink,MatIcon],
  templateUrl: './ultimos.component.html',
  styleUrl: './ultimos.component.css'
})
export class UltimosComponent implements OnInit {
  latestEvents: Event[] = [];
  loading = true;
  error = false;

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.loadLatestEvents();
  }

  private loadLatestEvents() {
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.latestEvents = events
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3);
        this.loading = false;
      },
      error: (error) => {
        this.error = true;
        this.loading = false;
      }
    });
  }
}
