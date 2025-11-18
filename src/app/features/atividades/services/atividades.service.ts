import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, tap, timeout, finalize } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  AtividadeDTO,
  AtividadeFiltroDTO,
  AtividadeCreateDTO,
  AtividadeUpdateDTO,
  Page,
  PessoaPapelDTO
} from '../models/atividade.model';
import { Papel } from '../models/papel.enum';
import { ApiService } from '../../../shared/api.service';

@Injectable({
  providedIn: 'root'
})
export class AtividadesService {
  private baseUrl = `${environment.apiUrl}/atividades`;

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  /**
   * GET /api/atividades/curso/{cursoId}
   * Buscar atividades por curso
   */
  getAtividadesPorCurso(cursoId: number): Observable<AtividadeDTO[]> {
    return this.http.get<AtividadeDTO[]>(`${this.baseUrl}/curso/${cursoId}`);
  }

  /**
   * GET /api/atividades/{atividadeId}/usuario/{usuarioId}
   * Buscar atividade por ID e usuário
   */
  getAtividadeByIdAndUsuario(atividadeId: number, usuarioId: number): Observable<AtividadeDTO> {
    return this.http.get<AtividadeDTO>(`${this.baseUrl}/${atividadeId}/usuario/${usuarioId}`);
  }

  /**
   * POST /api/atividades
   * Criar nova atividade
   */
  createAtividade(atividade: AtividadeDTO): Observable<AtividadeDTO> {
    const url = this.baseUrl;
    console.log('📡 Criando nova atividade:', url);
    console.log('📋 Dados da nova atividade:', atividade);
    console.log('📋 JSON enviado:', JSON.stringify(atividade, null, 2));

    return this.http.post<AtividadeDTO>(url, atividade).pipe(
      timeout(30000),
      tap(response => {
        console.log('✅ Atividade criada com sucesso:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Erro ao criar atividade:', error);
        console.error('❌ Status:', error?.status);
        console.error('❌ Message:', error?.message);
        console.error('❌ Error body:', error?.error);
        throw error;
      })
    );
  }

  /**
   * GET /api/atividades/{atividadeId}
   * Buscar atividade por ID
   */
  getAtividadeById(atividadeId: number): Observable<AtividadeDTO> {
    const url = `${this.baseUrl}/${atividadeId}`;
    console.log('📡 Buscando atividade por ID:', url);

    return this.http.get<AtividadeDTO>(url).pipe(
      timeout(30000),
      tap(response => {
        console.log('✅ Atividade encontrada:', response);
      }),
      catchError((error: any) => {
        console.error('❌ Erro ao buscar atividade por ID:', error);
        throw error;
      })
    );
  }

  updateAtividade(atividadeId: number, atividadeUpdate: any): Observable<AtividadeDTO> {
    const url = `${this.baseUrl}/${atividadeId}`;
    console.log('📡 Atualizando atividade:', url);
    console.log('📋 Dados para atualização:', atividadeUpdate);
    console.log('📋 JSON enviado:', JSON.stringify(atividadeUpdate, null, 2));

    return this.http.put<AtividadeDTO>(url, atividadeUpdate).pipe(
      timeout(30000),
      tap(response => {
        console.log('✅ Atividade atualizada com sucesso:', response);
      }),
      catchError((error: any) => {
        console.error('❌ Erro ao atualizar atividade:', error);
        console.error('❌ Status:', error?.status);
        console.error('❌ Status Text:', error?.statusText);
        console.error('❌ Error Body:', error?.error);
        console.error('❌ Headers:', error?.headers);
        console.error('❌ URL:', error?.url);
        console.error('❌ Request Body:', atividadeUpdate);

        // Log detalhado do erro para debug
        if (error?.error) {
          console.error('❌ Detalhes do erro:', JSON.stringify(error.error, null, 2));
        }

        throw error;
      })
    );
  }

  uploadFotoCapa(atividadeId: number, file: File): Observable<AtividadeDTO> {
    const url = `${this.baseUrl}/foto-capa/${atividadeId}`;
    console.log('📡 Upload de foto de capa:', url);
    console.log('📸 Arquivo:', file.name, file.size, file.type);

    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<AtividadeDTO>(url, formData).pipe(
      timeout(60000), // 60 segundos para upload
      tap(response => {
        console.log('✅ Foto de capa enviada com sucesso:', response);
      }),
      catchError((error: any) => {
        console.error('❌ Erro no upload da foto:', error);
        throw error;
      })
    );
  }

