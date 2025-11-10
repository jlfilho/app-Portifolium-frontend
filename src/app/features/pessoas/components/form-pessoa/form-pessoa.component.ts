import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

import { PessoasService } from '../../services/pessoas.service';
import { Pessoa } from '../../models/pessoa.model';
import { extractApiMessage } from '../../../../shared/utils/message.utils';

@Component({
  selector: 'acadmanage-form-pessoa',
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
  templateUrl: './form-pessoa.component.html',
  styleUrl: './form-pessoa.component.css'
})
export class FormPessoaComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  pessoaId?: number;

  constructor(
    private readonly fb: FormBuilder,
    private readonly pessoasService: PessoasService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      cpf: ['', [Validators.required, this.cpfValidator.bind(this)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.pessoaId = Number(params['id']);
        if (!Number.isNaN(this.pessoaId)) {
          this.loadPessoa(this.pessoaId);
        }
      }
    });
  }

  loadPessoa(id: number): void {
    this.isLoading = true;
    this.pessoasService.getById(id).subscribe({
      next: (pessoa) => {
        this.form.patchValue({
          nome: pessoa.nome,
          cpf: this.formatCpf(pessoa.cpf)
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar pessoa:', error);
        const message = extractApiMessage(error) || 'Erro ao carregar os dados da pessoa.';
        this.showMessage(message, 'error');
        this.isLoading = false;
        this.router.navigate(['/pessoas']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSaving) {
      this.markAllAsTouched();
      this.showMessage('Por favor, corrija os campos destacados.', 'error');
      return;
    }

    this.isSaving = true;
    const payload: Pessoa = {
      nome: (this.form.value.nome as string).trim(),
      cpf: this.normalizeCpf(this.form.value.cpf as string)
    };

    if (this.isEditMode && this.pessoaId) {
      this.pessoasService.update(this.pessoaId, payload).subscribe({
        next: () => {
          this.showMessage('Pessoa atualizada com sucesso!', 'success');
          this.isSaving = false;
          this.router.navigate(['/pessoas']);
        },
        error: (error) => {
          console.error('❌ Erro ao atualizar pessoa:', error);
          const message = extractApiMessage(error) || 'Erro ao atualizar pessoa.';
          this.showMessage(message, 'error');
          this.isSaving = false;
        }
      });
    } else {
      this.pessoasService.create(payload).subscribe({
        next: () => {
          this.showMessage('Pessoa cadastrada com sucesso!', 'success');
          this.isSaving = false;
          this.router.navigate(['/pessoas']);
        },
        error: (error) => {
          console.error('❌ Erro ao cadastrar pessoa:', error);
          const message = extractApiMessage(error) || 'Erro ao cadastrar pessoa.';
          this.showMessage(message, 'error');
          this.isSaving = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/pessoas']);
  }

  clearCpfField(): void {
    if (!this.isSaving) {
      this.form.patchValue({ cpf: '' });
    }
  }

  onCpfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input) {
      return;
    }

    const digits = this.normalizeCpf(input.value).slice(0, 11);
    const formatted = this.formatCpf(digits);

    input.value = formatted;
    this.form.patchValue({ cpf: formatted }, { emitEvent: false });
  }

  private markAllAsTouched(): void {
    Object.values(this.form.controls).forEach(control => control.markAsTouched());
  }

  private normalizeCpf(value: string): string {
    return (value || '').replace(/\D+/g, '');
  }

  private formatCpf(value: string | undefined | null): string {
    const digits = this.normalizeCpf(value || '');
    const part1 = digits.substring(0, 3);
    const part2 = digits.substring(3, 6);
    const part3 = digits.substring(6, 9);
    const part4 = digits.substring(9, 11);

    let formatted = part1;
    if (part2) {
      formatted += part2 ? `.${part2}` : '';
    }
    if (part3) {
      formatted += part3 ? `.${part3}` : '';
    }
    if (part4) {
      formatted += part4 ? `-${part4}` : '';
    }
    return formatted;
  }

  private cpfValidator(control: AbstractControl): ValidationErrors | null {
    const digits = this.normalizeCpf(control.value);
    if (!digits) {
      return { invalidCpf: true };
    }

    if (digits.length !== 11) {
      return { invalidCpf: true };
    }

    if (!this.isValidCpf(digits)) {
      return { invalidCpf: true };
    }

    return null;
  }

  private isValidCpf(cpf: string): boolean {
    if (!cpf || cpf.length !== 11) {
      return false;
    }

    if (/^([0-9])\1{10}$/.test(cpf)) {
      return false;
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += Number(cpf.charAt(i)) * (10 - i);
    }

    let rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) {
      rest = 0;
    }

    if (rest !== Number(cpf.charAt(9))) {
      return false;
    }

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += Number(cpf.charAt(i)) * (11 - i);
    }

    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) {
      rest = 0;
    }

    return rest === Number(cpf.charAt(10));
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


