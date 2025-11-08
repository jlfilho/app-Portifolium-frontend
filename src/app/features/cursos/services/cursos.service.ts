import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';
import { Page, PageRequest } from '../../../shared/models/page.model';
import { Curso } from '../models/curso.model';
import { CursoFilter } from '../models/curso-filter.model';

@Injectable({
  providedIn: 'root'
})
export class CursosService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * GET /cursos/usuarios (listagem completa – uso legado)
   */
  getUserCourses(): Observable<Curso[]> {
    return this.http.get<Page<Curso> | Curso[]>(`${this.baseUrl}/cursos/usuarios`).pipe(
      map(response => {
        if (Array.isArray(response)) {
          return response;
        }
        if (response && typeof response === 'object' && 'content' in response) {
          return (response as Page<Curso>).content || [];
        }
        return [];
      })
    );
  }

  /**
   * GET /cursos/usuarios (com paginação e filtros)
   */
  getUserCoursesPaginado(filter: CursoFilter): Observable<Page<Curso>> {
    const params = this.buildCursoParams(filter);

    console.log('📡 Buscando cursos do usuário (paginado):', {
      page: filter.page,
      size: filter.size,
      sort: `${filter.sortBy},${filter.direction}`,
      ativo: filter.ativo !== null && filter.ativo !== undefined ? filter.ativo : 'todos',
      nome: filter.nome || 'sem filtro',
      tipoId: filter.tipoId ?? 'todos'
    });

    return this.http.get<Page<Curso> | Curso[]>(`${this.baseUrl}/cursos/usuarios`, { params }).pipe(
      tap(response => console.log('📡 CursosService - Resposta recebida:', response)),
      map(response => this.ensurePageResponse<Curso>(response, filter))
    );
  }

  /**
   * GET /cursos (com paginação e filtros)
   */
  getAllCourses(filter: CursoFilter): Observable<Page<Curso>> {
    const params = this.buildCursoParams(filter);

    console.log('📡 Buscando todos os cursos (paginado):', {
      page: filter.page,
      size: filter.size,
      sort: `${filter.sortBy},${filter.direction}`,
      ativo: filter.ativo !== null && filter.ativo !== undefined ? filter.ativo : 'todos',
      nome: filter.nome || 'sem filtro',
      tipoId: filter.tipoId ?? 'todos'
    });

    return this.http.get<Page<Curso> | Curso[]>(`${this.baseUrl}/cursos`, { params }).pipe(
      tap(response => {
        const count = Array.isArray(response)
          ? response.length
          : ((response as Page<Curso>)?.content?.length || 0);
        console.log('✅ Cursos carregados:', count);
      }),
      map(response => this.ensurePageResponse<Curso>(response, filter))
    );
  }

  /**
   * GET /cursos/{id}
   */
  getCourseById(id: number): Observable<Curso> {
    console.log('📡 Buscando curso ID:', id);
    return this.http.get<Curso>(`${this.baseUrl}/cursos/${id}`).pipe(
      tap(curso => console.log('✅ Curso encontrado:', curso))
    );
  }

  createCourse(courseData: Partial<Curso>): Observable<Curso> {
    return this.http.post<Curso>(`${this.baseUrl}/cursos`, courseData);
  }

  /**
   * GET /categorias (sem paginação)
   */
  getAllCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categorias`);
  }

  getAllCategoriesPaginado(pageRequest: PageRequest): Observable<Page<any>> {
    let params = new HttpParams()
      .set('page', pageRequest.page.toString())
      .set('size', pageRequest.size.toString())
      .set('sortBy', pageRequest.sortBy)
      .set('direction', pageRequest.direction);

    return this.http.get<Page<any>>(`${this.baseUrl}/categorias`, { params });
  }

  updateCourse(id: number, courseData: Partial<Curso>): Observable<Curso> {
    return this.http.put<Curso>(`${this.baseUrl}/cursos/${id}`, courseData);
  }

  uploadCourseCover(cursoId: number, file: File): Observable<Curso> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.put<Curso>(`${this.baseUrl}/cursos/foto-capa/${cursoId}`, formData);
  }

  deleteCourseCover(cursoId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/cursos/foto-capa/${cursoId}`);
  }

  deleteCourse(id: number): Observable<void> {
    console.log('🗑️ Service: excluindo curso ID:', id);
    console.log('📡 URL:', `${this.baseUrl}/cursos/${id}`);
    return this.http.delete<void>(`${this.baseUrl}/cursos/${id}`);
  }

  updateCourseStatus(id: number, ativo: boolean): Observable<void> {
    console.log('🔄 Atualizando status do curso:', id, 'Ativo:', ativo);
    return this.http.put<void>(`${this.baseUrl}/cursos/${id}/status`, { ativo });
  }

  /**
   * GET /cursos/permissoes/{cursoId}
   */
  getCoursePermissions(cursoId: number): Observable<any[]> {
    console.log('👥 Buscando permissões do curso ID:', cursoId);
    console.log('📡 URL:', `${this.baseUrl}/cursos/permissoes/${cursoId}`);
    return this.http.get<any[]>(`${this.baseUrl}/cursos/permissoes/${cursoId}`);
  }

  /**
   * PUT /cursos/{cursoId}/usuarios/{usuarioId}
   */
  addUserToCourse(cursoId: number, usuarioId: number): Observable<any[]> {
    console.log('➕ Adicionando usuário ao curso:', { cursoId, usuarioId });
    console.log('📡 URL:', `${this.baseUrl}/cursos/${cursoId}/usuarios/${usuarioId}`);
    return this.http.put<any[]>(`${this.baseUrl}/cursos/${cursoId}/usuarios/${usuarioId}`, {});
  }

  /**
   * DELETE /cursos/{cursoId}/usuarios/{usuarioId}
   */
  removeUserFromCourse(cursoId: number, usuarioId: number): Observable<any[]> {
    console.log('➖ Removendo usuário do curso:', { cursoId, usuarioId });
    console.log('📡 URL:', `${this.baseUrl}/cursos/${cursoId}/usuarios/${usuarioId}`);
    return this.http.delete<any[]>(`${this.baseUrl}/cursos/${cursoId}/usuarios/${usuarioId}`);
  }

  /**
   * GET /categorias/{categoriaId}
   */
  getCategoryById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/categorias/${id}`);
  }

  /**
   * POST /categorias
   */
  createCategory(categoryData: { nome: string }): Observable<any> {
    console.log('📝 Criando categoria:', categoryData);
    return this.http.post(`${this.baseUrl}/categorias`, categoryData);
  }

  /**
   * PUT /categorias/{categoriaId}
   */
  updateCategory(id: number, categoryData: { nome: string }): Observable<any> {
    console.log('✏️ Atualizando categoria:', id, categoryData);
    return this.http.put(`${this.baseUrl}/categorias/${id}`, categoryData);
  }

  /**
   * DELETE /categorias/{categoriaId}
   */
  deleteCategory(id: number): Observable<any> {
    console.log('🗑️ Deletando categoria:', id);
    return this.http.delete(`${this.baseUrl}/categorias/${id}`);
  }

  private buildCursoParams(filter: CursoFilter): HttpParams {
    const sortBy = filter.sortBy || 'nome';
    const direction = (filter.direction || 'ASC').toLowerCase();

    let params = new HttpParams()
      .set('page', filter.page.toString())
      .set('size', filter.size.toString())
      .set('sort', `${sortBy},${direction}`);

    if (filter.nome && filter.nome.trim()) {
      params = params.set('nome', filter.nome.trim());
    }

    if (filter.ativo !== null && filter.ativo !== undefined) {
      params = params.set('ativo', filter.ativo.toString());
    }

    if (filter.tipoId !== null && filter.tipoId !== undefined) {
      params = params.set('tipoId', filter.tipoId.toString());
    }

    return params;
  }

  private ensurePageResponse<T>(response: Page<T> | T[] | null | undefined, request: PageRequest): Page<T> {
    const isPage = (value: any): value is Page<T> =>
      value && typeof value === 'object' && 'content' in value && Array.isArray(value.content);

    if (isPage(response)) {
      return response;
    }

    if (Array.isArray(response)) {
      const content = response as T[];
      return {
        content,
        totalElements: content.length,
        totalPages: content.length > 0 ? Math.ceil(content.length / request.size) : 0,
        size: request.size,
        number: request.page,
        first: request.page === 0,
        last: content.length <= request.size,
        empty: content.length === 0,
        pageable: {
          pageNumber: request.page,
          pageSize: request.size,
          sort: {
            sorted: false,
            unsorted: true,
            empty: true
          },
          offset: request.page * request.size,
          paged: true,
          unpaged: false
        },
        sort: {
          sorted: false,
          unsorted: true,
          empty: true
        },
        numberOfElements: content.length
      };
    }

    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: request.size,
      number: request.page,
      first: true,
      last: true,
      empty: true,
      pageable: {
        pageNumber: request.page,
        pageSize: request.size,
        sort: {
          sorted: false,
          unsorted: true,
          empty: true
        },
        offset: request.page * request.size,
        paged: true,
        unpaged: false
      },
      sort: {
        sorted: false,
        unsorted: true,
        empty: true
      },
      numberOfElements: 0
    };
  }
}
