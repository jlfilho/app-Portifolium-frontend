import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UsuariosService } from '../../../features/usuarios/services/usuarios.service';

export interface ChangePasswordDialogData {
  usuarioId: number;
  usuarioNome: string;
}

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './change-password-dialog.component.html',
  styleUrl: './change-password-dialog.component.css'
})
export class ChangePasswordDialogComponent {
  passwordForm: FormGroup;
  isSaving = false;

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChangePasswordDialogData,
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private snackBar: MatSnackBar
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
      this.isSaving = true;

      const { currentPassword, newPassword } = this.passwordForm.value;

      const passwordData = {
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim()
      };

      console.log('=== ALTERAÇÃO DE SENHA ===');
      console.log('Usuário ID:', this.data.usuarioId);
      console.log('Usuário Nome:', this.data.usuarioNome);
      console.log('Endpoint:', `PUT /api/usuarios/${this.data.usuarioId}/change-password`);
      console.log('Payload:', { currentPassword: '***', newPassword: '***' });

      this.usuariosService.changePassword(this.data.usuarioId, passwordData).subscribe({
        next: (response) => {
          console.log('=== SENHA ALTERADA COM SUCESSO ===');
          console.log('Response:', response);
          console.log('Mensagem:', response.message);
          console.log('Usuário ID:', response.usuarioId);

          // Exibe mensagem retornada pelo backend
          this.showMessage(response.message || 'Senha alterada com sucesso!', 'success');
          this.isSaving = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('=== ERRO AO ALTERAR SENHA ===');
          console.error('Status:', error.status);
          console.error('Error:', error);
          console.error('Error Message:', error.error);

          let errorMessage = 'Erro ao alterar senha. ';

          if (error.error?.message) {
            errorMessage += error.error.message;
          } else if (error.error && typeof error.error === 'string') {
            errorMessage += error.error;
          } else if (error.status === 400) {
            errorMessage += 'Senha atual incorreta ou nova senha inválida.';
          } else if (error.status === 401) {
            errorMessage += 'Senha atual incorreta.';
          } else if (error.status === 403) {
            errorMessage += 'Sem permissão para alterar esta senha.';
          } else if (error.status === 404) {
            errorMessage += 'Usuário não encontrado.';
          } else {
            errorMessage += 'Verifique a senha atual e tente novamente.';
          }

          this.showMessage(errorMessage, 'error');
          this.isSaving = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.passwordForm);

      if (this.passwordForm.hasError('passwordMismatch')) {
        this.showMessage('As senhas não coincidem.', 'warning');
      } else {
        this.showMessage('Por favor, preencha todos os campos corretamente.', 'warning');
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

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

  get currentPassword() { return this.passwordForm.get('currentPassword'); }
  get newPassword() { return this.passwordForm.get('newPassword'); }
  get confirmPassword() { return this.passwordForm.get('confirmPassword'); }
}

