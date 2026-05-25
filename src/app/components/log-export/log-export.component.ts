import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { ActionType, AuditAction, ActionLogFilter, AuditLogFilter } from '../../models/log-filter.model';
import { LogExportService } from '../../services/log-export.service';
import { MessageService } from '../../shared/services/message.service';

@Component({
  selector: 'app-log-export',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './log-export.component.html',
  styleUrl: './log-export.component.css'
})
export class LogExportComponent {
  exportForm: FormGroup;
  loading = false;
  auditActions = Object.values(AuditAction);
  actionTypes = Object.values(ActionType);

  constructor(
    private fb: FormBuilder,
    private logExportService: LogExportService,
    private messageService: MessageService
  ) {
    this.exportForm = this.fb.group({
      logType: ['audit', Validators.required],
      userEmail: [''],
      startDate: [''],
      endDate: [''],
      action: [''],
      entityName: [''],
      entityId: [''],
      actionType: [''],
      success: ['']
    });
  }

  get showAuditFilters(): boolean {
    return this.exportForm.get('logType')?.value === 'audit';
  }

  get showActionFilters(): boolean {
    return this.exportForm.get('logType')?.value === 'action';
  }

  exportLogs(): void {
    if (this.exportForm.invalid || this.loading) {
      return;
    }

    this.loading = true;
    const value = this.exportForm.getRawValue();
    const startDate = value.startDate ? new Date(value.startDate).toISOString() : undefined;
    const endDate = value.endDate ? new Date(value.endDate).toISOString() : undefined;

    if (this.showAuditFilters) {
      const filter: AuditLogFilter = {
        userEmail: value.userEmail || undefined,
        action: value.action || undefined,
        entityName: value.entityName || undefined,
        entityId: value.entityId ? Number(value.entityId) : undefined,
        startDate,
        endDate
      };

      this.logExportService.exportAuditLogs(filter).subscribe({
        next: () => this.handleSuccess('Logs de auditoria exportados com sucesso!'),
        error: () => this.handleError('Erro ao exportar logs de auditoria. Tente novamente.')
      });
    } else {
      const filter: ActionLogFilter = {
        userEmail: value.userEmail || undefined,
        actionType: value.actionType || undefined,
        success: value.success !== '' ? value.success === 'true' : undefined,
        startDate,
        endDate
      };

      this.logExportService.exportActionLogs(filter).subscribe({
        next: () => this.handleSuccess('Logs de ação exportados com sucesso!'),
        error: () => this.handleError('Erro ao exportar logs de ação. Tente novamente.')
      });
    }
  }

  clearFilters(): void {
    this.exportForm.reset({
      logType: 'audit'
    });
  }

  private handleSuccess(message: string): void {
    this.loading = false;
    this.messageService.success(message);
  }

  private handleError(message: string): void {
    this.loading = false;
    this.messageService.error(message);
  }
}

