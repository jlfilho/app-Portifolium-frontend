import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="custom-dialog-overlay" (click)="onCancel()">
      <div class="custom-dialog" (click)="$event.stopPropagation()">
        <!-- Ícone -->
        <div class="icon-container" [ngClass]="getIconClass()">
          <mat-icon>{{ getIcon() }}</mat-icon>
        </div>

        <!-- Título -->
        <h2 class="title">{{ data.title }}</h2>

        <!-- Mensagem -->
        <p class="message">{{ data.message }}</p>

        <!-- Botões -->
        <div class="buttons">
          <button
            type="button"
            (click)="onCancel()"
            class="btn btn-cancel">
            {{ data.cancelText || 'Cancelar' }}
          </button>

          <button
            type="button"
            (click)="onConfirm()"
            class="btn btn-confirm"
            [ngClass]="data.type === 'danger' ? 'btn-danger' : 'btn-primary'">
            {{ data.confirmText || 'Confirmar' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }

    .custom-dialog {
      background: #ffffff;
      border-radius: 16px;
      padding: 40px;
      min-width: 400px;
      max-width: 500px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      font-family: 'Roboto', 'Helvetica Neue', sans-serif;
    }

    .icon-container {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }

    .icon-container mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: #ffffff;
    }

    .icon-warning {
      background: linear-gradient(135deg, #F59E0B, #D97706);
    }

    .icon-danger {
      background: linear-gradient(135deg, #EF4444, #DC2626);
    }

    .icon-info {
      background: linear-gradient(135deg, #3B82F6, #2563EB);
    }

    .title {
      font-size: 24px;
      font-weight: 600;
      color: #0F172A;
      margin: 0 0 16px 0;
      line-height: 1.2;
    }

    .message {
      font-size: 16px;
      color: #475569;
      margin: 0 0 32px 0;
      line-height: 1.5;
    }

    .buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
    }

    .btn {
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
      font-family: 'Roboto', 'Helvetica Neue', sans-serif;
    }

    .btn-cancel {
      background: transparent;
      color: #475569;
      border: 2px solid #CBD5E1;
    }

    .btn-cancel:hover {
      background: rgba(59, 130, 246, 0.1);
      border-color: #3B82F6;
      color: #3B82F6;
    }

    .btn-confirm {
      min-width: 120px;
    }

    .btn-primary {
      background: #3B82F6;
      color: #ffffff;
    }

    .btn-primary:hover {
      background: #2563EB;
      transform: translateY(-1px);
    }

    .btn-danger {
      background: #EF4444;
      color: #ffffff;
    }

    .btn-danger:hover {
      background: #DC2626;
      transform: translateY(-1px);
    }

    /* Responsivo */
    @media (max-width: 500px) {
      .custom-dialog {
        min-width: 280px;
        padding: 32px 24px;
        margin: 20px;
      }

      .icon-container {
        width: 64px;
        height: 64px;
      }

      .icon-container mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
      }

      .title {
        font-size: 20px;
      }

      .message {
        font-size: 14px;
      }

      .buttons {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }
  `]
})
export class ConfirmDialogComponent {
  @Input() data: ConfirmDialogData = {
    title: '',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    type: 'warning'
  };

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onCancel(): void {
    this.cancel.emit();
  }

  onConfirm(): void {
    this.confirm.emit();
  }

  getIcon(): string {
    switch (this.data.type) {
      case 'danger':
        return 'delete_forever';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'help_outline';
    }
  }

  getIconClass(): string {
    return `icon-${this.data.type}`;
  }
}
