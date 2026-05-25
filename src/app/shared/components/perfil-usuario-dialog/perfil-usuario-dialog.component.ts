import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { UsuariosService } from '../../../features/usuarios/services/usuarios.service';
import { Usuario } from '../../../features/usuarios/models/usuario.model';
import { EditarPerfilDialogComponent, EditarPerfilDialogData } from '../editar-perfil-dialog/editar-perfil-dialog.component';

export interface PerfilUsuarioDialogData {
  userEmail: string;
}

@Component({
  selector: 'app-perfil-usuario-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './perfil-usuario-dialog.component.html',
  styleUrl: './perfil-usuario-dialog.component.css'
})
export class PerfilUsuarioDialogComponent implements OnInit {
  usuario: Usuario | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<PerfilUsuarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PerfilUsuarioDialogData,
    private usuariosService: UsuariosService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.carregarDadosUsuario();
  }

  carregarDadosUsuario(): void {
    this.loading = true;
    this.error = null;

    this.usuariosService.getUserByEmail(this.data.userEmail).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Erro ao carregar dados do usuário:', err);
        this.error = 'Erro ao carregar dados do usuário.';
        this.loading = false;
      }
    });
  }

  formatarCPF(cpf: string): string {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  getRoleLabel(role: string): string {
    const roleUpper = role.toUpperCase();
    if (roleUpper.includes('ADMINISTRADOR')) {
      return 'Administrador';
    } else if (roleUpper.includes('GERENTE')) {
      return 'Gerente';
    } else if (roleUpper.includes('SECRETARIO')) {
      return 'Secretário';
    } else if (roleUpper.includes('COORDENADOR_ATIVIDADE') || roleUpper.includes('COORDENADOR ATIVIDADE')) {
      return 'Coordenador de Atividades';
    }
    return role;
  }

  getRoleColor(role: string): string {
    const roleUpper = role.toUpperCase();
    if (roleUpper.includes('ADMINISTRADOR')) {
      return 'warn';
    } else if (roleUpper.includes('GERENTE')) {
      return 'primary';
    } else if (roleUpper.includes('SECRETARIO')) {
      return 'accent';
    } else if (roleUpper.includes('COORDENADOR_ATIVIDADE') || roleUpper.includes('COORDENADOR ATIVIDADE')) {
      return '';
    }
    return '';
  }

  isCoordenadorAtividade(role: string): boolean {
    const roleUpper = role.toUpperCase();
    return roleUpper.includes('COORDENADOR_ATIVIDADE') || roleUpper.includes('COORDENADOR ATIVIDADE');
  }

  onClose(): void {
    this.dialogRef.close();
  }

  abrirEdicao(): void {
    if (!this.usuario) return;

    const dialogRef = this.dialog.open(EditarPerfilDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: {
        usuario: this.usuario
      } as EditarPerfilDialogData
    });

    dialogRef.afterClosed().subscribe((usuarioAtualizado?: Usuario) => {
      if (usuarioAtualizado) {
        // Atualizar os dados do usuário no componente
        this.usuario = usuarioAtualizado;
        // Recarregar dados para garantir sincronização
        this.carregarDadosUsuario();
      }
    });
  }
}

