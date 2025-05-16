import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-job',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './job.component.html',
  styleUrl: './job.component.css'
})
export class JobComponent {
  positions = [
    {
      title: 'Desarrollador Full Stack',
      department: 'Tecnología',
      location: 'Madrid',
      type: 'Tiempo completo'
    },
    {
      title: 'Diseñador UX/UI',
      department: 'Diseño',
      location: 'Remoto',
      type: 'Tiempo completo'
    },
    {
      title: 'Atención al Cliente',
      department: 'Soporte',
      location: 'Barcelona',
      type: 'Tiempo parcial'
    }
  ];
}
