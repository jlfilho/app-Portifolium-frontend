import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

// Services
import { CursosService } from '../../services/cursos.service';
import { UsuariosService } from '../../../usuarios/services/usuarios.service';
import { SimpleConfirmDialogComponent } from '../../../../shared/components/simple-confirm-dialog/simple-confirm-dialog.component';
import { PageRequest } from '../../../../shared/models/page.model';
import { extractApiMessage } from '../../../../shared/utils/message.utils';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface PermissaoCurso {
  cursoId: number;
  usuarioId: number;
  usuarioNome: string;
  permissao: string;
}

@Component({
  selector: 'acadmanage-permissoes-curso-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './permissoes-curso-form.component.html',
  styleUrl: './permissoes-curso-form.component.css'
})
export class PermissoesCursoFormComponent implements OnInit, OnDestroy {
  cursoId!: number;
  cursoNome = '';

  permissoes: PermissaoCurso[] = [];
  usuarios: any[] = [];
  usuarioSelecionado: number | null = null;
  usuarioFiltro = '';
  isLoading = true;
  isLoadingUsers = false;
  isAdding = false;
  errorMessage = '';
  private userSearchSubject = new Subject<string>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cursosService: CursosService,
    private usuariosService: UsuariosService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.setupSearchDebounce();
    this.cursoId = Number(this.route.snapshot.paramMap.get('id'));
    // Tentar recuperar nome do curso via state (enviado pela navegação) ou via query
    this.cursoNome = (history.state && history.state.cursoNome) || this.route.snapshot.queryParamMap.get('nome') || '';

