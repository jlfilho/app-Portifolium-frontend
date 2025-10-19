import { Component, HostListener } from '@angular/core';
import { CommonModule, NgOptimizedImage  } from '@angular/common';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CursosService } from '../../services/cursos.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'acadmanage-cards-cursos',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    NgOptimizedImage,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './cards-cursos.component.html',
  styleUrl: './cards-cursos.component.css'
})
export class CardsCursosComponent  {
  cursos: any[] = []; // Armazena a lista de cursos
  errorMessage: string = ''; // Mensagem de erro (caso ocorra)
  columns: number = 3; // Número de colunas padrão

  constructor(
    private cursosService: CursosService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.loadCourses();
    this.updateColumns(window.innerWidth);
  }

  // Detectar mudanças no tamanho da janela
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateColumns(event.target.innerWidth);
  }

  // Atualizar número de colunas baseado na largura
  updateColumns(width: number): void {
    if (width < 768) {
      this.columns = 1; // Mobile: 1 coluna
    } else if (width < 1200) {
      this.columns = 2; // Tablet: 2 colunas
    } else {
      this.columns = 3; // Desktop: 3 colunas
    }
  }

  // Getter para usar no template
  getColumns(): number {
    return this.columns;
  }



  // Método para carregar os cursos do usuário
  loadCourses(): void {
    this.cursosService.getUserCourses().subscribe({
      next: (data) => {
        this.cursos = data; // Atribui os cursos à variável
        console.log(this.cursos); // Para depuração
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar os cursos. Tente novamente.';
        console.error(error); // Para depuração
      },
    });
  }

  // Navegar para adicionar novo curso
  addCourse(): void {
    this.router.navigate(['/cursos/novo']);
  }

  // Navegar para editar curso
  editCourse(cursoId: number): void {
    this.router.navigate(['/cursos/editar', cursoId]);
  }

  // Deletar curso com diálogo de confirmação
  deleteCourse(curso: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      panelClass: 'confirm-dialog-panel',
      data: {
        title: 'Excluir Curso',
        message: `Tem certeza que deseja excluir o curso "${curso.nome}"? Esta ação não pode ser desfeita.`,
        confirmText: 'Sim, Excluir',
        cancelText: 'Cancelar',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.performDelete(curso.id, curso.nome);
      }
    });
  }

  // Executar a exclusão
  private performDelete(cursoId: number, cursoNome: string): void {
    this.cursosService.deleteCourse(cursoId).subscribe({
      next: () => {
        this.showMessage(`Curso "${cursoNome}" excluído com sucesso!`, 'success');
        this.loadCourses(); // Recarrega a lista
      },
      error: (error) => {
        console.error('Erro ao deletar curso:', error);
        this.showMessage('Erro ao excluir curso. Tente novamente.', 'error');
      }
    });
  }

  // Mostrar notificação
  private showMessage(message: string, type: 'success' | 'error'): void {
    const panelClass = type === 'success' ? 'snackbar-success' : 'snackbar-error';

    this.snackBar.open(message, 'Fechar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

}
