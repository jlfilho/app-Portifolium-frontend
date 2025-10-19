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
  ) {
    // Garantir que cursos existe
    if (!this.data.usuario.cursos) {
      this.data.usuario.cursos = [];
    }
    console.log('📚 Diálogo de Cursos - Usuário:', this.data.usuario);
    console.log('📚 Total de cursos:', this.data.usuario.cursos.length);
  }

  close(): void {
    this.dialogRef.close();
  }

  getCursosAtivos(): number {
    if (!this.data.usuario.cursos) return 0;
    return this.data.usuario.cursos.filter(c => c.ativo).length;
  }

  getCursosInativos(): number {
    if (!this.data.usuario.cursos) return 0;
    return this.data.usuario.cursos.filter(c => !c.ativo).length;
  }

  getTotalCursos(): number {
    return this.data.usuario.cursos?.length || 0;
  }

  hasCursos(): boolean {
    return this.data.usuario.cursos && this.data.usuario.cursos.length > 0;
  }

  trackByCursoId(index: number, curso: any): number {
    return curso.id;
  }
}

