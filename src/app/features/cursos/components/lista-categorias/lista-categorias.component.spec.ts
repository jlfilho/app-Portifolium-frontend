import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { ListaCategoriasComponent, Categoria } from './lista-categorias.component';
import { CursosService } from '../../services/cursos.service';
import { ApiService } from '../../../../shared/api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('ListaCategoriasComponent', () => {
  let component: ListaCategoriasComponent;
  let fixture: ComponentFixture<ListaCategoriasComponent>;
  let cursosService: jasmine.SpyObj<CursosService>;
  let apiService: jasmine.SpyObj<ApiService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  const mockCategorias: Categoria[] = [
    { id: 1, nome: 'Extensão' },
    { id: 2, nome: 'Pesquisa' },
    { id: 3, nome: 'Ensino' }
  ];

  const mockPage = {
    content: mockCategorias,
    totalElements: 3,
    totalPages: 1,
    size: 10,
    number: 0,
    numberOfElements: 3,
    first: true,
    last: true,
    empty: false,
    pageable: {
      pageNumber: 0,
      pageSize: 10,
      offset: 0,
      paged: true,
      unpaged: false,
      sort: { sorted: false, unsorted: true, empty: true }
    },
    sort: { sorted: false, unsorted: true, empty: true }
  };

  beforeEach(async () => {
    const cursosServiceSpy = jasmine.createSpyObj('CursosService', [
      'getAllCategoriesPaginado',
      'deleteCategory'
    ]);
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['isAdmin']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        ListaCategoriasComponent,
        NoopAnimationsModule
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CursosService, useValue: cursosServiceSpy },
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    cursosService = TestBed.inject(CursosService) as jasmine.SpyObj<CursosService>;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    // Configurar retornos padrão
    cursosService.getAllCategoriesPaginado.and.returnValue(of(mockPage));
    apiService.isAdmin.and.returnValue(true);

    fixture = TestBed.createComponent(ListaCategoriasComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar com valores padrão', () => {
    expect(component.isLoading).toBe(true);
    expect(component.pageSize).toBe(10);
    expect(component.pageIndex).toBe(0);
    expect(component.sortBy).toBe('id');
    expect(component.sortDirection).toBe('ASC');
    expect(component.displayedColumns).toEqual(['id', 'nome', 'acao']);
  });

  it('deve carregar categorias ao inicializar', () => {
    fixture.detectChanges();

    expect(cursosService.getAllCategoriesPaginado).toHaveBeenCalledWith({
      page: 0,
      size: 10,
      sortBy: 'id',
      direction: 'ASC'
    });
    expect(component.dataSource.data).toEqual(mockCategorias);
    expect(component.totalElements).toBe(3);
    expect(component.isLoading).toBe(false);
  });

  it('deve exibir mensagem de erro ao falhar no carregamento', () => {
    const errorResponse = { status: 500, message: 'Erro interno' };
    cursosService.getAllCategoriesPaginado.and.returnValue(throwError(() => errorResponse));

    fixture.detectChanges();

    expect(component.errorMessage).toBe('Erro ao carregar os tipos de atividades. Tente novamente.');
    expect(component.isLoading).toBe(false);
    expect(snackBar.open).toHaveBeenCalled();
  });

  it('deve aplicar filtro corretamente', () => {
    component.dataSource.data = mockCategorias;
    const event = { target: { value: 'extensão' } } as any;

    component.applyFilter(event);

    expect(component.dataSource.filter).toBe('extensão');
  });

  it('deve navegar para criar nova categoria', () => {
    spyOn(component['router'], 'navigate');

    component.addCategoria();

    expect(component['router'].navigate).toHaveBeenCalledWith(['/categorias/novo']);
  });

  it('deve navegar para editar categoria', () => {
    spyOn(component['router'], 'navigate');
    const categoria = mockCategorias[0];

    component.editCategoria(categoria);

    expect(component['router'].navigate).toHaveBeenCalledWith(['/categorias/editar', 1]);
  });

  it('deve abrir diálogo de confirmação ao excluir', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(false));
    dialog.open.and.returnValue(dialogRefSpy);

    const categoria = mockCategorias[0];
    component.deleteCategoria(categoria);

    expect(dialog.open).toHaveBeenCalled();
    expect(dialogRefSpy.afterClosed).toHaveBeenCalled();
  });

  it('deve excluir categoria quando confirmado', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(true));
    dialog.open.and.returnValue(dialogRefSpy);
    cursosService.deleteCategory.and.returnValue(of(void 0));
    cursosService.getAllCategoriesPaginado.and.returnValue(of(mockPage));

    const categoria = mockCategorias[0];
    component.deleteCategoria(categoria);

    expect(cursosService.deleteCategory).toHaveBeenCalledWith(1);
    expect(snackBar.open).toHaveBeenCalled();
  });

  it('deve tratar erro 403 ao excluir (sem permissão)', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(true));
    dialog.open.and.returnValue(dialogRefSpy);
    cursosService.deleteCategory.and.returnValue(
      throwError(() => ({ status: 403 }))
    );

    const categoria = mockCategorias[0];
    component.deleteCategoria(categoria);

    expect(snackBar.open).toHaveBeenCalledWith(
      'Você não tem permissão para excluir tipos de atividades.',
      'Fechar',
      jasmine.any(Object)
    );
  });

  it('deve tratar erro 404 ao excluir (não encontrado)', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(true));
    dialog.open.and.returnValue(dialogRefSpy);
    cursosService.deleteCategory.and.returnValue(
      throwError(() => ({ status: 404 }))
    );

    const categoria = mockCategorias[0];
    component.deleteCategoria(categoria);

    expect(snackBar.open).toHaveBeenCalledWith(
      'Tipo de atividade não encontrado.',
      'Fechar',
      jasmine.any(Object)
    );
  });

  it('deve tratar erro 409 ao excluir (conflito)', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(true));
    dialog.open.and.returnValue(dialogRefSpy);
    cursosService.deleteCategory.and.returnValue(
      throwError(() => ({ status: 409 }))
    );

    const categoria = mockCategorias[0];
    component.deleteCategoria(categoria);

    expect(snackBar.open).toHaveBeenCalledWith(
      'Não é possível excluir este tipo de atividade pois há atividades vinculadas a ele.',
      'Fechar',
      jasmine.any(Object)
    );
  });

  it('deve alterar página corretamente', () => {
    cursosService.getAllCategoriesPaginado.and.returnValue(of(mockPage));
    const event = { pageIndex: 1, pageSize: 25 };

    component.onPageChange(event);

    expect(component.pageIndex).toBe(1);
    expect(component.pageSize).toBe(25);
    expect(cursosService.getAllCategoriesPaginado).toHaveBeenCalledWith({
      page: 1,
      size: 25,
      sortBy: 'id',
      direction: 'ASC'
    });
  });

  it('deve retornar true quando usuário é admin', () => {
    apiService.isAdmin.and.returnValue(true);

    expect(component.isAdmin()).toBe(true);
  });

  it('deve retornar false quando usuário não é admin', () => {
    apiService.isAdmin.and.returnValue(false);

    expect(component.isAdmin()).toBe(false);
  });

  it('deve exibir mensagem de sucesso', () => {
    component.showMessage('Sucesso!', 'success');

    expect(snackBar.open).toHaveBeenCalledWith(
      'Sucesso!',
      'Fechar',
      jasmine.objectContaining({
        duration: 4000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']
      })
    );
  });

  it('deve rastrear categoria por id', () => {
    const categoria = mockCategorias[0];

    const result = component.trackByCategoria(0, categoria);

    expect(result).toBe(1);
  });
});
