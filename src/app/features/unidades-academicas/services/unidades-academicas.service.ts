import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UnidadeAcademica } from '../models/unidade-academica.model';
import { Page, PageRequest } from '../../../shared/models/page.model';

@Injectable({
  providedIn: 'root'
})
export class UnidadesAcademicasService {
  private readonly baseUrl = `${environment.apiUrl}/unidades-academicas`;

  constructor(private http: HttpClient) {}

  getPage(pageRequest: PageRequest, nome?: string): Observable<Page<UnidadeAcademica>> {
    let params = new HttpParams()
      .set('page', pageRequest.page.toString())
      .set('size', pageRequest.size.toString())
      .set('sort', `${pageRequest.sortBy},${pageRequest.direction.toLowerCase()}`);

    if (nome && nome.trim()) {
      params = params.set('nome', nome.trim());
    }

    return this.http.get<Page<UnidadeAcademica>>(this.baseUrl, { params }).pipe(
      map(page => {
        if (page) {
          return page;
        }

        return {
          content: [],
          totalElements: 0,
          totalPages: 0,
          number: pageRequest.page,
          size: pageRequest.size,
          numberOfElements: 0,
          first: pageRequest.page === 0,
          last: true,
          empty: true,
          sort: {
            sorted: false,
            unsorted: true,
            empty: true
          },
          pageable: {
            pageNumber: pageRequest.page,
            pageSize: pageRequest.size,
            offset: pageRequest.page * pageRequest.size,
            paged: true,
            unpaged: false,
            sort: {
              sorted: false,
              unsorted: true,
              empty: true
            }
          }
        } as Page<UnidadeAcademica>;
      })
    );
  }

  getFirstPageAsList(size: number = 100, nome?: string, sortBy: string = 'nome', direction: 'ASC' | 'DESC' = 'ASC'): Observable<UnidadeAcademica[]> {
    const pageRequest: PageRequest = { page: 0, size, sortBy, direction };
    return this.getPage(pageRequest, nome).pipe(
      map(page => page?.content ?? [])
    );
  }

  getById(id: number): Observable<UnidadeAcademica> {
    return this.http.get<UnidadeAcademica>(`${this.baseUrl}/${id}`);
  }

  create(payload: UnidadeAcademica): Observable<UnidadeAcademica> {
    return this.http.post<UnidadeAcademica>(this.baseUrl, payload);
  }

  update(id: number, payload: UnidadeAcademica): Observable<UnidadeAcademica> {
    return this.http.put<UnidadeAcademica>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}


