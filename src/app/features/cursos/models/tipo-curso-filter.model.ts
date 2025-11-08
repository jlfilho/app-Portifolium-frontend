import { PageRequest } from '../../../shared/models/page.model';

export interface TipoCursoFilter extends PageRequest {
  nome?: string;
}
