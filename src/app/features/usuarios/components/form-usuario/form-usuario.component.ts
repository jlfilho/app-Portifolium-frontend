import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';

// Services e Models
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario, UserRole } from '../../models/usuario.model';

@Component({
  selector: 'acadmanage-form-usuario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatChipsModule
  ],
  templateUrl: './form-usuario.component.html',
  styleUrl: './form-usuario.component.css'
})
export class FormUsuarioComponent implements OnInit {
  usuarioForm!: FormGroup;
  isEditMode = false;
  usuarioId?: number;
  isLoading = false;
  isSaving = false;

  roles = [
    { value: 'ADMINISTRADOR', label: 'Administrador', icon: 'admin_panel_settings' },
    { value: 'PROFESSOR', label: 'Professor', icon: 'school' },
    { value: 'ALUNO', label: 'Aluno', icon: 'person' }
  ];

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.usuarioId = +params['id'];
        this.loadUsuario(this.usuarioId);
      }
    });
  }

  initForm(): void {
    this.usuarioForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      senha: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]],
      role: ['ALUNO', Validators.required]
    });
  }

  loadUsuario(id: number): void {
    this.isLoading = true;
    this.usuariosService.getUserById(id).subscribe({
      next: (usuario) => {
        this.usuarioForm.patchValue({
          nome: usuario.nome,
          email: usuario.email,
          cpf: usuario.cpf,
          role: usuario.role
        });
        // Em modo de edição, senha não é obrigatória
        this.usuarioForm.get('senha')?.clearValidators();
        this.usuarioForm.get('senha')?.setValidators([Validators.minLength(6)]);
        this.usuarioForm.get('senha')?.updateValueAndValidity();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar usuário:', error);
        this.showMessage('Erro ao carregar usuário', 'error');
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      this.isSaving = true;
      const usuarioData: Partial<Usuario> = this.usuarioForm.value;

      // Se a senha estiver vazia em modo de edição, não enviar
      if (this.isEditMode && !usuarioData.senha) {
        delete usuarioData.senha;
      }

      const operation = this.isEditMode && this.usuarioId
        ? this.usuariosService.updateUser(this.usuarioId, usuarioData)
        : this.usuariosService.createUser(usuarioData);

      operation.subscribe({
        next: () => {
          this.showMessage(
            this.isEditMode ? 'Usuário atualizado com sucesso!' : 'Usuário cadastrado com sucesso!',
            'success'
          );
          this.isSaving = false;
          this.router.navigate(['/usuarios']);
        },
        error: (error) => {
          console.error('Erro ao salvar usuário:', error);
          this.showMessage('Erro ao salvar usuário. Tente novamente.', 'error');
          this.isSaving = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.usuarioForm);
      this.showMessage('Por favor, preencha todos os campos obrigatórios.', 'warning');
    }
  }

  onCancel(): void {
    this.router.navigate(['/usuarios']);
  }

  onReset(): void {
    this.usuarioForm.reset({
      role: 'ALUNO'
    });
  }

  // Máscara de CPF
  onCpfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }

    input.value = value;
    this.usuarioForm.get('cpf')?.setValue(value);
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

  getRoleColor(role: string): string {
    switch (role.toUpperCase()) {
      case 'ADMINISTRADOR':
        return 'warn';
      case 'PROFESSOR':
        return 'primary';
      case 'ALUNO':
        return 'accent';
      default:
        return '';
    }
  }

  getRoleIcon(role: string): string {
    switch (role.toUpperCase()) {
      case 'ADMINISTRADOR':
        return 'admin_panel_settings';
      case 'PROFESSOR':
        return 'school';
      case 'ALUNO':
        return 'person';
      default:
        return 'person';
    }
  }

  // Getters
  get nome() { return this.usuarioForm.get('nome'); }
  get email() { return this.usuarioForm.get('email'); }
  get cpf() { return this.usuarioForm.get('cpf'); }
  get senha() { return this.usuarioForm.get('senha'); }
  get role() { return this.usuarioForm.get('role'); }
}
