import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Event } from '../../../core/interfaces/event.interface';
import { EventService } from '../../../core/services/event.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UltimosComponent } from '../ultimos/ultimos.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, RouterLink,UltimosComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  event?: Event;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    public authService: AuthService,
    private notify: NotificationService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      this.loadEvent(id);
    });
    this.notify.success("HAS CARGADO CORRECTAMENTE")
  }

  private loadEvent(id: number) {
    this.loading = true;
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
