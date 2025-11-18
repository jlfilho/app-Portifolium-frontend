import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { UsuariosService } from '../../../features/usuarios/services/usuarios.service';
import { Usuario } from '../../../features/usuarios/models/usuario.model';
import { ChangePasswordDialogComponent, ChangePasswordDialogData } from '../change-password-dialog/change-password-dialog.component';

export interface EditarPerfilDialogData {
  usuario: Usuario;
}

@Component({
  selector: 'app-editar-perfil-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  templateUrl: './editar-perfil-dialog.component.html',
  styleUrl: './editar-perfil-dialog.component.css'
})
export class EditarPerfilDialogComponent implements OnInit {
  perfilForm!: FormGroup;
  isSaving = false;
  usuarioOriginal: Usuario;

  constructor(
    public dialogRef: MatDialogRef<EditarPerfilDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditarPerfilDialogData,
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.usuarioOriginal = data.usuario;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    // Inicializar CPF formatado se existir
    const cpfOriginal = this.usuarioOriginal.cpf || '';
    const cpfFormatado = cpfOriginal ? this.formatarCPF(cpfOriginal.replace(/\D/g, '')) : '';

    this.perfilForm = this.fb.group({
      nome: [this.usuarioOriginal.nome || '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      cpf: [cpfFormatado, [
        Validators.required,
        Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
      ]],
      email: [this.usuarioOriginal.email || '', [
        Validators.required,
        Validators.email
      ]]
    });
  }

  formatarCPF(cpf: string): string {
    if (!cpf) return '';
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length === 0) return '';
    if (cpfLimpo.length <= 3) return cpfLimpo;
    if (cpfLimpo.length <= 6) return cpfLimpo.replace(/(\d{3})(\d+)/, '$1.$2');
    if (cpfLimpo.length <= 9) return cpfLimpo.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    if (cpfLimpo.length <= 11) return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    
    // Se tiver mais de 11 dígitos, limita a 11
    return cpfLimpo.substring(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  onCPFInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    // Limitar a 11 dígitos
    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    // Aplicar máscara progressivamente
    let cpfFormatado = '';
    if (value.length > 9) {
      cpfFormatado = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      cpfFormatado = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (value.length > 3) {
      cpfFormatado = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    } else {
      cpfFormatado = value;
    }

    // Atualizar o valor do input e do form control
    input.value = cpfFormatado;
    this.perfilForm.get('cpf')?.setValue(cpfFormatado, { emitEvent: false });
  }

  onCPFBlur(): void {
    const cpfControl = this.perfilForm.get('cpf');
    if (cpfControl && cpfControl.value) {
      const cpfLimpo = cpfControl.value.replace(/\D/g, '');
      if (cpfLimpo.length === 11) {
        const cpfFormatado = this.formatarCPF(cpfLimpo);
        cpfControl.setValue(cpfFormatado);
      }
    }
  }

  abrirTrocaSenha(): void {
    if (!this.usuarioOriginal) return;

    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '500px',
      data: {
        usuarioId: this.usuarioOriginal.id,
        usuarioNome: this.usuarioOriginal.nome
      } as ChangePasswordDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showMessage('Senha alterada com sucesso!', 'success');
      }
    });
  }

  onSubmit(): void {
    if (this.perfilForm.valid) {
      this.isSaving = true;

      const formValue = this.perfilForm.value;
      // CPF já vem formatado do formulário, apenas garantir que está correto
      const cpfFormatado = formValue.cpf || this.formatarCPF(formValue.cpf.replace(/\D/g, ''));

      // Preparar payload conforme esperado pela API
      // Cursos devem ser enviados como array de objetos com apenas id
      const cursosIds = (this.usuarioOriginal.cursos || []).map(curso => ({ id: curso.id }));

      const dadosAtualizados: any = {
        nome: formValue.nome.trim(),
        cpf: cpfFormatado,
        email: formValue.email.trim(),
        role: this.usuarioOriginal.role,
        cursos: cursosIds
      };

      console.log('📝 Atualizando perfil do usuário:', dadosAtualizados);
      console.log('📝 Payload JSON:', JSON.stringify(dadosAtualizados, null, 2));

      this.usuariosService.updateUser(this.usuarioOriginal.id, dadosAtualizados).subscribe({
        next: (usuarioAtualizado) => {
          console.log('✅ Perfil atualizado com sucesso:', usuarioAtualizado);
          this.showMessage('Perfil atualizado com sucesso!', 'success');
          this.isSaving = false;
          this.dialogRef.close(usuarioAtualizado);
        },
        error: (error) => {
          console.error('❌ Erro ao atualizar perfil:', error);
          console.error('❌ Status:', error.status);
          console.error('❌ Error body:', error.error);
          
          let errorMessage = '';

          // Extrair mensagem do backend (pode estar em error.error.error, error.error.message, ou error.error)
          if (error.error?.error) {
            errorMessage = error.error.error;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.status === 400) {
            // Tentar extrair mensagens de validação do backend
            if (error.error?.errors) {
              const validationErrors = Object.values(error.error.errors).flat();
              errorMessage = validationErrors.join(', ');
            } else {
              errorMessage = 'Dados inválidos. Verifique os campos e tente novamente.';
            }
          } else if (error.status === 403) {
            // 403 pode ser por falta de permissão ou validação de negócio (ex: CPF já cadastrado)
            if (error.error?.error) {
              errorMessage = error.error.error;
            } else if (error.error?.message) {
              errorMessage = error.error.message;
            } else {
              errorMessage = 'Acesso negado. Você não tem permissão para realizar esta operação.';
            }
          } else if (error.status === 409) {
            errorMessage = 'Email ou CPF já cadastrado.';
          } else {
            errorMessage = 'Erro ao atualizar perfil. Tente novamente mais tarde.';
          }

          this.showMessage(errorMessage || 'Erro ao atualizar perfil.', 'error');
          this.isSaving = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.perfilForm);
      this.showMessage('Por favor, preencha todos os campos corretamente.', 'warning');
    }
  }

  onCancel(): void {
    this.dialogRef.close();
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

  get nome() { return this.perfilForm.get('nome'); }
  get cpf() { return this.perfilForm.get('cpf'); }
  get email() { return this.perfilForm.get('email'); }
}

