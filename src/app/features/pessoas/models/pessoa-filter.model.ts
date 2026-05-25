import { PageRequest } from '../../../shared/models/page.model';

export interface PessoaFilter extends PageRequest {
  nome?: string;
}


