import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AtividadeDTO, PessoaPapelDTO } from '../../models/atividade.model';
import { AtividadesService } from '../../services/atividades.service';
import { Papel, PapelUtils } from '../../models/papel.enum';
import { EvidenciasService } from '../../../evidencias/services/evidencias.service';
import { EvidenciaDTO } from '../../../evidencias/models/evidencia.model';
import { ImageCompressionService, CompressionResult } from '../../../../shared/services/image-compression.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { extractApiMessage } from '../../../../shared/utils/message.utils';
import { ApiService } from '../../../../shared/api.service';
import { BreaklinesPipe } from '../../../../shared/pipes/breaklines.pipe';
import { GerarRelatorioAtividadeComponent } from '../gerar-relatorio-atividade/gerar-relatorio-atividade.component';

@Component({
  selector: 'acadmanage-visualizar-atividade',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatCardModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatDialogModule,
    BreaklinesPipe
  ],
  templateUrl: './visualizar-atividade.component.html',
  styleUrl: './visualizar-atividade.component.css'
})
export class VisualizarAtividadeComponent implements OnInit, OnDestroy {
  atividade: AtividadeDTO | null = null;
  atividadeId!: number;
  cursoId!: number;
  cursoNome: string = '';
  isLoading = true;
  errorMessage = '';

  // Evidências / Carrossel
  evidencias: EvidenciaDTO[] = [];
  isLoadingEvidencias = false;

  // Carrossel de evidências
  currentSlideIndex = 0;
  carrosselPageSize = 5;
  carrosselPageIndex = 0;

  // Paginação dos participantes
  integrantesPageSize = 6;
  integrantesPageIndex = 0;

  // Upload de evidência
  showUploadForm = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  legenda = '';
  isUploading = false;
  dragOver = false;
  isCompressing = false;
  compressionInfo: CompressionResult | null = null;
  deletingEvidenceId: number | null = null;
  isEditingEvidence = false;
  editingEvidence: EvidenciaDTO | null = null;

  private fetchingExistingFile = false;
  canManageEvidencias = false;
  private authoritiesSub?: Subscription;
  isReordering = false;
  orderChanged = false;
  savingOrder = false;
  private ordemOriginal: EvidenciaDTO[] = [];
  private participantesBuffer: PessoaPapelDTO[] | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private atividadesService: AtividadesService,
    private evidenciasService: EvidenciasService,
    private imageCompressionService: ImageCompressionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // Obter ID da atividade da rota
    this.atividadeId = Number(this.route.snapshot.paramMap.get('id'));

    // Tentar obter informações do state
    const state = history.state;
    if (state && state.atividade) {
      const atividadeEstado = this.normalizeAtividade(state.atividade);
      if (this.participantesBuffer) {
        atividadeEstado.integrantes = this.participantesBuffer;
        atividadeEstado.totalParticipantes = this.participantesBuffer.length;
        atividadeEstado.participantesCount = this.participantesBuffer.length;
      }
      this.atividade = atividadeEstado;
      this.cursoId = state.cursoId || atividadeEstado.curso.id;
      this.cursoNome = state.cursoNome || atividadeEstado.curso.nome;
      this.isLoading = false;
      
      if (!atividadeEstado.integrantes || atividadeEstado.integrantes.length === 0) {
        this.carregarAtividade(false);
      }
    } else {
      // Carregar atividade da API
      this.carregarAtividade();
    }

    // Carregar evidências da atividade
    this.carregarEvidencias();
    this.carregarParticipantes();

