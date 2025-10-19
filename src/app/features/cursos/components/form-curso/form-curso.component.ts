import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

// Services e Models
import { CursosService } from '../../services/cursos.service';
import { Curso } from '../../models/curso.model';

@Component({
  selector: 'acadmanage-form-curso',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './form-curso.component.html',
  styleUrl: './form-curso.component.css'
})
export class FormCursoComponent implements OnInit {
  cursoForm!: FormGroup;
  isEditMode = false;
  cursoId?: number;
  isLoading = false;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private cursosService: CursosService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Verificar se está em modo de edição
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.cursoId = +params['id'];
        this.loadCurso(this.cursoId);
      }
    });
  }

  initForm(): void {
    this.cursoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      ativo: [true]
    });
  }

  loadCurso(id: number): void {
    this.isLoading = true;
    this.cursosService.getUserCourses().subscribe({
      next: (cursos: Curso[]) => {
        const curso = cursos.find(c => c.id === id);
        if (curso) {
          this.cursoForm.patchValue({
            nome: curso.nome,
            ativo: curso.ativo
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar curso:', error);
        this.showMessage('Erro ao carregar curso', 'error');
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.cursoForm.valid) {
      this.isSaving = true;
      const cursoData: Curso = this.cursoForm.value;

      const operation = this.isEditMode && this.cursoId
        ? this.cursosService.updateCourse(this.cursoId, cursoData)
        : this.cursosService.createCourse(cursoData);

      operation.subscribe({
        next: () => {
          this.showMessage(
            this.isEditMode ? 'Curso atualizado com sucesso!' : 'Curso cadastrado com sucesso!',
            'success'
          );
          this.isSaving = false;
          this.router.navigate(['/cursos']);
        },
        error: (error) => {
          console.error('Erro ao salvar curso:', error);
          this.showMessage('Erro ao salvar curso. Tente novamente.', 'error');
          this.isSaving = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.cursoForm);
      this.showMessage('Por favor, preencha todos os campos obrigatórios.', 'warning');
    }
  }

  onCancel(): void {
    this.router.navigate(['/cursos']);
  }

  onReset(): void {
    this.cursoForm.reset({
      ativo: true
    });
  }

  // Helpers
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private showMessage(message: string, type: 'success' | 'error' | 'warning'): void {
    const panelClass = type === 'success' ? 'snackbar-success' :
                      type === 'error' ? 'snackbar-error' :
                      'snackbar-warning';

    this.snackBar.open(message, 'Fechar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  // Getters para facilitar validação no template
  get nome() { return this.cursoForm.get('nome'); }
  get ativo() { return this.cursoForm.get('ativo'); }
}

