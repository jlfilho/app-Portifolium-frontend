import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { CursosService } from './cursos.service';
import { environment } from '../../../../environments/environment.development';

describe('CursosService', () => {
  let service: CursosService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CursosService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CursosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica se não há requisições pendentes
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('Categorias - GET (Paginado)', () => {
    it('deve buscar categorias paginadas com parâmetros corretos', () => {
      const mockPage = {
        content: [
          { id: 1, nome: 'Extensão' },
          { id: 2, nome: 'Pesquisa' }
        ],
        totalElements: 2,
        totalPages: 1,
        size: 10,
        number: 0
      };

      const pageRequest = {
        page: 0,
        size: 10,
        sortBy: 'id',
        direction: 'ASC' as const
      };

      service.getAllCategoriesPaginado(pageRequest).subscribe(page => {
        expect(page.content.length).toBe(2);
        expect(page.totalElements).toBe(2);
        expect(page.content[0].nome).toBe('Extensão');
      });

      const req = httpMock.expectOne(
        `${baseUrl}/categorias?page=0&size=10&sortBy=id&direction=ASC`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPage);
    });

    it('deve buscar categorias com diferentes parâmetros de paginação', () => {
      const mockPage = {
        content: [{ id: 3, nome: 'Ensino' }],
        totalElements: 25,
        totalPages: 3,
        size: 10,
        number: 2
      };

      const pageRequest = {
        page: 2,
        size: 10,
        sortBy: 'nome',
        direction: 'DESC' as const
      };

      service.getAllCategoriesPaginado(pageRequest).subscribe(page => {
        expect(page.number).toBe(2);
        expect(page.totalPages).toBe(3);
      });

      const req = httpMock.expectOne(
        `${baseUrl}/categorias?page=2&size=10&sortBy=nome&direction=DESC`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPage);
    });
  });

  describe('Categorias - GET by ID', () => {
    it('deve buscar categoria por ID', () => {
      const mockCategoria = { id: 1, nome: 'Extensão' };

      service.getCategoryById(1).subscribe(categoria => {
        expect(categoria).toEqual(mockCategoria);
        expect(categoria.nome).toBe('Extensão');
      });

      const req = httpMock.expectOne(`${baseUrl}/categorias/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCategoria);
    });

    it('deve tratar erro 404 ao buscar categoria inexistente', () => {
      service.getCategoryById(999).subscribe({
        next: () => fail('Deveria ter falhado'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/categorias/999`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('Categorias - POST (Criar)', () => {
    it('deve criar nova categoria', () => {
      const novaCategoria = { nome: 'Extensão' };
      const mockResponse = { id: 1, nome: 'Extensão' };

      service.createCategory(novaCategoria).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.id).toBe(1);
      });

      const req = httpMock.expectOne(`${baseUrl}/categorias`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(novaCategoria);
      req.flush(mockResponse);
    });

    it('deve logar mensagem ao criar categoria', () => {
      spyOn(console, 'log');
      const novaCategoria = { nome: 'Pesquisa' };

      service.createCategory(novaCategoria).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/categorias`);
      req.flush({ id: 2, nome: 'Pesquisa' });

      expect(console.log).toHaveBeenCalledWith('📝 Criando categoria:', novaCategoria);
    });

    it('deve tratar erro 403 ao criar sem permissão', () => {
      const novaCategoria = { nome: 'Extensão' };

      service.createCategory(novaCategoria).subscribe({
        next: () => fail('Deveria ter falhado'),
        error: (error) => {
          expect(error.status).toBe(403);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/categorias`);
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    });

    it('deve tratar erro 409 ao criar categoria duplicada', () => {
      const novaCategoria = { nome: 'Extensão' };

      service.createCategory(novaCategoria).subscribe({
        next: () => fail('Deveria ter falhado'),
        error: (error) => {
          expect(error.status).toBe(409);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/categorias`);
      req.flush('Conflict', { status: 409, statusText: 'Conflict' });
    });
  });

  describe('Categorias - PUT (Atualizar)', () => {
    it('deve atualizar categoria existente', () => {
      const categoriaAtualizada = { nome: 'Extensão Universitária' };
      const mockResponse = { id: 1, nome: 'Extensão Universitária' };

      service.updateCategory(1, categoriaAtualizada).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.nome).toBe('Extensão Universitária');
      });

      const req = httpMock.expectOne(`${baseUrl}/categorias/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(categoriaAtualizada);
      req.flush(mockResponse);
    });

    it('deve logar mensagem ao atualizar categoria', () => {
      spyOn(console, 'log');
      const categoriaAtualizada = { nome: 'Pesquisa Científica' };

      service.updateCategory(2, categoriaAtualizada).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/categorias/2`);
      req.flush({ id: 2, nome: 'Pesquisa Científica' });

      expect(console.log).toHaveBeenCalledWith('✏️ Atualizando categoria:', 2, categoriaAtualizada);
    });

    it('deve tratar erro 404 ao atualizar categoria inexistente', () => {
      const categoriaAtualizada = { nome: 'Teste' };

      service.updateCategory(999, categoriaAtualizada).subscribe({
        next: () => fail('Deveria ter falhado'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/categorias/999`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('deve tratar erro 403 ao atualizar sem permissão', () => {
      const categoriaAtualizada = { nome: 'Teste' };

      service.updateCategory(1, categoriaAtualizada).subscribe({
        next: () => fail('Deveria ter falhado'),
        error: (error) => {
          expect(error.status).toBe(403);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/categorias/1`);
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    });
  });

  describe('Categorias - DELETE (Excluir)', () => {
    it('deve excluir categoria', () => {
      service.deleteCategory(1).subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${baseUrl}/categorias/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('deve logar mensagem ao excluir categoria', () => {
      spyOn(console, 'log');

      service.deleteCategory(1).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/categorias/1`);
      req.flush(null);

      expect(console.log).toHaveBeenCalledWith('🗑️ Deletando categoria:', 1);
    });

    it('deve tratar erro 404 ao excluir categoria inexistente', () => {
      service.deleteCategory(999).subscribe({
        next: () => fail('Deveria ter falhado'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/categorias/999`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('deve tratar erro 409 ao excluir categoria com vínculos', () => {
      service.deleteCategory(1).subscribe({
        next: () => fail('Deveria ter falhado'),
        error: (error) => {
          expect(error.status).toBe(409);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/categorias/1`);
      req.flush('Conflict', { status: 409, statusText: 'Conflict' });
    });

    it('deve tratar erro 403 ao excluir sem permissão', () => {
      service.deleteCategory(1).subscribe({
        next: () => fail('Deveria ter falhado'),
        error: (error) => {
          expect(error.status).toBe(403);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/categorias/1`);
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    });
  });
});
