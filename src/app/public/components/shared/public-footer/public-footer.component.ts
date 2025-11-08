import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule
  ],
  template: `
    <mat-toolbar class="public-footer">
      <div class="footer-content">
        <div class="footer-left">
          <mat-icon>school</mat-icon>
          <span>AcadManage - Sistema de Gestão Acadêmica</span>
        </div>

        <div class="footer-right">
          <span class="footer-year">© 2024</span>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .public-footer {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
      color: white;
      box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
      margin-top: auto;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .footer-left {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }

    .footer-left mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .footer-right {
      font-size: 14px;
      opacity: 0.8;
    }

    @media (max-width: 768px) {
      .footer-content {
        flex-direction: column;
        gap: 8px;
        text-align: center;
      }

      .footer-left {
        font-size: 12px;
      }

      .footer-right {
        font-size: 12px;
      }
    }
  `]
})
export class PublicFooterComponent {}

