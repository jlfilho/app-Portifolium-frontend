import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AtividadesService } from './atividades.service';
import { AtividadeDTO, AtividadeFiltroDTO, AtividadeCreateDTO } from '../models/atividade.model';

describe('AtividadesService', () => {
  let service: AtividadesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AtividadesService]
    });
    service = TestBed.inject(AtividadesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAtividadesPorCurso', () => {
    it('should return atividades for a course', () => {
      const cursoId = 1;
      const mockAtividades: AtividadeDTO[] = [
        {
          id: 1,
          nome: 'Atividade 1',
          objetivo: 'Objetivo da atividade',
          publicoAlvo: 'Público alvo',
          statusPublicacao: true,
          coordenador: 'João Silva',
          dataRealizacao: '2024-01-01',
          curso: {
            id: 1,
            nome: 'Curso de Engenharia',
            ativo: true
          },
          categoria: {
            id: 1,
            nome: 'Categoria A'
          },
          fontesFinanciadora: [],
          integrantes: [
            {
              id: 1,
              nome: 'João Silva',
              cpf: '12345678901',
              papel: 'Coordenador'
            }
          ]
        }
      ];

      service.getAtividadesPorCurso(cursoId).subscribe(atividades => {
        expect(atividades).toEqual(mockAtividades);
      });

      const req = httpMock.expectOne(`/api/atividades/curso/${cursoId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockAtividades);
    });
  });

  describe('getAtividadeById', () => {
    it('should return atividade by id', () => {
      const atividadeId = 1;
      const mockAtividade: AtividadeDTO = {
        id: 1,
        nome: 'Atividade 1',
        objetivo: 'Objetivo da atividade',
        publicoAlvo: 'Público alvo',
        statusPublicacao: true,
        coordenador: 'João Silva',
        dataRealizacao: '2024-01-01',
        curso: {
          id: 1,
          nome: 'Curso de Engenharia',
          ativo: true
        },
        categoria: {
          id: 1,
          nome: 'Categoria A'
        },
        fontesFinanciadora: [],
        integrantes: []
      };

      service.getAtividadeById(atividadeId).subscribe(atividade => {
        expect(atividade).toEqual(mockAtividade);
      });

      const req = httpMock.expectOne(`/api/atividades/${atividadeId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockAtividade);
    });
  });

  describe('salvarAtividade', () => {
    it('should create a new atividade', () => {
      const novaAtividade: AtividadeCreateDTO = {
        nome: 'Nova Atividade',
        objetivo: 'Objetivo da nova atividade',
        publicoAlvo: 'Público alvo',
        statusPublicacao: true,
        coordenador: 'João Silva',
        dataRealizacao: '2024-01-01',
        cursoId: 1,
        categoriaId: 1
      };

      const mockAtividadeSalva: AtividadeDTO = {
        id: 1,
        ...novaAtividade
      };

      service.salvarAtividade(novaAtividade).subscribe(atividade => {
        expect(atividade).toEqual(mockAtividadeSalva);
      });

      const req = httpMock.expectOne('/api/atividades');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(novaAtividade);
      req.flush(mockAtividadeSalva);
    });
  });

  describe('atualizarAtividade', () => {
    it('should update an existing atividade', () => {
      const atividadeId = 1;
      const atividadeAtualizada = {
        nome: 'Atividade Atualizada',
        objetivo: 'Novo objetivo'
      };

      const mockAtividade: AtividadeDTO = {
        id: 1,
        nome: 'Atividade Atualizada',
        objetivo: 'Novo objetivo',
        publicoAlvo: 'Público alvo',
        statusPublicacao: true,
        coordenador: 'João Silva',
        dataRealizacao: '2024-01-01',
        curso: {
          id: 1,
          nome: 'Curso de Engenharia',
          ativo: true
        },
        categoria: {
          id: 1,
          nome: 'Categoria A'
        },
        fontesFinanciadora: [],
        integrantes: []
      };

      service.atualizarAtividade(atividadeId, atividadeAtualizada).subscribe(atividade => {
        expect(atividade).toEqual(mockAtividade);
      });

      const req = httpMock.expectOne(`/api/atividades/${atividadeId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(atividadeAtualizada);
      req.flush(mockAtividade);
    });
  });

  describe('excluirAtividade', () => {
    it('should delete an atividade', () => {
      const atividadeId = 1;

      service.excluirAtividade(atividadeId).subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`/api/atividades/${atividadeId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('getAtividadesPorFiltros', () => {
    it('should return atividades with filters', () => {
      const filtros: AtividadeFiltroDTO = {
        cursoId: 1,
        statusPublicacao: true,
        coordenador: 'João Silva'
      };

      const mockAtividades: AtividadeDTO[] = [
        {
          id: 1,
          nome: 'Atividade 1',
          objetivo: 'Objetivo da atividade',
          publicoAlvo: 'Público alvo',
          statusPublicacao: true,
          coordenador: 'João Silva',
          dataRealizacao: '2024-01-01',
          curso: {
            id: 1,
            nome: 'Curso de Engenharia',
            ativo: true
          },
          categoria: {
            id: 1,
            nome: 'Categoria A'
          },
          fontesFinanciadora: [],
          integrantes: [
            {
              id: 1,
              nome: 'João Silva',
              cpf: '12345678901',
              papel: 'Coordenador'
            }
          ]
        }
      ];

      service.getAtividadesPorFiltros(filtros).subscribe(atividades => {
        expect(atividades).toEqual(mockAtividades);
      });

      const req = httpMock.expectOne('/api/atividades/filtros?cursoId=1&statusPublicacao=true&coordenador=Jo%C3%A3o%20Silva');
      expect(req.request.method).toBe('GET');
      req.flush(mockAtividades);
    });
  });
});