    this.updatePermissions();
    this.authoritiesSub = this.apiService.authorities.subscribe(() => this.updatePermissions());
  }

  ngOnDestroy(): void {
    this.authoritiesSub?.unsubscribe();
  }

  carregarAtividade(showLoading: boolean = true): void {
    if (showLoading) {
      this.isLoading = true;
    }
    
    this.atividadesService.getAtividadeById(this.atividadeId).subscribe({
      next: (response) => {
        const atividadeNormalizada = this.normalizeAtividade(response);
        if (this.participantesBuffer) {
          atividadeNormalizada.integrantes = this.participantesBuffer;
          atividadeNormalizada.totalParticipantes = this.participantesBuffer.length;
          atividadeNormalizada.participantesCount = this.participantesBuffer.length;
        }
        this.atividade = atividadeNormalizada;
        this.cursoId = atividadeNormalizada.curso.id;
        this.cursoNome = atividadeNormalizada.curso.nome;
        this.integrantesPageIndex = 0;
        this.isLoading = false;
              },
      error: (error) => {
        console.error('❌ Erro ao carregar atividade:', error);
        this.errorMessage = 'Erro ao carregar atividade';
        this.isLoading = false;
        this.showMessage('Erro ao carregar atividade', 'error');
      }
    });
  }

  getImageUrl(fotoCapa: string): string {
    if (fotoCapa.startsWith('http')) {
      return fotoCapa;
    }
    return `http://localhost:8080/api/files${fotoCapa}`;
  }

  formatarData(data: string): string {
    if (!data) return 'Data não informada';
    const dataObj = new Date(data + 'T00:00:00');
    return dataObj.toLocaleDateString('pt-BR');
  }

  formatarDataAtividade(atividade: AtividadeDTO): string {
    if (!atividade.dataRealizacao) return 'Data não informada';
    
    const dataInicio = new Date(atividade.dataRealizacao + 'T00:00:00');
    const dataInicioFormatada = dataInicio.toLocaleDateString('pt-BR');
    
    if (!atividade.dataFim) {
      // Evento em data única
      return dataInicioFormatada;
    } else {
      // Evento em período
      const dataFim = new Date(atividade.dataFim + 'T00:00:00');
      const dataFimFormatada = dataFim.toLocaleDateString('pt-BR');
      return `${dataInicioFormatada} a ${dataFimFormatada}`;
    }
  }

  getPapelLabel(papel: string): string {
    return PapelUtils.getLabel(papel as Papel);
  }

  getPapelIcon(papel: string): string {
    return PapelUtils.getIcon(papel as Papel);
  }

  getPapelColor(papel: string): string {
    return PapelUtils.getColor(papel as Papel);
  }

  get coordenadoresExibidos(): PessoaPapelDTO[] {
    return this.getParticipantesOrdenados().filter(participante => participante.papel === Papel.COORDENADOR);
  }

  get participantesSemCoordenador(): PessoaPapelDTO[] {
    return this.getParticipantesOrdenados().filter(participante => participante.papel !== Papel.COORDENADOR);
  }

  get participantesPaginados(): PessoaPapelDTO[] {
    const start = this.integrantesPageIndex * this.integrantesPageSize;
    const end = start + this.integrantesPageSize;
    return this.participantesSemCoordenador.slice(start, end);
  }

  get totalParticipantesPaginas(): number {
    return Math.max(1, Math.ceil(this.participantesSemCoordenador.length / this.integrantesPageSize));
  }

  get hasMoreParticipantesPages(): boolean {
    return this.participantesSemCoordenador.length > this.integrantesPageSize;
  }

  onParticipantesPageChange(event: PageEvent): void {
    this.integrantesPageIndex = event.pageIndex;
  }

  editarAtividade(): void {
    if (!this.atividade) return;

    if (!this.atividadesService.podeEditarAtividade(this.atividade)) {
      this.showMessage(
        'Você não tem permissão para editar esta atividade. Apenas coordenadores da atividade podem editá-la.',
        'warning'
      );
      return;
    }

        this.router.navigate(['/admin/atividades/editar', this.atividadeId], {
      state: {
        atividade: this.atividade,
        cursoId: this.cursoId,
        cursoNome: this.cursoNome
      }
    });
  }

  canEditAtividade(): boolean {
    return !!this.atividade && this.atividadesService.podeEditarAtividade(this.atividade);
  }

  voltar(): void {
        this.router.navigate(['/admin/atividades/curso', this.cursoId], {
      state: {
        cursoNome: this.cursoNome
      }
    });
  }

  showMessage(message: string, type: 'success' | 'error' | 'warning' = 'success'): void {
    const panelClass = type === 'success' ? 'success-snackbar' : type === 'error' ? 'error-snackbar' : 'warning-snackbar';
    this.snackBar.open(message, 'Fechar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  private getParticipantesOrdenados(): PessoaPapelDTO[] {
    const integrantes = this.atividade?.integrantes ?? [];
    if (!Array.isArray(integrantes)) {
      return [];
    }

    return [...integrantes].filter(Boolean);
  }

  private updatePermissions(): void {
    // Verificar se pode gerenciar evidências (inclui COORDENADOR_ATIVIDADE)
    // Mas ainda precisa verificar se é coordenador da atividade específica
    this.canManageEvidencias = this.apiService.podeGerenciarAtividades();
    
    // Se for COORDENADOR_ATIVIDADE, verificar se é coordenador desta atividade
    if (this.apiService.isCoordenadorAtividade() && this.atividade) {
      const pessoaId = this.apiService.getPessoaId();
      if (pessoaId && this.atividade.integrantes) {
        const isCoordenador = this.atividade.integrantes.some(
          integrante => integrante.id === pessoaId && integrante.papel === 'COORDENADOR'
        );
        this.canManageEvidencias = isCoordenador;
      } else {
        this.canManageEvidencias = false;
      }
    }
  }

  temPermissaoGerarRelatorio(): boolean {
    const authorities = this.apiService.getAuthorities();
    
    // Verificar se tem uma das roles permitidas
    const temRolePermitida = authorities.some(role => 
      role === 'ROLE_ADMINISTRADOR' ||
      role === 'ROLE_GERENTE' ||
      role === 'ROLE_SECRETARIO' ||
      role === 'ROLE_COORDENADOR_ATIVIDADE'
    );

    if (!temRolePermitida) {
      return false;
    }

    // Se for COORDENADOR_ATIVIDADE, verificar se é coordenador desta atividade
    if (this.apiService.isCoordenadorAtividade() && this.atividade) {
      const pessoaId = this.apiService.getPessoaId();
      if (pessoaId && this.atividade.integrantes) {
        return this.atividade.integrantes.some(
          integrante => integrante.id === pessoaId && integrante.papel === 'COORDENADOR'
        );
      }
      return false;
    }

    return true;
  }

  abrirDialogRelatorio(): void {
    if (!this.atividade) {
      return;
    }

    const dialogRef = this.dialog.open(GerarRelatorioAtividadeComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: {
        atividadeId: this.atividadeId,
        atividadeNome: this.atividade.nome
      }
    });
  }

  private normalizeAtividade(atividade: AtividadeDTO): AtividadeDTO {
    const integrantesArray = Array.isArray(atividade?.integrantes) ? atividade.integrantes.filter(Boolean) : [];
    const totalParticipantes =
      atividade.totalParticipantes ??
      atividade.participantesCount ??
      integrantesArray.length;

    return {
      ...atividade,
      integrantes: integrantesArray,
      totalParticipantes,
      participantesCount: totalParticipantes
    };
  }

  private carregarParticipantes(): void {
    if (!this.atividadeId) {
      return;
    }

    this.atividadesService.listarPessoasPorAtividade(this.atividadeId).subscribe({
      next: (participantes) => {
        const participantesNormalizados = this.normalizeParticipantes(participantes);
        this.participantesBuffer = participantesNormalizados;

        if (this.atividade) {
          this.atividade = {
            ...this.atividade,
            integrantes: participantesNormalizados,
            totalParticipantes: participantesNormalizados.length,
            participantesCount: participantesNormalizados.length
          };
        }
        this.integrantesPageIndex = 0;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar participantes da atividade:', error);
        this.participantesBuffer = [];
        if (this.atividade) {
          this.atividade = {
            ...this.atividade,
            integrantes: [],
            totalParticipantes: 0,
            participantesCount: 0
          };
        }
        this.integrantesPageIndex = 0;
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

  // ===== MÉTODOS DO CARROSSEL DE EVIDÊNCIAS =====

  carregarEvidencias(): void {
    this.isLoadingEvidencias = true;
    
    this.evidenciasService.listarEvidenciasPorAtividade(this.atividadeId).subscribe({
      next: (evidencias) => {
        const normalized = evidencias.map(e => this.normalizeEvidencia(e));
        this.evidencias = this.sortEvidencias(normalized);
        this.ordemOriginal = this.cloneEvidencias(this.evidencias);
        this.orderChanged = false;
        this.savingOrder = false;
        this.refreshCarouselAfterDataChange();
        this.isLoadingEvidencias = false;
                
        if (this.isReordering && !this.orderChanged) {
          // Mantenha modo reordenação apenas se o usuário estiver no meio do ajuste
          this.isReordering = false;
        }
      },
      error: (error) => {
        console.error('❌ Erro ao carregar evidências:', error);
        this.evidencias = [];
        this.ordemOriginal = [];
        this.isReordering = false;
        this.orderChanged = false;
        this.savingOrder = false;
        this.refreshCarouselAfterDataChange();
        this.isLoadingEvidencias = false;
      }
    });
  }

  getEvidenciaImageUrl(foto: string): string {
    return this.evidenciasService.getImageUrl(foto);
  }

  getEvidenciaImageUrlFromEvidencia(evidencia: EvidenciaDTO | null | undefined): string {
    return this.evidenciasService.getImageUrl(this.getEvidenciaFotoPath(evidencia));
  }

  previousSlide(): void {
    if (this.evidenciasPaginadas.length === 0) return;
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.evidenciasPaginadas.length) % this.evidenciasPaginadas.length;
  }

  nextSlide(): void {
    if (this.evidenciasPaginadas.length === 0) return;
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.evidenciasPaginadas.length;
  }

  goToSlide(index: number): void {
    this.currentSlideIndex = index;
  }

  get currentEvidencia(): EvidenciaDTO | null {
    return this.evidenciasPaginadas[this.currentSlideIndex] || null;
  }

  get evidenciasPaginadas(): EvidenciaDTO[] {
    const start = this.carrosselPageIndex * this.carrosselPageSize;
    const end = start + this.carrosselPageSize;
    return this.evidencias.slice(start, end);
  }

  get totalCarrosselPages(): number {
    return Math.ceil(this.evidencias.length / this.carrosselPageSize);
  }

  get hasMultiplePages(): boolean {
    return this.evidencias.length > this.carrosselPageSize;
  }

  previousCarrosselPage(): void {
    if (this.carrosselPageIndex > 0) {
      this.carrosselPageIndex--;
      this.currentSlideIndex = 0;
    }
  }

  nextCarrosselPage(): void {
    if (this.carrosselPageIndex < this.totalCarrosselPages - 1) {
      this.carrosselPageIndex++;
      this.currentSlideIndex = 0;
    }
  }

  goToCarrosselPage(pageIndex: number): void {
    this.carrosselPageIndex = pageIndex;
    this.currentSlideIndex = 0;
  }

  // ===== MÉTODOS DE UPLOAD DE EVIDÊNCIA =====

  toggleUploadForm(): void {
    if (!this.canManageEvidencias) {
      this.showMessage('Você não tem permissão para gerenciar evidências.', 'error');
      return;
    }

    if (this.isEditingEvidence) {
      this.cancelarEdicaoEvidencia();
      return;
    }

    this.showUploadForm = !this.showUploadForm;
    if (!this.showUploadForm) {
      this.resetUploadForm();
    } else {
      this.resetUploadForm();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.processFile(file);
    }
  }

  private async processFile(file: File): Promise<void> {
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      this.showMessage('Por favor, selecione apenas imagens', 'error');
      return;
    }

    
    // Iniciar compressão
    this.isCompressing = true;
    this.compressionInfo = null;

    try {
      const maxSizeBytes = 10 * 1024 * 1024; // 10MB
      const requiresDownscale = file.size > maxSizeBytes;

      if (requiresDownscale) {
              }

      // Comprimir imagem
      const compressionResult = await this.imageCompressionService.compressImage(file, {
        maxWidth: requiresDownscale ? 4096 : 1920,
        maxHeight: requiresDownscale ? 4096 : 1920,
        quality: 0.85,
        maxSizeKB: requiresDownscale ? Math.floor(maxSizeBytes / 1024) : 800
      });

      if (requiresDownscale && compressionResult.compressedSize > maxSizeBytes) {
        this.showMessage('Não foi possível reduzir a imagem para até 10MB. Tente uma imagem com menor resolução.', 'error');
        this.isCompressing = false;
        this.selectedFile = null;
        this.previewUrl = null;
        return;
      }

      this.selectedFile = compressionResult.compressedFile;
      this.compressionInfo = compressionResult;

      // Criar preview da imagem comprimida
      this.previewUrl = await this.imageCompressionService.createPreview(compressionResult.compressedFile, 600);

      // Mostrar resultado da compressão
      const reduction = compressionResult.compressionRatio.toFixed(1);
      
      if (compressionResult.compressionRatio > 10) {
        this.showMessage(
          `Imagem comprimida: ${this.formatFileSize(compressionResult.compressedSize)} (${reduction}% menor)`,
          'success'
        );
      }

      this.isCompressing = false;
    } catch (error) {
      console.error('❌ Erro na compressão:', error);
      this.showMessage('Erro ao processar imagem. Tente outro arquivo.', 'error');
      this.isCompressing = false;
      this.selectedFile = null;
      this.previewUrl = null;
    }
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.compressionInfo = null;
  }

  async salvarEvidencia(): Promise<void> {
    if (!this.canManageEvidencias) {
      this.showMessage('Você não tem permissão para salvar evidências.', 'error');
      return;
    }

    if (!this.legenda.trim()) {
      this.showMessage('Adicione uma legenda para a evidência.', 'warning');
      return;
    }

    let arquivoParaEnviar: File | null = this.selectedFile;

    if (!this.isEditingEvidence) {
      if (!arquivoParaEnviar) {
        this.showMessage('Selecione uma imagem e adicione uma legenda.', 'warning');
        return;
      }
    } else if (!arquivoParaEnviar && this.editingEvidence) {
      arquivoParaEnviar = await this.obterArquivoDaEvidencia(this.editingEvidence);
      if (!arquivoParaEnviar) {
        return;
      }
    }

    if (!arquivoParaEnviar) {
      this.showMessage('Não foi possível preparar a imagem da evidência.', 'error');
      return;
    }

    let evidenciaId: number | null = null;
    if (this.isEditingEvidence) {
      evidenciaId = this.editingEvidence?.id ?? null;
      if (evidenciaId === null) {
        this.showMessage('Não foi possível identificar a evidência a ser editada.', 'error');
        return;
      }
    }

    this.isUploading = true;
    
    const legendaFormatada = this.legenda.trim();

    const request$ = this.isEditingEvidence && evidenciaId !== null
      ? this.evidenciasService.atualizarEvidencia(evidenciaId, legendaFormatada, arquivoParaEnviar)
      : this.evidenciasService.salvarEvidencia(this.atividadeId, legendaFormatada, arquivoParaEnviar);

    request$.subscribe({
      next: () => {
        const mensagem = this.isEditingEvidence ? 'Evidência atualizada com sucesso!' : 'Evidência postada com sucesso!';
        this.showMessage(mensagem, 'success');
        this.isUploading = false;
        this.carregarEvidencias();
        this.cancelarEdicaoEvidencia();
        this.showUploadForm = false;
      },
      error: (error) => {
        console.error('❌ Erro ao salvar evidência:', error);
        this.isUploading = false;
        if (error?.status === 403) {
          this.showMessage(
            'Você não tem permissão para gerenciar evidências desta atividade. Apenas coordenadores da atividade podem gerenciá-las.',
            'error'
          );
        } else {
          const apiMessage = extractApiMessage(error);
          this.showMessage(apiMessage || 'Erro ao salvar evidência.', 'error');
        }
      }
    });
  }

  async confirmarExclusaoEvidencia(evidencia: EvidenciaDTO): Promise<void> {
    if (!this.canManageEvidencias) {
      this.showMessage('Você não tem permissão para excluir evidências.', 'error');
      return;
    }

    const confirmado = await this.openConfirmDialog({
      title: 'Excluir Evidência',
      message: `Tem certeza que deseja excluir a evidência "${evidencia.legenda}"? Esta ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar'
    });

    if (confirmado === true && evidencia.id) {
      this.excluirEvidencia(evidencia.id);
    }
  }

  private excluirEvidencia(evidenciaId: number): void {
    this.deletingEvidenceId = evidenciaId;
    this.evidenciasService.excluirEvidencia(evidenciaId).subscribe({
      next: () => {
        this.showMessage('Evidência excluída com sucesso!', 'success');
        this.deletingEvidenceId = null;
        this.carregarEvidencias();
      },
      error: (error) => {
        this.deletingEvidenceId = null;
        if (error?.status === 403) {
          this.showMessage(
            'Você não tem permissão para excluir evidências desta atividade. Apenas coordenadores da atividade podem excluí-las.',
            'error'
          );
        } else {
          const apiMessage = extractApiMessage(error);
          this.showMessage(apiMessage || error.message || 'Erro ao excluir evidência.', 'error');
        }
      }
    });
  }

  private resetUploadForm(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.legenda = '';
    this.dragOver = false;
    this.compressionInfo = null;
    this.isCompressing = false;
    this.isEditingEvidence = false;
    this.editingEvidence = null;
  }

  editarEvidencia(evidencia: EvidenciaDTO): void {
    if (!this.canManageEvidencias) {
      this.showMessage('Você não tem permissão para editar evidências.', 'error');
      return;
    }

    this.isEditingEvidence = true;
    this.editingEvidence = evidencia;
    this.legenda = evidencia.legenda || '';
    this.previewUrl = this.getEvidenciaImageUrlFromEvidencia(evidencia);
    this.selectedFile = null;
    this.compressionInfo = null;
    this.showUploadForm = true;
    this.isCompressing = false;
  }

  cancelarEdicaoEvidencia(): void {
    this.showUploadForm = false;
    this.resetUploadForm();
  }

  iniciarReordenacao(): void {
    if (!this.canManageEvidencias || this.evidencias.length < 2) {
      return;
    }

    this.isReordering = true;
    this.orderChanged = false;
    this.ordemOriginal = this.cloneEvidencias(this.evidencias);
  }

  cancelarReordenacao(): void {
    if (this.savingOrder) {
      return;
    }

    const currentId = this.getCurrentEvidenceId();
    this.isReordering = false;
    this.orderChanged = false;
    this.evidencias = this.cloneEvidencias(this.ordemOriginal.length ? this.ordemOriginal : this.evidencias);
    this.refreshCarouselAfterDataChange(currentId);
  }

  moverEvidencia(evidencia: EvidenciaDTO, direction: number): void {
    if (!this.isReordering || this.savingOrder) {
      return;
    }

    const index = this.evidencias.findIndex(ev => ev.id === evidencia.id);
    if (index === -1) {
      return;
    }

    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= this.evidencias.length) {
      return;
    }

    const reordered = [...this.evidencias];
    const [item] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, item);

    reordered.forEach((ev, idx) => {
      ev.ordem = idx + 1;
    });

    this.evidencias = reordered;
    this.orderChanged = true;
    this.refreshCarouselAfterDataChange(item.id ?? null);
  }

  salvarOrdemEvidencias(): void {
    if (!this.isReordering || this.savingOrder) {
      return;
    }

    const payload = this.evidencias
      .filter(ev => ev.id !== undefined && ev.id !== null)
      .map((ev, idx) => ({
        evidenciaId: ev.id as number,
        ordem: idx
      }));

    if (!payload.length) {
      this.showMessage('Nenhuma evidência encontrada para salvar a ordem.', 'warning');
      return;
    }

    const currentId = this.getCurrentEvidenceId();
    this.savingOrder = true;

    this.evidenciasService.reordenarEvidencias(this.atividadeId, payload).subscribe({
      next: (response) => {
        this.savingOrder = false;
        this.isReordering = false;
        this.orderChanged = false;

        if (Array.isArray(response) && response.length > 0) {
          const normalized = response.map(e => this.normalizeEvidencia(e));
          this.evidencias = this.sortEvidencias(normalized);
        } else {
          // Se a API não retornar dados, mantém ordem local aplicada
          this.evidencias = this.cloneEvidencias(this.evidencias);
        }

        this.ordemOriginal = this.cloneEvidencias(this.evidencias);
        this.refreshCarouselAfterDataChange(currentId);
        this.showMessage('Ordem das evidências atualizada com sucesso!', 'success');
      },
      error: (error) => {
        this.savingOrder = false;
        const apiMessage = extractApiMessage(error);
        this.showMessage(apiMessage || error.message || 'Erro ao atualizar ordem das evidências.', 'error');
        this.evidencias = this.cloneEvidencias(this.ordemOriginal.length ? this.ordemOriginal : this.evidencias);
        this.refreshCarouselAfterDataChange(currentId);
        this.isReordering = false;
        this.orderChanged = false;
      }
    });
  }

  private async obterArquivoDaEvidencia(evidencia: EvidenciaDTO): Promise<File | null> {
    try {
      const url = this.getEvidenciaImageUrlFromEvidencia(evidencia);
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Não foi possível carregar a imagem atual.');
      }
      const blob = await response.blob();
      const nomeArquivo = evidencia.foto?.split('/').pop()?.split('?')[0] || `evidencia-${evidencia.id}.jpg`;
      const fileName = nomeArquivo || `evidencia-${Date.now()}.jpg`;
      const file = new File([blob], fileName, { type: blob.type || 'image/jpeg' });
      return file;
    } catch (error) {
      console.error('❌ Erro ao preparar arquivo existente:', error);
      this.showMessage('Não foi possível carregar a imagem atual. Selecione uma nova foto.', 'error');
      this.isUploading = false;
      return null;
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  private getEvidenciaFotoPath(evidencia: EvidenciaDTO | null | undefined): string {
    if (!evidencia) {
      return '';
    }
    return evidencia.foto || evidencia.urlFoto || '';
  }

  private normalizeEvidencia(evidencia: EvidenciaDTO): EvidenciaDTO {
    const ordem =
      typeof evidencia.ordem === 'number'
        ? evidencia.ordem
        : (evidencia as any)?.indice ?? undefined;

    const foto = this.getEvidenciaFotoPath(evidencia);

    return {
      ...evidencia,
      foto,
      ordem: typeof ordem === 'number' ? ordem : undefined
    };
  }

  private sortEvidencias(evidencias: EvidenciaDTO[]): EvidenciaDTO[] {
    return [...evidencias].sort((a, b) => {
      const ordemA = typeof a.ordem === 'number' ? a.ordem : Number.MAX_SAFE_INTEGER;
      const ordemB = typeof b.ordem === 'number' ? b.ordem : Number.MAX_SAFE_INTEGER;
      if (ordemA !== ordemB) {
        return ordemA - ordemB;
      }
      return (a.id ?? Number.MAX_SAFE_INTEGER) - (b.id ?? Number.MAX_SAFE_INTEGER);
    });
  }

  private cloneEvidencias(evidencias: EvidenciaDTO[]): EvidenciaDTO[] {
    return evidencias.map(ev => ({ ...ev }));
  }

  private refreshCarouselAfterDataChange(targetEvidenceId?: number | null): void {
    if (!this.evidencias.length) {
      this.currentSlideIndex = 0;
      this.carrosselPageIndex = 0;
      return;
    }

    const targetId =
      targetEvidenceId ??
      this.getCurrentEvidenceId() ??
      this.evidencias[0]?.id ??
      null;

    if (targetId !== null && targetId !== undefined) {
      const newIndex = this.evidencias.findIndex(ev => ev.id === targetId);
      if (newIndex >= 0) {
        this.carrosselPageIndex = Math.floor(newIndex / this.carrosselPageSize);
        this.currentSlideIndex = newIndex % this.carrosselPageSize;
        return;
      }
    }

    this.carrosselPageIndex = 0;
    this.currentSlideIndex = 0;
  }

  private getCurrentEvidenceId(): number | null {
    const absoluteIndex = this.carrosselPageIndex * this.carrosselPageSize + this.currentSlideIndex;
    const evidencia = this.evidencias[absoluteIndex];
    return evidencia?.id ?? null;
  }

  private async openConfirmDialog(data: { title: string; message: string; confirmText: string; cancelText: string }): Promise<boolean> {
    const { SimpleConfirmDialogComponent } = await import('../../../../shared/components/simple-confirm-dialog/simple-confirm-dialog.component');
    const dialogRef = this.dialog.open(SimpleConfirmDialogComponent, {
      width: '420px',
      data
    });
    return firstValueFrom(dialogRef.afterClosed());
  }
}

