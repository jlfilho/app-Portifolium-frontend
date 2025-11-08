import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';
import { TipoCurso } from '../models/tipo-curso.model';
import { Page } from '../../../shared/models/page.model';
import { TipoCursoFilter } from '../models/tipo-curso-filter.model';
import { PageRequest } from '../../../shared/models/page.model';

function ensurePageResponse<T>(response: Page<T> | null | undefined, request: PageRequest): Page<T> {
  if (response && Array.isArray(response.content)) {
    return response;
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

@Injectable({
  providedIn: 'root'
})
export class TiposCursoService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * GET /api/tipos-curso/{id}
   */
  getById(id: number): Observable<TipoCurso> {
    const url = `${this.baseUrl}/tipos-curso/${id}`;
    console.log('📡 TiposCursoService:getById', url);
    return this.http.get<TipoCurso>(url);
  }

  /**
   * PUT /api/tipos-curso/{id}
   */
  update(id: number, data: Partial<TipoCurso>): Observable<TipoCurso> {
    const url = `${this.baseUrl}/tipos-curso/${id}`;
    console.log('✏️ TiposCursoService:update', { url, id, data });
    return this.http.put<TipoCurso>(url, data);
  }

  /**
   * DELETE /api/tipos-curso/{id}
   */
  delete(id: number): Observable<void> {
    const url = `${this.baseUrl}/tipos-curso/${id}`;
    console.log('🗑️ TiposCursoService:delete', { url, id });
    return this.http.delete<void>(url);
  }

  /**
   * GET /api/tipos-curso (paginado e com filtro por nome)
   */
  getPage(filter: TipoCursoFilter): Observable<Page<TipoCurso>> {
    const url = `${this.baseUrl}/tipos-curso`;
    const sortBy = filter.sortBy || 'nome';
    const direction = (filter.direction || 'ASC').toLowerCase();

    let params = new HttpParams()
      .set('page', filter.page.toString())
      .set('size', filter.size.toString())
      .set('sort', `${sortBy},${direction}`);

    if (filter.nome && filter.nome.trim()) {
      params = params.set('nome', filter.nome.trim());
    }

    console.log('📡 TiposCursoService:getPage', { url, params: params.toString() });
    return this.http.get<Page<TipoCurso>>(url, { params }).pipe(
      map(response => ensurePageResponse(response, filter))
    );
  }

  /**
   * Helper para carregar a primeira página e extrair apenas a lista (útil para dropdowns)
   */
  getFirstPageAsList(size: number = 100, nome?: string, sortBy: string = 'nome', direction: 'ASC' | 'DESC' = 'ASC'): Observable<TipoCurso[]> {
    const filter: TipoCursoFilter = { page: 0, size, sortBy, direction, nome };
    return this.getPage(filter).pipe(map(p => p?.content || []));
  }

  /**
   * POST /api/tipos-curso
   */
  create(payload: Omit<TipoCurso, 'id'>): Observable<TipoCurso> {
    const url = `${this.baseUrl}/tipos-curso`;
    console.log('📝 TiposCursoService:create', { url, payload });
    return this.http.post<TipoCurso>(url, payload);
  }
}


