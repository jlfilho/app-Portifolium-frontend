import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from '../api.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const apiService = inject(ApiService);
  const router = inject(Router);

  // Verificar se está logado
  if (!apiService.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Verificar se é administrador
  // O backend também valida com @PreAuthorize("hasRole('ADMINISTRADOR')")
  // Esta é uma validação adicional no frontend para melhor UX

  if (apiService.isAdmin()) {
    return true;
  }

  // Se não tiver authorities carregadas ainda, permitir
  // O backend irá bloquear se não for admin
  const authorities = apiService.getAuthorities();
  if (authorities.length === 0) {
    return true; // Backend fará a validação final
  }

  // Não é admin, redirecionar
  console.warn('Acesso negado: Usuário não é ADMINISTRADOR');
  router.navigate(['/dashboard']);
  return false;
};

