import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Angular Material
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';

// Services e Models
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../models/usuario.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CursosUsuarioDialogComponent } from '../cursos-usuario-dialog/cursos-usuario-dialog.component';
import { ChangePasswordDialogComponent } from '../../../../shared/components/change-password-dialog/change-password-dialog.component';

@Component({
  selector: 'acadmanage-lista-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
    MatBadgeModule
  ],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.css'
})
export class ListaUsuariosComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'email', 'cpf', 'role', 'cursos', 'actions'];
  dataSource!: MatTableDataSource<Usuario>;
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private usuariosService: UsuariosService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<Usuario>([]);
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.usuariosService.getAllUsers().subscribe({
      next: (usuarios) => {
        this.dataSource.data = usuarios;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.showMessage('Erro ao carregar usuários. Verifique suas permissões.', 'error');
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addUser(): void {
    this.router.navigate(['/usuarios/novo']);
  }

  editUser(usuario: Usuario): void {
    this.router.navigate(['/usuarios/editar', usuario.id]);
  }

  viewCursos(usuario: Usuario): void {
    this.dialog.open(CursosUsuarioDialogComponent, {
      width: '700px',
      maxWidth: '90vw',
      panelClass: 'cursos-dialog-panel',
      data: { usuario }
    });
  }

  changePassword(usuario: Usuario): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      panelClass: 'change-password-dialog-panel',
      data: {
        usuarioId: usuario.id,
        usuarioNome: usuario.nome
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Senha alterada com sucesso
        console.log('Senha alterada para usuário:', usuario.nome);
      }
    });
  }

  deleteUser(usuario: Usuario): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      panelClass: 'confirm-dialog-panel',
      data: {
        title: 'Excluir Usuário',
        message: `Tem certeza que deseja excluir o usuário "${usuario.nome}"? Esta ação não pode ser desfeita.`,
        confirmText: 'Sim, Excluir',
        cancelText: 'Cancelar',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.performDelete(usuario.id, usuario.nome);
      }
    });
  }

  private performDelete(userId: number, userName: string): void {
    this.usuariosService.deleteUser(userId).subscribe({
      next: () => {
        this.showMessage(`Usuário "${userName}" excluído com sucesso!`, 'success');
        this.loadUsers();
      },
      error: (error) => {
        console.error('Erro ao deletar usuário:', error);
        this.showMessage('Erro ao excluir usuário. Tente novamente.', 'error');
      }
    });
  }

  getRoleColor(role: string): string {
    switch (role.toUpperCase()) {
      case 'ADMINISTRADOR':
        return 'warn';
      case 'PROFESSOR':
        return 'primary';
      case 'ALUNO':
        return 'accent';
      default:
        return '';
    }
  }

  getRoleIcon(role: string): string {
    switch (role.toUpperCase()) {
      case 'ADMINISTRADOR':
        return 'admin_panel_settings';
      case 'PROFESSOR':
        return 'school';
      case 'ALUNO':
        return 'person';
      default:
        return 'person';
    }
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    const panelClass = type === 'success' ? 'snackbar-success' : 'snackbar-error';

    this.snackBar.open(message, 'Fechar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
}
