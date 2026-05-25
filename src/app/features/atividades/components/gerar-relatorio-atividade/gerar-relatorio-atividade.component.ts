import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AtividadeRelatorioService } from '../../services/atividade-relatorio.service';

export interface GerarRelatorioAtividadeData {
  atividadeId: number;
  atividadeNome?: string;
}

@Component({
  selector: 'acadmanage-gerar-relatorio-atividade',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './gerar-relatorio-atividade.component.html',
  styleUrl: './gerar-relatorio-atividade.component.css'
})
export class GerarRelatorioAtividadeComponent implements OnInit {
  relatorioForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private relatorioService: AtividadeRelatorioService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<GerarRelatorioAtividadeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GerarRelatorioAtividadeData
  ) {}

  ngOnInit(): void {
    this.relatorioForm = this.fb.group({
      introducao: ['']
    });
  }

  gerarRelatorio(): void {
    if (this.relatorioForm.invalid) {
      return;
    }

    this.isLoading = true;
    const introducao = this.relatorioForm.get('introducao')?.value?.trim() || undefined;

    this.relatorioService.downloadRelatorioAtividade(this.data.atividadeId, introducao)
      .subscribe({
        next: () => {
          this.snackBar.open('Relatório gerado com sucesso!', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          this.isLoading = false;
          this.dialogRef.close();
        },
        error: (error) => {
          console.error('Erro ao gerar relatório:', error);
          
          let errorMessage = 'Erro ao gerar relatório. Tente novamente.';
          
          if (error.status === 403) {
            errorMessage = 'Você não tem permissão para gerar este relatório.';
          } else if (error.status === 404) {
            errorMessage = 'Atividade não encontrada.';
          } else if (error.status === 500) {
            errorMessage = 'Erro ao gerar relatório. Tente novamente mais tarde.';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }

          this.snackBar.open(
            errorMessage,
            'Fechar',
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            }
          );
          this.isLoading = false;
        }
      });
  }

  visualizarRelatorio(): void {
    if (this.relatorioForm.invalid) {
      return;
    }

    this.isLoading = true;
    const introducao = this.relatorioForm.get('introducao')?.value?.trim() || undefined;

    this.relatorioService.visualizarRelatorioAtividade(this.data.atividadeId, introducao)
      .subscribe({
        next: () => {
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao visualizar relatório:', error);
          
          let errorMessage = 'Erro ao visualizar relatório. Tente novamente.';
          
          if (error.status === 403) {
            errorMessage = 'Você não tem permissão para visualizar este relatório.';
          } else if (error.status === 404) {
            errorMessage = 'Atividade não encontrada.';
          } else if (error.status === 500) {
            errorMessage = 'Erro ao gerar relatório. Tente novamente mais tarde.';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }

          this.snackBar.open(
            errorMessage,
            'Fechar',
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            }
          );
          this.isLoading = false;
        }
      });
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}

