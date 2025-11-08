import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
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
          <span class="header-title">AcadManage</span>
        </div>

        <div class="header-right">
          <button
            mat-button
            class="nav-btn"
            (click)="goToCursos()">
            <mat-icon>book</mat-icon>
            Cursos
          </button>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .public-header {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
      background: rgba(255, 255, 255, 0.1);
      transform: scale(1.1);
    }

    .header-title {
      font-size: 24px;
      font-weight: 700;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-btn {
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      transition: all 0.3s ease;
    }

    .nav-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .nav-btn mat-icon {
      margin-right: 8px;
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
}

