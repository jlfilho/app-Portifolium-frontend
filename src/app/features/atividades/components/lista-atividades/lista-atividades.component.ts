import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
// Services
import { AtividadesService } from '../../services/atividades.service';
import { CursosService } from '../../../cursos/services/cursos.service';
import { CursosRelatoriosService } from '../../../cursos/services/cursos-relatorios.service';
import { AtividadeDTO, AtividadeFiltroDTO, Page, PessoaPapelDTO } from '../../models/atividade.model';
import { extractApiMessage } from '../../../../shared/utils/message.utils';
import { ApiService } from '../../../../shared/api.service';
import { RelatorioCursoDialogComponent } from '../../../cursos/components/relatorio-curso-dialog/relatorio-curso-dialog.component';
import type { RelatorioCursoDialogResult } from '../../../cursos/components/relatorio-curso-dialog/relatorio-curso-dialog.component';
import { EvidenciasService } from '../../../evidencias/services/evidencias.service';

@Component({
  selector: 'acadmanage-lista-atividades',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatDialogModule
  ],
  templateUrl: './lista-atividades.component.html',
  styleUrl: './lista-atividades.component.css'
})
export class ListaAtividadesComponent implements OnInit {
  cursoId!: number;
  cursoNome = '';
  atividades: AtividadeDTO[] = [];
  categorias: any[] = [];
  isLoading = true;
  isGeneratingRelatorio = false;
  errorMessage = '';
  emptyMessage = 'Sem atividade cadastrada!';

  // Filtros
  filtros: AtividadeFiltroDTO = {};
  filtroNome = '';
  filtroCategoriaId: number | null = null;
  filtroStatusPublicacao: boolean | null = null;
  filtroDataInicio: Date | null = null;
  filtroDataFim: Date | null = null;

