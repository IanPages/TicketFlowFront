import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Event } from '../../../../core/interfaces/event.interface';
import { EventService } from '../../../../core/services/event.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.css'
})
export class EventosComponent implements OnInit {
  events: Event[] = [];
  displayedColumns: string[] = ['name', 'actions'];
  loading = true;
  error = '';

  constructor(
    private eventService: EventService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.loading = true;
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los eventos';
        this.loading = false;
        this.notificationService.error(this.error);
      }
    });
  }
  deleteEvent(id: number) {
      this.loading = true;
      this.eventService.deleteEvent(id).subscribe({
        next: () => {
          this.notificationService.success('Evento eliminado correctamente');
          this.loadEvents();
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error al eliminar el evento';
          this.loading = false;
          this.notificationService.error(this.error);
        }
      });
    }
}


