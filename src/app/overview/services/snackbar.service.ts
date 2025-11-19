import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string): void {
    this.snackBar.open(message, '✕', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-success'],
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, '✕', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-error'],
    });
  }
}
