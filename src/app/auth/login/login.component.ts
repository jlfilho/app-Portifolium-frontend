import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ApiService } from './../../shared/api.service';
import { RecuperarSenhaDialogComponent } from '../components/recuperar-senha-dialog/recuperar-senha-dialog.component';

@Component({
  selector: 'acadmanage-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  sessionExpiredMessage: string = '';
  hidePassword: boolean = true;
  isLoading: boolean = false;
  currentYear: number = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Verificar se foi redirecionado por sessão expirada
    this.route.queryParams.subscribe(params => {
      if (params['reason'] === 'session-expired' || params['reason'] === 'token-expired') {
        this.sessionExpiredMessage = params['message'] ||
          '⏱️ Sua sessão expirou. Por favor, faça login novamente.';
        console.warn('⚠️ Usuário redirecionado: Sessão expirada');
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      const { username, password } = this.loginForm.value;

      this.isLoading = true;
      this.errorMessage = '';

      
      this.apiService.login(username, password).subscribe({
        next: () => {
                    this.router.navigate(['/admin']);
        },
        error: (err) => {
          console.error('❌ Erro no login:', err);
          this.isLoading = false;
          this.errorMessage = 'Login falhou. Verifique suas credenciais.';
        },
      });
    }
  }

  abrirRecuperarSenha(): void {
    const dialogRef = this.dialog.open(RecuperarSenhaDialogComponent, {
      width: '500px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe((senhaRedefinida) => {
      if (senhaRedefinida) {
        // Opcional: mostrar mensagem de sucesso ou limpar formulário
        this.errorMessage = '';
      }
    });
  }
}
