import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { FormCategoriaComponent } from './form-categoria.component';
import { CursosService } from '../../services/cursos.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('FormCategoriaComponent', () => {
  let component: FormCategoriaComponent;
  let fixture: ComponentFixture<FormCategoriaComponent>;
  let cursosService: jasmine.SpyObj<CursosService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let activatedRoute: ActivatedRoute;

  const mockCategoria = {
    id: 1,
    nome: 'Extensão'
  };

  beforeEach(async () => {
    const cursosServiceSpy = jasmine.createSpyObj('CursosService', [
      'getCategoryById',
      'createCategory',
      'updateCategory'
    ]);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        FormCategoriaComponent,
        NoopAnimationsModule
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CursosService, useValue: cursosServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({})
          }
        }
      ]
    }).compileComponents();

    cursosService = TestBed.inject(CursosService) as jasmine.SpyObj<CursosService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(FormCategoriaComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar formulário com validações', () => {
    expect(component.categoriaForm).toBeDefined();
    expect(component.categoriaForm.get('nome')).toBeDefined();
    expect(component.categoriaForm.get('nome')?.hasError('required')).toBe(true);
  });

  it('deve inicializar em modo de criação', () => {
    fixture.detectChanges();

    expect(component.isEditMode).toBe(false);
    expect(component.categoriaId).toBeUndefined();
  });

  it('deve carregar categoria em modo de edição', () => {
    activatedRoute.params = of({ id: '1' });
    cursosService.getCategoryById.and.returnValue(of(mockCategoria));

    fixture = TestBed.createComponent(FormCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isEditMode).toBe(true);
    expect(component.categoriaId).toBe(1);
    expect(cursosService.getCategoryById).toHaveBeenCalledWith(1);
    expect(component.categoriaForm.get('nome')?.value).toBe('Extensão');
  });

  it('deve validar campo nome como obrigatório', () => {
    const nomeControl = component.categoriaForm.get('nome');

    nomeControl?.setValue('');
    expect(nomeControl?.hasError('required')).toBe(true);

    nomeControl?.setValue('Extensão');
    expect(nomeControl?.hasError('required')).toBe(false);
  });

  it('deve validar tamanho mínimo do nome (3 caracteres)', () => {
    const nomeControl = component.categoriaForm.get('nome');

    nomeControl?.setValue('Ex');
    expect(nomeControl?.hasError('minlength')).toBe(true);

    nomeControl?.setValue('Ext');
    expect(nomeControl?.hasError('minlength')).toBe(false);
  });

  it('deve validar tamanho máximo do nome (100 caracteres)', () => {
    const nomeControl = component.categoriaForm.get('nome');
    const longName = 'a'.repeat(101);

    nomeControl?.setValue(longName);
    expect(nomeControl?.hasError('maxlength')).toBe(true);

    nomeControl?.setValue('a'.repeat(100));
    expect(nomeControl?.hasError('maxlength')).toBe(false);
  });

  it('deve criar categoria com sucesso', () => {
    const mockResponse = { id: 1, nome: 'Extensão' };
    cursosService.createCategory.and.returnValue(of(mockResponse));
    spyOn(component['router'], 'navigate');

    component.categoriaForm.patchValue({ nome: 'Extensão' });
    component.onSubmit();

    expect(cursosService.createCategory).toHaveBeenCalledWith({ nome: 'Extensão' });
    expect(snackBar.open).toHaveBeenCalledWith(
      'Tipo de atividade criado com sucesso!',
      'Fechar',
      jasmine.any(Object)
    );
    expect(component['router'].navigate).toHaveBeenCalledWith(['/categorias']);
  });

  it('deve atualizar categoria com sucesso', () => {
    component.isEditMode = true;
    component.categoriaId = 1;
    const mockResponse = { id: 1, nome: 'Extensão Atualizada' };
    cursosService.updateCategory.and.returnValue(of(mockResponse));
    spyOn(component['router'], 'navigate');

    component.categoriaForm.patchValue({ nome: 'Extensão Atualizada' });
    component.onSubmit();

    expect(cursosService.updateCategory).toHaveBeenCalledWith(1, { nome: 'Extensão Atualizada' });
    expect(snackBar.open).toHaveBeenCalledWith(
      'Tipo de atividade atualizado com sucesso!',
      'Fechar',
      jasmine.any(Object)
    );
    expect(component['router'].navigate).toHaveBeenCalledWith(['/categorias']);
  });

  it('não deve submeter formulário inválido', () => {
    component.categoriaForm.patchValue({ nome: '' });
    component.onSubmit();

    expect(cursosService.createCategory).not.toHaveBeenCalled();
    expect(cursosService.updateCategory).not.toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith(
      'Por favor, preencha todos os campos obrigatórios.',
      'Fechar',
      jasmine.any(Object)
    );
  });

  it('deve tratar erro 403 ao criar (sem permissão)', () => {
    cursosService.createCategory.and.returnValue(
      throwError(() => ({ status: 403 }))
    );

    component.categoriaForm.patchValue({ nome: 'Extensão' });
    component.onSubmit();

    expect(snackBar.open).toHaveBeenCalledWith(
      'Você não tem permissão para criar tipos de atividades.',
      'Fechar',
      jasmine.any(Object)
    );
  });

  it('deve tratar erro 409 ao criar (conflito)', () => {
    cursosService.createCategory.and.returnValue(
      throwError(() => ({ status: 409 }))
    );

    component.categoriaForm.patchValue({ nome: 'Extensão' });
    component.onSubmit();

    expect(snackBar.open).toHaveBeenCalledWith(
      'Já existe um tipo de atividade com este nome.',
      'Fechar',
      jasmine.any(Object)
    );
  });

  it('deve tratar erro 404 ao editar (não encontrado)', () => {
    component.isEditMode = true;
    component.categoriaId = 1;
    cursosService.updateCategory.and.returnValue(
      throwError(() => ({ status: 404 }))
    );

    component.categoriaForm.patchValue({ nome: 'Extensão' });
    component.onSubmit();

    expect(snackBar.open).toHaveBeenCalledWith(
      'Tipo de atividade não encontrado.',
      'Fechar',
      jasmine.any(Object)
    );
  });

  it('deve tratar erro genérico ao criar', () => {
    cursosService.createCategory.and.returnValue(
      throwError(() => ({ status: 500 }))
    );

    component.categoriaForm.patchValue({ nome: 'Extensão' });
    component.onSubmit();

    expect(snackBar.open).toHaveBeenCalledWith(
      'Erro ao criar tipo de atividade. Tente novamente.',
      'Fechar',
      jasmine.any(Object)
    );
  });

  it('deve tratar erro ao carregar categoria para edição', () => {
    activatedRoute.params = of({ id: '1' });
    cursosService.getCategoryById.and.returnValue(
      throwError(() => ({ status: 404 }))
    );
    spyOn(component['router'], 'navigate');

    fixture = TestBed.createComponent(FormCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(snackBar.open).toHaveBeenCalledWith(
      'Erro ao carregar tipo de atividade.',
      'Fechar',
      jasmine.any(Object)
    );
    expect(component['router'].navigate).toHaveBeenCalledWith(['/categorias']);
  });

  it('deve navegar de volta ao cancelar', () => {
    spyOn(component['router'], 'navigate');

    component.onCancel();

    expect(component['router'].navigate).toHaveBeenCalledWith(['/categorias']);
  });

  it('deve trimmar espaços do nome ao submeter', () => {
    cursosService.createCategory.and.returnValue(of({ id: 1, nome: 'Extensão' }));
    spyOn(component['router'], 'navigate');

    component.categoriaForm.patchValue({ nome: '  Extensão  ' });
    component.onSubmit();

    expect(cursosService.createCategory).toHaveBeenCalledWith({ nome: 'Extensão' });
  });

  it('deve marcar formulário como touched ao submeter inválido', () => {
    component.categoriaForm.patchValue({ nome: '' });
    const nomeControl = component.categoriaForm.get('nome');

    component.onSubmit();

    expect(nomeControl?.touched).toBe(true);
  });

  it('deve desabilitar submit durante salvamento', () => {
    cursosService.createCategory.and.returnValue(of({ id: 1, nome: 'Extensão' }));

    component.categoriaForm.patchValue({ nome: 'Extensão' });
    component.isSaving = true;
    component.onSubmit();

    // Não deve chamar o serviço se já está salvando
    expect(cursosService.createCategory).not.toHaveBeenCalled();
  });

  it('deve retornar getter do campo nome', () => {
    const nomeControl = component.nome;

    expect(nomeControl).toBe(component.categoriaForm.get('nome'));
  });

  it('deve exibir estado de loading ao carregar categoria', () => {
    activatedRoute.params = of({ id: '1' });
    cursosService.getCategoryById.and.returnValue(of(mockCategoria));

    fixture = TestBed.createComponent(FormCategoriaComponent);
    component = fixture.componentInstance;

    expect(component.isLoading).toBe(false);

    fixture.detectChanges();

    // Após carregar, isLoading deve ser false
    fixture.whenStable().then(() => {
      expect(component.isLoading).toBe(false);
    });
  });

  it('deve exibir mensagens com diferentes tipos', () => {
    component.showMessage('Sucesso', 'success');
    expect(snackBar.open).toHaveBeenCalledWith(
      'Sucesso',
      'Fechar',
      jasmine.objectContaining({ panelClass: ['snackbar-success'] })
    );

    component.showMessage('Erro', 'error');
    expect(snackBar.open).toHaveBeenCalledWith(
      'Erro',
      'Fechar',
      jasmine.objectContaining({ panelClass: ['snackbar-error'] })
    );

    component.showMessage('Info', 'info');
    expect(snackBar.open).toHaveBeenCalledWith(
      'Info',
      'Fechar',
      jasmine.objectContaining({ panelClass: ['info-snackbar'] })
    );
  });
});
