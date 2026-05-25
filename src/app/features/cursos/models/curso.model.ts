import { TipoCurso } from './tipo-curso.model';
import { UnidadeAcademica } from '../../unidades-academicas/models/unidade-academica.model';

export interface Curso {
  id?: number;
  nome: string;
  descricao?: string;
  ativo: boolean;
  fotoCapa?: string;
  tipoId?: number; // referência ao tipo de curso
  tipo?: TipoCurso; // tipo de curso completo (quando o backend retornar)
  unidadeAcademicaId?: number;
  unidadeAcademica?: UnidadeAcademica;
}

export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
}

