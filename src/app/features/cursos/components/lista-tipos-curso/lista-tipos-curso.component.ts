import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

// Services e Models
import { TiposCursoService } from '../../../cursos/services/tipos-curso.service';
import { TipoCurso } from '../../../cursos/models/tipo-curso.model';
import { ApiService } from '../../../../shared/api.service';
import { SimpleConfirmDialogComponent } from '../../../../shared/components/simple-confirm-dialog/simple-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { extractApiMessage } from '../../../../shared/utils/message.utils';
import { TipoCursoFilter } from '../../../cursos/models/tipo-curso-filter.model';

@Component({
  selector: 'acadmanage-lista-tipos-curso',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
    MatChipsModule,
    MatPaginatorModule
  ],
  templateUrl: './lista-tipos-curso.component.html',
  styleUrl: './lista-tipos-curso.component.css'
})
export class ListaTiposCursoComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'acao'];
  tipos: TipoCurso[] = [];
  isLoading = true;
  errorMessage: string = '';
  filtro = '';

  // Paginação servidor
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20, 50];
  sortBy = 'nome';
  sortDirection: 'ASC' | 'DESC' = 'ASC';

  constructor(
    private tiposCursoService: TiposCursoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public apiService: ApiService
  ) {}

  isAdmin(): boolean {
    return this.apiService.isAdmin();
  }

  ngOnInit(): void {
    this.loadTipos();
  }

  loadTipos(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const filter: TipoCursoFilter = {
      page: this.pageIndex,
      size: this.pageSize,
      sortBy: this.sortBy,
      direction: this.sortDirection,
      nome: this.filtro || undefined
    };

    this.tiposCursoService.getPage(filter).subscribe({
      next: (page) => {
        this.tipos = page?.content || [];
        this.totalElements = page?.totalElements || 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar tipos de curso:', error);
        const apiMessage = extractApiMessage(error);
        this.errorMessage = apiMessage || 'Erro ao carregar os tipos de curso. Tente novamente.';
        this.tipos = [];
        this.totalElements = 0;
        this.isLoading = false;
        this.showMessage(this.errorMessage, 'error');
      }
    });
  }

  applyFilter(value: string): void {
    this.filtro = value || '';
    this.pageIndex = 0;
    this.loadTipos();
  }

  addTipo(): void {
    this.router.navigate(['/tipos-curso/novo']);
  }

  editTipo(tipo: TipoCurso): void {
    this.router.navigate(['/tipos-curso/editar', tipo.id]);
  }

  deleteTipo(tipo: TipoCurso): void {
    const dialogRef = this.dialog.open(SimpleConfirmDialogComponent, {
      width: '420px',
      panelClass: 'custom-dialog-panel',
      data: {
        title: 'Excluir Tipo de Curso',
        message: `Tem certeza que deseja excluir o tipo de curso "${tipo.nome}"?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true && tipo.id) {
        this.tiposCursoService.delete(tipo.id).subscribe({
          next: () => {
            this.showMessage('Tipo de curso excluído com sucesso!', 'success');
            this.loadTipos();
          },
      error: (error) => {
        console.error('Erro ao excluir tipo de curso:', error);
        const apiMessage = extractApiMessage(error);
        if (apiMessage) {
          this.showMessage(apiMessage, 'error');
        } else if (error.status === 403) {
          this.showMessage('Você não tem permissão para excluir tipos de curso.', 'error');
        } else if (error.status === 404) {
          this.showMessage('Tipo de curso não encontrado.', 'error');
        } else if (error.status === 409 || error.status === 400) {
          this.showMessage('Não é possível excluir este tipo de curso pois há relacionamentos vinculados.', 'error');
        } else if (error.status === 500) {
          this.showMessage('Erro interno do servidor ao excluir o tipo de curso. Tente novamente mais tarde.', 'error');
        } else {
          this.showMessage('Erro ao excluir tipo de curso. Tente novamente.', 'error');
        }
      }
        });
      }
    });
  }

  showMessage(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    const panelClass = type === 'success' ? 'snackbar-success' : type === 'error' ? 'snackbar-error' : 'info-snackbar';
    this.snackBar.open(message, 'Fechar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTipos();
  }
}


