import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

import { UnidadesAcademicasService } from '../../services/unidades-academicas.service';
import { UnidadeAcademica } from '../../models/unidade-academica.model';
import { extractApiMessage } from '../../../../shared/utils/message.utils';

@Component({
  selector: 'acadmanage-form-unidade-academica',
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
  templateUrl: './form-unidade-academica.component.html',
  styleUrl: './form-unidade-academica.component.css'
})
export class FormUnidadeAcademicaComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  id?: number;
  isLoading = false;
  isSaving = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly unidadesService: UnidadesAcademicasService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      descricao: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.id = +params['id'];
        this.loadUnidade(this.id);
      }
    });
  }

  loadUnidade(id: number): void {
    this.isLoading = true;
    this.unidadesService.getById(id).subscribe({
      next: (unidade) => {
        this.form.patchValue({
          nome: unidade.nome,
          descricao: unidade.descricao || ''
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar unidade acadêmica:', error);
        const message = extractApiMessage(error) || 'Erro ao carregar unidade acadêmica.';
        this.showMessage(message, 'error');
        this.isLoading = false;
        this.router.navigate(['/unidades-academicas']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSaving) {
      this.markFormGroupTouched(this.form);
      this.showMessage('Por favor, preencha os campos obrigatórios.', 'error');
      return;
    }

    this.isSaving = true;
    const payload: UnidadeAcademica = {
      nome: (this.form.value.nome as string).trim(),
      descricao: this.form.value.descricao?.trim() || undefined
    };

    if (this.isEditMode && this.id) {
      this.unidadesService.update(this.id, payload).subscribe({
        next: () => {
          this.showMessage('Unidade acadêmica atualizada com sucesso!', 'success');
          this.isSaving = false;
          this.router.navigate(['/unidades-academicas']);
        },
        error: (error) => {
          console.error('❌ Erro ao atualizar unidade acadêmica:', error);
          this.isSaving = false;
          const message = extractApiMessage(error) || 'Erro ao atualizar unidade acadêmica.';
          this.showMessage(message, 'error');
        }
      });
    } else {
      this.unidadesService.create(payload).subscribe({
        next: () => {
          this.showMessage('Unidade acadêmica criada com sucesso!', 'success');
          this.isSaving = false;
          this.router.navigate(['/unidades-academicas']);
        },
        error: (error) => {
          console.error('❌ Erro ao criar unidade acadêmica:', error);
          this.isSaving = false;
          const message = extractApiMessage(error) || 'Erro ao criar unidade acadêmica.';
          this.showMessage(message, 'error');
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/unidades-academicas']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => control.markAsTouched());
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
}


