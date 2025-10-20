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

// Services
import { ApiService } from './../../shared/api.service';

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

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  /**
   * Carrega informações do usuário
   */
  loadUserInfo(): void {
    // TODO: Implementar chamada à API para buscar dados do usuário
    // Por enquanto, usa valores padrão
    const token = this.apiService.getToken();
    if (token) {
      // Aqui você pode decodificar o token JWT para obter informações do usuário
      // ou fazer uma chamada à API
      this.userName = 'Usuário Logado';
      this.userEmail = 'usuario@portifolium.com';
    }
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
}
