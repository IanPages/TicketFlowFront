import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { SalaService } from '../../../../../core/services/sala.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { Sala } from '../../../../../core/interfaces/sala.interface';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  salas: Sala[] = [];
  displayedColumns: string[] = ['name', 'location', 'capacity',  'actions'];
  loading = false;
  error = '';
  isAdmin = false;

  constructor(
    private salaService: SalaService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    if (this.isAdmin) {
      this.loadSalas();
    }
  }

  private loadSalas() {
    this.loading = true;
    this.salaService.getAllSalas().subscribe({
      next: (salas) => {
        this.salas = salas;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las salas';
        this.loading = false;
        this.notificationService.error(this.error);
      }
    });
  }

  deleteSala(id: number) {
    this.loading = true;
    this.salaService.deleteSala(id).subscribe({
      complete: () => {
        this.notificationService.success('Sala eliminada correctamente');
        this.loadSalas();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al eliminar la sala';
        this.loading = false;
        this.notificationService.error(this.error);
      }
    });
  }
}
