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
import { CursosService } from '../../services/cursos.service';
import { PageRequest } from '../../../../shared/models/page.model';

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
  templateUrl: './lista-cursos-publica.component.html',
  styleUrl: './lista-cursos-publica.component.css'
})
export class ListaCursosPublicaComponent implements OnInit, OnDestroy {
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
    private cursosService: CursosService,
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

    const pageRequest: PageRequest = {
      page: this.pageIndex,
      size: this.pageSize,
      sortBy: 'nome',
      direction: 'ASC' as 'ASC'
    };

    // Sempre buscar apenas cursos ATIVOS (filtro oculto)
    const ativo = true;
    const nome = this.searchTerm || undefined;

    console.log('📚 Carregando cursos públicos:', {
      pagina: this.pageIndex + 1,
      tamanho: this.pageSize,
      busca: nome || 'todos',
      apenasAtivos: true
    });

    this.cursosService.getAllCoursesPaginado(pageRequest, ativo, nome).subscribe({
      next: (page) => {
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
    // Navegar para página pública de atividades
    this.router.navigate(['/atividades-publicas/curso', curso.id], {
      state: { cursoNome: curso.nome }
    });
  }

  // Obter URL completa da imagem
  getImageUrl(fotoCapa: string): string {
    if (!fotoCapa) return '';

    // Se já é uma URL completa, retorna como está
    if (fotoCapa.startsWith('http')) {
      return fotoCapa;
    }

    // Senão, monta a URL completa
    return `http://localhost:8080/api/files${fotoCapa}`;
  }

  // Tratamento de erro de imagem
  onImageError(event: any): void {
    console.log('⚠️ Erro ao carregar imagem do curso, usando gradiente padrão');
    // Remove o elemento img para mostrar o gradiente de fundo
    event.target.style.display = 'none';
  }
}

