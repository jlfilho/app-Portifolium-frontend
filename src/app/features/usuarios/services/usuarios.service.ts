import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Usuario, ChangePasswordRequest, AuthoritiesResponse } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * GET /api/usuarios
   * Buscar todos os usuários (apenas ADMINISTRADOR)
   * @PreAuthorize("hasRole('ADMINISTRADOR')")
   */
  getAllUsers(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/usuarios`);
  }

  /**
   * GET /api/usuarios/{id}
   * Buscar usuário por ID
   */
  getUserById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/usuarios/${id}`);
  }

  /**
   * POST /api/usuarios
   * Criar novo usuário
   */
  createUser(userData: Partial<Usuario>): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.baseUrl}/usuarios`, userData);
  }

  /**
   * PUT /api/usuarios/{usuarioId}
   * Atualizar usuário
   * Request: { id, nome, cpf, email, senha?, role, cursos }
   */
  updateUser(usuarioId: number, userData: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/usuarios/${usuarioId}`, userData);
  }

  /**
   * DELETE /api/usuarios/{usuarioId}
   * Deletar usuário
   */
  deleteUser(usuarioId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/usuarios/${usuarioId}`);
  }

  /**
   * PUT /api/usuarios/{usuarioId}/change-password
   * Alterar senha do usuário
   * Request: { currentPassword, newPassword }
   */
  changePassword(usuarioId: number, passwordData: ChangePasswordRequest): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/usuarios/${usuarioId}/change-password`, passwordData);
  }

  /**
   * GET /api/usuarios/checkAuthorities
   * Verificar autoridades/permissões do usuário logado
   * Response: { username, authorities: [] }
   */
  checkAuthorities(): Observable<AuthoritiesResponse> {
    return this.http.get<AuthoritiesResponse>(`${this.baseUrl}/usuarios/checkAuthorities`);
  }
}
