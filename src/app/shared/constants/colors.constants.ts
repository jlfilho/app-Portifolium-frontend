/**
 * Constantes de cores que espelham as variáveis CSS globais
 * Use estas constantes em TypeScript quando precisar de valores de cor
 * Para CSS, sempre use as variáveis globais: var(--primary-color), etc.
 */

export const COLORS = {
  // Cores Primárias
  PRIMARY: '#0F6A45',
  SECONDARY: '#33A36B',
  ACCENT: '#64B687',

  // Cores de Estado
  SUCCESS: '#16A34A',
  ERROR: '#EF4444',
  WARNING: '#F59E0B',
  INFO: '#0F6A45',

  // Cores de Texto
  TEXT_DARK: '#0B1F16',
  TEXT_MEDIUM: '#5B7B6F',
  TEXT_LIGHT: '#94A3B8',

  // Cores Neutras (para casos especiais)
  GRAY_500: '#64748B',
  GRAY_600: '#475569',
  GRAY_700: '#1e293b',
  GRAY_800: '#0f172a',
  GRAY_900: '#1f2937',

  // Branco e Preto
  WHITE: '#FFFFFF',
  BLACK: '#000000'
} as const;

/**
 * Função helper para obter cores dinamicamente do CSS
 * Útil quando você precisa ler valores de variáveis CSS em runtime
 */
export function getCssVariable(variableName: string): string {
  if (typeof window !== 'undefined' && typeof getComputedStyle === 'function') {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim() || '';
  }
  return '';
}

/**
 * Mapeamento de cores para categorias (usado em gráficos)
 */
export const CATEGORIA_COLORS: Record<string, string> = {
  'Ensino': COLORS.PRIMARY,
  'Pesquisa': COLORS.SUCCESS,
  'Extensão': COLORS.SECONDARY,
  'Inovação': COLORS.WARNING,
  'Outros': COLORS.GRAY_500
};

/**
 * Array de cores para métricas (usado em gráficos)
 */
export const METRIC_COLORS: string[] = [
  COLORS.PRIMARY,    // Total de Cursos
  COLORS.SUCCESS,    // Atividades Ativas
  COLORS.SECONDARY,  // Usuários Cadastrados
  COLORS.ACCENT,     // Pessoas Cadastradas
  COLORS.WARNING,    // Fontes Financiadoras
  COLORS.ERROR       // Publicações
];

/**
 * Cores para papéis (usado em atividades)
 */
export const PAPEL_COLORS: Record<string, string> = {
  'COORDENADOR': COLORS.PRIMARY,
  'SUBCOORDENADOR': COLORS.SECONDARY,
  'BOLSISTA': COLORS.ACCENT,
  'VOLUNTARIO': COLORS.SUCCESS,
  'PARTICIPANTE': COLORS.SECONDARY
};

/**
 * Cores para status de atividades
 */
export const STATUS_COLORS: Record<string, string> = {
  'success': COLORS.SUCCESS,
  'warning': COLORS.WARNING,
  'error': COLORS.ERROR,
  'info': COLORS.INFO
};

/**
 * Cores para roles de usuários
 */
export const ROLE_COLORS: Record<string, string> = {
  'Administradores': COLORS.PRIMARY,
  'Gerentes': COLORS.SUCCESS,
  'Secretários': COLORS.SECONDARY,
  'Coordenador de atividades': COLORS.ACCENT
};

