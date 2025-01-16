
import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';

import { ApiService } from './api.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(ApiService);
  const router = inject(Router);

  const token = authService.getToken();

  if (token && authService.isTokenValid()) {
    // Clonar a requisição e adicionar o cabeçalho Authorization
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(clonedRequest); // Passar a requisição modificada para o próximo handler
  }

  if (!authService.isTokenValid()) {
    // Se o token estiver ausente ou inválido, redirecionar para login
    authService.logout();
    router.navigate(['/login']);
  }

  return next(req); // Passar a requisição original para o próximo handler
};
