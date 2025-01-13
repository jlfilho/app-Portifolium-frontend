import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from './api.service';



export const authGuard: CanActivateFn = (route, state) => {

  const apiService = inject(ApiService); // Injeta o serviço de autenticação
  const router = inject(Router); // Injeta o roteador

  if (apiService.isTokenValid()) {
    return true; // Permite o acesso à rota
  } else {
    apiService.logout(); // Realiza logout
    return router.createUrlTree(['/login']);
  }
};
