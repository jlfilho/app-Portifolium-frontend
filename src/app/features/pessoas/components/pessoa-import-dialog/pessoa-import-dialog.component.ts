import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'acadmanage-pessoa-import-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './pessoa-import-dialog.component.html',
  styleUrl: './pessoa-import-dialog.component.css'
})
export class PessoaImportDialogComponent {
  constructor(private readonly dialogRef: MatDialogRef<PessoaImportDialogComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}