  // Paginação
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25, 50];

  // Opções de status
  statusOptions = [
    { value: null, label: 'Todos' },
    { value: true, label: 'Publicado' },
    { value: false, label: 'Não Publicado' }
  ];

  private participantesCache = new Map<number, PessoaPapelDTO[]>();
  private evidenciasCountCache = new Map<number, number>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public atividadesService: AtividadesService,
    private cursosService: CursosService,
    private readonly cursosRelatoriosService: CursosRelatoriosService,
    private readonly apiService: ApiService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private evidenciasService: EvidenciasService
  ) {}

  ngOnInit(): void {
    this.cursoId = Number(this.route.snapshot.paramMap.get('cursoId'));
    // Tentar recuperar nome do curso via state (enviado pela navegação)
    this.cursoNome = (history.state && history.state.cursoNome) || this.route.snapshot.queryParamMap.get('nome') || '';

    // Comentado temporariamente para debug
    // this.setFiltroDataPadrao();

    this.loadCategorias();
    this.loadAtividades();
  }

  setFiltroDataPadrao(): void {
    const hoje = new Date();
    const treAnosAtras = new Date();
    treAnosAtras.setFullYear(hoje.getFullYear() - 3);

    this.filtroDataInicio = treAnosAtras;
    this.filtroDataFim = hoje;

    console.log('📅 Filtro padrão de data configurado:', {
      dataInicio: this.formatarDataParaISO(treAnosAtras),
      dataFim: this.formatarDataParaISO(hoje)
    });
  }

  loadCategorias(): void {
    this.cursosService.getAllCategoriesPaginado({ page: 0, size: 1000, sortBy: 'id', direction: 'ASC' }).subscribe({
      next: (page) => {
        console.log('📚 Categorias carregadas:', page);
        this.categorias = Array.isArray(page) ? page : (page?.content || []);
        console.log('📚 Categorias array:', this.categorias);
      },
      error: (error) => {
        console.error('❌ Erro ao carregar categorias:', error);
        this.categorias = [];
      }
    });
  }

  loadAtividades(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Construir objeto de filtros
    const filtros: AtividadeFiltroDTO = {
      cursoId: this.cursoId,
      nome: this.filtroNome || undefined,
      categoriaId: this.filtroCategoriaId || undefined,
      statusPublicacao: this.filtroStatusPublicacao !== null ? this.filtroStatusPublicacao : undefined,
      dataInicio: this.filtroDataInicio ? this.formatarDataParaISO(this.filtroDataInicio) : undefined,
      dataFim: this.filtroDataFim ? this.formatarDataParaISO(this.filtroDataFim) : undefined
    };

    console.log('🔍 Carregando atividades com filtros:', filtros);
    console.log('📄 Página:', this.pageIndex, 'Tamanho:', this.pageSize);

    this.atividadesService.getAtividadesPorFiltros(filtros, this.pageIndex, this.pageSize).subscribe({
      next: (page: Page<AtividadeDTO> | null | undefined) => {
        console.log('✅ Atividades carregadas:', page);

        if (!page) {
          this.handleEmptyAtividades();
          return;
        }

        this.atividades = page.content || [];
        this.totalElements = page.totalElements || 0;
        this.isLoading = false;
        this.complementarDadosDasAtividades();

        // Log detalhado das atividades para debug das fotos
        console.log('📸 URLs das fotos de capa das atividades:');
        this.atividades.forEach((atividade, index) => {
          if (atividade.fotoCapa) {
            console.log(`  ${index + 1}. ${atividade.nome}: ${this.getImageUrl(atividade.fotoCapa)}`);
          } else {
            console.log(`  ${index + 1}. ${atividade.nome}: Sem foto de capa`);
          }
        });

        if (this.atividades.length === 0) {
          this.handleEmptyAtividades();
        } else {
          this.errorMessage = '';
        }
      },
      error: (error) => {
        console.error('❌ Erro ao carregar atividades:', error);
        console.error('❌ Status:', error?.status);
        console.error('❌ StatusText:', error?.statusText);
        console.error('❌ Message:', error?.message);
        console.error('❌ Error completo:', JSON.stringify(error, null, 2));

        this.errorMessage = this.extractErrorMessage(error);
        this.atividades = [];
        this.totalElements = 0;
        this.isLoading = false;
        this.showMessage('Erro ao carregar atividades: ' + this.errorMessage, 'error');
      }
    });
  }

  aplicarFiltros(): void {
    this.pageIndex = 0; // Resetar para primeira página
    this.loadAtividades();
  }

  limparFiltros(): void {
    this.filtroNome = '';
    this.filtroCategoriaId = null;
    this.filtroStatusPublicacao = null;
    this.filtroDataInicio = null;
    this.filtroDataFim = null;
    this.pageIndex = 0;
    this.loadAtividades();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAtividades();
  }

  formatarDataParaISO(data: Date): string {
    return data.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  back(): void {
    this.router.navigate(['/cursos']);
  }

  novaAtividade(): void {
    console.log('➕ Criando nova atividade para curso:', this.cursoId);
    // Navegar para o formulário de criação
    this.router.navigate(['/atividades/nova', this.cursoId], {
      state: {
        cursoId: this.cursoId,
        cursoNome: this.cursoNome
      }
    });
  }

  visualizarAtividade(atividade: AtividadeDTO): void {
    console.log('👁️ Visualizando atividade:', atividade);

    // Navegar para a página de visualização
    this.router.navigate(['/atividades/visualizar', atividade.id], {
      state: {
        atividade: atividade,
        cursoId: this.cursoId,
        cursoNome: this.cursoNome
      }
    });
  }

  editarAtividade(atividade: AtividadeDTO): void {
    if (!atividade || !atividade.id) {
      console.warn('⚠️ Atividade inválida ao tentar editar:', atividade);
      return;
    }
    this.router.navigate(['/atividades/editar', atividade.id], {
      state: {
        atividade,
        cursoNome: this.cursoNome,
        cursoId: this.cursoId
      }
    });
  }

  async confirmarExclusao(atividade: AtividadeDTO): Promise<void> {
    const confirmado = await this.openConfirmDialog({
      title: 'Excluir Atividade',
      message: `Tem certeza que deseja excluir a atividade "${atividade?.nome}"? Essa ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar'
    });

    if (confirmado === true && atividade?.id) {
      this.excluirAtividade(atividade.id);
    }
  }

  private excluirAtividade(atividadeId: number): void {
    this.isLoading = true;
    this.atividadesService.excluirAtividade(atividadeId).subscribe({
      next: () => {
        this.showMessage('Atividade excluída com sucesso!', 'success');
        this.loadAtividades();
      },
      error: (error) => {
        const apiMessage = extractApiMessage(error);
        this.showMessage(apiMessage || 'Erro ao excluir atividade. Tente novamente.', 'error');
        this.isLoading = false;
      }
    });
  }

  private async openConfirmDialog(data: { title: string; message: string; confirmText: string; cancelText: string }): Promise<boolean> {
    const { SimpleConfirmDialogComponent } = await import('../../../../shared/components/simple-confirm-dialog/simple-confirm-dialog.component');
    const dialogRef = this.dialog.open(SimpleConfirmDialogComponent, {
      width: '460px',
      data
    });
    return firstValueFrom(dialogRef.afterClosed());
  }

  getImageUrl(fotoCapa: string): string {
    // Se já é uma URL completa, retorna como está
    if (fotoCapa.startsWith('http')) {
      return fotoCapa;
    }
    // Caso contrário, adiciona o base URL do backend com /api/files
    return `http://localhost:8080/api/files${fotoCapa}`;
  }

  onImageError(event: any): void {
    console.error('❌ Erro ao carregar imagem:', event.target.src);
    console.error('❌ Elemento da imagem:', event.target);
    // Substituir por imagem padrão em caso de erro
    event.target.src = '/imagens/curso-header.png';
    console.log('🔄 Imagem substituída por padrão:', event.target.src);
  }

  onImageLoad(event: any): void {
    console.log('✅ Imagem carregada com sucesso:', event.target.src);
  }

  formatarData(dataISO: string): string {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR');
  }

  private showMessage(message: string, type: 'success' | 'error' | 'warning'): void {
    const panelClass = type === 'success' ? 'snackbar-success' :
                      type === 'error' ? 'snackbar-error' :
                      'snackbar-warning';

    this.snackBar.open(message, 'Fechar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  private extractErrorMessage(error: any): string {
    if (error?.error) {
      if (typeof error.error === 'string') return error.error;
      if (error.error.message) return error.error.message;
      if (error.error.error) return error.error.error;
    }
    if (error?.message) return error.message;
    return 'Erro ao processar solicitação.';
  }

  trackByAtividadeId(index: number, atividade: AtividadeDTO): number {
    return atividade.id || index;
  }

  getParticipantesCount(atividade: AtividadeDTO): number {
    if (!atividade) {
      return 0;
    }

    const integrantesLength = Array.isArray(atividade.integrantes) ? atividade.integrantes.length : 0;
    if (integrantesLength > 0) {
      return integrantesLength;
    }

    const atividadeAny = atividade as any;
    return atividadeAny.totalParticipantes ?? atividadeAny.participantesCount ?? 0;
  }

  getEvidenciasCount(atividade: AtividadeDTO): number {
    if (!atividade) {
      return 0;
    }

    const atividadeAny = atividade as any;
    return atividadeAny.totalEvidencias ?? atividadeAny.evidenciasCount ?? 0;
  }

  private complementarDadosDasAtividades(): void {
    if (!Array.isArray(this.atividades) || this.atividades.length === 0) {
      return;
    }

    this.atividades.forEach(atividade => {
      this.preencherParticipantes(atividade);
      this.preencherEvidencias(atividade);
    });
  }

  private preencherParticipantes(atividade: AtividadeDTO): void {
    const atividadeId = atividade.id;
    if (!atividadeId) {
      return;
    }

    if (Array.isArray(atividade.integrantes) && atividade.integrantes.length > 0) {
      (atividade as any).totalParticipantes = atividade.integrantes.length;
      this.participantesCache.set(atividadeId, atividade.integrantes);
      return;
    }

    if (this.participantesCache.has(atividadeId)) {
      const participantesCacheados = this.participantesCache.get(atividadeId) ?? [];
      atividade.integrantes = participantesCacheados;
      (atividade as any).totalParticipantes = participantesCacheados.length;
      return;
    }

    this.atividadesService.listarPessoasPorAtividade(atividadeId).subscribe({
      next: (participantes) => {
        const participantesNormalizados = this.normalizeParticipantes(participantes);
        this.participantesCache.set(atividadeId, participantesNormalizados);
        atividade.integrantes = participantesNormalizados;
        (atividade as any).totalParticipantes = participantesNormalizados.length;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar participantes para atividade', atividadeId, error);
        (atividade as any).totalParticipantes = 0;
      }
    });
  }

  private preencherEvidencias(atividade: AtividadeDTO): void {
    const atividadeId = atividade.id;
    if (!atividadeId) {
      return;
    }

    const evidenciasExistentes = (atividade as any).totalEvidencias ?? (atividade as any).evidenciasCount;
    if (typeof evidenciasExistentes === 'number') {
      (atividade as any).totalEvidencias = evidenciasExistentes;
      return;
    }

    if (this.evidenciasCountCache.has(atividadeId)) {
      (atividade as any).totalEvidencias = this.evidenciasCountCache.get(atividadeId) ?? 0;
      return;
    }

    this.evidenciasService.listarEvidenciasPorAtividade(atividadeId).subscribe({
      next: (evidencias) => {
        const totalEvidencias = Array.isArray(evidencias) ? evidencias.length : 0;
        this.evidenciasCountCache.set(atividadeId, totalEvidencias);
        (atividade as any).totalEvidencias = totalEvidencias;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar evidências para atividade', atividadeId, error);
        this.evidenciasCountCache.set(atividadeId, 0);
        (atividade as any).totalEvidencias = 0;
      }
    });
  }

  private normalizeParticipantes(participantes: PessoaPapelDTO[] | null | undefined): PessoaPapelDTO[] {
    if (!Array.isArray(participantes)) {
      return [];
    }

    return participantes
      .filter((participante): participante is PessoaPapelDTO => !!participante)
      .map(participante => ({
        id: participante.id ?? 0,
        nome: participante.nome?.trim() && participante.nome.trim().length > 0
          ? participante.nome.trim()
          : 'Participante',
        cpf: participante.cpf ?? '',
        papel: participante.papel ?? ''
      }));
  }

  private hasActiveFilters(): boolean {
    return Boolean(
      (this.filtroNome && this.filtroNome.trim()) ||
      this.filtroCategoriaId !== null ||
      this.filtroStatusPublicacao !== null ||
      this.filtroDataInicio ||
      this.filtroDataFim
    );
  }

  private handleEmptyAtividades(): void {
    this.atividades = [];
    this.totalElements = 0;
    this.isLoading = false;
    this.emptyMessage = this.hasActiveFilters()
      ? 'Nenhuma atividade encontrada com os filtros aplicados.'
      : 'Sem atividade cadastrada!';
  }

  get podeGerarRelatorio(): boolean {
    return this.apiService.hasAnyRole(['ADMINISTRADOR', 'GERENTE', 'SECRETARIO']);
  }

  async abrirDialogRelatorio(): Promise<void> {
    if (!this.podeGerarRelatorio) {
      return;
    }

    const categoriasDialog = (this.categorias || []).map((categoria: any) => ({
      id: categoria.id,
      nome: categoria.nome
    }));

    const dialogRef = this.dialog.open<RelatorioCursoDialogComponent, { cursoNome: string; categorias: Array<{ id: number; nome: string }> }, RelatorioCursoDialogResult | null>(
      RelatorioCursoDialogComponent,
      {
        width: '600px',
        data: {
          cursoNome: this.cursoNome,
          categorias: categoriasDialog
        }
      }
    );

    const resultado = await firstValueFrom(dialogRef.afterClosed());

    if (resultado) {
      this.gerarRelatorio(resultado);
    }
  }

  private gerarRelatorio(filtro: RelatorioCursoDialogResult): void {
    this.isGeneratingRelatorio = true;
    this.cursosRelatoriosService.gerarRelatorioCurso(this.cursoId, filtro).subscribe({
      next: (blob: Blob) => {
        this.isGeneratingRelatorio = false;
        const fileName = `relatorio-curso-${this.cursoId}-${filtro.dataInicio}-${filtro.dataFim}.pdf`;
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(blobUrl);
        this.showMessage('Relatório gerado com sucesso!', 'success');
      },
      error: (error: HttpErrorResponse) => {
        this.isGeneratingRelatorio = false;
        const mensagem = extractApiMessage(error) || 'Não foi possível gerar o relatório. Verifique os filtros e tente novamente.';
        this.showMessage(mensagem, 'error');
      }
    });
  }
}
