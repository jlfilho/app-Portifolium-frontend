import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Angular Material
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';

// Services e Models
import { CursosService } from '../../services/cursos.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PageRequest } from '../../../../shared/models/page.model';
import { ApiService } from '../../../../shared/api.service';

export interface Categoria {
  id: number;
  nome: string;
}

@Component({
  selector: 'acadmanage-lista-categorias',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  templateUrl: './lista-categorias.component.html',
  styleUrl: './lista-categorias.component.css'
})
export class ListaCategoriasComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'acao'];
  dataSource!: MatTableDataSource<Categoria>;
  isLoading = true;
  errorMessage: string = '';

  // Paginação do servidor
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  sortBy = 'id';
  sortDirection: 'ASC' | 'DESC' = 'ASC';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private cursosService: CursosService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public apiService: ApiService
  ) {
    this.dataSource = new MatTableDataSource<Categoria>([]);
  }

  // Verificar se usuário é admin
  isAdmin(): boolean {
    return this.apiService.isAdmin();
  }

  ngOnInit(): void {
    this.loadCatagories();
  }

  ngAfterViewInit(): void {
    // Conectar eventos do MatSort para paginação do servidor
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0; // Resetar para primeira página ao ordenar
        this.sortBy = this.sort.active || 'id';
        this.sortDirection = this.sort.direction === 'desc' ? 'DESC' : 'ASC';
        this.loadCatagories();
      });
    }
  }

  loadCatagories(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const pageRequest: PageRequest = {
      page: this.pageIndex,
      size: this.pageSize,
      sortBy: this.sortBy,
      direction: this.sortDirection
    };

    console.log('📄 Carregando tipos de atividades paginados:', pageRequest);

    this.cursosService.getAllCategoriesPaginado(pageRequest).subscribe({
      next: (page) => {
        console.log('✅ Página recebida:', page);
        console.log(`📊 ${page.numberOfElements} de ${page.totalElements} tipos de atividades`);

        this.dataSource.data = page.content;
        this.totalElements = page.totalElements;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar tipos de atividades:', error);
        this.errorMessage = 'Erro ao carregar os tipos de atividades. Tente novamente.';
        this.isLoading = false;
        this.showMessage('Erro ao carregar tipos de atividades.', 'error');
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // Nota: Filtro ainda é do lado do cliente
    // Para filtro do servidor, seria necessário adicionar parâmetro "search" na API
  }

  onPageChange(event: any): void {
    console.log('📄 Mudança de página:', event);
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCatagories();
  }

  addCategoria(): void {
    console.log('➕ Navegar para adicionar novo tipo de atividade');
    this.router.navigate(['/categorias/novo']);
  }

  editCategoria(categoria: Categoria): void {
    console.log('✏️ Navegar para editar tipo de atividade:', categoria);
    this.router.navigate(['/categorias/editar', categoria.id]);
  }

  deleteCategoria(categoria: Categoria): void {
    console.log('🗑️ Solicitando confirmação para excluir tipo de atividade:', categoria);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir o tipo de atividade "${categoria.nome}"?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.performDelete(categoria);
      }
    });
  }

  performDelete(categoria: Categoria): void {
    console.log('🗑️ Excluindo tipo de atividade:', categoria.id);

    this.cursosService.deleteCategory(categoria.id).subscribe({
      next: () => {
        console.log('✅ Tipo de atividade excluído com sucesso');
        this.showMessage(`Tipo de atividade "${categoria.nome}" excluído com sucesso!`, 'success');
        this.loadCatagories(); // Recarregar a lista
      },
      error: (error) => {
        console.error('❌ Erro ao excluir tipo de atividade:', error);

        if (error.status === 403) {
          this.showMessage('Você não tem permissão para excluir tipos de atividades.', 'error');
        } else if (error.status === 404) {
          this.showMessage('Tipo de atividade não encontrado.', 'error');
        } else if (error.status === 409 || error.status === 400) {
          this.showMessage('Não é possível excluir este tipo de atividade pois há atividades vinculadas a ele.', 'error');
        } else {
          this.showMessage('Erro ao excluir tipo de atividade. Tente novamente.', 'error');
        }
      }
    });
  }

  showMessage(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    const panelClass = type === 'success' ? 'success-snackbar' :
                       type === 'error' ? 'error-snackbar' :
                       'info-snackbar';

    this.snackBar.open(message, 'Fechar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  trackByCategoria(index: number, categoria: Categoria): number {
    return categoria.id;
  }
}
