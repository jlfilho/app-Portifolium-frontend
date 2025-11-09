import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';

import { CursosService } from '../../services/cursos.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SimpleConfirmDialogComponent } from '../../../../shared/components/simple-confirm-dialog/simple-confirm-dialog.component';
import { PermissoesCursoFormComponent } from '../permissoes-curso-form/permissoes-curso-form.component';
import { TiposCursoService } from '../../services/tipos-curso.service';
import { TipoCurso } from '../../models/tipo-curso.model';
import { extractApiMessage } from '../../../../shared/utils/message.utils';
import { Curso } from '../../models/curso.model';
import { CursoFilter } from '../../models/curso-filter.model';
import { environment } from '../../../../../environments/environment';
import { UnidadesAcademicasService } from '../../../unidades-academicas/services/unidades-academicas.service';
import { UnidadeAcademica } from '../../../unidades-academicas/models/unidade-academica.model';

@Component({
  selector: 'acadmanage-cards-cursos',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule
  ],
  templateUrl: './cards-cursos.component.html',
  styleUrl: './cards-cursos.component.css'
})
export class CardsCursosComponent  implements OnInit {
  cursos: Curso[] = []; // Armazena a lista de cursos
  errorMessage: string = ''; // Mensagem de erro (caso ocorra)
  columns: number = 3; // Número de colunas padrão

  // Paginação
  totalElements = 0;
  pageSize = 9; // 9 cursos por página (3x3 grid)
  pageIndex = 0;
  pageSizeOptions = [6, 9, 12, 18, 24];
  isLoading = false;

  // Filtros
  filtroNome = '';
  filtroStatus: boolean | null = null;
  filtroTipo: number | null = null;
  filtroUnidade: number | null = null;
  private searchSubject = new Subject<string>();

  // Opções de status
  statusOptions = [
    { value: null, label: 'Todos' },
    { value: true, label: 'Ativos' },
    { value: false, label: 'Inativos' }
  ];

  private readonly filesBaseUrl = `${environment.apiUrl}/files`;

  constructor(
    private cursosService: CursosService,
    private tiposCursoService: TiposCursoService,
    private unidadesAcademicasService: UnidadesAcademicasService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.updateColumns(window.innerWidth);
    this.setupSearchDebounce();
    this.loadCourses();
  }

  tiposCurso: TipoCurso[] = [];
  isLoadingTipos = false;
  unidadesAcademicas: UnidadeAcademica[] = [];
  isLoadingUnidades = false;

  ngOnInit(): void {
    this.loadTiposCurso();
    this.loadUnidadesAcademicas();
  }

