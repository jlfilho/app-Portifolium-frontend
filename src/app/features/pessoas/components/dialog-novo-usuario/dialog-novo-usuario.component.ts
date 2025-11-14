import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface DialogNovoUsuarioData {
  pessoaId: number;
  pessoaNome: string;
  rolesDisponiveis: Array<{ value: string; label: string }>;
}

@Component({
  selector: 'acadmanage-dialog-novo-usuario',
  standalone: true,
  templateUrl: './dialog-novo-usuario.component.html',
  styleUrl: './dialog-novo-usuario.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class DialogNovoUsuarioComponent {
  form: FormGroup;
  isSubmitting = false;

  constructor(
    private readonly dialogRef: MatDialogRef<DialogNovoUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: DialogNovoUsuarioData,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      role: [this.data.rolesDisponiveis[0]?.value ?? 'ROLE_GERENTE', Validators.required]
    });
  }

  fechar(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const payload = {
      pessoaId: this.data.pessoaId,
      email: this.form.value.email,
      senha: this.form.value.senha,
      role: this.form.value.role,
      cursosIds: [] as number[]
    };

    this.dialogRef.close(payload);
  }
}

