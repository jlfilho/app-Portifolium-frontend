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
    console.log('📡 Buscando todas as fontes financiadoras:', url);

    return this.http.get<FonteFinanciadoraDTO[]>(url).pipe(
      timeout(30000),
      tap(response => {
        console.log('✅ Fontes financiadoras carregadas:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Erro ao buscar fontes financiadoras:', error);
        console.error('❌ Status:', error?.status);
        console.error('❌ Message:', error?.message);
        console.error('❌ Error body:', error?.error);
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
    console.log('📡 Buscando fonte financiadora por ID:', url);

    return this.http.get<FonteFinanciadoraDTO>(url).pipe(
      timeout(30000),
      tap(response => {
        console.log('✅ Fonte financiadora encontrada:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Erro ao buscar fonte financiadora:', error);
        console.error('❌ Status:', error?.status);
        console.error('❌ Message:', error?.message);
        console.error('❌ Error body:', error?.error);
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
    console.log('📡 Criando nova fonte financiadora:', url);
    console.log('📋 Dados:', fonteFinanciadora);

    return this.http.post<FonteFinanciadoraDTO>(url, fonteFinanciadora).pipe(
      timeout(30000),
      tap(response => {
        console.log('✅ Fonte financiadora criada com sucesso:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Erro ao criar fonte financiadora:', error);
        console.error('❌ Status:', error?.status);
        console.error('❌ Message:', error?.message);
        console.error('❌ Error body:', error?.error);
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
    console.log('📡 Atualizando fonte financiadora:', url);
    console.log('📋 Dados para atualização:', fonteFinanciadora);

    return this.http.put<FonteFinanciadoraDTO>(url, fonteFinanciadora).pipe(
      timeout(30000),
      tap(response => {
        console.log('✅ Fonte financiadora atualizada com sucesso:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Erro ao atualizar fonte financiadora:', error);
        console.error('❌ Status:', error?.status);
        console.error('❌ Message:', error?.message);
        console.error('❌ Error body:', error?.error);
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
    console.log('📡 Deletando fonte financiadora:', url);

    return this.http.delete<void>(url).pipe(
      timeout(30000),
      tap(() => {
        console.log('✅ Fonte financiadora deletada com sucesso');
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Erro ao deletar fonte financiadora:', error);
        console.error('❌ Status:', error?.status);
        console.error('❌ Message:', error?.message);
        console.error('❌ Error body:', error?.error);
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

