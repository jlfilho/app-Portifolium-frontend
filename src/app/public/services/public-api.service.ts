import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Models
import { Curso } from '../../features/cursos/models/curso.model';
import { AtividadeDTO } from '../../features/atividades/models/atividade.model';
import { EvidenciaDTO } from '../../features/evidencias/models/evidencia.model';
import { Page } from '../../shared/models/page.model';

@Injectable({
  providedIn: 'root'
})
export class PublicApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ===== CURSOS PÚBLICOS =====

  /**
   * Busca todos os cursos públicos com paginação
   */
  getCursosPublicos(page: number = 0, size: number = 10, nome?: string): Observable<Page<Curso>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'nome,ASC')
      .set('ativo', 'true'); // Apenas cursos ativos (públicos)

    if (nome && nome.trim()) {
      params = params.set('nome', nome.trim());
    }

    return this.http.get<Page<Curso>>(`${this.baseUrl}/cursos`, { params });
  }

  /**
   * Busca um curso específico por ID
   */
  getCursoById(cursoId: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.baseUrl}/cursos/${cursoId}`);
  }

  // ===== ATIVIDADES PÚBLICAS =====

  /**
   * Busca atividades públicas de um curso específico
   */
  getAtividadesPublicasPorCurso(
    cursoId: number,
    page: number = 0,
    size: number = 10,
    nome?: string
  ): Observable<Page<AtividadeDTO>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'nome,ASC')
      .set('cursoId', cursoId.toString())
      .set('statusPublicacao', 'true'); // Apenas atividades publicadas

    if (nome && nome.trim()) {
      params = params.set('nome', nome.trim());
    }

    return this.http.get<Page<AtividadeDTO>>(`${this.baseUrl}/atividades/filtros`, { params });
  }

  /**
   * Busca uma atividade específica por ID
   */
  getAtividadeById(atividadeId: number): Observable<AtividadeDTO> {
    return this.http.get<AtividadeDTO>(`${this.baseUrl}/atividades/${atividadeId}`);
  }

  // ===== EVIDÊNCIAS PÚBLICAS =====

  /**
   * Busca evidências de uma atividade específica
   */
  getEvidenciasPorAtividade(atividadeId: number): Observable<EvidenciaDTO[]> {
    return this.http.get<EvidenciaDTO[]>(`${this.baseUrl}/evidencias/atividade/${atividadeId}`);
  }

  /**
   * Obtém URL completa da imagem de evidência
   */
  getEvidenciaImageUrl(foto: string): string {
    return this.buildFileUrl(foto);
  }

  /**
   * Obtém URL completa da imagem de capa do curso
   */
  getCursoImageUrl(foto: string): string {
    return this.buildFileUrl(foto);
  }

  /**
   * Obtém URL completa da imagem de capa da atividade
   */
  getAtividadeImageUrl(foto: string): string {
    return this.buildFileUrl(foto);
  }

  private buildFileUrl(foto: string): string {
    if (!foto) {
      return '';
    }

    if (foto.startsWith('http')) {
      return foto;
    }

    const normalizedPath = foto.startsWith('/') ? foto : `/${foto}`;
    return `${this.baseUrl}/files${normalizedPath}`;
  }
}
