import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../../../shared/models/categoria.model';
import { Curso } from '../../../shared/models/curso.model';
import { Atividade } from '../../../shared/models/atividade.model';
import { Evidencia } from '../../../shared/models/evidencia.model';
import { Permissao } from '../../../shared/models/permissao.model';

@Injectable({
  providedIn: 'root'
})
export class CursosService {
  private baseUrl = 'http://localhost:8080/api'; // Endpoint de login

  constructor(private http: HttpClient) {}

  // Método para buscar a lista de cursos do usuário autenticado
  getUserCourses(): Observable<Curso[]> {
    const token = localStorage.getItem('token'); // Obtém o token JWT armazenado

    // Configura os headers com o token de autenticação
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Faz a requisição GET ao endpoint
    return this.http.get<Curso[]>(`${this.baseUrl}/cursos/usuarios`, { headers });
  }

  getAllCourses(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cursos`);
  }

  createCourse(courseData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/cursos`, courseData);
  }

  getAllCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categorias`);
  }

  getCategoriasPorCurso(
    cursoId: number,
    categorias?: number[],
    statusPublicacao?: boolean,
    nomeAtividade?: string
  ): Observable<Categoria[]> {
    // Configurando os parâmetros da consulta
    let params = new HttpParams();

    if (categorias) {
      categorias.forEach((categoriaId) => {
        params = params.append('categorias', categoriaId.toString());
      });
    }

    if (statusPublicacao !== undefined) {
      params = params.set('statusPublicacao', statusPublicacao.toString());
    }

    if (nomeAtividade) {
      params = params.set('nomeAtividade', nomeAtividade);
    }

    // Realiza a requisição GET com parâmetros
    return this.http.get<Categoria[]>(`${this.baseUrl}/categorias/cursos/${cursoId}`, { params });
  }

  getCourseById(courseId: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.baseUrl}/cursos/${courseId}`);
  }

  getAtividadeById(atividadeId: number): Observable<Atividade> {
    return this.http.get<Atividade>(`${this.baseUrl}/atividades/${atividadeId}`);
  }

  getAtividadesByCursoId(cursoId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/atividades/curso/${cursoId}`);
  }

  getEvidenciasByAtividadeId(atividadeId: number): Observable<Evidencia[]> {
    return this.http.get<Evidencia[]>(`${this.baseUrl}/evidencias/atividade/${atividadeId}`);
  }

  getAllPermissoesByCurso(cursoId: number): Observable<Permissao[]> {
    const token = localStorage.getItem('token'); // Obtém o token JWT armazenado
    // Configura os headers com o token de autenticação
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Permissao[]>(`${this.baseUrl}/cursos/permissoes/${cursoId}`, { headers });
  }


  saveCurso(curso: Curso): Observable<Curso> {
    const token = localStorage.getItem('token'); // Obtém o token JWT armazenado
    // Configura os headers com o token de autenticação
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<Curso>(`${this.baseUrl}/cursos`, curso, { headers });
  }

  deleteCurso(cursoId: number): Observable<any> {
    const token = localStorage.getItem('token'); // Obtém o token JWT armazenado
    // Configura os headers com o token de autenticação
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<any>(`${this.baseUrl}/cursos/${cursoId}`, { headers });
  }

  removeCursoUsuario(cursoId: number, usuarioId: number): Observable<Permissao[]> {
    const token = localStorage.getItem('token'); // Obtém o token JWT armazenado
    // Configura os headers com o token de autenticação
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<Permissao[]>(`${this.baseUrl}/cursos/${cursoId}/usuarios/${usuarioId}`, { headers });
  }

  adicionarCursoUsuario(cursoId: number, usuarioId: number): Observable<Permissao[]> {
    const token = localStorage.getItem('token'); // Obtém o token JWT armazenado
    // Configura os headers com o token de autenticação
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<Permissao[]>(`${this.baseUrl}/cursos/${cursoId}/usuarios/${usuarioId}`, { headers });
  }

  updateCurso(curso: Curso): Observable<Curso> {
    const token = localStorage.getItem('token'); // Obtém o token JWT armazenado
    // Configura os headers com o token de autenticação
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<Curso>(`${this.baseUrl}/cursos/${curso.id}`, curso, { headers });
  }

}
