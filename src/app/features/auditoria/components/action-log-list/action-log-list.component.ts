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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';

import { ActionLogService } from '../../services/action-log.service';
import { ActionLog, ActionLogFilters, ActionType } from '../../models/action-log.interface';
import { ActionLogPage } from '../../models/page-response.interface';
import { MessageService } from '../../../../shared/services/message.service';
import { LogDetailComponent } from '../log-detail/log-detail.component';

@Component({
  selector: 'app-action-log-list',
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
    MatCheckboxModule,
    MatDividerModule
  ],
  templateUrl: './action-log-list.component.html',
  styleUrl: './action-log-list.component.css'
})
export class ActionLogListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'timestamp',
    'userEmail',
    'actionType',
    'description',
    'success',
    'errorMessage',
    'endpoint',
    'ipAddress',
    'actions'
  ];

  dataSource = new MatTableDataSource<ActionLog>([]);
  totalElements = 0;
  pageSize = 20;
  pageIndex = 0;
  pageSizeOptions = [10, 20, 50, 100];

  isDataLoading = false;
  filterForm!: FormGroup;

  actionTypes = Object.values(ActionType);

  constructor(
    private actionLogService: ActionLogService,
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
      userEmail: [''],
      actionType: [''],
      success: [''],
      startDate: [''],
      endDate: ['']
    });
  }

  loadLogs(): void {
    this.isDataLoading = true;
    const filters: ActionLogFilters = {
      ...this.filterForm.value,
      page: this.pageIndex,
      size: this.pageSize,
      sort: 'timestamp,DESC'
    };

    // Remove campos vazios
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof ActionLogFilters] === '' || filters[key as keyof ActionLogFilters] === null) {
        delete filters[key as keyof ActionLogFilters];
      }
    });

    this.actionLogService.searchLogs(filters).subscribe({
      next: (page: ActionLogPage) => {
        this.dataSource.data = page.content;
        this.totalElements = page.totalElements;
        this.isDataLoading = false;
      },
      error: (error) => {
        this.messageService.handleError(error, 'Erro ao carregar logs de ação');
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

  viewDetails(log: ActionLog): void {
    this.dialog.open(LogDetailComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: { log, type: 'action' }
    });
  }

  getActionTypeLabel(actionType: ActionType): string {
    const labels: Record<ActionType, string> = {
      LOGIN_SUCCESS: 'Login Sucesso',
      LOGIN_FAILURE: 'Login Falha',
      LOGOUT: 'Logout',
      PASSWORD_CHANGE: 'Alterar Senha',
      PASSWORD_RESET_REQUEST: 'Solicitar Reset',
      PASSWORD_RESET_COMPLETE: 'Reset Completo',
      FILE_UPLOAD: 'Upload Arquivo',
      FILE_DOWNLOAD: 'Download Arquivo',
      FILE_DELETE: 'Excluir Arquivo',
      EXPORT_REPORT: 'Exportar Relatório',
      IMPORT_CSV: 'Importar CSV',
      ACCESS_DENIED: 'Acesso Negado',
      PERMISSION_CHECK_FAILED: 'Permissão Negada',
      TOKEN_REFRESH: 'Atualizar Token',
      SESSION_EXPIRED: 'Sessão Expirada'
    };
    return labels[actionType] || actionType;
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