  getAtividadesPorFiltros(
    filtros: AtividadeFiltroDTO,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'id',
    sortDirection: string = 'ASC'
  ): Observable<Page<AtividadeDTO>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);

    if (filtros.cursoId) {
      params = params.set('cursoId', filtros.cursoId.toString());
    }
    if (filtros.categoriaId) {
      params = params.set('categoriaId', filtros.categoriaId.toString());
    }
    if (filtros.nome) {
      params = params.set('nome', filtros.nome);
    }
    if (filtros.dataInicio) {
      params = params.set('dataInicio', filtros.dataInicio);
    }
    if (filtros.dataFim) {
      params = params.set('dataFim', filtros.dataFim);
    }
    if (filtros.statusPublicacao !== undefined) {
      params = params.set('statusPublicacao', filtros.statusPublicacao.toString());
    }

    const url = `${this.baseUrl}/filtros`;
    console.log('📡 Request URL:', url);
    console.log('📋 Params:', params.toString());

    return this.http.get<Page<AtividadeDTO>>(url, { params }).pipe(
      timeout(30000), // 30 segundos de timeout
      tap(response => {
        console.log('🌐 Response recebida:', response);
        if (!response) {
          console.log('⚠️ Resposta nula do servidor (possível 204 No Content)');
          return;
        }
        console.log('📦 Content length:', response?.content?.length || 0);
        console.log('📊 Total elements:', response?.totalElements ?? 0);
      }),
      map(response => {
        if (!response || !Array.isArray(response.content)) {
          console.log('⚠️ Resposta vazia ou sem conteúdo válido, retornando página vazia');
          return this.buildEmptyPage(page, size);
        }

        // Validar estrutura da resposta
        console.log('✅ Body validado:', {
          contentLength: response.content?.length || 0,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          pageNumber: response.number
        });

        return {
          ...response,
          content: response.content ?? [],
          totalElements: response.totalElements ?? response.content.length,
          totalPages: response.totalPages ?? 1,
          size: response.size ?? size,
          number: response.number ?? page,
          first: response.first ?? page === 0,
          last: response.last ?? true,
          empty: response.content.length === 0
        };
      }),
      catchError((error: any) => {
        console.error('🚨 Erro HTTP capturado no serviço:', error);
        console.error('🚨 Status:', error?.status);
        console.error('🚨 Message:', error?.message);
        console.error('🚨 Error body:', error?.error);
        console.error('🚨 Name:', error?.name);

        // Se for erro de timeout
        if (error.name === 'TimeoutError') {
          console.error('⏰ Timeout: Requisição demorou mais de 30 segundos');
        }

        throw error;
      }),
      finalize(() => {
        console.log('🏁 Requisição finalizada (sucesso ou erro)');
      })
    );
  }

  private buildEmptyPage(page: number, size: number): Page<AtividadeDTO> {
    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size,
      number: page,
      first: true,
      last: true,
      empty: true
    };
  }

  /**
   * POST /api/atividades
   * Criar nova atividade
   * @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('GERENTE') or hasRole('SECRETARIO')")
   */
  salvarAtividade(atividade: AtividadeCreateDTO): Observable<AtividadeDTO> {
    return this.http.post<AtividadeDTO>(`${this.baseUrl}`, atividade);
  }

  /**
   * PUT /api/atividades/foto-capa/{atividadeId}
   * Atualizar foto de capa da atividade
   * @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('GERENTE') or hasRole('SECRETARIO')")
   */
  salvarFotoCapa(atividadeId: number, file: File): Observable<AtividadeDTO> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<AtividadeDTO>(`${this.baseUrl}/foto-capa/${atividadeId}`, formData);
  }

  /**
   * PUT /api/atividades/{atividadeId}
   * Atualizar atividade
   * @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('GERENTE') or hasRole('SECRETARIO')")
   */
  atualizarAtividade(atividadeId: number, atividade: AtividadeUpdateDTO): Observable<AtividadeDTO> {
    return this.http.put<AtividadeDTO>(`${this.baseUrl}/${atividadeId}`, atividade);
  }

  /**
   * DELETE /api/atividades/{atividadeId}/foto-capa
   * Excluir foto de capa da atividade
   * @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('GERENTE') or hasRole('SECRETARIO')")
   */
  excluirFotoCapa(atividadeId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${atividadeId}/foto-capa`);
  }

  /**
   * DELETE /api/atividades/{atividadeId}
   * Excluir atividade
   * @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('GERENTE') or hasRole('SECRETARIO')")
   */
  excluirAtividade(atividadeId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${atividadeId}`);
  }

  /**
   * Método auxiliar para converter datas para formato ISO
   */
  formatarDataParaISO(data: Date | string): string {
    if (typeof data === 'string') {
      return data;
    }
    return data.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  /**
   * Método auxiliar para converter string ISO para Date
   */
  converterISOParaData(dataISO: string): Date {
    return new Date(dataISO);
  }

  /**
   * Método auxiliar para validar se uma atividade está ativa
   */
  isAtividadeAtiva(atividade: AtividadeDTO): boolean {
    const hoje = new Date();
    const dataRealizacao = this.converterISOParaData(atividade.dataRealizacao);

    return hoje <= dataRealizacao && atividade.statusPublicacao;
  }

  /**
   * Método auxiliar para obter status da atividade
   */
  getStatusAtividade(atividade: AtividadeDTO): 'ativa' | 'inativa' | 'futura' | 'realizada' {
    const hoje = new Date();
    const dataRealizacao = this.converterISOParaData(atividade.dataRealizacao);

    if (!atividade.statusPublicacao) {
      return 'inativa';
    }

    if (hoje < dataRealizacao) {
      return 'futura';
    }

    if (hoje >= dataRealizacao) {
      return 'realizada';
    }

    return 'ativa';
  }

  /**
   * Método auxiliar para obter informações do curso
   */
  getCursoInfo(atividade: AtividadeDTO): string {
    return `${atividade.curso.nome} (ID: ${atividade.curso.id})`;
  }

  /**
   * Método auxiliar para obter informações da categoria
   */
  getCategoriaInfo(atividade: AtividadeDTO): string {
    return `${atividade.categoria.nome} (ID: ${atividade.categoria.id})`;
  }

  /**
   * Método auxiliar para obter lista de fontes financiadoras
   */
  getFontesFinanciadoras(atividade: AtividadeDTO): string[] {
    return atividade.fontesFinanciadora.map(fonte => fonte.nome);
  }

  /**
   * Método auxiliar para obter lista de integrantes
   */
  getIntegrantes(atividade: AtividadeDTO): string[] {
    return atividade.integrantes.map(integrante => `${integrante.nome} (${integrante.papel})`);
  }

  // ============================================
  // MÉTODOS DE GERENCIAMENTO DE PESSOAS
  // ============================================

  /**
   * POST /api/atividades-pessoas/{atividadeId}/pessoas/import
   * Importar pessoas em lote via arquivo CSV
   * @PreAuthorize: ADMINISTRADOR, GERENTE, SECRETARIO
   */
  importarPessoasCsv(atividadeId: number, file: File): Observable<PessoaPapelDTO[]> {
    const url = `${environment.apiUrl}/atividades-pessoas/${atividadeId}/pessoas/import`;
    console.log('📡 Importando participantes via CSV:', url);
    console.log('📄 Arquivo selecionado:', file.name, '-', file.size, 'bytes');

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<PessoaPapelDTO[]>(url, formData).pipe(
      timeout(30000),
      tap(response => {
        const quantidade = Array.isArray(response) ? response.length : 0;
        console.log(`✅ Importação concluída. Registros processados: ${quantidade}`);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Erro ao importar participantes via CSV:', error);
        console.error('❌ Status:', error?.status);
        console.error('❌ Message:', error?.message);
        console.error('❌ Error body:', error?.error);
        throw error;
      })
    );
  }

  /**
   * POST /api/atividades-pessoas/{atividadeId}/pessoas/{pessoaId}
   * Associar uma pessoa a uma atividade com um papel específico
   * @PreAuthorize: ADMINISTRADOR, GERENTE, SECRETARIO
   */
  associarPessoa(atividadeId: number, pessoaId: number, papel: Papel): Observable<any> {
    const url = `${environment.apiUrl}/atividades-pessoas/${atividadeId}/pessoas/${pessoaId}`;
    console.log('📡 Associando pessoa à atividade:', url);
    console.log('📋 Papel:', papel);

    const params = new HttpParams().set('papel', papel);

    return this.http.post<any>(url, null, { params }).pipe(
      timeout(30000),
      tap(response => {
        console.log('✅ Pessoa associada com sucesso:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Erro ao associar pessoa:', error);
        console.error('❌ Status:', error?.status);
        console.error('❌ Message:', error?.message);
        console.error('❌ Error body:', error?.error);
        throw error;
      })
    );
  }

  /**
   * PUT /api/atividades-pessoas/{atividadeId}/pessoas/{pessoaId}
   * Alterar o papel de uma pessoa em uma atividade
   * @PreAuthorize: ADMINISTRADOR, GERENTE, SECRETARIO
   */
  alterarPapelPessoa(atividadeId: number, pessoaId: number, novoPapel: Papel): Observable<any> {
    const url = `${environment.apiUrl}/atividades-pessoas/${atividadeId}/pessoas/${pessoaId}`;
    console.log('📡 Alterando papel da pessoa:', url);
    console.log('📋 Novo papel:', novoPapel);

    const params = new HttpParams().set('novoPapel', novoPapel);

    return this.http.put<any>(url, null, { params }).pipe(
      timeout(30000),
      tap(response => {
        console.log('✅ Papel alterado com sucesso:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Erro ao alterar papel:', error);
        console.error('❌ Status:', error?.status);
        console.error('❌ Message:', error?.message);
        console.error('❌ Error body:', error?.error);
        throw error;
      })
    );
  }

  /**
   * GET /api/atividades-pessoas/{atividadeId}/pessoas
   * Listar pessoas associadas a uma atividade
   * @PreAuthorize: ADMINISTRADOR, GERENTE, SECRETARIO
   */
  listarPessoasPorAtividade(atividadeId: number): Observable<PessoaPapelDTO[]> {
    const url = `${environment.apiUrl}/atividades-pessoas/${atividadeId}/pessoas`;
    console.log('📡 Listando pessoas da atividade:', url);

    return this.http.get<PessoaPapelDTO[]>(url).pipe(
      timeout(30000),
      tap(response => {
        console.log('✅ Pessoas da atividade carregadas:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Erro ao listar pessoas:', error);
        console.error('❌ Status:', error?.status);
        console.error('❌ Message:', error?.message);
        console.error('❌ Error body:', error?.error);
        throw error;
      })
    );
  }

  /**
   * DELETE /api/atividades-pessoas/{atividadeId}/pessoas/{pessoaId}
   * Remover uma pessoa de uma atividade
   * @PreAuthorize: ADMINISTRADOR, GERENTE, SECRETARIO
   */
  removerPessoaDaAtividade(atividadeId: number, pessoaId: number): Observable<void> {
    const url = `${environment.apiUrl}/atividades-pessoas/${atividadeId}/pessoas/${pessoaId}`;
    console.log('📡 Removendo pessoa da atividade:', url);

    return this.http.delete<void>(url).pipe(
      timeout(30000),
      tap(() => {
        console.log('✅ Pessoa removida da atividade com sucesso');
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Erro ao remover pessoa:', error);
        console.error('❌ Status:', error?.status);
        console.error('❌ Message:', error?.message);
        console.error('❌ Error body:', error?.error);
        throw error;
      })
    );
  }

  /**
   * Verificar se o usuário pode editar uma atividade específica
   * @param atividade A atividade a ser verificada
   * @returns true se o usuário pode editar, false caso contrário
   */
  podeEditarAtividade(atividade: AtividadeDTO): boolean {
    // Admin, Gerente e Secretário sempre podem (se associados ao curso)
    if (this.apiService.isAdminGerenteOuSecretario()) {
      return true; // Backend fará verificação de associação ao curso
    }

    // Coordenador de Atividade só pode editar se for coordenador desta atividade
    if (this.apiService.isCoordenadorAtividade()) {
      const pessoaId = this.apiService.getPessoaId();
      if (!pessoaId || !atividade.integrantes) {
        return false;
      }

      // Verificar se o usuário está na lista de integrantes como coordenador
      return atividade.integrantes.some(
        integrante => integrante.id === pessoaId && integrante.papel === Papel.COORDENADOR
      );
    }

    return false;
  }

  /**
   * Verificar se o usuário pode criar atividades
   * @returns true se o usuário pode criar, false caso contrário
   */
  podeCriarAtividade(): boolean {
    return this.apiService.podeCriarAtividade();
  }

  /**
   * Verificar se o usuário pode gerenciar atividades (criar/editar/excluir)
   * @returns true se o usuário pode gerenciar, false caso contrário
   */
  podeGerenciarAtividades(): boolean {
    return this.apiService.podeGerenciarAtividades();
  }
}
