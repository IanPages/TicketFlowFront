import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SalaService } from '../../../../../core/services/sala.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatIconModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent implements OnInit {
  salaForm!: FormGroup;
  loading = false;
  error = '';
  isAdmin = false;

  constructor(
    private fb: FormBuilder,
    private salaService: SalaService,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}
  static noNumbersValidator(control: AbstractControl): ValidationErrors | null {
    const hasNumbers = /\d/.test(control.value);
    return hasNumbers ? { containsNumbers: true } : null;
  }
  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    if (!this.isAdmin) return;

    this.initForm();
  }

  private initForm() {
    this.salaForm = this.fb.group({
      name: ['', [
        Validators.required, 
        Validators.minLength(3),
        AddComponent.noNumbersValidator
      ]],
      location: ['', [
        Validators.required,
        AddComponent.noNumbersValidator
      ]],
      capacity: ['', [Validators.required, Validators.min(1)]],
      numberedSeats: [null, [AddComponent.requiredBoolean]],
      filas: ['', [Validators.required, Validators.min(1)]],
      columnas: ['', [Validators.required, Validators.min(1)]]
    });

    this.salaForm.get('numberedSeats')?.valueChanges.subscribe(isNumbered => {
      const filasControl = this.salaForm.get('filas');
      const columnasControl = this.salaForm.get('columnas');

      if (isNumbered) {
        filasControl?.setValidators([Validators.required, Validators.min(1)]);
        columnasControl?.setValidators([Validators.required, Validators.min(1)]);
      } else {
        filasControl?.clearValidators();
        columnasControl?.clearValidators();
      }

      filasControl?.updateValueAndValidity();
      columnasControl?.updateValueAndValidity();
    });
  }
  static requiredBoolean(control: AbstractControl): ValidationErrors | null {
  return control.value === true || control.value === false ? null : { requiredBoolean: true };
}
  onSubmit() {
    if (this.salaForm.valid) {
      this.loading = true;
      this.error = '';

      const salaData = { ...this.salaForm.value };
      
      if (!salaData.numberedSeats) {
        delete salaData.filas;
        delete salaData.columnas;
      }

      this.salaService.createSala(salaData).subscribe({
        next: () => {
          this.notificationService.success('Sala creada correctamente');
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          this.error = 'Error al crear la sala';
          this.loading = false;
          this.notificationService.error(this.error);
        }
      });
    } else {
      this.notificationService.error('Por favor, completa todos los campos requeridos correctamente');
    }
  }
  get formHasErrors(): boolean {
    const form = this.salaForm;
    if (!form) return true;

    if (form.get('numberedSeats')?.value) {
      return form.invalid || 
            this.loading || 
            !!this.error ||
            !form.get('filas')?.valid ||
            !form.get('columnas')?.valid
    }

    return !form.get('name')?.valid ||
          !form.get('location')?.valid ||
          !form.get('capacity')?.valid ||
          !form.get('numberedSeats')?.valid ||
          this.loading ||
          !!this.error;
  }
}
