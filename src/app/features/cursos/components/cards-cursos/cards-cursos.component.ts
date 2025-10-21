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
import { SimpleConfirmDialogComponent } from '../../../../shared/components/simple-confirm-dialog/simple-confirm-dialog.component';
import { PermissoesCursoFormComponent } from '../permissoes-curso-form/permissoes-curso-form.component';

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

  // Navegar para a tela de gerenciar permissões (formulário)
  managePermissions(curso: any): void {
    console.log('👥 Gerenciar permissões para curso:', curso);
    this.router.navigate(['/cursos', curso.id, 'permissoes'], { state: { cursoNome: curso.nome } });
  }

  // Navegar para a tela de atividades do curso
  manageAtividades(curso: any): void {
    console.log('📚 Gerenciar atividades para curso:', curso);
    this.router.navigate(['/atividades/curso', curso.id], { state: { cursoNome: curso.nome } });
  }

  // Deletar curso com diálogo de confirmação
  deleteCourse(curso: any): void {
    console.log('🗑️ Excluir curso chamado para:', curso);

    const dialogRef = this.dialog.open(SimpleConfirmDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-panel',
      data: {
        title: 'Excluir Curso',
        message: `Tem certeza que deseja excluir o curso "${curso.nome}"? Esta ação não pode ser desfeita.`,
        confirmText: 'Sim, Excluir',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('💬 Resultado do diálogo de exclusão:', result);
      if (result === true) {
        console.log('✅ Confirmado! Executando exclusão...');
        this.performDelete(curso.id, curso.nome);
      } else {
        console.log('❌ Exclusão cancelada pelo usuário');
      }
    });
  }

  // Executar a exclusão
  private performDelete(cursoId: number, cursoNome: string): void {
    console.log('📡 Chamando API para excluir curso ID:', cursoId);

    this.cursosService.deleteCourse(cursoId).subscribe({
      next: (response) => {
        console.log('✅ Curso excluído com sucesso! Response:', response);
        this.showMessage(`Curso "${cursoNome}" excluído com sucesso!`, 'success');
        console.log('🔄 Recarregando lista de cursos...');
        this.loadCourses(); // Recarrega a lista
      },
      error: (error) => {
        console.error('❌ Erro ao deletar curso:', error);
        console.error('📊 Detalhes do erro:', error.error);
        console.error('🔢 Status HTTP:', error.status);

        // Extrair mensagem de erro do servidor
        let errorMessage = 'Erro ao excluir curso. Tente novamente.';

        if (error.error) {
          // Se o backend retornou uma mensagem
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error.message) {
            errorMessage = error.error.message;
          } else if (error.error.error) {
            errorMessage = error.error.error;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }

        console.log('📢 Mensagem de erro extraída:', errorMessage);
        this.showMessage(errorMessage, 'error');
      }
    });
  }

  // Toggle status do curso (ativar/desativar) com confirmação
  toggleCourseStatus(curso: any): void {
    console.log('🔄 Toggle status chamado para curso:', curso);
    console.log('📊 Status atual:', curso.ativo);

    const novoStatus = !curso.ativo;
    const acao = novoStatus ? 'ativar' : 'desativar';
    const acaoCapitalizada = novoStatus ? 'Ativar' : 'Desativar';

    console.log('🎯 Novo status será:', novoStatus);

    const dialogRef = this.dialog.open(SimpleConfirmDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-panel',
      data: {
        title: `${acaoCapitalizada} Curso`,
        message: `Tem certeza que deseja ${acao} o curso "${curso.nome}"?`,
        confirmText: `Sim, ${acaoCapitalizada}`,
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('💬 Resultado do diálogo:', result);
      if (result === true) {
        console.log('✅ Confirmado! Executando atualização...');
        this.performStatusUpdate(curso.id, curso.nome, novoStatus);
      } else {
        console.log('❌ Cancelado pelo usuário');
      }
    });
  }

  // Executar a atualização de status
  private performStatusUpdate(cursoId: number, cursoNome: string, novoStatus: boolean): void {
    console.log('📡 Chamando API para atualizar status...');
    console.log('📋 Dados:', { cursoId, novoStatus });

    this.cursosService.updateCourseStatus(cursoId, novoStatus).subscribe({
      next: (response) => {
        console.log('✅ Resposta da API:', response);
        const statusTexto = novoStatus ? 'ativado' : 'desativado';
        this.showMessage(`Curso "${cursoNome}" ${statusTexto} com sucesso!`, 'success');
        console.log('🔄 Recarregando lista de cursos...');
        this.loadCourses(); // Recarrega a lista
      },
      error: (error) => {
        console.error('❌ Erro ao atualizar status do curso:', error);
        console.error('📊 Detalhes do erro:', error.error);
        console.error('🔢 Status HTTP:', error.status);

        // Extrair mensagem de erro do servidor
        let errorMessage = 'Erro ao atualizar status do curso. Tente novamente.';

        if (error.error) {
          // Se o backend retornou uma mensagem
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error.message) {
            errorMessage = error.error.message;
          } else if (error.error.error) {
            errorMessage = error.error.error;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }

        console.log('📢 Mensagem de erro extraída:', errorMessage);
        this.showMessage(errorMessage, 'error');
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
