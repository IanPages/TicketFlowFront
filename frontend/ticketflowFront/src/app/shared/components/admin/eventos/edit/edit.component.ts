import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { EventService } from '../../../../../core/services/event.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { TypeEventsService } from '../../../../../core/services/typeEvents.service';
import { SalaService } from '../../../../../core/services/sala.service';
import { Event } from '../../../../../core/interfaces/event.interface';
import { TypeEvent } from '../../../../../core/interfaces/typeEvent.interface';
import { Sala } from '../../../../../core/interfaces/sala.interface';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, RouterLink],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {
  eventForm!: FormGroup;
  loading = false;
  error = '';
  isAdmin = false;
  eventId!: number;
  genres: TypeEvent[] = [];
  salas: Sala[] = [];
  isIndoorEvent = false;
  selectedFiles: { image1?: File, image2?: File } = {};
  currentEvent?: Event;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private authService: AuthService,
    private typeEventsService: TypeEventsService,
    private salaService: SalaService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    if (!this.isAdmin) return;

    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadGenres();
    this.loadSalas();
    this.initForm();
    this.loadEvent();
  }

  private initForm() {
    const baseValidators = {
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      date: ['', [Validators.required]],
      location: ['', [Validators.required]],
      capacity: ['', [Validators.required, Validators.min(1)]],
      normalPrice: ['', [Validators.required, Validators.min(0)]],
      genreId: ['', [Validators.required]],
    };

    this.eventForm = this.fb.group(baseValidators);
  }

  private loadGenres() {
    this.typeEventsService.getEventTypes().subscribe({
      next: (genres) => this.genres = genres,
      error: () => this.notificationService.error('Error al cargar los géneros')
    });
  }

  private loadSalas() {
    this.salaService.getAllSalas().subscribe({
      next: (salas) => this.salas = salas,
      error: () => this.notificationService.error('Error al cargar las salas')
    });
  }

  private loadEvent() {
  this.loading = true;
  this.eventService.getEventById(this.eventId).subscribe({
    next: (event) => {
      this.currentEvent = event;
      this.isIndoorEvent = !!event.sala;
      
      if (this.isIndoorEvent) {
        this.eventForm.addControl('vipPrice', this.fb.control('', [Validators.required, Validators.min(0)]));
        this.eventForm.addControl('salaId', this.fb.control('', Validators.required));
        this.eventForm.get('capacity')?.clearValidators();
        this.eventForm.get('capacity')?.updateValueAndValidity();
      }

      this.eventForm.patchValue({
        name: event.name,
        description: event.description,
        date: new Date(event.date).toISOString().split('T')[0],
        location: event.location,
        capacity: event.capacity,
        normalPrice: event.normalPrice,
        vipPrice: event.vipPrice,
        genreId: event.genre.id,
        salaId: event.sala?.id
      });

      this.loading = false;
    },
    error: () => {
      this.error = 'Error al cargar el evento';
      this.loading = false;
      this.notificationService.error(this.error);
    }
  });
}

  onFileSelected(event: any, imageField: 'image1' | 'image2') {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type.match(/image\/*/) && file.size <= 5000000) {
        this.selectedFiles[imageField] = file;
      } else {
        this.notificationService.error('Por favor, selecciona una imagen válida (máx. 5MB)');
      }
    }
  }

async onSubmit() {
  if (this.eventForm.invalid) {
    this.notificationService.error('Por favor, completa todos los campos requeridos');
    return;
  }

  this.loading = true;
  this.error = '';

  const v = this.eventForm.value;
  const eventPayload: any = {
    name: v.name,
    description: v.description,
    date: v.date,                
    location: v.location,
    capacity: v.capacity,
    normalPrice: v.normalPrice,
    vipPrice: this.isIndoorEvent ? v.vipPrice : 0,
    genreId: v.genreId,
    salaId: this.isIndoorEvent ? v.salaId : null
  };

  const formData = new FormData();
  formData.append(
    'event',
    new Blob([JSON.stringify(eventPayload)], { type: 'application/json' })
  );

  if (this.selectedFiles.image1) {
    formData.append(
      'image1',
      this.selectedFiles.image1,
      this.selectedFiles.image1.name
    );
  }
  if (this.selectedFiles.image2) {
    formData.append(
      'image2',
      this.selectedFiles.image2,
      this.selectedFiles.image2.name
    );
  }
  this.eventService.updateEvent(this.eventId, formData).subscribe({
    next: () => {
      this.notificationService.success('Evento actualizado correctamente');
      this.router.navigate(['/admin']);
    },
    error: (err) => {
      console.log(err)
      this.notificationService.error('Error al actualizar el evento');
      this.loading = false;
    }
  });
}
}
