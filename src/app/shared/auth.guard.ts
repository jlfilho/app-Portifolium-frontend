import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from './api.service';



export const authGuard: CanActivateFn = (route, state) => {

  const apiService = inject(ApiService); // Injeta o serviço de autenticação
  const router = inject(Router); // Injeta o roteador

  if (apiService.isLoggedIn()) {
    return true; // Permite o acesso à rota
  } else {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } }); // Redireciona para login
    return false;
  }
};
