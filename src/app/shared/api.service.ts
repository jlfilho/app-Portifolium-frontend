import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api'; // Endpoint de login
  private tokenSubject: BehaviorSubject<string | null>;
  public token: Observable<string | null>;

  constructor(private http: HttpClient, private router: Router) {
    const token = this.isLocalStorageAvailable() ? localStorage.getItem('token') : null;
    this.tokenSubject = new BehaviorSubject<string | null>(token);
    this.token = this.tokenSubject.asObservable();
  }

  private isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  login(username: string, password: string): Observable<any> {
    console.log('Tentando fazer login com 2 : ', username, password);
    return this.http.post<any>(`${this.baseUrl}/auth/login`, { username, password }).pipe(
      tap((response) => {
        if (response?.token) {
          localStorage.setItem('token', response.token);
          this.tokenSubject.next(response.token);
          console.log('Login efetuado com sucesso!, token: ', response.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
    this.router.navigate(['/login']);
  }


  getToken(): string | null {
    return this.tokenSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.tokenSubject.value;
  }


  // Decodifica e valida o token
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) {
      return false; // Sem token, não é válido
    }

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // Tempo atual em segundos
      return decoded.exp > currentTime; // Verifica se o token ainda não expirou
    } catch (error) {
      return false; // Se a decodificação falhar, o token é inválido
    }
  }

}
