import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { EventosComponent } from '../eventos/eventos.component';
import { ListComponent } from '../salas/list/list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatTabsModule, EventosComponent, ListComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  activeTab = 0;

  setActiveTab(index: number) {
    this.activeTab = index;
  }
}
