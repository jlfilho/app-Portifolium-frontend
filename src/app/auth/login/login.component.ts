import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ApiService } from './../../shared/api.service';

@Component({
  selector: 'acadmanage-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
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
    private route: ActivatedRoute
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

      console.log('🔐 Tentando fazer login com:', username);

      this.apiService.login(username, password).subscribe({
        next: () => {
          console.log('✅ Login bem-sucedido, redirecionando...');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('❌ Erro no login:', err);
          this.isLoading = false;
          this.errorMessage = 'Login falhou. Verifique suas credenciais.';
        },
      });
    }
  }




}
