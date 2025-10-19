import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-cursos-usuario-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './cursos-usuario-dialog.component.html',
  styleUrl: './cursos-usuario-dialog.component.css'
})
export class CursosUsuarioDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CursosUsuarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { usuario: Usuario }
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  getCursosAtivos(): number {
    return this.data.usuario.cursos?.filter(c => c.ativo).length || 0;
  }

  getCursosInativos(): number {
    return this.data.usuario.cursos?.filter(c => !c.ativo).length || 0;
  }
}

