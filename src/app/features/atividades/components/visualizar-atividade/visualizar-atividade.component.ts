import { Component, OnInit } from '@angular/core';
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
import { AtividadeDTO } from '../../models/atividade.model';
import { AtividadesService } from '../../services/atividades.service';
import { Papel, PapelUtils } from '../../models/papel.enum';
import { EvidenciasService } from '../../../evidencias/services/evidencias.service';
import { EvidenciaDTO } from '../../../evidencias/models/evidencia.model';
import { ImageCompressionService, CompressionResult } from '../../../../shared/services/image-compression.service';

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
    MatInputModule
  ],
  templateUrl: './visualizar-atividade.component.html',
  styleUrl: './visualizar-atividade.component.css'
})
export class VisualizarAtividadeComponent implements OnInit {
  atividade: AtividadeDTO | null = null;
  atividadeId!: number;
  cursoId!: number;
  cursoNome: string = '';
  isLoading = true;
  errorMessage = '';

  // Evidências / Carrossel
  evidencias: EvidenciaDTO[] = [];
  currentSlideIndex = 0;
  isLoadingEvidencias = false;

  // Paginação do carrossel
  carrosselPageSize = 5;
  carrosselPageIndex = 0;

  // Upload de evidência
  showUploadForm = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  legenda = '';
  isUploading = false;
  dragOver = false;
  isCompressing = false;
  compressionInfo: CompressionResult | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private atividadesService: AtividadesService,
    private evidenciasService: EvidenciasService,
    private imageCompressionService: ImageCompressionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Obter ID da atividade da rota
    this.atividadeId = Number(this.route.snapshot.paramMap.get('id'));

    // Tentar obter informações do state
    const state = history.state;
    if (state && state.atividade) {
      this.atividade = state.atividade;
      this.cursoId = state.cursoId || (this.atividade ? this.atividade.curso.id : 0);
      this.cursoNome = state.cursoNome || (this.atividade ? this.atividade.curso.nome : '');
      this.isLoading = false;
      console.log('👁️ Atividade carregada do state:', this.atividade);
    } else {
      // Carregar atividade da API
      this.carregarAtividade();
    }

    // Carregar evidências da atividade
    this.carregarEvidencias();
  }

  carregarAtividade(): void {
    this.isLoading = true;
    console.log('📡 Carregando atividade ID:', this.atividadeId);

    this.atividadesService.getAtividadeById(this.atividadeId).subscribe({
      next: (response) => {
        this.atividade = response;
        this.cursoId = this.atividade.curso.id;
        this.cursoNome = this.atividade.curso.nome;
        this.isLoading = false;
        console.log('✅ Atividade carregada:', this.atividade);
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

  getPapelLabel(papel: string): string {
    return PapelUtils.getLabel(papel as Papel);
  }

  getPapelIcon(papel: string): string {
    return PapelUtils.getIcon(papel as Papel);
  }

  getPapelColor(papel: string): string {
    return PapelUtils.getColor(papel as Papel);
  }

  editarAtividade(): void {
    if (!this.atividade) return;

    console.log('✏️ Navegando para edição da atividade:', this.atividadeId);
    this.router.navigate(['/atividades/editar', this.atividadeId], {
      state: {
        atividade: this.atividade,
        cursoId: this.cursoId,
        cursoNome: this.cursoNome
      }
    });
  }

  voltar(): void {
    console.log('🔙 Voltando para lista de atividades');
    this.router.navigate(['/atividades/curso', this.cursoId], {
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

  // ===== MÉTODOS DO CARROSSEL DE EVIDÊNCIAS =====

  carregarEvidencias(): void {
    this.isLoadingEvidencias = true;
    console.log('📸 Carregando evidências da atividade:', this.atividadeId);

    this.evidenciasService.listarEvidenciasPorAtividade(this.atividadeId).subscribe({
      next: (evidencias) => {
        this.evidencias = evidencias;
        this.currentSlideIndex = 0;
        this.carrosselPageIndex = 0; // Reset paginação
        this.isLoadingEvidencias = false;
        console.log(`✅ ${evidencias.length} evidência(s) carregada(s)`);
        console.log(`📄 ${this.totalCarrosselPages} página(s) de ${this.carrosselPageSize} evidências`);
      },
      error: (error) => {
        console.error('❌ Erro ao carregar evidências:', error);
        this.evidencias = [];
        this.isLoadingEvidencias = false;
      }
    });
  }

  getEvidenciaImageUrl(foto: string): string {
    return this.evidenciasService.getImageUrl(foto);
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
    this.showUploadForm = !this.showUploadForm;
    if (!this.showUploadForm) {
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

    // Validar tamanho (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      this.showMessage('Imagem muito grande. Tamanho máximo: 10MB', 'error');
      return;
    }

    console.log('📎 Arquivo selecionado:', file.name, this.formatFileSize(file.size));

    // Iniciar compressão
    this.isCompressing = true;
    this.compressionInfo = null;

    try {
      // Comprimir imagem
      const compressionResult = await this.imageCompressionService.compressImage(file, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.85,
        maxSizeKB: 800 // 800KB máximo
      });

      this.selectedFile = compressionResult.compressedFile;
      this.compressionInfo = compressionResult;

      // Criar preview da imagem comprimida
      this.previewUrl = await this.imageCompressionService.createPreview(compressionResult.compressedFile, 600);

      // Mostrar resultado da compressão
      const reduction = compressionResult.compressionRatio.toFixed(1);
      console.log('✅ Compressão concluída:', {
        original: this.formatFileSize(compressionResult.originalSize),
        comprimido: this.formatFileSize(compressionResult.compressedSize),
        redução: `${reduction}%`
      });

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

  salvarEvidencia(): void {
    if (!this.selectedFile || !this.legenda.trim()) {
      this.showMessage('Selecione uma imagem e adicione uma legenda', 'warning');
      return;
    }

    this.isUploading = true;
    console.log('📤 Enviando evidência...');

    this.evidenciasService.salvarEvidencia(this.atividadeId, this.legenda.trim(), this.selectedFile)
      .subscribe({
        next: (evidencia) => {
          console.log('✅ Evidência salva:', evidencia);
          this.showMessage('Evidência postada com sucesso!', 'success');
          this.isUploading = false;

          // Recarregar evidências
          this.carregarEvidencias();

          // Resetar formulário
          this.resetUploadForm();
          this.showUploadForm = false;
        },
        error: (error) => {
          console.error('❌ Erro ao salvar evidência:', error);
          this.showMessage(error.message || 'Erro ao postar evidência', 'error');
          this.isUploading = false;
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
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

