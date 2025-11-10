import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, map, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { Page, PageRequest, createEmptyPage } from '../../../shared/models/page.model';
import { Pessoa } from '../models/pessoa.model';
import { PessoaFilter } from '../models/pessoa-filter.model';
import { PessoaImportResponse } from '../models/pessoa-import-response.model';

@Injectable({
  providedIn: 'root'
})
export class PessoasService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPage(filter: PessoaFilter): Observable<Page<Pessoa>> {
    const params = this.buildParams(filter);

    return this.http.get<Page<Pessoa>>(`${this.baseUrl}/pessoas`, { params, observe: 'response' }).pipe(
      map(response => {
        if (!response.body) {
          return createEmptyPage<Pessoa>();
        }
        return {
          ...response.body,
          content: response.body.content || []
        };
      }),
      catchError(error => this.handlePageError(error))
    );
  }

  getById(id: number): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${this.baseUrl}/pessoas/${id}`);
  }

  create(payload: Pessoa): Observable<Pessoa> {
    return this.http.post<Pessoa>(`${this.baseUrl}/pessoas`, payload);
  }

  update(id: number, payload: Pessoa): Observable<Pessoa> {
    return this.http.put<Pessoa>(`${this.baseUrl}/pessoas/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/pessoas/${id}`);
  }

  importCsv(file: File): Observable<PessoaImportResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<PessoaImportResponse>(`${this.baseUrl}/pessoas/import`, formData);
  }

  private buildParams(filter: PessoaFilter): HttpParams {
    let params = new HttpParams()
      .set('page', filter.page.toString())
      .set('size', filter.size.toString())
      .set('sort', `${filter.sortBy || 'nome'},${(filter.direction || 'ASC').toLowerCase()}`);

    if (filter.nome && filter.nome.trim()) {
      params = params.set('nome', filter.nome.trim());
    }

    return params;
  }

  private handlePageError(error: HttpErrorResponse): Observable<Page<Pessoa>> {
    if (error.status === 204) {
      return of(createEmptyPage<Pessoa>());
    }

    return throwError(() => error);
  }
}


