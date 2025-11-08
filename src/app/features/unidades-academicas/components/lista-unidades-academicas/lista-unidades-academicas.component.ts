import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { PageRequest } from '../../../../shared/models/page.model';
import { UnidadeAcademica } from '../../models/unidade-academica.model';
import { UnidadesAcademicasService } from '../../services/unidades-academicas.service';
import { extractApiMessage } from '../../../../shared/utils/message.utils';

@Component({
  selector: 'acadmanage-lista-unidades-academicas',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCardModule,
    MatDialogModule
  ],
  templateUrl: './lista-unidades-academicas.component.html',
  styleUrl: './lista-unidades-academicas.component.css'
})
export class ListaUnidadesAcademicasComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'nome', 'descricao', 'acoes'];
  unidades: UnidadeAcademica[] = [];

  isLoading = false;
  filtro = '';

  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  sortBy = 'nome';
  sortDirection: 'ASC' | 'DESC' = 'ASC';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private readonly unidadesService: UnidadesAcademicasService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUnidades();
  }

  ngAfterViewInit(): void {
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.sortBy = this.sort.active || 'nome';
        this.sortDirection = this.sort.direction === 'desc' ? 'DESC' : 'ASC';
        this.loadUnidades();
      });
    }
  }

  loadUnidades(): void {
    this.isLoading = true;

    const pageRequest: PageRequest = {
      page: this.pageIndex,
      size: this.pageSize,
      sortBy: this.sortBy,
      direction: this.sortDirection
    };

    this.unidadesService.getPage(pageRequest, this.filtro).subscribe({
      next: (page) => {
        if (!page) {
          this.unidades = [];
          this.totalElements = 0;
          this.isLoading = false;
          return;
        }

        this.unidades = page.content || [];
        this.totalElements = page.totalElements || 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar unidades acadêmicas:', error);
        const message = extractApiMessage(error) || 'Erro ao carregar unidades acadêmicas.';
        this.showMessage(message, 'error');
        this.unidades = [];
        this.totalElements = 0;
        this.isLoading = false;
      }
    });
  }

  applyFilter(value: string): void {
    this.filtro = (value || '').trim();
    this.pageIndex = 0;
    this.loadUnidades();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUnidades();
  }

  addUnidade(): void {
    this.router.navigate(['/unidades-academicas/novo']);
  }

  editUnidade(unidade: UnidadeAcademica): void {
    this.router.navigate(['/unidades-academicas/editar', unidade.id], {
      state: { unidade }
    });
  }

  deleteUnidade(unidade: UnidadeAcademica): void {
    this.openConfirmDialog(unidade);
  }

  private performDelete(unidade: UnidadeAcademica): void {
    if (!unidade.id) {
      return;
    }

    this.unidadesService.delete(unidade.id).subscribe({
      next: () => {
        this.showMessage(`Unidade "${unidade.nome}" excluída com sucesso!`, 'success');
        this.loadUnidades();
      },
      error: (error) => {
        console.error('❌ Erro ao excluir unidade acadêmica:', error);
        const message = extractApiMessage(error) || 'Erro ao excluir unidade acadêmica.';
        this.showMessage(message, 'error');
      }
    });
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    const panelClass = type === 'success' ? 'snackbar-success' : 'snackbar-error';
    this.snackBar.open(message, 'Fechar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  private async openConfirmDialog(unidade: UnidadeAcademica): Promise<void> {
    const { SimpleConfirmDialogComponent } = await import('../../../../shared/components/simple-confirm-dialog/simple-confirm-dialog.component');

    const dialogRef = this.dialog.open(SimpleConfirmDialogComponent, {
      width: '480px',
      panelClass: 'custom-dialog-panel',
      data: {
        title: 'Excluir Unidade Acadêmica',
        message: `Deseja realmente excluir a unidade "${unidade.nome}"? Esta ação não pode ser desfeita.`,
        confirmText: 'Sim, excluir',
        cancelText: 'Cancelar'
      }
    });

    const result = await firstValueFrom(dialogRef.afterClosed());
    if (result === true) {
      this.performDelete(unidade);
    }
  }
}


