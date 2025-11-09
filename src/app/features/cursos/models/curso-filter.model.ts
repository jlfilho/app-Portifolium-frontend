import { PageRequest } from '../../../shared/models/page.model';

export interface CursoFilter extends PageRequest {
  nome?: string;
  ativo?: boolean | null;
  tipoId?: number | null;
  unidadeAcademicaId?: number | null;
}
