import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Usuario, ChangePasswordRequest, ChangePasswordResponse, AuthoritiesResponse } from '../models/usuario.model';
import { Page, PageRequest } from '../../../shared/models/page.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * GET /api/usuarios
   * Buscar todos os usuários (apenas ADMINISTRADOR) - SEM paginação
   * @PreAuthorize("hasRole('ADMINISTRADOR')")
   * @deprecated Use getAllUsersPaginado() para melhor performance
   */
  getAllUsers(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/usuarios`);
  }

  /**
   * GET /api/usuarios (com paginação)
   * Buscar usuários paginados (apenas ADMINISTRADOR)
   * @param pageRequest - Parâmetros de paginação
   * @PreAuthorize("hasRole('ADMINISTRADOR')")
   */
  getAllUsersPaginado(pageRequest: PageRequest): Observable<Page<Usuario>> {
    let params = new HttpParams()
      .set('page', pageRequest.page.toString())
      .set('size', pageRequest.size.toString())
      .set('sortBy', pageRequest.sortBy)
      .set('direction', pageRequest.direction);

    return this.http.get<Page<Usuario>>(`${this.baseUrl}/usuarios`, { params });
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
   * Response: { message: string, usuarioId: string }
   */
  changePassword(usuarioId: number, passwordData: ChangePasswordRequest): Observable<ChangePasswordResponse> {
    return this.http.put<ChangePasswordResponse>(
      `${this.baseUrl}/usuarios/${usuarioId}/change-password`,
      passwordData
    );
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
