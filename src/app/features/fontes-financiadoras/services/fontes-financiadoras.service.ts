import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, timeout } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface FonteFinanciadoraDTO {
  id?: number;
  nome: string;
  // Outros campos conforme necessário
}

export interface FonteFinanciadoraCreateDTO {
  nome: string;
}

export interface FonteFinanciadoraUpdateDTO {
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class FontesFinanciadorasService {
  private baseUrl = `${environment.apiUrl}/fontes-financiadoras`;

  constructor(private http: HttpClient) {}

  /**
   * GET /api/fontes-financiadoras
   * Listar todas as fontes financiadoras
   */
  listarTodas(): Observable<FonteFinanciadoraDTO[]> {
    const url = this.baseUrl;
    
    return this.http.get<FonteFinanciadoraDTO[]>(url).pipe(
      timeout(30000),
      tap(response => {
              }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Erro ao buscar fontes financiadoras:', error);
        console.error('❌ Status:', error?.status);
        console.error('❌ Message:', error?.message);
        throw error;
      })
    );
  }

  /**
   * GET /api/fontes-financiadoras/{id}
   * Recuperar uma fonte financiadora pelo ID
   */
  recuperarPorId(id: number): Observable<FonteFinanciadoraDTO> {
    const url = `${this.baseUrl}/${id}`;
    
    return this.http.get<FonteFinanciadoraDTO>(url).pipe(
      timeout(30000),
      tap(response => {
              }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Erro ao buscar fonte financiadora:', error);
        console.error('❌ Status:', error?.status);
        console.error('❌ Message:', error?.message);
        throw error;
      })
    );
  }

  /**
   * POST /api/fontes-financiadoras
   * Criar uma nova fonte financiadora
   * @PreAuthorize: ADMINISTRADOR, GERENTE, SECRETARIO
   */
  salvar(fonteFinanciadora: FonteFinanciadoraCreateDTO): Observable<FonteFinanciadoraDTO> {
    const url = this.baseUrl;
        
    return this.http.post<FonteFinanciadoraDTO>(url, fonteFinanciadora).pipe(
      timeout(30000),
      tap(response => {
              }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Erro ao criar fonte financiadora:', error);
        console.error('❌ Status:', error?.status);
        console.error('❌ Message:', error?.message);
        throw error;
      })
    );
  }

  /**
   * PUT /api/fontes-financiadoras/{id}
   * Atualizar uma fonte financiadora
   * @PreAuthorize: ADMINISTRADOR, GERENTE, SECRETARIO
   */
  atualizar(id: number, fonteFinanciadora: FonteFinanciadoraUpdateDTO): Observable<FonteFinanciadoraDTO> {
    const url = `${this.baseUrl}/${id}`;
        
    return this.http.put<FonteFinanciadoraDTO>(url, fonteFinanciadora).pipe(
      timeout(30000),
      tap(response => {
              }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Erro ao atualizar fonte financiadora:', error);
        console.error('❌ Status:', error?.status);
        console.error('❌ Message:', error?.message);
        throw error;
      })
    );
  }

  /**
   * DELETE /api/fontes-financiadoras/{id}
   * Deletar uma fonte financiadora
   * @PreAuthorize: ADMINISTRADOR
   */
  deletar(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    
    return this.http.delete<void>(url).pipe(
      timeout(30000),
      tap(() => {
              }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Erro ao deletar fonte financiadora:', error);
        console.error('❌ Status:', error?.status);
        console.error('❌ Message:', error?.message);
        throw error;
      })
    );
  }

  /**
   * Método auxiliar para extrair mensagem de erro
   */
  private extractErrorMessage(error: any): string {
    if (error.error && error.error.message) {
      return error.error.message;
    } else if (error.message) {
      return error.message;
    } else {
      return 'Erro desconhecido';
    }
  }
}

