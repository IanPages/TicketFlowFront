import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { EventService } from '../../../../../core/services/event.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { TypeEventsService } from '../../../../../core/services/typeEvents.service';
import { SalaService } from '../../../../../core/services/sala.service';

import { TypeEvent } from '../../../../../core/interfaces/typeEvent.interface';
import { Sala } from '../../../../../core/interfaces/sala.interface';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    RouterLink,
    MatButtonToggleModule
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent implements OnInit {
  isFormValid = false;
  eventForm!: FormGroup;
  loading = false;
  error = '';
  isAdmin = false;
  isIndoorEvent = true;
  genres: TypeEvent[] = [];
  salas: Sala[] = [];
  selectedFiles: { image1?: File; image2?: File } = {};

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private authService: AuthService,
    private typeEventsService: TypeEventsService,
    private salaService: SalaService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    if (!this.isAdmin) {
      return;
    }

    this.loadGenres();
    this.loadSalas();
    this.initializeForm();
    this.eventForm.statusChanges.subscribe(() => this.updateFormValidity());
  }
  private updateFormValidity() {
  this.isFormValid =
    this.eventForm.valid &&
    !!this.selectedFiles.image1 &&
    !!this.selectedFiles.image2 &&
    !this.loading;
  }
  private loadGenres() {
    this.typeEventsService.getEventTypes().subscribe({
      next: (genres) => (this.genres = genres),
      error: () => this.notificationService.error('Error al cargar los géneros')
    });
  }

  private loadSalas() {
    this.salaService.getAllSalas().subscribe({
      next: (salas) => (this.salas = salas),
      error: () => this.notificationService.error('Error al cargar las salas')
    });
  }

  private initializeForm() {
  const baseValidators: { [key: string]: any[] } = {
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    date: ['', [Validators.required]],
    location: ['', [Validators.required]],
    normalPrice: ['', [Validators.required, Validators.min(0)]],
    genreId: ['', [Validators.required]]
  };

  if (!this.isIndoorEvent) {
    baseValidators['capacity'] = ['', [Validators.required, Validators.min(1)]];
  }

  this.eventForm = this.fb.group(baseValidators);

  if (this.isIndoorEvent) {
    this.eventForm.addControl('vipPrice', this.fb.control('', [Validators.required, Validators.min(0)]));
    this.eventForm.addControl('salaId', this.fb.control('', Validators.required));
  }
  }

  onEventTypeChange() {
  const currentValues = this.eventForm.value;
  
  if (this.isIndoorEvent) {
    this.eventForm.removeControl('capacity');
  
    this.eventForm.addControl('vipPrice', this.fb.control(currentValues.vipPrice || '', [Validators.required, Validators.min(0)]));
    this.eventForm.addControl('salaId', this.fb.control(currentValues.salaId || '', Validators.required));
  } else {
    
    this.eventForm.removeControl('vipPrice');
    this.eventForm.removeControl('salaId');
    
  
    this.eventForm.addControl('capacity', this.fb.control(currentValues.capacity || '', [Validators.required, Validators.min(1)]));
  }
  this.updateFormValidity();
  }

  onFileSelected(event: any, imageField: 'image1' | 'image2') {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type.match(/image\/*/) && file.size <= 5_000_000) {
        this.selectedFiles[imageField] = file;
        this.updateFormValidity();
      } else {
        this.notificationService.error('Por favor, selecciona una imagen válida (máx. 5MB)');
      }
    }
  }

  onSubmit() {
    
  if (this.eventForm.invalid || !this.selectedFiles.image1 || !this.selectedFiles.image2) {
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
  formData.append(
    'image1',
    this.selectedFiles.image1!,
    this.selectedFiles.image1!.name
  );
  formData.append(
    'image2',
    this.selectedFiles.image2!,
    this.selectedFiles.image2!.name
  );

  formData.forEach((val, key) => console.log(key, val));

  this.eventService.createEvent(formData).subscribe({
    next: () => {
      this.notificationService.success('Evento creado correctamente');
      this.router.navigate(['/admin']);
    },
    error: (err) => {
      this.notificationService.error('Error al crear el evento');
      this.loading = false;
    }
  });
  }
}