    this.loadPermissions();
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.userSearchSubject.complete();
  }

  private setupSearchDebounce(): void {
    this.userSearchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(term => {
      this.usuarioFiltro = term;
      this.loadUsers(term);
    });
  }

  loadPermissions(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.cursosService.getCoursePermissions(this.cursoId).subscribe({
      next: (permissoes) => {
        this.permissoes = permissoes;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = extractApiMessage(error) || 'Erro ao carregar permissões do curso. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  loadUsers(term?: string): void {
    this.isLoadingUsers = true;

    // Usar getAllUsersPaginado() em vez do método deprecated getAllUsers()
    const pageRequest: PageRequest = {
      page: 0,
      size: 1000, // Buscar muitos usuários para o dropdown
      sortBy: 'id', // Mudado de 'nome' para 'id' porque o backend não reconhece 'nome'
      direction: 'ASC'
    };

    this.usuariosService.getAllUsersPaginado(pageRequest, term).subscribe({
      next: (page) => {
        console.log('📦 Resposta recebida:', page);
        console.log('📦 Conteúdo (page.content):', page.content);
        console.log('📦 Total de elementos:', page.totalElements);

        // Garantir que sempre seja um array
        this.usuarios = Array.isArray(page.content) ? page.content : [];
        this.isLoadingUsers = false;

        console.log('✅ Usuários carregados:', this.usuarios.length);
        if (this.usuarios.length > 0) {
          console.log('✅ Primeiro usuário:', this.usuarios[0]);
        }
      },
      error: (error) => {
        console.error('❌ ERRO ao carregar usuários:');
        console.error('❌ Status:', error.status);
        console.error('❌ StatusText:', error.statusText);
        console.error('❌ Message:', error.message);
        console.error('❌ Error body:', error.error);

        // Mostrar mensagem de erro ao usuário
        if (error.status === 403 || error.status === 401) {
          this.showMessage('Você não tem permissão para visualizar a lista de usuários.', 'error');
        } else {
          this.showMessage('Erro ao carregar lista de usuários. Tente novamente.', 'error');
        }

        this.usuarios = []; // Garantir que seja um array mesmo em caso de erro
        this.isLoadingUsers = false;
      }
    });
  }

  getAvailableUsers(): any[] {
    // Se ainda está carregando usuários, retornar array vazio
    if (this.isLoadingUsers) {
      return [];
    }

    // Verificar se this.usuarios é um array antes de usar filter
    if (!Array.isArray(this.usuarios)) {
      console.error('❌ this.usuarios não é um array!', this.usuarios);
      return [];
    }

    const usuariosComPermissao = this.permissoes.map(p => p.usuarioId);
    const availableUsers = this.usuarios.filter(u => !usuariosComPermissao.includes(u.id));

    console.log('📋 Total de usuários:', this.usuarios.length);
    console.log('📋 Usuários com permissão:', usuariosComPermissao);
    console.log('📋 Usuários disponíveis:', availableUsers.length);

    return availableUsers;
  }

  addUserToCourse(): void {
    console.log('🔵 addUserToCourse() chamado');
    console.log('🔵 usuarioSelecionado:', this.usuarioSelecionado);
    console.log('🔵 cursoId:', this.cursoId);

    if (!this.usuarioSelecionado) {
      console.log('⚠️ Nenhum usuário selecionado');
      this.showMessage('Selecione um usuário para adicionar', 'warning');
      return;
    }

    console.log('🔵 Iniciando adição de usuário...');
    this.isAdding = true;

    this.cursosService.addUserToCourse(this.cursoId, this.usuarioSelecionado).subscribe({
      next: (permissoes) => {
        console.log('✅ Usuário adicionado com sucesso!');
        console.log('✅ Permissões recebidas:', permissoes);
        console.log('✅ Tipo das permissões:', typeof permissoes);
        console.log('✅ É array?', Array.isArray(permissoes));

        this.permissoes = permissoes;
        this.usuarioSelecionado = null;
        this.isAdding = false;
        this.showMessage('Usuário adicionado ao curso com sucesso!', 'success');
      },
      error: (error) => {
        console.error('❌ Erro ao adicionar usuário:', error);
        console.error('❌ Status:', error.status);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error body:', error.error);

        const errorMessage = extractApiMessage(error) || 'Erro ao adicionar usuário ao curso. Tente novamente.';
        this.showMessage(errorMessage, 'error');
        this.isAdding = false;
      }
    });
  }

  onUserSearchChange(term: string): void {
    this.userSearchSubject.next(term);
  }

  confirmRemove(permissao: PermissaoCurso): void {
    const dialogRef = this.dialog.open(SimpleConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Remover Usuário',
        message: `Tem certeza que deseja remover "${permissao.usuarioNome}" deste curso?`,
        confirmText: 'Sim, Remover',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.removeUser(permissao.usuarioId, permissao.usuarioNome);
      }
    });
  }

  private removeUser(usuarioId: number, usuarioNome: string): void {
    this.cursosService.removeUserFromCourse(this.cursoId, usuarioId).subscribe({
      next: (permissoes) => {
        this.permissoes = [...permissoes];
        this.showMessage(`Usuário "${usuarioNome}" removido do curso com sucesso!`, 'success');
      },
      error: (error) => {
        const handleMessage = (apiMessage: string | null) => {
          if (apiMessage) {
            this.showMessage(apiMessage, 'error');
            return;
          }

          if (error?.status === 409) {
            this.showMessage('Não é possível remover administradores enquanto houver outros usuários dependentes.', 'error');
            return;
          }

          if (error?.status === 403) {
            this.showMessage('Você não tem permissão para remover este usuário.', 'error');
            return;
          }

          if (error?.status === 404) {
            this.showMessage('Usuário não encontrado no curso.', 'error');
            return;
          }

          this.showMessage('Erro ao remover usuário do curso. Tente novamente.', 'error');
        };

        if (error?.error instanceof Blob) {
          const blob = error.error as Blob;
          blob.text().then(text => {
            let parsed: any = text;
            try {
              parsed = JSON.parse(text);
            } catch {
              // keep as text
            }
            const apiMessage = extractApiMessage(parsed);
            handleMessage(apiMessage);
          }).catch(() => handleMessage(null));
          return;
        }

        const apiMessage = extractApiMessage(error);
        handleMessage(apiMessage);
      }
    });
  }

  back(): void {
    this.router.navigate(['/cursos']);
  }

  private showMessage(message: string, type: 'success' | 'error' | 'warning'): void {
    const panelClass = type === 'success' ? 'snackbar-success' :
                      type === 'error' ? 'snackbar-error' :
                      'snackbar-warning';

    this.snackBar.open(message, 'Fechar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  trackByUsuarioId(index: number, p: PermissaoCurso): number {
    return p.usuarioId;
  }

  getRoleColor(role: string): string {
    const roleUpper = role.toUpperCase();
    if (roleUpper.includes('ADMINISTRADOR')) {
      return 'error';
    } else if (roleUpper.includes('GERENTE')) {
      return 'success';
    } else if (roleUpper.includes('SECRETARIO')) {
      return 'warn';
    }
    return '';
  }

  getRoleIcon(role: string): string {
    const roleUpper = role.toUpperCase();
    if (roleUpper.includes('ADMINISTRADOR')) {
      return 'admin_panel_settings';
    } else if (roleUpper.includes('GERENTE')) {
      return 'manage_accounts';
    } else if (roleUpper.includes('SECRETARIO')) {
      return 'assignment_ind';
    }
    return 'person';
  }
}


