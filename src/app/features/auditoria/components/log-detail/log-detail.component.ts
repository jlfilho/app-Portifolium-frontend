import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { AuditLog } from '../../models/audit-log.interface';
import { ActionLog } from '../../models/action-log.interface';

export interface LogDetailData {
  log: AuditLog | ActionLog;
  type: 'audit' | 'action';
}

@Component({
  selector: 'app-log-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './log-detail.component.html',
  styleUrl: './log-detail.component.css'
})
export class LogDetailComponent implements OnInit {
  log: AuditLog | ActionLog;
  type: 'audit' | 'action';
  isAuditLog = false;
  isActionLog = false;

  oldValuesParsed: any = null;
  newValuesParsed: any = null;
  metadataParsed: any = null;

  constructor(
    public dialogRef: MatDialogRef<LogDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LogDetailData
  ) {
    this.log = data.log;
    this.type = data.type;
    this.isAuditLog = this.type === 'audit';
    this.isActionLog = this.type === 'action';
  }

  ngOnInit(): void {
    if (this.isAuditLog) {
      const auditLog = this.log as AuditLog;
      if (auditLog.oldValues) {
        try {
          this.oldValuesParsed = JSON.parse(auditLog.oldValues);
        } catch (e) {
          this.oldValuesParsed = auditLog.oldValues;
        }
      }
      if (auditLog.newValues) {
        try {
          this.newValuesParsed = JSON.parse(auditLog.newValues);
        } catch (e) {
          this.newValuesParsed = auditLog.newValues;
        }
      }
    }

    if (this.isActionLog) {
      const actionLog = this.log as ActionLog;
      if (actionLog.metadata) {
        try {
          this.metadataParsed = JSON.parse(actionLog.metadata);
        } catch (e) {
          this.metadataParsed = actionLog.metadata;
        }
      }
    }
  }

  close(): void {
    this.dialogRef.close();
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

  formatJSON(obj: any): string {
    if (typeof obj === 'string') return obj;
    return JSON.stringify(obj, null, 2);
  }

  // Getters para acessar propriedades tipadas no template
  get auditLog(): AuditLog | null {
    return this.isAuditLog ? (this.log as AuditLog) : null;
  }

  get actionLog(): ActionLog | null {
    return this.isActionLog ? (this.log as ActionLog) : null;
  }

  get actionLogSuccess(): boolean {
    return this.actionLog?.success ?? false;
  }

  get actionLogSuccessClass(): string {
    return this.actionLogSuccess ? 'status-success' : 'status-error';
  }
}

