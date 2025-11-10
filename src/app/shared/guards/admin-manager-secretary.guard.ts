import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from '../api.service';

const ALLOWED_ROLES = ['ADMINISTRADOR', 'GERENTE', 'SECRETARIO'];

export const adminManagerSecretaryGuard: CanActivateFn = (route, state) => {
  const apiService = inject(ApiService);
  const router = inject(Router);

  if (!apiService.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Permitido se tiver qualquer uma das roles
  const hasAllowedRole = ALLOWED_ROLES.some(role => apiService.hasRole(role));
  if (hasAllowedRole) {
    return true;
  }

  // Caso authorities ainda não tenham sido carregadas, permite a navegação;
  // o backend fará a verificação definitiva
  const authorities = apiService.getAuthorities();
  if (!authorities || authorities.length === 0) {
    return true;
  }

  console.warn('Acesso negado: usuário não possui permissões necessárias');
  router.navigate(['/dashboard']);
  return false;
};


