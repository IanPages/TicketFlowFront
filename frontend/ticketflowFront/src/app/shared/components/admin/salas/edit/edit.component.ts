import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SalaService } from '../../../../../core/services/sala.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { Sala } from '../../../../../core/interfaces/sala.interface';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatIconModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {
  salaForm!: FormGroup;
  loading = false;
  error = '';
  isAdmin = false;
  salaId!: number;
  currentSala?: Sala;
  formTouched = false;
  constructor(
    private fb: FormBuilder,
    private salaService: SalaService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    if (!this.isAdmin) return;

    this.initForm();
    
    this.salaId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.salaId) {
      this.loadSala();
    }
    this.watchFormChanges();
  }
private watchFormChanges() {
    this.salaForm.valueChanges.subscribe(() => {
      this.formTouched = true;
    });
  }
  private initForm() {
    this.salaForm = this.fb.group({
      name: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z][a-zA-Z0-9\s_-]*$/)
      ]],
    });
  }

  get isFormValid(): boolean {
    return this.salaForm.valid && 
          this.formTouched && 
          !this.loading && 
          !this.error 
  }
  get formHasErrors(): boolean {
  return this.salaForm.invalid || 
        this.loading || 
        !!this.error;
}
  private loadSala() {
    this.loading = true;
    this.salaService.getSalaById(this.salaId).subscribe({
      next: (sala) => {
        this.currentSala = sala;
        this.salaForm.patchValue(sala);
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar la sala';
        this.loading = false;
        this.notificationService.error(this.error);
      }
    });
  }

  onSubmit() {
    if (this.salaForm.valid) {
      this.loading = true;
      this.error = '';

      const updatedSala = {
        ...this.currentSala,
        ...this.salaForm.value
      };

      this.salaService.updateSala(this.salaId, updatedSala).subscribe({
        next: () => {
          this.notificationService.success('Sala actualizada correctamente');
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          this.error = 'Error al actualizar la sala';
          this.loading = false;
          this.notificationService.error(this.error);
          console.error('Update error:', error);
        }
      });
    } else {
      this.notificationService.error('Por favor, completa todos los campos requeridos correctamente');
    }
  }
}
