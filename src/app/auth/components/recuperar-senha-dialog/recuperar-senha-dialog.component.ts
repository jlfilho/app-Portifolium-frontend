import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RecoveryService } from '../../services/recovery.service';

@Component({
  selector: 'acadmanage-recuperar-senha-dialog',
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
  templateUrl: './recuperar-senha-dialog.component.html',
  styleUrl: './recuperar-senha-dialog.component.css'
})
export class RecuperarSenhaDialogComponent implements OnInit {
  step = 1; // 1: Solicitar código, 2: Redefinir senha
  emailForm!: FormGroup;
  resetPasswordForm!: FormGroup;
  isLoading = false;
  codeSent = false;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private recoveryService: RecoveryService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<RecuperarSenhaDialogComponent>
  ) {}

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetPasswordForm = this.fb.group({
      recoveryCode: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  solicitarCodigo(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const email = this.emailForm.get('email')?.value?.trim();

    this.recoveryService.generateRecoveryCode(email).subscribe({
      next: (response) => {
        this.codeSent = true;
        this.step = 2;
        this.isLoading = false;
        const message = response || 'Código de recuperação enviado para seu e-mail!';
        this.showMessage(message, 'success');
      },
      error: (error) => {
        console.error('Erro ao solicitar código:', error);
        console.error('Error status:', error.status);
        this.isLoading = false;
        
        let errorMessage = 'Erro ao solicitar código de recuperação.';
        
        // Tratar diferentes formatos de resposta de erro
        if (error.error) {
          // Se error.error é uma string
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          }
          // Se error.error é um objeto
          else if (typeof error.error === 'object') {
            if (error.error.error) {
              errorMessage = error.error.error;
            } else if (error.error.message) {
              errorMessage = error.error.message;
            }
          }
        }
        
        // Se a mensagem é muito técnica ou vazia, usar mensagens padrão
        if (errorMessage === 'Erro ao solicitar código de recuperação.' || 
            errorMessage.includes('Format specifier') ||
            errorMessage.trim() === '') {
          if (error.status === 400) {
            errorMessage = 'Email é obrigatório.';
          } else if (error.status === 401) {
            errorMessage = 'E-mail não encontrado no sistema.';
          } else if (error.status === 503) {
            errorMessage = 'Erro ao enviar e-mail. Tente novamente mais tarde.';
          } else {
            errorMessage = 'Erro ao solicitar código de recuperação. Tente novamente.';
          }
        }

        this.showMessage(errorMessage, 'error');
      }
    });
  }

  redefinirSenha(): void {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      
      if (this.resetPasswordForm.hasError('passwordMismatch')) {
        this.showMessage('As senhas não coincidem.', 'warning');
      }
      return;
    }

    this.isLoading = true;
    const email = this.emailForm.get('email')?.value?.trim();
    const recoveryCode = this.resetPasswordForm.get('recoveryCode')?.value?.trim();
    const newPassword = this.resetPasswordForm.get('newPassword')?.value?.trim();

    this.recoveryService.resetPassword(email, recoveryCode, newPassword).subscribe({
      next: (response) => {
        this.isLoading = false;
        const message = response || 'Senha redefinida com sucesso! Você já pode fazer login.';
        this.showMessage(message, 'success');
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Erro ao redefinir senha:', error);
        console.error('Error status:', error.status);
        this.isLoading = false;
        
        let errorMessage = 'Erro ao redefinir senha.';
        
        // Tratar diferentes formatos de resposta de erro
        if (error.error) {
          // Se error.error é uma string
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          }
          // Se error.error é um objeto
          else if (error.error.error) {
            errorMessage = error.error.error;
          } else if (error.error.message) {
            errorMessage = error.error.message;
          }
        }
        
        // Mensagens padrão por status se não houver mensagem específica
        if (errorMessage === 'Erro ao redefinir senha.') {
          if (error.status === 400) {
            errorMessage = 'Email, código de recuperação e nova senha são obrigatórios.';
          } else if (error.status === 403) {
            errorMessage = 'Código de recuperação inválido ou expirado. Solicite um novo código.';
          }
        }

        this.showMessage(errorMessage, 'error');
      }
    });
  }

  voltar(): void {
    if (this.step === 2) {
      this.step = 1;
      this.codeSent = false;
      this.resetPasswordForm.reset();
    } else {
      this.dialogRef.close();
    }
  }

  private showMessage(message: string, type: 'success' | 'error' | 'warning'): void {
    const panelClass = type === 'success' ? 'success-snackbar' :
                      type === 'error' ? 'error-snackbar' :
                      'warning-snackbar';

    this.snackBar.open(message, 'Fechar', {
      duration: type === 'error' ? 5000 : 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
}

