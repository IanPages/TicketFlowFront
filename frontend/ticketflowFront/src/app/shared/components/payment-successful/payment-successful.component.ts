import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-successful',
  standalone: true,
  templateUrl: './payment-successful.component.html',
  styleUrls: ['./payment-successful.component.css'], 
})
export class PaymentSuccessfulComponent {
  constructor(private router: Router) {}

  goToBookingHistory(): void {
    this.router.navigate(['/reservas']); 
  }
}