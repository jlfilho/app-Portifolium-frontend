import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EvidenciasService } from './evidencias.service';
import { EvidenciaDTO } from '../models/evidencia.model';

describe('EvidenciasService', () => {
  let service: EvidenciasService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8080/api/evidencias';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EvidenciasService]
    });
    service = TestBed.inject(EvidenciasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('listarEvidenciasPorAtividade', () => {
    it('should return evidencias for an activity', () => {
      const mockEvidencias: EvidenciaDTO[] = [
        {
          id: 1,
          atividadeId: 10,
          foto: '/fotos/evidencia1.jpg',
          legenda: 'Evidência 1',
          criadoPor: 'usuario1'
        },
        {
          id: 2,
          atividadeId: 10,
          foto: '/fotos/evidencia2.jpg',
          legenda: 'Evidência 2',
          criadoPor: 'usuario2'
        }
      ];

      service.listarEvidenciasPorAtividade(10).subscribe(evidencias => {
        expect(evidencias.length).toBe(2);
        expect(evidencias).toEqual(mockEvidencias);
      });

      const req = httpMock.expectOne(`${baseUrl}/atividade/10`);
      expect(req.request.method).toBe('GET');
      req.flush(mockEvidencias);
    });

    it('should return empty array when no evidencias found', () => {
      service.listarEvidenciasPorAtividade(10).subscribe(evidencias => {
        expect(evidencias.length).toBe(0);
      });

      const req = httpMock.expectOne(`${baseUrl}/atividade/10`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('getEvidenciasPorId', () => {
    it('should return a single evidencia', () => {
      const mockEvidencia: EvidenciaDTO = {
        id: 1,
        atividadeId: 10,
        foto: '/fotos/evidencia1.jpg',
        legenda: 'Evidência 1',
        criadoPor: 'usuario1'
      };

      service.getEvidenciasPorId(1).subscribe(evidencia => {
        expect(evidencia).toEqual(mockEvidencia);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockEvidencia);
    });
  });

  describe('salvarEvidencia', () => {
    it('should save a new evidencia with FormData', () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockResponse: EvidenciaDTO = {
        id: 1,
        atividadeId: 10,
        foto: '/fotos/evidencia1.jpg',
        legenda: 'Nova evidência',
        criadoPor: 'usuario1'
      };

      service.salvarEvidencia(10, 'Nova evidência', mockFile).subscribe(evidencia => {
        expect(evidencia).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBeTruthy();
      req.flush(mockResponse);
    });
  });

  describe('atualizarEvidencia', () => {
    it('should update an existing evidencia', () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockResponse: EvidenciaDTO = {
        id: 1,
        atividadeId: 10,
        foto: '/fotos/evidencia1-updated.jpg',
        legenda: 'Evidência atualizada',
        criadoPor: 'usuario1'
      };

      service.atualizarEvidencia(1, 'Evidência atualizada', mockFile).subscribe(evidencia => {
        expect(evidencia).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body instanceof FormData).toBeTruthy();
      req.flush(mockResponse);
    });
  });

  describe('excluirEvidencia', () => {
    it('should delete an evidencia', () => {
      service.excluirEvidencia(1).subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('getImageUrl', () => {
    it('should return full URL for relative path', () => {
      const url = service.getImageUrl('/fotos/test.jpg');
      expect(url).toBe('http://localhost:8080/api/files/fotos/test.jpg');
    });

    it('should return URL as is if already complete', () => {
      const completeUrl = 'http://example.com/image.jpg';
      const url = service.getImageUrl(completeUrl);
      expect(url).toBe(completeUrl);
    });

    it('should return empty string for empty input', () => {
      const url = service.getImageUrl('');
      expect(url).toBe('');
    });
  });
});

