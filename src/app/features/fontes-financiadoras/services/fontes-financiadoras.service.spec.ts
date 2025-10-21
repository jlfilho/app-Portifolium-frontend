import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FontesFinanciadorasService, FonteFinanciadoraDTO, FonteFinanciadoraCreateDTO, FonteFinanciadoraUpdateDTO } from './fontes-financiadoras.service';
import { environment } from '../../../../environments/environment';

describe('FontesFinanciadorasService', () => {
  let service: FontesFinanciadorasService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/fontes-financiadoras`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FontesFinanciadorasService]
    });
    service = TestBed.inject(FontesFinanciadorasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('listarTodas', () => {
    it('should return all fontes financiadoras', () => {
      const mockFontes: FonteFinanciadoraDTO[] = [
        { id: 1, nome: 'CNPq' },
        { id: 2, nome: 'FAPEAM' }
      ];

      service.listarTodas().subscribe(fontes => {
        expect(fontes.length).toBe(2);
        expect(fontes).toEqual(mockFontes);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockFontes);
    });

    it('should handle empty list', () => {
      service.listarTodas().subscribe(fontes => {
        expect(fontes.length).toBe(0);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('recuperarPorId', () => {
    it('should return fonte financiadora by id', () => {
      const mockFonte: FonteFinanciadoraDTO = { id: 1, nome: 'CNPq' };

      service.recuperarPorId(1).subscribe(fonte => {
        expect(fonte).toEqual(mockFonte);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockFonte);
    });

    it('should handle error for invalid id', () => {
      service.recuperarPorId(999).subscribe(
        () => fail('should have failed'),
        error => {
          expect(error.status).toBe(404);
        }
      );

      const req = httpMock.expectOne(`${baseUrl}/999`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('salvar', () => {
    it('should create new fonte financiadora', () => {
      const newFonte: FonteFinanciadoraCreateDTO = { nome: 'Nova Fonte' };
      const mockResponse: FonteFinanciadoraDTO = { id: 3, nome: 'Nova Fonte' };

      service.salvar(newFonte).subscribe(fonte => {
        expect(fonte).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newFonte);
      req.flush(mockResponse);
    });
  });

  describe('atualizar', () => {
    it('should update fonte financiadora', () => {
      const updateData: FonteFinanciadoraUpdateDTO = { nome: 'Fonte Atualizada' };
      const mockResponse: FonteFinanciadoraDTO = { id: 1, nome: 'Fonte Atualizada' };

      service.atualizar(1, updateData).subscribe(fonte => {
        expect(fonte).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(mockResponse);
    });
  });

  describe('deletar', () => {
    it('should delete fonte financiadora', () => {
      service.deletar(1).subscribe(() => {
        expect(true).toBeTruthy();
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle error when deleting', () => {
      service.deletar(999).subscribe(
        () => fail('should have failed'),
        error => {
          expect(error.status).toBe(404);
        }
      );

      const req = httpMock.expectOne(`${baseUrl}/999`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });
});

