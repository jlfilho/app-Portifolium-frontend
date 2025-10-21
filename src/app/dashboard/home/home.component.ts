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
    private dialog: MatDialog
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
      this.userName = userInfo.name || userInfo.username || 'Usuário';
      this.userEmail = userInfo.email;
      this.userAuthorities = userInfo.authorities;

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
