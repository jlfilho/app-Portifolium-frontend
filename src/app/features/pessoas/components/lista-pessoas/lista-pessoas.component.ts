import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
import { MatDialog } from '@angular/material/dialog';

import { PessoasService } from '../../services/pessoas.service';
import { Pessoa } from '../../models/pessoa.model';
import { PessoaFilter } from '../../models/pessoa-filter.model';
import { PessoaImportResponse } from '../../models/pessoa-import-response.model';
import { ApiService } from '../../../../shared/api.service';
import { extractApiMessage } from '../../../../shared/utils/message.utils';

@Component({
  selector: 'acadmanage-lista-pessoas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './lista-pessoas.component.html',
  styleUrl: './lista-pessoas.component.css'
})
export class ListaPessoasComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<Pessoa>([]);
  isLoading = false;
  hasError = false;
  errorMessage = '';
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  sortBy = 'nome';
  sortDirection: 'ASC' | 'DESC' = 'ASC';

  searchControl = new FormControl<string>('', { nonNullable: true });
  private searchSub?: Subscription;
  filtroNome = '';

  lastImportResponse?: PessoaImportResponse;
  isImporting = false;
  @ViewChild('csvInput') csvInput?: ElementRef<HTMLInputElement>;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(
    private readonly pessoasService: PessoasService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    public readonly apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.displayedColumns = this.canManage()
      ? ['id', 'nome', 'cpf', 'acoes']
      : ['id', 'nome', 'cpf'];
    this.loadPessoas();
    this.setupSearch();
  }

  openImportHelp(): void {
    import('../pessoa-import-dialog/pessoa-import-dialog.component').then(({ PessoaImportDialogComponent }) => {
      this.dialog.open(PessoaImportDialogComponent, {
        width: '520px',
        maxWidth: '90vw',
        autoFocus: false
      });
    }).catch(error => console.error('Erro ao abrir diálogo de ajuda para importação:', error));
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  isAdmin(): boolean {
    return this.apiService.isAdmin();
  }

  canManage(): boolean {
    return this.apiService.isAdmin();
  }

  canCreatePessoa(): boolean {
    return this.apiService.hasAnyRole(['ADMINISTRADOR', 'GERENTE', 'SECRETARIO']);
  }

  canImport(): boolean {
    return this.apiService.isAdmin() || this.apiService.hasRole('GERENTE') || this.apiService.hasRole('SECRETARIO');
  }

  loadPessoas(): void {
    this.isLoading = true;
    this.hasError = false;

    const filter: PessoaFilter = {
      page: this.pageIndex,
      size: this.pageSize,
      sortBy: this.sortBy,
      direction: this.sortDirection,
      nome: this.filtroNome || undefined
    };

    this.pessoasService.getPage(filter).subscribe({
      next: (page) => {
        this.dataSource.data = page.content || [];
        this.totalElements = page.totalElements || 0;
        this.isLoading = false;

        if (!page.content || page.content.length === 0) {
          this.dataSource.data = [];
        }
      },
      error: (error) => {
        console.error('❌ Erro ao carregar pessoas:', error);
        this.isLoading = false;
        this.hasError = true;
        const message = extractApiMessage(error) || 'Erro ao carregar a lista de pessoas.';
        this.errorMessage = message;
        this.showMessage(message, 'error');
      }
    });
  }

  applyFilter(value: string): void {
    this.filtroNome = value.trim();
    this.pageIndex = 0;
    this.loadPessoas();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPessoas();
  }

  addPessoa(): void {
    if (!this.canCreatePessoa()) {
      this.showMessage('Somente administradores, gerentes ou secretários podem cadastrar pessoas.', 'error');
      return;
    }
    this.router.navigate(['/pessoas/novo']);
  }

  editPessoa(pessoa: Pessoa): void {
    if (!this.canManage()) {
      this.showMessage('Somente administradores podem editar pessoas.', 'error');
      return;
    }
    this.router.navigate(['/pessoas/editar', pessoa.id]);
  }

  deletePessoa(pessoa: Pessoa): void {
    if (!this.canManage()) {
      this.showMessage('Somente administradores podem excluir pessoas.', 'error');
      return;
    }

    import('../../../../shared/components/simple-confirm-dialog/simple-confirm-dialog.component')
      .then(({ SimpleConfirmDialogComponent }) => {
        const dialogRef = this.dialog.open(SimpleConfirmDialogComponent, {
          width: '420px',
          panelClass: 'custom-dialog-panel',
          data: {
            title: 'Excluir Pessoa',
            message: `Tem certeza que deseja excluir "${pessoa.nome}"?`,
            confirmText: 'Excluir',
            cancelText: 'Cancelar'
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === true && pessoa.id) {
            this.performDelete(pessoa);
          }
        });
      })
      .catch(error => console.error('Erro ao carregar diálogo de confirmação:', error));
  }

  triggerImport(): void {
    if (!this.canImport() || this.isImporting) {
      return;
    }
    this.csvInput?.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    this.isImporting = true;

    this.pessoasService.importCsv(file).subscribe({
      next: (response) => {
        this.lastImportResponse = response;
        const message = `Importação concluída: ${response.totalCadastrados} novos cadastros, ${response.duplicados.length} registros ignorados.`;
        this.showMessage(message, 'success');
        this.isImporting = false;
        this.loadPessoas();
        if (this.csvInput?.nativeElement) {
          this.csvInput.nativeElement.value = '';
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Erro ao importar pessoas:', error);
        this.isImporting = false;
        this.lastImportResponse = undefined;
        if (this.csvInput?.nativeElement) {
          this.csvInput.nativeElement.value = '';
        }
        this.handleImportError(error);
      }
    });
  }

  clearImportSummary(): void {
    this.lastImportResponse = undefined;
  }

  hasData(): boolean {
    return this.dataSource.data.length > 0;
  }

  private setupSearch(): void {
    this.searchSub = this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(value => this.applyFilter(value));
  }

  private performDelete(pessoa: Pessoa): void {
    if (!pessoa.id) {
      return;
    }

    this.pessoasService.delete(pessoa.id).subscribe({
      next: () => {
        this.showMessage(`Pessoa "${pessoa.nome}" excluída com sucesso!`, 'success');
        this.loadPessoas();
      },
      error: (error) => {
        console.error('Erro ao excluir pessoa:', error);
        const message = extractApiMessage(error) || 'Erro ao excluir pessoa.';
        this.showMessage(message, 'error');
      }
    });
  }

  private handleImportError(error: HttpErrorResponse): void {
    const finalize = (message: string | null) => {
      if (message) {
        this.showMessage(message, 'error');
        return;
      }

      if (error.status === 400) {
        this.showMessage('Não foi possível importar. Verifique se o arquivo segue o formato e se os CPFs são válidos.', 'error');
        return;
      }

      this.showMessage('Erro ao importar arquivo CSV. Tente novamente.', 'error');
    };

    if (error?.error instanceof Blob) {
      const blob = error.error as Blob;
      blob.text()
        .then(text => {
          let parsed: any = text;
          try {
            parsed = JSON.parse(text);
          } catch {
            // permanece como texto simples
          }
          const apiMessage = extractApiMessage(parsed);
          finalize(apiMessage ?? (typeof parsed === 'string' ? parsed : null));
        })
        .catch(() => finalize(null));
      return;
    }

    const apiMessage = extractApiMessage(error);
    finalize(apiMessage);
  }

  private showMessage(message: string, type: 'success' | 'error' | 'info'): void {
    const panelClass =
      type === 'success' ? 'snackbar-success' :
      type === 'error' ? 'snackbar-error' :
      'info-snackbar';

    this.snackBar.open(message, 'Fechar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
}


