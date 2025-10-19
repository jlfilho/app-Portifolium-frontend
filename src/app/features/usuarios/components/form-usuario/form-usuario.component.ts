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
  usuarioOriginal?: Usuario; // Armazena dados originais do usuário

  roles = [
    { value: 'ROLE_ADMINISTRADOR', label: 'Administrador', icon: 'admin_panel_settings' },
    { value: 'ROLE_GERENTE', label: 'Gerente', icon: 'manage_accounts' },
    { value: 'ROLE_SECRETARIO', label: 'Secretário(a)', icon: 'assignment_ind' }
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

        // Tentar usar dados passados via navigation state primeiro
        const navigation = this.router.getCurrentNavigation();
        const usuarioFromState = navigation?.extras?.state?.['usuario'] ||
                                 window.history.state?.['usuario'];

        if (usuarioFromState) {
          console.log('📦 Usando dados do state (não faz nova requisição)');
          this.loadUsuarioFromData(usuarioFromState);
        } else {
          console.log('🌐 Carregando dados do servidor (GET /api/usuarios/' + this.usuarioId + ')');
          this.loadUsuario(this.usuarioId);
        }
      }
    });
  }

  initForm(): void {
    this.usuarioForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      senha: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]],
      role: ['ROLE_SECRETARIO', Validators.required]
    });
  }

  // Carregar dados de usuário passados via state (evita requisição)
  loadUsuarioFromData(usuario: Usuario): void {
    this.usuarioOriginal = usuario;

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

    console.log('✅ Dados carregados do state:', usuario);
  }

  // Carregar dados do servidor (fallback se não tiver no state)
  loadUsuario(id: number): void {
    this.isLoading = true;
    this.usuariosService.getUserById(id).subscribe({
      next: (usuario) => {
        console.log('✅ Dados carregados do servidor:', usuario);
        this.loadUsuarioFromData(usuario);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar usuário:', error);
        console.error('Status:', error.status);
        console.error('Mensagem:', error.error);

        let errorMessage = 'Erro ao carregar usuário. ';

        if (error.status === 500) {
          errorMessage += 'O endpoint GET /api/usuarios/{id} pode não estar implementado no backend. ';
          errorMessage += 'Use a listagem para editar usuários.';
        } else if (error.status === 404) {
          errorMessage += 'Usuário não encontrado.';
        } else if (error.status === 403) {
          errorMessage += 'Sem permissão para visualizar este usuário.';
        } else {
          errorMessage += 'Tente novamente pela listagem.';
        }

        this.showMessage(errorMessage, 'error');
        this.isLoading = false;

        // Redireciona de volta para listagem
        setTimeout(() => {
          this.router.navigate(['/usuarios']);
        }, 2000);
      }
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      this.isSaving = true;

      // Preparar payload de acordo com a API
      const formValues = this.usuarioForm.value;
      let usuarioData: any;

      if (this.isEditMode && this.usuarioOriginal) {
        // MODO EDIÇÃO: Estrutura conforme API
        usuarioData = {
          nome: formValues.nome.trim(),
          cpf: formValues.cpf.trim(),
          email: formValues.email.trim(),
          role: formValues.role,
          cursos: (this.usuarioOriginal.cursos || []).map(curso => ({ id: curso.id }))
        };

        // Adicionar senha apenas se foi preenchida
        if (formValues.senha && formValues.senha.trim() !== '') {
          usuarioData.senha = formValues.senha.trim();
        }
      } else {
        // MODO CRIAÇÃO: Estrutura conforme API (SEM campo id no usuário)
        usuarioData = {
          nome: formValues.nome.trim(),
          cpf: formValues.cpf.trim(),
          email: formValues.email.trim(),
          senha: formValues.senha.trim(),
          role: formValues.role,
          cursos: [] // Array vazio - cursos gerenciados depois
        };
      }

      console.log('=== PAYLOAD ENVIADO ===');
      console.log('Modo:', this.isEditMode ? 'EDIÇÃO' : 'CRIAÇÃO');
      console.log('Endpoint:', this.isEditMode ? `PUT /api/usuarios/${this.usuarioId}` : 'POST /api/usuarios');
      console.log('Payload:', JSON.stringify(usuarioData, null, 2));

      const operation = this.isEditMode && this.usuarioId
        ? this.usuariosService.updateUser(this.usuarioId, usuarioData)
        : this.usuariosService.createUser(usuarioData);

      operation.subscribe({
        next: (response) => {
          console.log('=== RESPOSTA DO SERVIDOR ===');
          console.log('Status: Sucesso');
          console.log('Response:', response);

          this.showMessage(
            this.isEditMode ? 'Usuário atualizado com sucesso!' : 'Usuário cadastrado com sucesso!',
            'success'
          );
          this.isSaving = false;
          this.router.navigate(['/usuarios']);
        },
        error: (error) => {
          console.error('=== ERRO AO SALVAR USUÁRIO ===');
          console.error('Status:', error.status);
          console.error('Error:', error);
          console.error('Error Message:', error.error);

          let errorMessage = 'Erro ao salvar usuário. ';

          // Priorizar mensagem do backend
          if (error.error?.message) {
            errorMessage += error.error.message;
          } else if (error.error && typeof error.error === 'string') {
            errorMessage += error.error;
          } else if (error.status === 400) {
            errorMessage += 'Dados inválidos. Verifique os campos.';
          } else if (error.status === 409) {
            errorMessage += 'CPF ou email já cadastrado.';
          } else if (error.status === 403) {
            errorMessage += 'Sem permissão para esta operação.';
          } else if (error.status === 500) {
            errorMessage += 'Erro no servidor. Tente novamente mais tarde.';
          } else {
            errorMessage += 'Tente novamente.';
          }

          this.showMessage(errorMessage, 'error');
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
      role: 'ROLE_SECRETARIO'
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
    const roleUpper = role.toUpperCase();
    if (roleUpper.includes('ADMINISTRADOR')) {
      return 'warn';
    } else if (roleUpper.includes('GERENTE')) {
      return 'primary';
    } else if (roleUpper.includes('SECRETARIO')) {
      return 'accent';
    }
    return '';
  }

  getRoleIcon(role: string): string {
    const roleUpper = role.toUpperCase();
    if (roleUpper.includes('ADMINISTRADOR')) {
      return 'admin_panel_settings';
    } else if (roleUpper.includes('GERENTE')) {
      return 'manage_accounts';
    } else if (roleUpper.includes('SECRETARIO')) {
      return 'assignment_ind';
    }
    return 'person';
  }

  // Getters
  get nome() { return this.usuarioForm.get('nome'); }
  get email() { return this.usuarioForm.get('email'); }
  get cpf() { return this.usuarioForm.get('cpf'); }
  get senha() { return this.usuarioForm.get('senha'); }
  get role() { return this.usuarioForm.get('role'); }
}
