import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';


import { CursosService } from '../../services/cursos.service';
import { FormCursoComponent } from '../form-curso/form-curso.component';
import { Curso } from '../../../../shared/models/curso.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'acadmanage-cards-cursos',
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatGridListModule, NgOptimizedImage, MatDividerModule, MatIconModule, MatTooltipModule, MatDialogModule, MatChipsModule
  ],
  templateUrl: './cards-cursos.component.html',
  styleUrl: './cards-cursos.component.css'
})
export class CardsCursosComponent {
  novoCurso!: Curso;
  cursos: Curso[] = []; // Armazena a lista de cursos
  errorMessage: string = ''; // Mensagem de erro (caso ocorra)

  constructor(private cursosService: CursosService,
    private dialog: MatDialog
  ) {
    this.loadCourses();
  }

  confirmacao(mensagem: string): MatDialogRef<ConfirmDialogComponent> {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '600px',
      enterAnimationDuration: '100ms',
      exitAnimationDuration: '100ms',
      data: { mensagem },
    });
  }

  cadastarCursoDialog(): void {
    const dialogRef = this.dialog.open(FormCursoComponent, {
      width: '600px',
      data: { curso: { id: 0, nome: '' } }, // Dados iniciais para o formulário
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.novoCurso = result;
        this.saveCurso();
        // Aqui você pode chamar um serviço para salvar o curso
      }
    });
  }

  utualizarCursoDialog(curso: Curso): void {
    const dialogRef = this.dialog.open(FormCursoComponent, {
      width: '600px',
      data: { curso: curso }, // Dados iniciais para o formulário
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateCurso(result);
        // Aqui você pode chamar um serviço para salvar o curso
      }
    });
  }

  saveCurso(): void {
    this.cursosService.saveCurso(this.novoCurso).subscribe({
      next: (data) => {
        this.loadCourses();
        console.log('Curso salvo:', data);
      },
      error: (error) => {
        this.errorMessage = 'Erro ao salvar o curso. Tente novamente.';
        console.error(error);
      },
    })
  }

  deleteCurso(curso: Curso): void {
    const dialogRef = this.confirmacao(`Tem certeza que deseja excluir o curso ${curso.nome}?`);
    if (!dialogRef) return;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cursosService.deleteCurso(curso.id).subscribe({
          next: (data) => {
            this.loadCourses();
            console.log('Curso deletado:', data);
          },
          error: (error) => {
            this.errorMessage = 'Erro ao deletar o curso. Tente novamente.';
            console.error(error);
          },
        });
      }
    });
  }

  updateCurso(curso: Curso): void {
    const dialogRef = this.confirmacao(`Tem certeza que deseja alterar o curso ${curso.nome}?`);
    if (!dialogRef) return;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cursosService.updateCurso(curso).subscribe({
          next: (data) => {
            this.loadCourses();
            console.log('Curso atualizado:', data);
          },
          error: (error) => {
            this.errorMessage = 'Erro ao atualizar o curso. Tente novamente.';
            console.error(error);
          },
        });
      }
    });
  }

  alterarStatusCurso(curso: Curso): void {
    const dialogRef = this.confirmacao(`Tem certeza que deseja alterar o status do curso ${curso.nome}?`);
    if (!dialogRef) return;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        curso.ativo = !curso.ativo;
        this.cursosService.updateCurso(curso).subscribe({
          next: (data) => {
            this.loadCourses();
            console.log('Curso atualizado:', data);
          },
          error: (error) => {
            this.errorMessage = 'Erro ao atualizar o curso. Tente novamente.';
            console.error(error);
          },
        });
      }
    });
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

}
