import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { RelatorioAtividadeRequest } from '../models/relatorio-atividade-request.interface';

@Injectable({
  providedIn: 'root'
})
export class AtividadeRelatorioService {
  private apiUrl = `${environment.apiUrl}/atividades`;

  constructor(private http: HttpClient) {}

  /**
   * Gera o relatório em PDF de uma atividade
   * @param atividadeId ID da atividade
   * @param introducao Texto de introdução personalizado (opcional)
   * @returns Observable com o blob do PDF
   */
  gerarRelatorioAtividade(
    atividadeId: number,
    introducao?: string
  ): Observable<Blob> {
    const url = `${this.apiUrl}/${atividadeId}/relatorios`;
    
    const requestBody: RelatorioAtividadeRequest = introducao
      ? { introducao }
      : {};

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, requestBody, {
      headers,
      responseType: 'blob',
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<Blob>) => {
        if (response.body) {
          return response.body;
        }
        throw new Error('Resposta vazia do servidor');
      })
    );
  }

  /**
   * Gera o relatório e faz o download automaticamente
   * @param atividadeId ID da atividade
   * @param introducao Texto de introdução personalizado (opcional)
   */
  downloadRelatorioAtividade(
    atividadeId: number,
    introducao?: string
  ): Observable<void> {
    return this.gerarRelatorioAtividade(atividadeId, introducao).pipe(
      map((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `relatorio-atividade-${atividadeId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
    );
  }

  /**
   * Gera o relatório e abre em nova aba
   * @param atividadeId ID da atividade
   * @param introducao Texto de introdução personalizado (opcional)
   */
  visualizarRelatorioAtividade(
    atividadeId: number,
    introducao?: string
  ): Observable<void> {
    return this.gerarRelatorioAtividade(atividadeId, introducao).pipe(
      map((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        // Revogar URL após um tempo para liberar memória
        setTimeout(() => window.URL.revokeObjectURL(url), 100);
      })
    );
  }
}

