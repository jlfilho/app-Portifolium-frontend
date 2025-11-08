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

// Services
import { PublicApiService } from '../../services/public-api.service';
import { PublicNavigationService } from '../../services/public-navigation.service';

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
    MatRippleModule
  ],
  templateUrl: './cursos-publicos.component.html',
  styleUrl: './cursos-publicos.component.css'
})
export class CursosPublicosComponent implements OnInit, OnDestroy {
  cursos: any[] = [];
  isLoading = false;

  // Paginação
  totalElements = 0;
  pageSize = 12; // 12 cursos por página (grid 4x3)
  pageIndex = 0;
  pageSizeOptions = [6, 12, 24, 36];

  // Busca
  searchTerm = '';
  private searchSubject = new Subject<string>();

  constructor(
    private publicApiService: PublicApiService,
    private publicNavigationService: PublicNavigationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setupSearchDebounce();
    this.loadCursos();
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
      apenasAtivos: true
    });

    this.publicApiService.getCursosPublicos(this.pageIndex, this.pageSize, this.searchTerm).subscribe({
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
  clearSearch(): void {
    this.searchTerm = '';
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

  // Tratamento de erro de imagem
  onImageError(event: any): void {
    console.log('⚠️ Erro ao carregar imagem do curso, usando gradiente padrão');
    // Remove o elemento img para mostrar o gradiente de fundo
    event.target.style.display = 'none';
  }

  getTipoNome(curso: any): string {
    return curso?.tipo?.nome || curso?.tipoNome || '';
  }
}

