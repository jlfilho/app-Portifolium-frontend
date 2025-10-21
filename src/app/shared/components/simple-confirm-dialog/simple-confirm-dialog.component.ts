import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface SimpleConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-simple-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="simple-dialog">
      <h2 mat-dialog-title>{{ data.title }}</h2>

      <mat-dialog-content>
        <p>{{ data.message }}</p>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">
          {{ data.cancelText || 'Cancelar' }}
        </button>
        <button mat-raised-button color="warn" (click)="onConfirm()">
          {{ data.confirmText || 'Confirmar' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .simple-dialog {
      min-width: 300px;
      max-width: 500px;
    }

    h2[mat-dialog-title] {
      margin: 0 0 16px 0;
      font-size: 20px;
      font-weight: 500;
      color: #0F172A;
    }

    mat-dialog-content {
      margin: 0 0 24px 0;
    }

    mat-dialog-content p {
      margin: 0;
      font-size: 16px;
      color: #475569;
      line-height: 1.5;
    }

    mat-dialog-actions {
      margin: 0;
      padding: 0;
    }

    mat-dialog-actions button {
      margin-left: 8px;
    }
  `]
})
export class SimpleConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SimpleConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SimpleConfirmDialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