  // Configurar debounce para busca dinâmica
  private setupSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(500), // Aguarda 500ms após parar de digitar
      distinctUntilChanged() // Só emite se o valor mudou
    ).subscribe(searchTerm => {
      console.log('🔍 Aplicando filtro de nome:', searchTerm);
      this.pageIndex = 0; // Resetar para primeira página
      this.loadCourses();
    });
  }

  // Detectar mudanças no tamanho da janela
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateColumns(event.target.innerWidth);
  }

  // Atualizar número de colunas baseado na largura
  updateColumns(width: number): void {
    if (width < 768) {
      this.columns = 1; // Mobile: 1 coluna
    } else if (width < 1200) {
      this.columns = 2; // Tablet: 2 colunas
    } else {
      this.columns = 3; // Desktop: 3 colunas
    }
  }

  // Getter para usar no template
  getColumns(): number {
    return this.columns;
  }



  // Método para carregar os cursos do usuário com paginação e filtros
  loadCourses(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const filter: CursoFilter = {
      page: this.pageIndex,
      size: this.pageSize,
      sortBy: 'nome',
      direction: 'ASC',
      ativo: this.filtroStatus,
      nome: this.filtroNome || undefined,
      tipoId: this.filtroTipo ?? undefined,
      unidadeAcademicaId: this.filtroUnidade ?? undefined
    };

    console.log('📡 Carregando cursos do usuário (página ' + (this.pageIndex + 1) + ')');
    console.log('🔍 Filtros aplicados:', {
      nome: this.filtroNome || 'sem filtro',
      status: this.filtroStatus !== null ? (this.filtroStatus ? 'Ativos' : 'Inativos') : 'Todos',
      tipoId: this.filtroTipo ?? 'todos',
      unidadeAcademicaId: this.filtroUnidade ?? 'todas'
    });

    this.cursosService.getUserCoursesPaginado(filter).subscribe({
      next: (page) => {
        if (!page || page === null) {
          console.log('📭 Nenhum curso encontrado (204 No Content)');
          this.handleEmptyCourses();
          return;
        }

        this.cursos = page.content || [];
        this.totalElements = page.totalElements || 0;
        this.isLoading = false;

        this.populateUnidadesFromCursos(this.cursos);

        if (this.cursos.length === 0) {
          this.handleEmptyCourses();
          return;
        }

        console.log('✅ Cursos do usuário carregados:', {
          exibindo: this.cursos.length,
          total: this.totalElements,
          pagina: this.pageIndex + 1,
          totalPaginas: page.totalPages || 0
        });
      },
      error: (error) => {
        console.error('❌ Erro ao carregar cursos do usuário:', error);
        const apiMessage = extractApiMessage(error);
        this.errorMessage = apiMessage || 'Erro ao carregar os cursos. Tente novamente.';
        this.isLoading = false;
        this.showMessage(this.errorMessage, 'error');
        this.cursos = [];
        this.totalElements = 0;
      }
    });
  }

  getCursoImageUrl(curso: Curso): string {
    const foto = curso?.fotoCapa;
    if (foto) {
      if (foto.startsWith('http')) {
        return foto;
      }
      const normalized = foto.startsWith('/') ? foto : `/${foto}`;
      return `${this.filesBaseUrl}${normalized}`;
    }
    return '/imagens/curso-header.png';
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = '/imagens/curso-header.png';
  }

  // Chamado quando usuário digita no campo de busca
  onSearchChange(searchTerm: string): void {
    this.filtroNome = searchTerm;
    this.searchSubject.next(searchTerm);
  }

  // Chamado quando usuário muda o filtro de status
  onStatusChange(): void {
    console.log('📊 Filtro de status alterado:', this.filtroStatus);
    this.pageIndex = 0; // Resetar para primeira página
    this.loadCourses();
  }

  onTipoChange(): void {
    console.log('🏷️ Filtro de tipo alterado:', this.filtroTipo);
    this.pageIndex = 0;
    this.loadCourses();
  }

  onUnidadeChange(): void {
    console.log('🏛️ Filtro de unidade acadêmica alterado:', this.filtroUnidade);
    this.pageIndex = 0;
    this.loadCourses();
  }

  // Limpar filtros
  limparFiltros(): void {
    console.log('🧹 Limpando filtros');
    this.filtroNome = '';
    this.filtroStatus = null;
    this.filtroTipo = null;
    this.filtroUnidade = null;
    this.pageIndex = 0;
    this.loadCourses();
  }

  // Método de evento de mudança de página
  onPageChange(event: PageEvent): void {
    console.log('📄 Mudança de página:', event);
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCourses();
  }

  // Navegar para adicionar novo curso
  addCourse(): void {
    this.router.navigate(['/cursos/novo']);
  }

  // Navegar para editar curso
  editCourse(cursoId?: number): void {
    if (cursoId == null) {
      this.showMessage('Curso inválido selecionado. Tente novamente.', 'error');
      return;
    }
    this.router.navigate(['/cursos/editar', cursoId]);
  }

  // Navegar para a tela de gerenciar permissões (formulário)
  managePermissions(curso: Curso): void {
    console.log('👥 Gerenciar permissões para curso:', curso);
    if (curso?.id == null) {
      this.showMessage('Curso inválido selecionado. Tente novamente.', 'error');
      return;
    }
    const cursoId = curso.id;
    this.router.navigate(['/cursos', cursoId, 'permissoes'], { state: { cursoNome: curso.nome } });
  }

  // Navegar para a tela de atividades do curso
  manageAtividades(curso: Curso): void {
    console.log('📚 Gerenciar atividades para curso:', curso);
    if (curso?.id == null) {
      this.showMessage('Curso inválido selecionado. Tente novamente.', 'error');
      return;
    }
    const cursoId = curso.id;
    this.router.navigate(['/atividades/curso', cursoId], { state: { cursoNome: curso.nome } });
  }

  // Deletar curso com diálogo de confirmação
  deleteCourse(curso: Curso): void {
    console.log('🗑️ Excluir curso chamado para:', curso);
    if (curso?.id == null) {
      this.showMessage('Curso inválido selecionado. Tente novamente.', 'error');
      return;
    }

    const dialogRef = this.dialog.open(SimpleConfirmDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-panel',
      data: {
        title: 'Excluir Curso',
        message: `Tem certeza que deseja excluir o curso "${curso.nome}"? Esta ação não pode ser desfeita.`,
        confirmText: 'Sim, Excluir',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('💬 Resultado do diálogo de exclusão:', result);
      if (result === true) {
        console.log('✅ Confirmado! Executando exclusão...');
        const cursoId = curso.id!;
        this.performDelete(cursoId, curso.nome);
      } else {
        console.log('❌ Exclusão cancelada pelo usuário');
      }
    });
  }

  // Executar a exclusão
  private performDelete(cursoId: number, cursoNome: string): void {
    console.log('📡 Chamando API para excluir curso ID:', cursoId);

    this.cursosService.deleteCourse(cursoId).subscribe({
      next: (response) => {
        console.log('✅ Curso excluído com sucesso! Response:', response);
        this.showMessage(`Curso "${cursoNome}" excluído com sucesso!`, 'success');
        console.log('🔄 Recarregando lista de cursos...');
        this.loadCourses(); // Recarrega a lista
      },
      error: (error) => {
        console.error('❌ Erro ao deletar curso:', error);
        console.error('📊 Detalhes do erro:', error.error);
        console.error('🔢 Status HTTP:', error.status);

        const errorMessage = extractApiMessage(error) || 'Erro ao excluir curso. Tente novamente.';

        console.log('📢 Mensagem de erro extraída:', errorMessage);
        this.showMessage(errorMessage, 'error');
      }
    });
  }

  // Toggle status do curso (ativar/desativar) com confirmação
  toggleCourseStatus(curso: Curso): void {
    console.log('🔄 Toggle status chamado para curso:', curso);
    console.log('📊 Status atual:', curso.ativo);

    if (curso?.id == null) {
      this.showMessage('Curso inválido selecionado. Tente novamente.', 'error');
      return;
    }

    const novoStatus = !curso.ativo;
    const acao = novoStatus ? 'ativar' : 'desativar';
    const acaoCapitalizada = novoStatus ? 'Ativar' : 'Desativar';

    console.log('🎯 Novo status será:', novoStatus);

    const dialogRef = this.dialog.open(SimpleConfirmDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-panel',
      data: {
        title: `${acaoCapitalizada} Curso`,
        message: `Tem certeza que deseja ${acao} o curso "${curso.nome}"?`,
        confirmText: `Sim, ${acaoCapitalizada}`,
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('💬 Resultado do diálogo:', result);
      if (result === true) {
        console.log('✅ Confirmado! Executando atualização...');
        const cursoId = curso.id!;
        this.performStatusUpdate(cursoId, curso.nome, novoStatus);
      } else {
        console.log('❌ Cancelado pelo usuário');
      }
    });
  }

  // Executar a atualização de status
  private performStatusUpdate(cursoId: number, cursoNome: string, novoStatus: boolean): void {
    console.log('📡 Chamando API para atualizar status...');
    console.log('📋 Dados:', { cursoId, novoStatus });

    this.cursosService.updateCourseStatus(cursoId, novoStatus).subscribe({
      next: (response) => {
        console.log('✅ Resposta da API:', response);
        const statusTexto = novoStatus ? 'ativado' : 'desativado';
        this.showMessage(`Curso "${cursoNome}" ${statusTexto} com sucesso!`, 'success');
        console.log('🔄 Recarregando lista de cursos...');
        this.loadCourses(); // Recarrega a lista
      },
      error: (error) => {
        console.error('❌ Erro ao atualizar status do curso:', error);
        console.error('📊 Detalhes do erro:', error.error);
        console.error('🔢 Status HTTP:', error.status);

        const errorMessage = extractApiMessage(error) || 'Erro ao atualizar status do curso. Tente novamente.';

        console.log('📢 Mensagem de erro extraída:', errorMessage);
        this.showMessage(errorMessage, 'error');
      }
    });
  }

  // Mostrar notificação
  private showMessage(message: string, type: 'success' | 'error'): void {
    const panelClass = type === 'success' ? 'snackbar-success' : 'snackbar-error';

    this.snackBar.open(message, 'Fechar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  private loadTiposCurso(): void {
    this.isLoadingTipos = true;
    this.tiposCursoService.getFirstPageAsList(100, undefined, 'nome', 'ASC').subscribe({
      next: (list: TipoCurso[]) => {
        this.tiposCurso = Array.isArray(list) ? list : [];
        this.isLoadingTipos = false;
      },
      error: () => {
        this.tiposCurso = [];
        this.isLoadingTipos = false;
      }
    });
  }

  private loadUnidadesAcademicas(): void {
    this.isLoadingUnidades = true;
    this.unidadesAcademicasService.getFirstPageAsList(100, undefined, 'nome', 'ASC').subscribe({
      next: (lista) => {
        this.unidadesAcademicas = Array.isArray(lista) ? lista : [];
        this.isLoadingUnidades = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar unidades acadêmicas:', error);
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
      const unidadeNome = unidade?.nome ?? (curso as any)?.unidadeAcademicaNome ?? (curso as any)?.unidadeNome;

      if (unidadeId && unidadeNome) {
        mapa.set(unidadeId, { id: unidadeId, nome: unidadeNome });
      }
    });

    if (mapa.size === 0) {
      return;
    }

    const existentes = new Set(this.unidadesAcademicas.map(u => u.id));
    let alterou = false;
    mapa.forEach(unidade => {
      if (!existentes.has(unidade.id)) {
        this.unidadesAcademicas.push(unidade);
        alterou = true;
      }
    });

    if (alterou) {
      this.unidadesAcademicas.sort((a, b) => a.nome.localeCompare(b.nome));
    }
  }

  getTipoNomeById(id: number | null | undefined): string {
    if (id == null) return '';
    const found = this.tiposCurso.find(t => t.id === id);
    return found?.nome || '';
  }

  getTipoNomeFromCurso(curso: any): string {
    return curso?.tipo?.nome || this.getTipoNomeById(curso?.tipoId) || curso?.tipoNome || '';
  }

  getUnidadeNomeById(id: number | null | undefined): string {
    if (id == null) return '';
    const found = this.unidadesAcademicas.find(u => u.id === id);
    return found?.nome || '';
  }

  private hasActiveFilters(): boolean {
    return Boolean(
      (this.filtroNome && this.filtroNome.trim()) ||
      this.filtroStatus !== null ||
      this.filtroTipo !== null ||
      this.filtroUnidade !== null
    );
  }

  private handleEmptyCourses(): void {
    this.cursos = [];
    this.totalElements = 0;
    this.isLoading = false;
    if (this.hasActiveFilters()) {
      this.errorMessage = 'Nenhum curso encontrado com os filtros aplicados.';
    } else {
      this.errorMessage = 'Você ainda não possui cursos cadastrados.';
    }
  }

  trackCurso(index: number, curso: Curso): string | number {
    return curso.id ?? curso.nome ?? index;
  }
}
