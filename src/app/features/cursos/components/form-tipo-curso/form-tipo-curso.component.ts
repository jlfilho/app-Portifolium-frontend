import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';

// Services
import { TiposCursoService } from '../../../cursos/services/tipos-curso.service';
import { TipoCurso } from '../../../cursos/models/tipo-curso.model';

@Component({
  selector: 'acadmanage-form-tipo-curso',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
    MatSelectModule
  ],
  templateUrl: './form-tipo-curso.component.html',
  styleUrl: './form-tipo-curso.component.css'
})
export class FormTipoCursoComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  id?: number;
  isLoading = false;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private tiposCursoService: TiposCursoService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.id = +params['id'];
        this.loadTipo(this.id);
      }
    });
  }

  loadTipo(id: number): void {
    this.isLoading = true;
    this.tiposCursoService.getById(id).subscribe({
      next: (tipo: TipoCurso) => {
        this.form.patchValue({
          nome: tipo.nome
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar tipo de curso:', error);
        const apiMessage = this.extractApiMessage(error);
        this.showMessage(apiMessage || 'Erro ao carregar tipo de curso.', 'error');
        this.isLoading = false;
        this.router.navigate(['/tipos-curso']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid && !this.isSaving) {
      this.isSaving = true;
      const payload = {
        nome: this.form.value.nome?.trim()
      } as Omit<TipoCurso, 'id'>;

      if (this.isEditMode && this.id) {
        this.tiposCursoService.update(this.id, payload).subscribe({
          next: () => {
            this.showMessage('Tipo de curso atualizado com sucesso!', 'success');
            this.isSaving = false;
            this.router.navigate(['/tipos-curso']);
          },
          error: (error) => {
            console.error('Erro ao atualizar tipo de curso:', error);
            this.isSaving = false;
            const apiMessage = this.extractApiMessage(error);
            this.showMessage(apiMessage || 'Erro ao atualizar tipo de curso.', 'error');
          }
        });
      } else {
        this.tiposCursoService.create(payload).subscribe({
          next: () => {
            this.showMessage('Tipo de curso criado com sucesso!', 'success');
            this.isSaving = false;
            this.router.navigate(['/tipos-curso']);
          },
          error: (error) => {
            console.error('Erro ao criar tipo de curso:', error);
            this.isSaving = false;
            const apiMessage = this.extractApiMessage(error);
            this.showMessage(apiMessage || 'Erro ao criar tipo de curso.', 'error');
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.form);
      this.showMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
    }
  }

  onCancel(): void {
    this.router.navigate(['/tipos-curso']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private showMessage(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    const panelClass = type === 'success' ? 'snackbar-success' : type === 'error' ? 'snackbar-error' : 'info-snackbar';
    this.snackBar.open(message, 'Fechar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  private extractApiMessage(error: any): string | null {
    if (!error) return null;
    if (typeof error.error === 'string' && error.error.trim()) return error.error;
    if (error.error && typeof error.error.message === 'string' && error.error.message.trim()) return error.error.message;
    if (typeof error.message === 'string' && error.message.trim()) return error.message;
    return null;
  }
}


