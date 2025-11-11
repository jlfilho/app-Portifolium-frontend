import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
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
import { AtividadeDTO, EvidenciaDTO } from '../../models/public.models';
// Services
import { PublicApiService } from '../../services/public-api.service';
import { PublicNavigationService } from '../../services/public-navigation.service';
import { BreaklinesPipe } from '../../../shared/pipes/breaklines.pipe';

@Component({
  selector: 'acadmanage-visualizar-atividade-publica',
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
  evidencias: EvidenciaDTO[] = [];
  isLoadingEvidencias = false;

  // Carrossel de evidências
  currentSlideIndex = 0;
  carrosselPageSize = 5;
  carrosselPageIndex = 0;
  lightboxOpen = false;
  lightboxIndex = 0;
  private scrollLocked = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private publicApiService: PublicApiService,
    private publicNavigationService: PublicNavigationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Obter ID da atividade da rota
    this.atividadeId = Number(this.route.snapshot.paramMap.get('atividadeId'));

    // Tentar obter informações do curso do state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || this.router.lastSuccessfulNavigation?.extras?.state;
    this.cursoId = (state && state['cursoId']) || 0;
    this.cursoNome = (state && state['cursoNome']) || 'Curso';

    this.loadAtividade();
    this.loadEvidencias();
  }

  ngOnDestroy(): void {
    this.enableScroll();
  }

  loadAtividade(): void {
    this.isLoading = true;
    this.errorMessage = '';

    console.log('📚 Carregando atividade pública:', this.atividadeId);

    this.publicApiService.getAtividadeById(this.atividadeId).subscribe({
      next: (atividade: AtividadeDTO) => {
        this.atividade = atividade;
        this.isLoading = false;
        console.log('✅ Atividade carregada:', atividade);
      },
      error: (error: any) => {
        console.error('❌ Erro ao carregar atividade:', error);
        this.errorMessage = 'Erro ao carregar atividade';
        this.isLoading = false;
        this.showMessage('Erro ao carregar atividade', 'error');
      }
    });
  }

  loadEvidencias(): void {
    this.isLoadingEvidencias = true;
    console.log('📸 Carregando evidências da atividade:', this.atividadeId);

    this.publicApiService.getEvidenciasPorAtividade(this.atividadeId).subscribe({
      next: (evidencias: EvidenciaDTO[] | null) => {
        this.evidencias = Array.isArray(evidencias) ? evidencias : [];
        this.currentSlideIndex = 0;
        this.carrosselPageIndex = 0;
        this.isLoadingEvidencias = false;
        console.log('✅ Evidências carregadas:', this.evidencias.length);
      },
      error: (error: any) => {
        console.error('❌ Erro ao carregar evidências:', error);
        this.evidencias = [];
        this.currentSlideIndex = 0;
        this.carrosselPageIndex = 0;
        this.isLoadingEvidencias = false;
      }
    });
  }

  // Métodos do carrossel de evidências
  get evidenciasPaginadas(): EvidenciaDTO[] {
    const start = this.carrosselPageIndex * this.carrosselPageSize;
    const end = start + this.carrosselPageSize;
    return this.evidencias.slice(start, end);
  }

  get currentEvidencia(): EvidenciaDTO | null {
    return this.evidenciasPaginadas[this.currentSlideIndex] || null;
  }

  get totalCarrosselPages(): number {
    return Math.ceil(this.evidencias.length / this.carrosselPageSize);
  }

  get hasMultiplePages(): boolean {
    return this.evidencias.length > this.carrosselPageSize;
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
    if (pageIndex >= 0 && pageIndex < this.totalCarrosselPages) {
      this.carrosselPageIndex = pageIndex;
      this.currentSlideIndex = 0;
    }
  }

  openLightbox(evidencia: EvidenciaDTO): void {
    const index = this.evidencias.findIndex(e => e.id === evidencia.id);
    if (index === -1) {
      return;
    }
    this.lightboxIndex = index;
    this.lightboxOpen = true;
    this.disableScroll();
    console.log('🔍 Lightbox aberta para evidência:', evidencia.id);
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
    this.enableScroll();
    console.log('❎ Lightbox fechada');
  }

  nextLightbox(): void {
    if (!this.evidencias.length) return;
    this.lightboxIndex = (this.lightboxIndex + 1) % this.evidencias.length;
    console.log('➡️ Próxima evidência no lightbox:', this.lightboxIndex + 1);
  }

  prevLightbox(): void {
    if (!this.evidencias.length) return;
    this.lightboxIndex = (this.lightboxIndex - 1 + this.evidencias.length) % this.evidencias.length;
    console.log('⬅️ Evidência anterior no lightbox:', this.lightboxIndex + 1);
  }

  goToLightbox(index: number): void {
    if (index < 0 || index >= this.evidencias.length) {
      return;
    }
    this.lightboxIndex = index;
    console.log('🎯 Lightbox navegada para índice:', index + 1);
  }

  get lightboxEvidencia(): EvidenciaDTO | null {
    return this.evidencias[this.lightboxIndex] || null;
  }

  getLightboxImageUrl(): string {
    const evidencia = this.lightboxEvidencia;
    return evidencia ? this.getEvidenciaImageUrl(evidencia.foto) : '';
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    if (!this.lightboxOpen) {
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.nextLightbox();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.prevLightbox();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.closeLightbox();
    }
  }

  private disableScroll(): void {
    if (this.scrollLocked) return;
    document.body.style.overflow = 'hidden';
    this.scrollLocked = true;
  }

  private enableScroll(): void {
    if (!this.scrollLocked) return;
    document.body.style.overflow = '';
    this.scrollLocked = false;
  }

  // Voltar para atividades do curso
  voltarParaAtividades(): void {
    this.publicNavigationService.navigateBackToAtividades(this.cursoId, this.cursoNome);
  }

  // Voltar para cursos públicos
  voltarParaCursos(): void {
    this.publicNavigationService.navigateBackToCursos();
  }

  // Formatar data
  formatarData(data: string): string {
    if (!data) return 'Data não informada';
    const dataObj = new Date(data + 'T00:00:00');
    return dataObj.toLocaleDateString('pt-BR');
  }

  // Obter URL da imagem
  getImageUrl(fotoCapa: string): string {
    if (!fotoCapa) return '';
    if (fotoCapa.startsWith('http')) {
      return fotoCapa;
    }
    return `http://localhost:8080/api/files${fotoCapa}`;
  }

  // Obter URL da evidência
  getEvidenciaImageUrl(foto: string): string {
    return this.publicApiService.getEvidenciaImageUrl(foto);
  }

  // Erro ao carregar imagem
  onImageError(event: any): void {
    event.target.style.display = 'none';
  }

  // Mostrar mensagem
  private showMessage(message: string, type: 'success' | 'error' | 'warning'): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: [`snackbar-${type}`]
    });
  }
}
