import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';

// Services
import { AtividadesService } from '../../services/atividades.service';
import { AtividadeDTO } from '../../models/atividade.model';
import { PageRequest } from '../../../../shared/models/page.model';

@Component({
  selector: 'acadmanage-lista-atividades-publica',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatRippleModule
  ],
  templateUrl: './lista-atividades-publica.component.html',
  styleUrl: './lista-atividades-publica.component.css'
})
export class ListaAtividadesPublicaComponent implements OnInit, OnDestroy {
  cursoId!: number;
  cursoNome = '';
  atividades: AtividadeDTO[] = [];
  isLoading = false;

  // Paginação
  totalElements = 0;
  pageSize = 9;
  pageIndex = 0;
  pageSizeOptions = [6, 9, 12, 18];

  // Busca
  searchTerm = '';
  private searchSubject = new Subject<string>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private atividadesService: AtividadesService
  ) {}

  ngOnInit(): void {
    // Obter ID do curso da rota
    this.cursoId = Number(this.route.snapshot.paramMap.get('cursoId'));

    // Tentar obter nome do curso do state (usar Router ao invés de history para compatibilidade SSR)
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || this.router.lastSuccessfulNavigation?.extras?.state;
    this.cursoNome = (state && state['cursoNome']) || 'Curso';

    this.setupSearchDebounce();
    this.loadAtividades();
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  // Configurar debounce para busca
  private setupSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      console.log('🔍 Buscando atividades com:', searchTerm);
      this.pageIndex = 0;
      this.loadAtividades();
    });
  }

  // Carregar atividades
  loadAtividades(): void {
    this.isLoading = true;

    const filtro = {
      cursoId: this.cursoId,
      nome: this.searchTerm || undefined
      // NOTA: statusPublicacao removido temporariamente devido a erro no backend
      // O campo não existe na entidade Atividade ou na query JPA
      // Reativar quando backend for corrigido: statusPublicacao: true
    };

    console.log('📚 Carregando atividades públicas do curso:', this.cursoId);

    this.atividadesService.getAtividadesPorFiltros(
      filtro,
      this.pageIndex,
      this.pageSize,
      'dataInicio',
      'DESC'
    ).subscribe({
      next: (page: any) => {
        this.atividades = page.content || [];
        this.totalElements = page.totalElements || 0;
        this.isLoading = false;

        console.log('✅ Atividades carregadas:', {
          exibindo: this.atividades.length,
          total: this.totalElements
        });
      },
      error: (error: any) => {
        console.error('❌ Erro ao carregar atividades:', error);
        this.atividades = [];
        this.totalElements = 0;
        this.isLoading = false;
      }
    });
  }

  // Busca dinâmica
  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.searchSubject.next(searchTerm);
  }

  // Limpar busca
  clearSearch(): void {
    this.searchTerm = '';
    this.pageIndex = 0;
    this.loadAtividades();
  }

  // Mudança de página
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAtividades();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Visualizar atividade
  viewAtividade(atividade: AtividadeDTO): void {
    console.log('👁️ Visualizando atividade:', atividade);
    this.router.navigate(['/atividades/visualizar', atividade.id], {
      state: {
        atividade: atividade,
        cursoId: this.cursoId,
        cursoNome: this.cursoNome
      }
    });
  }

  // Voltar para cursos públicos
  voltarParaCursos(): void {
    this.router.navigate(['/cursos-publicos']);
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

  // Erro ao carregar imagem
  onImageError(event: any): void {
    event.target.style.display = 'none';
  }
}

