import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { AuthoritiesResponse } from '../features/usuarios/models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  private tokenSubject: BehaviorSubject<string | null>;
  public token: Observable<string | null>;
  private authoritiesSubject: BehaviorSubject<string[]>;
  public authorities: Observable<string[]>;

  constructor(private http: HttpClient) {
    const token = this.isLocalStorageAvailable() ? localStorage.getItem('token') : null;
    const authorities = this.isLocalStorageAvailable() ?
      JSON.parse(localStorage.getItem('authorities') || '[]') : [];

    this.tokenSubject = new BehaviorSubject<string | null>(token);
    this.token = this.tokenSubject.asObservable();

    this.authoritiesSubject = new BehaviorSubject<string[]>(authorities);
    this.authorities = this.authoritiesSubject.asObservable();
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
          console.log('Login efetuado com sucesso!, token: ', response.token);

          // Carregar authorities após login
          this.loadAuthorities();
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
    const authorities = this.authoritiesSubject.value;
    return authorities.includes(`ROLE_${role}`) || authorities.includes(role);
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
}
