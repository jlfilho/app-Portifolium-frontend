import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';
import { EvidenciaDTO } from '../models/evidencia.model';

@Injectable({
  providedIn: 'root'
})
export class EvidenciasService {
  private readonly baseUrl = 'http://localhost:8080/api/evidencias';
  private readonly requestTimeout = 30000; // 30 segundos

  constructor(private http: HttpClient) {}

  /**
   * GET /api/evidencias/atividade/{atividadeId}
   * Listar evidências por atividade
   */
  listarEvidenciasPorAtividade(atividadeId: number): Observable<EvidenciaDTO[]> {
    const url = `${this.baseUrl}/atividade/${atividadeId}`;
    
    return this.http.get<EvidenciaDTO[]>(url).pipe(
      timeout(this.requestTimeout),
      tap(response => {
              }),
      catchError(this.handleError)
    );
  }

  /**
   * GET /api/evidencias/{evidenciaId}
   * Buscar uma evidência por ID
   */
  getEvidenciasPorId(evidenciaId: number): Observable<EvidenciaDTO> {
    const url = `${this.baseUrl}/${evidenciaId}`;
    
    return this.http.get<EvidenciaDTO>(url).pipe(
      timeout(this.requestTimeout),
      tap(response => {
              }),
      catchError(this.handleError)
    );
  }

  /**
   * POST /api/evidencias
   * Salvar uma nova evidência (multipart/form-data)
   */
  salvarEvidencia(atividadeId: number, legenda: string, file: File): Observable<EvidenciaDTO> {
    const url = this.baseUrl;
            
    // Criar FormData para envio multipart
    const formData = new FormData();
    formData.append('atividadeId', atividadeId.toString());
    formData.append('legenda', legenda);
    formData.append('file', file);

    return this.http.post<EvidenciaDTO>(url, formData).pipe(
      timeout(this.requestTimeout),
      tap(response => {
              }),
      catchError(this.handleError)
    );
  }

  /**
   * PUT /api/evidencias/{evidenciaId}
   * Atualizar uma evidência existente (multipart/form-data)
   */
  atualizarEvidencia(evidenciaId: number, legenda: string, file: File): Observable<EvidenciaDTO> {
    const url = `${this.baseUrl}/${evidenciaId}`;
            
    // Criar FormData para envio multipart
    const formData = new FormData();
    formData.append('legenda', legenda);
    formData.append('file', file);

    return this.http.put<EvidenciaDTO>(url, formData).pipe(
      timeout(this.requestTimeout),
      tap(response => {
              }),
      catchError(this.handleError)
    );
  }

  /**
   * DELETE /api/evidencias/{evidenciaId}
   * Excluir uma evidência
   */
  excluirEvidencia(evidenciaId: number): Observable<void> {
    const url = `${this.baseUrl}/${evidenciaId}`;
    
    return this.http.delete<void>(url).pipe(
      timeout(this.requestTimeout),
      tap(() => {
              }),
      catchError(this.handleError)
    );
  }

  /**
   * PUT /api/evidencias/atividade/{atividadeId}/ordenacao
   * Atualiza a ordem das evidências de uma atividade
   */
  reordenarEvidencias(
    atividadeId: number,
    ordenacao: Array<{ id?: number; evidenciaId?: number; ordem: number }>
  ): Observable<EvidenciaDTO[]> {
    const urlPrimario = `${this.baseUrl}/atividade/${atividadeId}/ordem`;
    const urlLegado = `${this.baseUrl}/atividade/${atividadeId}/ordenacao`;
    const payload = this.buildOrdenacaoPayload(ordenacao);
    
    const requestHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    const primario$ = this.http.put<EvidenciaDTO[]>(urlPrimario, payload, { headers: requestHeaders }).pipe(
      timeout(this.requestTimeout),
      tap(response => {
              })
    );

    return primario$.pipe(
      catchError(error => {
        if (this.deveTentarEndpointLegado(error)) {
          console.warn('⚠️ Endpoint principal indisponível. Tentando endpoint legado /ordenacao...');

          return this.http.put<EvidenciaDTO[]>(urlLegado, payload, { headers: requestHeaders }).pipe(
            timeout(this.requestTimeout),
            tap(response => {
                          }),
            catchError(errLegado => this.handleError(errLegado))
          );
        }

        return this.handleError(error);
      })
    );
  }

  /**
   * Formatar URL completa da foto
   */
  getImageUrl(foto: string): string {
    if (!foto) return '';
    if (foto.startsWith('http')) {
      return foto;
    }
    return `http://localhost:8080/api/files${foto}`;
  }

  /**
   * Formatar tamanho de arquivo para exibição
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  private buildOrdenacaoPayload(
    ordenacao: Array<{ id?: number; evidenciaId?: number; ordem: number }>
  ): Array<{ evidenciaId: number; ordem: number }> {
    return ordenacao
      .map(item => {
        const evidenciaId = item.evidenciaId ?? item.id;
        if (evidenciaId === undefined || evidenciaId === null) {
          console.warn('⚠️ Registro de ordenação ignorado por não possuir ID:', item);
          return null;
        }
        return {
          evidenciaId,
          ordem: item.ordem
        };
      })
      .filter((item): item is { evidenciaId: number; ordem: number } => item !== null);
  }

  private deveTentarEndpointLegado(error: any): boolean {
    if (!error) {
      return false;
    }

    const status = error.status;
    if (status === 404) {
      return true;
    }

    if (status === 500) {
      const mensagemBruta =
        (typeof error.error === 'string' && error.error) ||
        error.error?.message ||
        error.message ||
        '';

      const mensagemNormalizada = mensagemBruta.toString().toLowerCase();
      if (mensagemNormalizada.includes('no static resource') || mensagemNormalizada.includes('noresourcefound')) {
        return true;
      }
    }

    return false;
  }

  /**
   * Tratamento de erros HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Erro ao processar solicitação.';

    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      console.error('❌ Erro do cliente:', error.error.message);
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      console.error('❌ Erro do servidor:');
      console.error('❌ Status:', error.status);
      console.error('❌ Message:', error.message);
      // Extrair mensagem de erro específica do backend
      if (error.error) {
        if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error.message) {
          errorMessage = error.error.message;
        } else if (error.error.error) {
          errorMessage = error.error.error;
        }
      }

      // Mensagens específicas por status HTTP
      switch (error.status) {
        case 0:
          errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
          break;
        case 400:
          errorMessage = errorMessage || 'Dados inválidos. Verifique as informações enviadas.';
          break;
        case 401:
          errorMessage = 'Não autorizado. Faça login novamente.';
          break;
        case 403:
          errorMessage = 'Você não tem permissão para realizar esta ação.';
          break;
        case 404:
          errorMessage = 'Evidência não encontrada.';
          break;
        case 413:
          errorMessage = 'Arquivo muito grande. Tente com um arquivo menor.';
          break;
        case 415:
          errorMessage = 'Tipo de arquivo não suportado.';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
          break;
        case 503:
          errorMessage = 'Serviço temporariamente indisponível.';
          break;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}

