export interface DashboardDTO {
  metricasGerais: MetricasGeraisDTO;
  atividadesPorCategoria: AtividadePorCategoriaDTO[];
  statusPublicacao: StatusPublicacaoDTO;
  distribuicaoUsuarios: DistribuicaoUsuarioDTO[];
  cursosDestaque: CursoDestaqueDTO[];
  atividadesRecentes: AtividadeRecenteDTO[];
  metasProgresso: MetaProgressoDTO[];
}

export interface MetricasGeraisDTO {
  totalCursos: MetricaDTO;
  atividadesAtivas: MetricaDTO;
  usuariosCadastrados: MetricaDTO;
  pessoasCadastradas: MetricaDTO;
  fontesFinanciadoras: MetricaDTO;
  publicacoes: MetricaDTO;
  taxaConclusao: MetricaDTO;
}

export interface MetricaDTO {
  percentualCrescimento: number;
  valor: number;
  descricaoCrescimento: string;
}

export interface AtividadePorCategoriaDTO {
  categoria: string;
  quantidade: number;
}

export interface StatusPublicacaoDTO {
  publicadas: number;
  naoPublicadas: number;
  percentualPublicadas: number;
}

export interface DistribuicaoUsuarioDTO {
  tipo: string;
  quantidade: number;
}

export interface CursoDestaqueDTO {
  nome: string;
  quantidadeAtividades: number;
  quantidadeUsuarios: number;
}

export interface AtividadeRecenteDTO {
  tipo: string;
  descricao: string;
  dataHora: string;
  tempoDecorrido: string;
}

export interface MetaProgressoDTO {
  nome: string;
  atual: number;
  meta: number;
  percentual: number;
}

export interface ChartData {
  label: string;
  value: number;
  color: string;
}

