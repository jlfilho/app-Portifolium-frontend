import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';

import { AuditLogService } from '../../services/audit-log.service';
import { AuditLog, AuditLogFilters, AuditAction } from '../../models/audit-log.interface';
import { AuditLogPage } from '../../models/page-response.interface';
import { MessageService } from '../../../../shared/services/message.service';
import { LogDetailComponent } from '../log-detail/log-detail.component';

@Component({
  selector: 'app-audit-log-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatDialogModule,
    MatDividerModule
  ],
  templateUrl: './audit-log-list.component.html',
  styleUrl: './audit-log-list.component.css'
})
export class AuditLogListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'timestamp',
    'userEmail',
    'action',
    'entityName',
    'entityId',
    'description',
    'endpoint',
    'ipAddress',
    'actions'
  ];

  dataSource = new MatTableDataSource<AuditLog>([]);
  totalElements = 0;
  pageSize = 20;
  pageIndex = 0;
  pageSizeOptions = [10, 20, 50, 100];

  isDataLoading = false;
  filterForm!: FormGroup;

  auditActions = Object.values(AuditAction);
  entityNames = [
    'Curso',
    'Atividade',
    'Evidencia',
    'Usuario',
    'Pessoa',
    'Categoria',
    'FonteFinanciadora',
    'TipoCurso',
    'UnidadeAcademica'
  ];

  constructor(
    private auditLogService: AuditLogService,
    private messageService: MessageService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.initFilterForm();
  }

  ngOnInit(): void {
    this.loadLogs();
  }

  initFilterForm(): void {
    this.filterForm = this.fb.group({
      entityName: [''],
      entityId: [''],
      userEmail: [''],
      action: [''],
      startDate: [''],
      endDate: ['']
    });
  }

  loadLogs(): void {
    this.isDataLoading = true;
    const filters: AuditLogFilters = {
      ...this.filterForm.value,
      page: this.pageIndex,
      size: this.pageSize,
      sort: 'timestamp,DESC'
    };

    // Remove campos vazios
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof AuditLogFilters] === '' || filters[key as keyof AuditLogFilters] === null) {
        delete filters[key as keyof AuditLogFilters];
      }
    });

    this.auditLogService.searchLogs(filters).subscribe({
      next: (page: AuditLogPage) => {
        this.dataSource.data = page.content;
        this.totalElements = page.totalElements;
        this.isDataLoading = false;
      },
      error: (error) => {
        this.messageService.handleError(error, 'Erro ao carregar logs de auditoria');
        this.isDataLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadLogs();
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.loadLogs();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.pageIndex = 0;
    this.loadLogs();
  }

  viewDetails(log: AuditLog): void {
    this.dialog.open(LogDetailComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: { log, type: 'audit' }
    });
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
      case AuditAction.LOGIN:
      case AuditAction.LOGOUT:
        return 'action-auth';
      default:
        return 'action-default';
    }
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

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}

