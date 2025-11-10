import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { AuthoritiesResponse } from '../features/usuarios/models/usuario.model';
import { isTokenExpired, getTokenExpirationTime, decodeToken, JwtPayload } from './utils/jwt.helper';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  private tokenSubject: BehaviorSubject<string | null>;
  public token: Observable<string | null>;
  private authoritiesSubject: BehaviorSubject<string[]>;
  public authorities: Observable<string[]>;

  constructor(private http: HttpClient, private router: Router) {
    const token = this.isLocalStorageAvailable() ? localStorage.getItem('token') : null;
    const authorities = this.isLocalStorageAvailable() ?
      JSON.parse(localStorage.getItem('authorities') || '[]') : [];

    this.tokenSubject = new BehaviorSubject<string | null>(token);
    this.token = this.tokenSubject.asObservable();

    this.authoritiesSubject = new BehaviorSubject<string[]>(authorities);
    this.authorities = this.authoritiesSubject.asObservable();

    // Verificar se token inicial está expirado
    if (token && isTokenExpired(token)) {
      console.warn('⚠️ Token expirado detectado ao inicializar');
      this.logout();
      this.router.navigate(['/login'], {
        queryParams: { reason: 'session-expired' }
      });
    } else if (token) {
      // Iniciar verificação periódica de expiração
      this.startTokenExpirationCheck();
    }
  }

  private isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  login(username: string, password: string): Observable<any> {
    console.log('Tentando fazer login com: ', username, password);
    return this.http.post<any>(`${this.baseUrl}/auth/login`, { username, password }).pipe(
      tap((response) => {
        if (response?.token) {
          localStorage.setItem('token', response.token);
          this.tokenSubject.next(response.token);
          console.log('✅ Login efetuado com sucesso!');

          // Verificar expiração do token
          const expiresIn = getTokenExpirationTime(response.token);
          console.log(`⏱️ Token expira em: ${Math.floor(expiresIn / 60)} minutos`);

          // Carregar authorities após login
          this.loadAuthorities();

          // Iniciar verificação periódica de expiração
          this.startTokenExpirationCheck();
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('authorities');
    this.tokenSubject.next(null);
    this.authoritiesSubject.next([]);
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.tokenSubject.value;
  }

  /**
   * Carregar authorities do usuário logado
   * GET /api/usuarios/checkAuthorities
   */
  loadAuthorities(): void {
    this.http.get<AuthoritiesResponse>(`${this.baseUrl}/usuarios/checkAuthorities`).subscribe({
      next: (response) => {
        const authorities = response.authorities || [];
        if (this.isLocalStorageAvailable()) {
          localStorage.setItem('authorities', JSON.stringify(authorities));
        }
        this.authoritiesSubject.next(authorities);
      },
      error: (error) => {
        console.error('Erro ao carregar authorities:', error);
      }
    });
  }

  /**
   * Verificar se o usuário tem uma role específica
   */
  hasRole(role: string): boolean {
    return this.hasAnyRole([role]);
  }

  hasAnyRole(roles: string[]): boolean {
    const normalized = roles.map(role => role.startsWith('ROLE_') ? role : `ROLE_${role}`);
    const authorities = this.authoritiesSubject.value || [];
    if (authorities.some(auth => normalized.includes(auth))) {
      return true;
    }

    const userInfo = this.getUserInfoFromToken();
    const tokenAuthorities = userInfo?.authorities || [];
    return tokenAuthorities.some(auth => {
      if (!auth) {
        return false;
      }
      const formatted = auth.startsWith('ROLE_') ? auth : `ROLE_${auth}`;
      return normalized.includes(auth) || normalized.includes(formatted);
    });
  }

  /**
   * Verificar se o usuário é administrador
   */
  isAdmin(): boolean {
    return this.hasRole('ADMINISTRADOR');
  }

  /**
   * Obter authorities atuais
   */
  getAuthorities(): string[] {
    return this.authoritiesSubject.value;
  }

  /**
   * Verificar periodicamente se o token expirou
   * Executa a cada 60 segundos
   */
  private startTokenExpirationCheck(): void {
    // Verifica a cada 60 segundos (1 minuto)
    interval(60000).subscribe(() => {
      const token = this.getToken();

      if (token && isTokenExpired(token)) {
        console.warn('⚠️ Token expirado detectado na verificação periódica');
        console.log('🚪 Efetuando logout automático...');

        this.logout();
        this.router.navigate(['/login'], {
          queryParams: {
            reason: 'session-expired',
            message: 'Sua sessão expirou. Por favor, faça login novamente.'
          }
        });
      }
    });
  }

  /**
   * Verificar se o token atual está expirado
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    return isTokenExpired(token);
  }

  /**
   * Obter tempo restante até expiração (em segundos)
   */
  getTokenTimeLeft(): number {
    const token = this.getToken();
    if (!token) return 0;
    return getTokenExpirationTime(token);
  }

  /**
   * Obter informações do usuário do token JWT
   * Retorna: { username: string, email: string, authorities: string[], name?: string }
   */
  getUserInfoFromToken(): { id?: number; pessoaId?: number; username: string; email: string; authorities: string[]; name?: string } | null {
    const token = this.getToken();
    if (!token) {
      console.warn('⚠️ Nenhum token encontrado');
      return null;
    }

    const decoded = decodeToken(token);
    if (!decoded) {
      console.error('❌ Erro ao decodificar token');
      return null;
    }

    console.log('🔍 Token decodificado:', decoded);

    // Extrair informações do token
    // O "sub" geralmente contém o username/email
    const username = decoded.sub || '';
    const email = decoded['email'] || decoded.sub || '';
    const authorities = decoded.authorities || this.getAuthorities();
    const name = decoded['name'] || decoded['nome'] || decoded['nomeCompleto'] || decoded['fullName'] || decoded['given_name'] || '';
    const rawId = decoded['id'] ?? decoded['userId'] ?? decoded['usuarioId'];
    const rawPessoaId = decoded['pessoaId'] ?? decoded['idPessoa'] ?? decoded['pessoa'];
    const parsedId = rawId !== undefined ? Number(rawId) : undefined;
    const parsedPessoaId = rawPessoaId !== undefined ? Number(rawPessoaId) : undefined;
    const id = typeof parsedId === 'number' && !Number.isNaN(parsedId) ? parsedId : undefined;
    const pessoaId = typeof parsedPessoaId === 'number' && !Number.isNaN(parsedPessoaId) ? parsedPessoaId : undefined;

    return {
      id,
      pessoaId,
      username,
      email,
      authorities,
      name
    };
  }

  /**
   * Obter nome do usuário do token (se disponível)
   */
  getUserName(): string {
    const userInfo = this.getUserInfoFromToken();
    if (!userInfo) return 'Usuário';

    // Priorizar o nome, senão username, senão email
    return userInfo.name || userInfo.username || userInfo.email || 'Usuário';
  }

  /**
   * Obter email do usuário do token
   */
  getUserEmail(): string {
    const userInfo = this.getUserInfoFromToken();
    if (!userInfo) return '';

    return userInfo.email || userInfo.username || '';
  }
}
