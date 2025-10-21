import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-test-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="test-dialog">
      <h2 mat-dialog-title>Teste de Diálogo</h2>

      <mat-dialog-content>
        <p>Este é um diálogo de teste para verificar se os estilos estão funcionando corretamente.</p>
        <p>Se você conseguir ver este texto, o diálogo está funcionando!</p>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" (click)="onConfirm()">Confirmar</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .test-dialog {
      min-width: 400px;
      max-width: 500px;
      padding: 24px;
    }

    h2[mat-dialog-title] {
      color: #0F172A !important;
      font-weight: 500 !important;
      font-size: 20px !important;
      margin: 0 0 16px 0 !important;
    }

    mat-dialog-content {
      color: #475569 !important;
      font-size: 16px !important;
      line-height: 1.5 !important;
      margin: 0 0 24px 0 !important;
    }

    mat-dialog-content p {
      margin: 0 0 12px 0 !important;
    }

    mat-dialog-actions {
      margin: 0 !important;
      padding: 0 !important;
    }

    mat-dialog-actions button {
      margin-left: 8px !important;
    }
  `]
})
export class TestDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
