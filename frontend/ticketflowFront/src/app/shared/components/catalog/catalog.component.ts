import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Event } from '../../../core/interfaces/event.interface';
import { EventService } from '../../../core/services/event.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  searchTerm: string = '';
  selectedType: string = '';
  selectedLocation: string = '';
  
  // Obtener tipos y ubicaciones únicas para los filtros
  get eventTypes(): string[] {
    return [...new Set(this.events.map(event => event.genre.name))];
  }

  get eventLocations(): string[] {
    return [...new Set(this.events.map(event => event.location))];
  }

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.loadEvents();
  }

  private loadEvents() {
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.filteredEvents = events;
      },
      error: (error) => {
        console.error('Error loading events:', error);
      }
    });
  }

  applyFilters() {
    this.filteredEvents = this.events.filter(event => {
      const matchesSearch = this.searchTerm === '' || 
        event.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = this.selectedType === '' || 
        event.genre.name === this.selectedType;
      const matchesLocation = this.selectedLocation === '' || 
        event.location === this.selectedLocation;
      
      return matchesSearch && matchesType && matchesLocation;
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedType = '';
    this.selectedLocation = '';
    this.filteredEvents = this.events;
  }
}
