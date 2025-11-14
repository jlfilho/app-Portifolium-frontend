import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
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
   * GET /api/usuarios (com paginação e filtro por nome)
   * Buscar usuários paginados (ADMINISTRADOR, GERENTE, SECRETARIO)
   * @param pageRequest - Parâmetros de paginação
   * @param nome - Filtro por nome (opcional, case insensitive)
   * @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('GERENTE') or hasRole('SECRETARIO')")
   */
  getAllUsersPaginado(pageRequest: PageRequest, nome?: string): Observable<Page<Usuario>> {
    let params = new HttpParams()
      .set('page', pageRequest.page.toString())
      .set('size', pageRequest.size.toString())
      .set('sortBy', pageRequest.sortBy)
      .set('direction', pageRequest.direction);

    // Adicionar filtro por nome se fornecido
    if (nome && nome.trim()) {
      params = params.set('nome', nome.trim());
    }

    console.log('📡 UsuariosService - Fazendo requisição para:', `${this.baseUrl}/usuarios`);
    console.log('📡 UsuariosService - Parâmetros:', params.toString());

    return this.http.get<Page<Usuario>>(`${this.baseUrl}/usuarios`, {
      params
    }).pipe(
      tap((response: Page<Usuario>) => {
        console.log('📡 UsuariosService - Resposta recebida:', response);
      }),
      map((response: Page<Usuario>) => {
        // Se a resposta está vazia, retornar página vazia estruturada
        if (!response || !response.content || response.content.length === 0) {
          return {
            content: [],
            totalElements: 0,
            totalPages: 0,
            size: pageRequest.size,
            number: pageRequest.page,
            first: true,
            last: true,
            empty: true,
            pageable: {
              pageNumber: pageRequest.page,
              pageSize: pageRequest.size,
              sort: {
                sorted: false,
                unsorted: true,
                empty: true
              },
              offset: pageRequest.page * pageRequest.size,
              paged: true,
              unpaged: false
            },
            sort: {
              sorted: false,
              unsorted: true,
              empty: true
            },
            numberOfElements: 0
          } as Page<Usuario>;
        }
        return response;
      })
    );
  }

  /**
   * GET /api/usuarios/{id}
   * Buscar usuário por ID
   */
  getUserById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/usuarios/${id}`);
  }

  /**
   * GET /api/usuarios/email?email=...
   * Buscar usuário pelo e-mail
   */
  getUserByEmail(email: string): Observable<Usuario> {
    const params = new HttpParams().set('email', email);
    return this.http.get<Usuario>(`${this.baseUrl}/usuarios/email`, { params });
  }

  /**
   * POST /api/usuarios
   * Criar novo usuário
   */
  createUser(userData: Partial<Usuario>): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.baseUrl}/usuarios`, userData);
  }

  criarUsuarioParaPessoa(request: {
    pessoaId: number;
    email: string;
    senha: string;
    role: string;
    cursosIds?: number[];
  }): Observable<Usuario> {
    const payload = {
      pessoaId: request.pessoaId,
      email: request.email,
      senha: request.senha,
      role: request.role,
      cursosIds: request.cursosIds ?? []
    };
    return this.http.post<Usuario>(`${this.baseUrl}/usuarios/pessoa`, payload);
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
