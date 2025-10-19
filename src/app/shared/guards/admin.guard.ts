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
  // Nota: O backend já valida com @PreAuthorize("hasRole('ADMINISTRADOR')")
  // Aqui fazemos uma verificação adicional no frontend
  
  // TODO: Implementar método getUserRole() no ApiService
  // Por enquanto, permitir acesso pois o backend já protege
  
  return true;
};

