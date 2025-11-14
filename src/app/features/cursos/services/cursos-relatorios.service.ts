import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';

export interface RelatorioCursoFiltro {
  dataInicio: string;
  dataFim: string;
  categorias?: number[];
  introducao?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CursosRelatoriosService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  gerarRelatorioCurso(cursoId: number, filtro: RelatorioCursoFiltro): Observable<Blob> {
    const url = `${this.baseUrl}/cursos/${cursoId}/relatorios`;

    const payload: any = {
      dataInicio: filtro.dataInicio,
      dataFim: filtro.dataFim
    };

    if (filtro.categorias && filtro.categorias.length > 0) {
      payload.categorias = filtro.categorias;
    }

    if (filtro.introducao && filtro.introducao.trim().length > 0) {
      payload.introducao = filtro.introducao.trim();
    }

    return this.http.post(url, payload, {
      responseType: 'blob'
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }
}

