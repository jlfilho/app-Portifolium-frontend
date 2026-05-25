import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuditLogService } from '../../services/audit-log.service';
import { AuditLog, AuditAction } from '../../models/audit-log.interface';
import { MessageService } from '../../../../shared/services/message.service';
import { LogDetailComponent } from '../../components/log-detail/log-detail.component';

@Component({
  selector: 'app-entity-history',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './entity-history.component.html',
  styleUrl: './entity-history.component.css'
})
export class EntityHistoryComponent implements OnInit {
  entityName: string = '';
  entityId: number = 0;
  history: AuditLog[] = [];
  isDataLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auditLogService: AuditLogService,
    private messageService: MessageService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.entityName = params['entityName'];
      this.entityId = +params['entityId'];
      this.loadHistory();
    });
  }

  loadHistory(): void {
    this.isDataLoading = true;
    this.auditLogService.getHistoryByEntity(this.entityName, this.entityId).subscribe({
      next: (history: AuditLog[]) => {
        this.history = history;
        this.isDataLoading = false;
      },
      error: (error) => {
        this.messageService.handleError(error, 'Erro ao carregar histórico da entidade');
        this.isDataLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/auditoria']);
  }

  viewDetails(log: AuditLog): void {
    this.dialog.open(LogDetailComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: { log, type: 'audit' }
    });
  }

  getActionLabel(action: AuditAction): string {
    const labels: Record<AuditAction, string> = {
      CREATE: 'Criar',
      UPDATE: 'Atualizar',
      DELETE: 'Excluir',
      VIEW: 'Visualizar',
      EXPORT: 'Exportar',
      LOGIN: 'Login',
      LOGOUT: 'Logout',
      PASSWORD_CHANGE: 'Alterar Senha',
      UPLOAD_FILE: 'Upload',
      DOWNLOAD_FILE: 'Download',
      ACCESS_DENIED: 'Acesso Negado'
    };
    return labels[action] || action;
  }

  getActionBadgeClass(action: AuditAction): string {
    switch (action) {
      case AuditAction.CREATE:
        return 'action-create';
      case AuditAction.UPDATE:
        return 'action-update';
      case AuditAction.DELETE:
        return 'action-delete';
      case AuditAction.VIEW:
        return 'action-view';
      default:
        return 'action-default';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  }
}

