import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ApiService } from '../api.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const apiService = inject(ApiService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Token expirado ou inválido
      if (error.status === 401) {
        console.warn('⚠️ Token expirado ou inválido (401 Unauthorized)');
        
        // Limpar dados de autenticação
        apiService.logout();

        // Redirecionar para login
        router.navigate(['/login'], {
          queryParams: {
            returnUrl: router.url,
            reason: 'session-expired'
          }
        });
      }

      // Token expirado ou sem permissão
      if (error.status === 403) {
        console.warn('⚠️ Acesso negado (403 Forbidden)');

        // Verificar se é erro de token expirado
        if (error.error?.message?.toLowerCase().includes('token') ||
            error.error?.message?.toLowerCase().includes('expired')) {
                    apiService.logout();
          router.navigate(['/login'], {
            queryParams: { reason: 'token-expired' }
          });
        }
      }

      return throwError(() => error);
    })
  );
};

