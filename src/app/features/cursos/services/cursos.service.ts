import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Page, PageRequest } from '../../../shared/models/page.model';

@Injectable({
  providedIn: 'root'
})
export class CursosService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Método para buscar a lista de cursos do usuário autenticado
  // O token será adicionado automaticamente pelo interceptor
  getUserCourses(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/cursos/usuarios`);
  }

  getAllCourses(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cursos`);
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

  deleteCourse(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cursos/${id}`);
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
