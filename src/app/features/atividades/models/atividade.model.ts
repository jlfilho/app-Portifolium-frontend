export interface AtividadeDTO {
  id?: number;
  nome: string;
  objetivo: string;
  publicoAlvo: string;
  statusPublicacao: boolean;
  fotoCapa?: string;
  coordenador: string;
  dataRealizacao: string; // ISO date string (LocalDate)
  curso: CursoDTO;
  categoria: CategoriaDTO;
  fontesFinanciadora: FonteFinanciadoraDTO[];
  integrantes: PessoaPapelDTO[];
  totalParticipantes?: number;
  participantesCount?: number;
  totalEvidencias?: number;
  evidenciasCount?: number;
}

export interface CursoDTO {
  id: number;
  nome: string;
  descricao?: string;
  ativo: boolean | null;
  // Campos ignorados pelo JsonIgnoreProperties
  // atividades?: any[];
  // usuarios?: any[];
}

export interface CategoriaDTO {
  id: number;
  nome: string;
  descricao?: string;
  // Campo ignorado pelo JsonIgnoreProperties
  // atividades?: any[];
}

export interface FonteFinanciadoraDTO {
  id?: number;
  nome: string;
  // Campo ignorado pelo JsonIgnore
  // atividades?: any[];
}

export interface PessoaPapelDTO {
  id: number;
  nome: string;
  cpf: string;
  papel: string; // Papel da pessoa na atividade
}

export interface AtividadeFiltroDTO {
  cursoId?: number;
  categoriaId?: number;
  nome?: string;
  dataInicio?: string; // ISO date string
  dataFim?: string; // ISO date string
  statusPublicacao?: boolean;
  coordenador?: string;
  publicoAlvo?: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface AtividadeCreateDTO {
  nome: string;
  objetivo: string;
  publicoAlvo: string;
  statusPublicacao: boolean;
  coordenador: string;
  dataRealizacao: string; // ISO date string
  cursoId: number;
  categoriaId: number;
  fontesFinanciadoraIds?: number[];
  integrantesIds?: number[];
}

export interface AtividadeUpdateDTO {
  nome: string;
  objetivo: string;
  publicoAlvo: string;
  statusPublicacao: boolean;
  coordenador: string;
  dataRealizacao: string; // ISO date string
  cursoId: number;
  categoriaId: number;
  fontesFinanciadoraIds?: number[];
  integrantesIds?: number[];
}
