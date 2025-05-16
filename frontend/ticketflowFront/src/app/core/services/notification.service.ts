import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export type SnackType = 'success' | 'error' | 'info' | 'warning';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private defaultConfig: MatSnackBarConfig = {
    duration: 3000,               
    horizontalPosition: 'center', 
    verticalPosition: 'bottom',   
  };

  constructor(private snackbar: MatSnackBar) {}

  private show(
    message: string,
    type: SnackType = 'info',
    config?: Partial<MatSnackBarConfig>
  ): void {
    const panelClass = [`snack-${type}`];
    this.snackbar.open(message, undefined, {
      ...this.defaultConfig,
      panelClass,
      ...config,
    });
  }

  success(message: string, config?: Partial<MatSnackBarConfig>) {
    this.show(message, 'success', config);
  }

  error(message: string, config?: Partial<MatSnackBarConfig>) {
    this.show(message, 'error', config);
  }

  info(message: string, config?: Partial<MatSnackBarConfig>) {
    this.show(message, 'info', config);
  }

  warning(message: string, config?: Partial<MatSnackBarConfig>) {
    this.show(message, 'warning', config);
  }
}
