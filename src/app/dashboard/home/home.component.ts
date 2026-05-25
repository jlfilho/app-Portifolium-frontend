import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';

// Services
import { ApiService } from './../../shared/api.service';
import { PerfilUsuarioDialogComponent } from '../../shared/components/perfil-usuario-dialog/perfil-usuario-dialog.component';
import { PessoasService } from '../../features/pessoas/services/pessoas.service';
import { Pessoa } from '../../features/pessoas/models/pessoa.model';
import { UsuariosService } from '../../features/usuarios/services/usuarios.service';

@Component({
  selector: 'acadmanage-home',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatCardModule,
    MatTooltipModule,
    MatBadgeModule,
    MatDividerModule,
    MatRippleModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isCollapsed = false;
  userName = 'Usuário';
  userEmail = 'usuario@email.com';
  userAuthorities: string[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private dialog: MatDialog,
    private pessoasService: PessoasService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  /**
   * Carrega informações do usuário do token JWT
   */
  loadUserInfo(): void {
    
    const userInfo = this.apiService.getUserInfoFromToken();

    if (userInfo) {
      
      // Atualizar propriedades do componente
      this.userEmail = userInfo.email || userInfo.username || '';
      this.userAuthorities = userInfo.authorities;

      // Verificar se o token tem o nome
      const nameFromToken = userInfo.name?.trim();
      const hasName = !!nameFromToken;

      if (hasName && nameFromToken) {
        // Se o token tem o nome, usar diretamente
        this.userName = nameFromToken;
              } else {
        // Se não tem nome no token, inicializar com placeholder e buscar
        this.userName = 'Carregando...';
        
        // Priorizar busca por pessoaId, depois por email
        if (userInfo.pessoaId) {
          this.fetchPessoaNome(userInfo.pessoaId);
        } else if (this.userEmail) {
          // Buscar por email (funciona para todos os usuários)
          this.fetchUsuarioNomePorEmail(this.userEmail);
        } else {
          // Fallback final se não conseguir buscar
          this.userName = 'Usuário';
        }
      }

                } else {
      console.warn('⚠️ Não foi possível extrair informações do token');
      // Manter valores padrão
      this.userName = 'Usuário';
      this.userEmail = '';
    }
  }

  private fetchPessoaNome(pessoaId: number): void {
    this.pessoasService.getById(pessoaId).subscribe({
      next: (pessoa: Pessoa) => {
        const nome = pessoa?.nome?.trim();
        if (nome) {
          this.userName = nome;
                  } else {
          // Se não encontrou nome na pessoa, tentar buscar por email
          if (this.userEmail) {
            this.fetchUsuarioNomePorEmail(this.userEmail);
          } else {
            this.userName = 'Usuário';
          }
        }
      },
      error: (error) => {
        console.warn('⚠️ Não foi possível carregar nome da pessoa pelo ID.', error);
        // Se falhar, tentar buscar por email
        if (this.userEmail) {
          this.fetchUsuarioNomePorEmail(this.userEmail);
        } else {
          this.userName = 'Usuário';
        }
      }
    });
  }

  private fetchUsuarioNomePorEmail(email: string): void {
    this.usuariosService.getUserByEmail(email).subscribe({
      next: (usuario) => {
        const nome = usuario?.nome?.trim();
        if (nome) {
          this.userName = nome;
                  } else {
          // Se não encontrou nome, usar email como último recurso
          this.userName = email.split('@')[0] || 'Usuário';
        }
      },
      error: (error) => {
        console.warn('⚠️ Não foi possível carregar nome do usuário pelo e-mail.', error);
        // Como último recurso, usar parte do email antes do @
        this.userName = email ? email.split('@')[0] : 'Usuário';
      }
    });
  }

  /**
   * Obtém a role mais relevante para exibir
   */
  getUserRole(): string {
    if (this.userAuthorities.includes('ROLE_ADMINISTRADOR')) {
      return 'Administrador';
    } else if (this.userAuthorities.includes('ROLE_GERENTE')) {
      return 'Gerente';
    } else if (this.userAuthorities.includes('ROLE_PROFESSOR')) {
      return 'Professor';
    } else if (this.userAuthorities.includes('ROLE_SECRETARIO')) {
      return 'Secretário';
    } else if (this.userAuthorities.includes('ROLE_COORDENADOR_ATIVIDADE')) {
      return 'Coordenador de Atividades';
    } else if (this.userAuthorities.includes('ROLE_ALUNO')) {
      return 'Aluno';
    }
    return 'Usuário';
  }

  /**
   * Obtém a inicial do nome do usuário para o avatar
   */
  getUserInitial(): string {
    if (this.userName && this.userName !== 'Usuário' && this.userName !== 'Carregando...') {
      const names = this.userName.trim().split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return this.userName[0].toUpperCase();
    }
    return 'U';
  }

  /**
   * Obtém a versão abreviada da role do usuário
   */
  getUserRoleShort(): string {
    const role = this.getUserRole();
    if (role.includes('Administrador')) return 'ADM';
    if (role.includes('Gerente')) return 'GER';
    if (role.includes('Secretário')) return 'SEC';
    if (role.includes('Coordenador')) return 'COORD';
    if (role.includes('Professor')) return 'PROF';
    if (role.includes('Aluno')) return 'ALUNO';
    return 'USR';
  }

  /**
   * Alterna estado da sidebar (expandida/colapsada)
   */
  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
      }

  /**
   * Abre o diálogo de perfil do usuário
   */
  goToProfile(): void {
        
    if (!this.userEmail) {
      console.warn('⚠️ Email do usuário não disponível');
      return;
    }

    this.dialog.open(PerfilUsuarioDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: {
        userEmail: this.userEmail
      }
    });
  }

  /**
   * Verifica se usuário possui uma das roles administrativas (admin/gerente/secretário)
   */
  canManageUsers(): boolean {
    return this.apiService.hasRole('ADMINISTRADOR') ||
      this.apiService.hasRole('GERENTE') ||
      this.apiService.hasRole('SECRETARIO');
  }

  /**
   * Verifica se o usuário é administrador
   */
  isAdmin(): boolean {
    return this.apiService.isAdmin();
  }

  /**
   * Realiza logout do usuário
   */
  logout(): void {
        this.apiService.logout();
    this.router.navigate(['/cursos-publicos']);
  }

}
