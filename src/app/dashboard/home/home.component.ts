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
import { TestDialogComponent } from '../../shared/components/test-dialog/test-dialog.component';
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
    console.log('📊 Carregando informações do usuário do token...');

    const userInfo = this.apiService.getUserInfoFromToken();

    if (userInfo) {
      console.log('✅ Informações extraídas do token:', userInfo);

      // Atualizar propriedades do componente
      const fallbackName = userInfo.username || userInfo.email || 'Usuário';
      this.userName = userInfo.name?.trim() ? userInfo.name.trim() : fallbackName;
      this.userEmail = userInfo.email;
      this.userAuthorities = userInfo.authorities;

      const hasName = !!userInfo.name && !!userInfo.name.trim();

      if (!hasName && userInfo.pessoaId) {
        this.fetchPessoaNome(userInfo.pessoaId, fallbackName);
      } else if (!hasName && this.canManageUsers() && userInfo.email) {
        this.fetchUsuarioNomePorEmail(userInfo.email, fallbackName);
      }

      console.log('👤 Nome do usuário:', this.userName);
      console.log('📧 Email do usuário:', this.userEmail);
      console.log('🔐 Permissões:', this.userAuthorities);
    } else {
      console.warn('⚠️ Não foi possível extrair informações do token');
      // Manter valores padrão
      this.userName = 'Usuário';
      this.userEmail = '';
    }
  }

  private fetchPessoaNome(pessoaId: number, fallback: string): void {
    this.pessoasService.getById(pessoaId).subscribe({
      next: (pessoa: Pessoa) => {
        const nome = pessoa?.nome?.trim();
        if (nome) {
          this.userName = nome;
        } else {
          this.userName = fallback;
        }
      },
      error: (error) => {
        console.warn('⚠️ Não foi possível carregar nome da pessoa pelo ID.', error);
        this.userName = fallback;
      }
    });
  }

  private fetchUsuarioNomePorEmail(email: string, fallback: string): void {
    this.usuariosService.getUserByEmail(email).subscribe({
      next: (usuario) => {
        const nome = usuario?.nome?.trim();
        if (nome) {
          this.userName = nome;
        } else {
          this.userName = fallback;
        }
      },
      error: (error) => {
        console.warn('⚠️ Não foi possível carregar nome do usuário pelo e-mail.', error);
        this.userName = fallback;
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
    } else if (this.userAuthorities.includes('ROLE_ALUNO')) {
      return 'Aluno';
    }
    return 'Usuário';
  }

  /**
   * Alterna estado da sidebar (expandida/colapsada)
   */
  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    console.log('Sidebar:', this.isCollapsed ? 'Colapsada' : 'Expandida');
  }

  /**
   * Navega para a página de perfil
   */
  goToProfile(): void {
    console.log('📱 Navegando para perfil do usuário');
    this.router.navigate(['/perfil']);
  }

  /**
   * Navega para a página de configurações
   */
  goToSettings(): void {
    console.log('⚙️ Navegando para configurações');
    this.router.navigate(['/configuracoes']);
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
    console.log('🚪 Efetuando logout...');
    this.apiService.logout();
    this.router.navigate(['/login']);
  }

  /**
   * Testa o diálogo para verificar se está funcionando
   */
  testDialog(): void {
    console.log('🧪 Testando diálogo...');

    const dialogRef = this.dialog.open(TestDialogComponent, {
      width: '500px',
      data: { message: 'Teste de diálogo' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('📋 Resultado do diálogo:', result);
    });
  }
}
