import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <mat-toolbar class="public-header">
      <div class="header-content">
        <div class="header-left">
          <button
            mat-icon-button
            class="logo-btn"
            (click)="goToHome()"
            matTooltip="Voltar ao início">
            <mat-icon>school</mat-icon>
          </button>
          <span class="header-title">Portifólium</span>
        </div>

        <div class="header-right">
          <button
            mat-button
            class="nav-btn"
            (click)="goToCursos()">
            <mat-icon>book</mat-icon>
            Cursos
          </button>
          <button
            mat-button
            class="nav-btn"
            (click)="goToSobre()">
            <mat-icon>info</mat-icon>
            Sobre
          </button>
          <button
            mat-button
            class="nav-btn"
            routerLink="/login"
            matTooltip="Acessar área administrativa">
            <mat-icon>login</mat-icon>
            Login
          </button>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .public-header {
      background: var(--primary-button-gradient);
      color: white;
      box-shadow: var(--shadow-sm);
      position: relative;
      z-index: 1000;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-btn {
      color: white;
      transition: all 0.3s ease;
    }

    .logo-btn:hover {
      background: color-mix(in srgb, white 10%, transparent);
      transform: scale(1.1);
    }

    .header-title {
      font-size: 24px;
      font-weight: 700;
      text-shadow: 0 2px 4px color-mix(in srgb, var(--text-dark) 20%, transparent);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-btn {
      color: white;
      border: 1px solid color-mix(in srgb, white 30%, transparent);
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .nav-btn:hover {
      background: color-mix(in srgb, white 10%, transparent);
      border-color: color-mix(in srgb, white 50%, transparent);
    }

    .nav-btn mat-icon {
      margin-right: 8px;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    @media (max-width: 768px) {
      .header-title {
        font-size: 20px;
      }

      .nav-btn {
        font-size: 14px;
      }

      .nav-btn mat-icon {
        margin-right: 4px;
      }
    }
  `]
})
export class PublicHeaderComponent {

  constructor(private router: Router) {}

  goToHome(): void {
    this.router.navigate(['/cursos-publicos']);
  }

  goToCursos(): void {
    this.router.navigate(['/cursos-publicos']);
  }

  goToSobre(): void {
    this.router.navigate(['/sobre']);
  }
}

