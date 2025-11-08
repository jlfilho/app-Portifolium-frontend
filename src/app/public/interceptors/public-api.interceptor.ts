import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor para APIs públicas que não requerem autenticação
 * Este interceptor não adiciona tokens de autenticação
 */
export const publicApiInterceptor: HttpInterceptorFn = (req, next) => {
  // Para APIs públicas, apenas passa a requisição sem modificações
  return next(req);
};

