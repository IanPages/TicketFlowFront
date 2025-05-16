import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService, 
    private router: Router,
    private notificationService: NotificationService
  ) {}

  canActivate(): boolean {
    if (!this.authService.isAdmin()) {
      this.notificationService.error('No tienes permisos para acceder a esta sección');
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
}