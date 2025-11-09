import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

// Services
import { PublicApiService } from '../../services/public-api.service';
import { PublicNavigationService } from '../../services/public-navigation.service';
import { UnidadeAcademica } from '../../../features/unidades-academicas/models/unidade-academica.model';
import { Curso } from '../../../features/cursos/models/curso.model';

@Component({
  selector: 'acadmanage-lista-cursos-publica',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatChipsModule,
    MatDividerModule,
    MatRippleModule,
    MatSelectModule
  ],
  templateUrl: './cursos-publicos.component.html',
  styleUrl: './cursos-publicos.component.css'
})
export class CursosPublicosComponent implements OnInit, OnDestroy {
  cursos: any[] = [];
  isLoading = false;
  isLoadingUnidades = false;

  // Paginação
  totalElements = 0;
  pageSize = 12; // 12 cursos por página (grid 4x3)
  pageIndex = 0;
  pageSizeOptions = [6, 12, 24, 36];

  // Busca
  searchTerm = '';
  private searchSubject = new Subject<string>();
  unidadesAcademicas: UnidadeAcademica[] = [];
  filtroUnidadeId: number | null = null;
  private readonly defaultCourseImage = '/imagens/curso-header.png';

  constructor(
    private publicApiService: PublicApiService,
    private publicNavigationService: PublicNavigationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setupSearchDebounce();
    this.loadCursos();
    this.loadUnidades();
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
      console.log('🔍 Buscando cursos com:', searchTerm);
      this.pageIndex = 0;
      this.loadCursos();
    });
  }

  // Carregar cursos
  loadCursos(): void {
    this.isLoading = true;

    console.log('📚 Carregando cursos públicos:', {
      pagina: this.pageIndex + 1,
      tamanho: this.pageSize,
      busca: this.searchTerm || 'todos',
      apenasAtivos: true,
      unidadeAcademicaId: this.filtroUnidadeId
    });

    this.publicApiService.getCursosPublicos(
      this.pageIndex,
      this.pageSize,
      this.searchTerm,
      this.filtroUnidadeId ?? undefined
    ).subscribe({
      next: (page) => {
        // Tratar resposta vazia (204 No Content)
        if (!page) {
          this.cursos = [];
          this.totalElements = 0;
          this.isLoading = false;
          console.log('📭 Nenhum curso encontrado');
          return;
        }

        this.cursos = page.content || [];
        this.totalElements = page.totalElements || 0;
        this.isLoading = false;
        this.populateUnidadesFromCursos(this.cursos);

        console.log('✅ Cursos carregados:', {
          exibindo: this.cursos.length,
          total: this.totalElements
        });
      },
      error: (error) => {
        console.error('❌ Erro ao carregar cursos:', error);
        this.cursos = [];
        this.totalElements = 0;
        this.isLoading = false;

        // Mostrar mensagem de erro mais específica
        if (error.status === 403) {
          console.warn('⚠️ Acesso negado - verificar permissões da API');
        } else if (error.status === 500) {
          console.warn('⚠️ Erro interno do servidor');
        }
      }
    });
  }

  // Busca dinâmica
  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.searchSubject.next(searchTerm);
  }

  // Limpar busca
  clearSearchText(): void {
    if (!this.searchTerm) {
      return;
    }
    this.searchTerm = '';
    this.pageIndex = 0;
    this.loadCursos();
  }

  clearAllFilters(): void {
    if (!this.hasActiveFilters()) {
      return;
    }
    this.searchTerm = '';
    this.filtroUnidadeId = null;
    this.pageIndex = 0;
    this.loadCursos();
  }

  // Mudança de página
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCursos();

    // Scroll suave para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Navegar para atividades públicas do curso
  viewCurso(curso: any): void {
    console.log('👁️ Visualizando atividades do curso:', curso);
    this.publicNavigationService.navigateToAtividadesPublicas(curso.id, curso.nome);
  }

  // Obter URL completa da imagem
  getImageUrl(fotoCapa: string): string {
    return this.publicApiService.getCursoImageUrl(fotoCapa);
  }

  getCursoCardImage(curso: Curso | any): string {
    const caminho = curso?.fotoCapa || curso?.imagemCapa;
    if (caminho) {
      return this.publicApiService.getCursoImageUrl(caminho);
    }
    return this.defaultCourseImage;
  }

  // Tratamento de erro de imagem
  onImageError(event: any): void {
    if (event?.target) {
      event.target.onerror = null;
      event.target.src = this.defaultCourseImage;
      event.target.style.display = 'block';
    }
  }

  getTipoNome(curso: any): string {
    return curso?.tipo?.nome || curso?.tipoNome || '';
  }

  onUnidadeChange(id: number | null): void {
    this.filtroUnidadeId = id ?? null;
    this.pageIndex = 0;
    this.loadCursos();
  }

  private loadUnidades(): void {
    this.isLoadingUnidades = true;
    this.publicApiService.getUnidadesAcademicasList(undefined, 100).subscribe({
      next: (list) => {
        this.unidadesAcademicas = list || [];
        this.isLoadingUnidades = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar unidades acadêmicas públicas:', error);
        this.unidadesAcademicas = [];
        this.isLoadingUnidades = false;
        this.populateUnidadesFromCursos(this.cursos);
      }
    });
  }

  private populateUnidadesFromCursos(cursos: Curso[]): void {
    if (!Array.isArray(cursos) || cursos.length === 0) {
      return;
    }

    const mapa = new Map<number, UnidadeAcademica>();
    cursos.forEach(curso => {
      const unidade = (curso as any)?.unidadeAcademica as UnidadeAcademica | undefined;
      const unidadeId = (curso as any)?.unidadeAcademicaId ?? unidade?.id;
      const unidadeNome =
        unidade?.nome ??
        (curso as any)?.unidadeAcademicaNome ??
        (curso as any)?.unidadeNome ??
        null;

      if (unidadeId && unidadeNome) {
        mapa.set(unidadeId, { id: unidadeId, nome: unidadeNome });
      }
    });

    if (mapa.size > 0) {
      const derivadas = Array.from(mapa.values()).sort((a, b) => a.nome.localeCompare(b.nome));
      const idsExistentes = new Set(this.unidadesAcademicas.map(u => u.id));
      let alterou = false;
      derivadas.forEach(unidade => {
        if (!idsExistentes.has(unidade.id)) {
          this.unidadesAcademicas.push(unidade);
          alterou = true;
        }
      });

      if (alterou) {
        this.unidadesAcademicas.sort((a, b) => a.nome.localeCompare(b.nome));
      }
    }
  }

  hasActiveFilters(): boolean {
    return Boolean(
      (this.searchTerm && this.searchTerm.trim().length > 0) ||
      this.filtroUnidadeId !== null
    );
  }
}

