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

// Services
import { CursosService } from '../../services/cursos.service';
import { ApiService } from '../../../../shared/api.service';

@Component({
  selector: 'acadmanage-form-categoria',
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
    MatDividerModule
  ],
  templateUrl: './form-categoria.component.html',
  styleUrl: './form-categoria.component.css'
})
export class FormCategoriaComponent implements OnInit {
  categoriaForm: FormGroup;
  isEditMode = false;
  categoriaId?: number;
  isLoading = false;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private cursosService: CursosService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private apiService: ApiService
  ) {
    this.categoriaForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    // Verificar se é modo de edição
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.categoriaId = +params['id'];
        this.loadCategoria(this.categoriaId);
      }
    });
  }

  loadCategoria(id: number): void {
    this.isLoading = true;
    
    this.cursosService.getCategoryById(id).subscribe({
      next: (categoria) => {
                this.categoriaForm.patchValue({
          nome: categoria.nome
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar categoria:', error);
        this.showMessage('Erro ao carregar tipo de atividade.', 'error');
        this.isLoading = false;
        this.router.navigate(['/admin/categorias']);
      }
    });
  }

  onSubmit(): void {
    if (!this.canSubmit()) {
      this.showMessage('Você não tem permissão para salvar este tipo de atividade.', 'error');
      return;
    }

    if (this.categoriaForm.valid && !this.isSaving) {
      this.isSaving = true;
      const categoriaData = {
        nome: this.categoriaForm.value.nome.trim()
      };

      if (this.isEditMode && this.categoriaId) {
        this.updateCategoria(this.categoriaId, categoriaData);
      } else {
        this.createCategoria(categoriaData);
      }
    } else {
      this.markFormGroupTouched(this.categoriaForm);
      this.showMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
    }
  }

  canSubmit(): boolean {
    return this.apiService.canAccess('CATEGORY_MANAGE');
  }

  createCategoria(categoriaData: { nome: string }): void {
    
    this.cursosService.createCategory(categoriaData).subscribe({
      next: (response) => {
                this.showMessage('Tipo de atividade criado com sucesso!', 'success');
        this.isSaving = false;
        this.router.navigate(['/admin/categorias']);
      },
      error: (error) => {
        console.error('❌ Erro ao criar tipo de atividade:', error);
        this.isSaving = false;

        if (error.status === 403) {
          this.showMessage('Você não tem permissão para criar tipos de atividades.', 'error');
        } else if (error.status === 409) {
          this.showMessage('Já existe um tipo de atividade com este nome.', 'error');
        } else {
          this.showMessage('Erro ao criar tipo de atividade. Tente novamente.', 'error');
        }
      }
    });
  }

  updateCategoria(id: number, categoriaData: { nome: string }): void {
    
    this.cursosService.updateCategory(id, categoriaData).subscribe({
      next: (response) => {
                this.showMessage('Tipo de atividade atualizado com sucesso!', 'success');
        this.isSaving = false;
        this.router.navigate(['/admin/categorias']);
      },
      error: (error) => {
        console.error('❌ Erro ao atualizar tipo de atividade:', error);
        this.isSaving = false;

        if (error.status === 403) {
          this.showMessage('Você não tem permissão para editar tipos de atividades.', 'error');
        } else if (error.status === 404) {
          this.showMessage('Tipo de atividade não encontrado.', 'error');
        } else if (error.status === 409) {
          this.showMessage('Já existe um tipo de atividade com este nome.', 'error');
        } else {
          this.showMessage('Erro ao atualizar tipo de atividade. Tente novamente.', 'error');
        }
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/categorias']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  showMessage(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    const panelClass = type === 'success' ? 'snackbar-success' :
                       type === 'error' ? 'snackbar-error' :
                       'info-snackbar';

    this.snackBar.open(message, 'Fechar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  // Getters para facilitar acesso aos controles no template
  get nome() {
    return this.categoriaForm.get('nome');
  }
}
