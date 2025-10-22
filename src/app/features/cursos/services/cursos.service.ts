import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';
import { Page, PageRequest } from '../../../shared/models/page.model';

@Injectable({
  providedIn: 'root'
})
export class CursosService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * GET /cursos/usuarios (sem paginação)
   * Buscar cursos do usuário autenticado
   * @deprecated Use getUserCoursesPaginado() para melhor performance e filtros
   */
  getUserCourses(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/cursos/usuarios`);
  }

  /**
   * GET /cursos/usuarios (com paginação e filtros)
   * Buscar cursos do usuário autenticado com paginação e filtros
   * @param pageRequest - Parâmetros de paginação (page, size, sortBy, direction)
   * @param ativo - Filtro por status ativo/inativo (opcional)
   * @param nome - Filtro por nome do curso (opcional)
   * @returns Page<CursoDTO>
   *
   * Backend:
   * @GetMapping("/usuarios")
   * @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('GERENTE') or hasRole('SECRETARIO')")
   * public ResponseEntity<Page<CursoDTO>> getCursosByUsuarioId(
   *   @AuthenticationPrincipal Usuario userDetails,
   *   @RequestParam(required = false) Boolean ativo,
   *   @RequestParam(required = false) String nome,
   *   @PageableDefault(size = 10, sort = "nome") Pageable pageable
   * )
   */
  getUserCoursesPaginado(
    pageRequest: PageRequest,
    ativo?: boolean | null,
    nome?: string
  ): Observable<Page<any>> {
    let params = new HttpParams()
      .set('page', pageRequest.page.toString())
      .set('size', pageRequest.size.toString())
      .set('sort', `${pageRequest.sortBy},${pageRequest.direction.toLowerCase()}`);

    // Adicionar filtros opcionais
    if (ativo !== null && ativo !== undefined) {
      params = params.set('ativo', ativo.toString());
    }

    if (nome && nome.trim()) {
      params = params.set('nome', nome.trim());
    }

    console.log('📡 Buscando cursos do usuário (paginado):', {
      page: pageRequest.page,
      size: pageRequest.size,
      sort: `${pageRequest.sortBy},${pageRequest.direction}`,
      ativo: ativo !== null && ativo !== undefined ? ativo : 'todos',
      nome: nome || 'sem filtro'
    });

    return this.http.get<Page<any>>(`${this.baseUrl}/cursos/usuarios`, {
      params,
      observe: 'response' // Observar resposta completa para capturar 204
    }).pipe(
      tap((response: any) => {
        // Se 204 No Content, response.body será null
        if (response.status === 204) {
          console.log('📭 Backend retornou 204 No Content (sem cursos)');
        }
      }),
      // Extrair apenas o body da resposta
      map((response: any) => {
        // Se 204, retornar página vazia
        if (response.status === 204 || !response.body) {
          return {
            content: [],
            totalElements: 0,
            totalPages: 0,
            size: pageRequest.size,
            number: pageRequest.page,
            first: true,
            last: true,
            empty: true
          };
        }
        return response.body;
      })
    );
  }

  /**
   * GET /cursos (com paginação e filtros)
   * Buscar todos os cursos com paginação e filtros
   * @param pageRequest - Parâmetros de paginação (page, size, sortBy, direction)
   * @param ativo - Filtro por status ativo/inativo (opcional)
   * @param nome - Filtro por nome do curso (opcional)
   * @returns Page<CursoDTO>
   *
   * Backend:
   * @GetMapping
   * public ResponseEntity<Page<CursoDTO>> buscarTodosCursos(
   *   @RequestParam(required = false) Boolean ativo,
   *   @RequestParam(required = false) String nome,
   *   @PageableDefault(size = 10, sort = "nome") Pageable pageable
   * )
   */
  getAllCoursesPaginado(
    pageRequest: PageRequest,
    ativo?: boolean | null,
    nome?: string
  ): Observable<Page<any>> {
    let params = new HttpParams()
      .set('page', pageRequest.page.toString())
      .set('size', pageRequest.size.toString())
      .set('sort', `${pageRequest.sortBy},${pageRequest.direction.toLowerCase()}`);

    // Adicionar filtros opcionais
    if (ativo !== null && ativo !== undefined) {
      params = params.set('ativo', ativo.toString());
    }

    if (nome && nome.trim()) {
      params = params.set('nome', nome.trim());
    }

    console.log('📡 Buscando todos os cursos (paginado):', {
      page: pageRequest.page,
      size: pageRequest.size,
      sort: `${pageRequest.sortBy},${pageRequest.direction}`,
      ativo: ativo !== null && ativo !== undefined ? ativo : 'todos',
      nome: nome || 'sem filtro'
    });

    return this.http.get<Page<any>>(`${this.baseUrl}/cursos`, { params }).pipe(
      tap((response: any) => {
        console.log('✅ Cursos carregados:', response?.content?.length || 0);
      }),
      map((response: any) => {
        // Garantir que sempre retorna uma estrutura válida
        if (!response) {
          return {
            content: [],
            totalElements: 0,
            totalPages: 0,
            size: pageRequest.size,
            number: pageRequest.page,
            first: true,
            last: true,
            empty: true
          };
        }
        return response;
      })
    );
  }

  /**
   * GET /cursos/{id}
   * Buscar um curso específico por ID
   * @param id - ID do curso
   * @returns Observable<CursoDTO>
   */
  getCourseById(id: number): Observable<any> {
    console.log('📡 Buscando curso ID:', id);
    return this.http.get<any>(`${this.baseUrl}/cursos/${id}`).pipe(
      tap(curso => {
        console.log('✅ Curso encontrado:', curso);
      })
    );
  }

  createCourse(courseData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/cursos`, courseData);
  }

  /**
   * GET /categorias
   * Buscar todas as categorias - SEM paginação
   * @deprecated Use getAllCategoriesPaginado() para melhor performance
   */
  getAllCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categorias`);
  }

  /**
   * GET /categorias (com paginação)
   * Buscar categorias paginadas
   * @param pageRequest - Parâmetros de paginação
   */
  getAllCategoriesPaginado(pageRequest: PageRequest): Observable<Page<any>> {
    let params = new HttpParams()
      .set('page', pageRequest.page.toString())
      .set('size', pageRequest.size.toString())
      .set('sortBy', pageRequest.sortBy)
      .set('direction', pageRequest.direction);

    return this.http.get<Page<any>>(`${this.baseUrl}/categorias`, { params });
  }

  updateCourse(id: number, courseData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/cursos/${id}`, courseData);
  }

  /**
   * DELETE /cursos/{cursoId}
   * Excluir um curso
   * @PreAuthorize("hasRole('ADMINISTRADOR')")
   * Retorna: 204 No Content
   */
  deleteCourse(id: number): Observable<any> {
    console.log('🗑️ Service: Excluindo curso ID:', id);
    console.log('📡 URL:', `${this.baseUrl}/cursos/${id}`);
    return this.http.delete(`${this.baseUrl}/cursos/${id}`);
  }

  /**
   * PUT /cursos/{cursoId}/status
   * Atualizar status (ativo/inativo) de um curso
   * @PreAuthorize("hasRole('ADMINISTRADOR')")
   * Body: { ativo: boolean }
   */
  updateCourseStatus(id: number, ativo: boolean): Observable<any> {
    console.log('🔄 Atualizando status do curso:', id, 'Ativo:', ativo);
    return this.http.put(`${this.baseUrl}/cursos/${id}/status`, { ativo });
  }

  /**
   * GET /cursos/permissoes/{cursoId}
   * Buscar usuários com acesso ao curso e suas permissões
   * @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('GERENTE') or hasRole('SECRETARIO')")
   * Retorna: List<PermissaoCursoDTO>
   */
  getCoursePermissions(cursoId: number): Observable<any[]> {
    console.log('👥 Buscando permissões do curso ID:', cursoId);
    console.log('📡 URL:', `${this.baseUrl}/cursos/permissoes/${cursoId}`);
    return this.http.get<any[]>(`${this.baseUrl}/cursos/permissoes/${cursoId}`);
  }

  /**
   * PUT /cursos/{cursoId}/usuarios/{usuarioId}
   * Adicionar usuário a um curso
   * @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('GERENTE')")
   * Retorna: List<PermissaoCursoDTO>
   */
  addUserToCourse(cursoId: number, usuarioId: number): Observable<any[]> {
    console.log('➕ Adicionando usuário ao curso:', { cursoId, usuarioId });
    console.log('📡 URL:', `${this.baseUrl}/cursos/${cursoId}/usuarios/${usuarioId}`);
    return this.http.put<any[]>(`${this.baseUrl}/cursos/${cursoId}/usuarios/${usuarioId}`, {});
  }

  /**
   * DELETE /cursos/{cursoId}/usuarios/{usuarioId}
   * Remover usuário de um curso
   * @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('GERENTE')")
   * Retorna: List<PermissaoCursoDTO>
   */
  removeUserFromCourse(cursoId: number, usuarioId: number): Observable<any[]> {
    console.log('➖ Removendo usuário do curso:', { cursoId, usuarioId });
    console.log('📡 URL:', `${this.baseUrl}/cursos/${cursoId}/usuarios/${usuarioId}`);
    return this.http.delete<any[]>(`${this.baseUrl}/cursos/${cursoId}/usuarios/${usuarioId}`);
  }

  /**
   * GET /categorias/{categoriaId}
   * Buscar categoria por ID
   */
  getCategoryById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/categorias/${id}`);
  }

  /**
   * POST /categorias
   * Criar nova categoria
   * @PreAuthorize("hasRole('ADMINISTRADOR')")
   * Body: { nome: string }
   */
  createCategory(categoryData: { nome: string }): Observable<any> {
    console.log('📝 Criando categoria:', categoryData);
    return this.http.post(`${this.baseUrl}/categorias`, categoryData);
  }

  /**
   * PUT /categorias/{categoriaId}
   * Atualizar categoria existente
   * @PreAuthorize("hasRole('ADMINISTRADOR')")
   * Body: { nome: string }
   */
  updateCategory(id: number, categoryData: { nome: string }): Observable<any> {
    console.log('✏️ Atualizando categoria:', id, categoryData);
    return this.http.put(`${this.baseUrl}/categorias/${id}`, categoryData);
  }

  /**
   * DELETE /categorias/{categoriaId}
   * Deletar categoria
   * @PreAuthorize("hasRole('ADMINISTRADOR')")
   */
  deleteCategory(id: number): Observable<any> {
    console.log('🗑️ Deletando categoria:', id);
    return this.http.delete(`${this.baseUrl}/categorias/${id}`);
  }
}
