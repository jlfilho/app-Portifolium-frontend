/**
 * Enum representando os papéis que uma pessoa pode ter em uma atividade
 * Equivalente ao enum Papel do backend Java
 */
export enum Papel {
  COORDENADOR = 'COORDENADOR',
  SUBCOORDENADOR = 'SUBCOORDENADOR',
  BOLSISTA = 'BOLSISTA',
  VOLUNTARIO = 'VOLUNTARIO',
  PARTICIPANTE = 'PARTICIPANTE'
}

/**
 * Labels em português para exibição na interface
 */
export const PapelLabels: Record<Papel, string> = {
  [Papel.COORDENADOR]: 'Coordenador',
  [Papel.SUBCOORDENADOR]: 'Subcoordenador',
  [Papel.BOLSISTA]: 'Bolsista',
  [Papel.VOLUNTARIO]: 'Voluntário',
  [Papel.PARTICIPANTE]: 'Participante'
};

/**
 * Ícones para cada papel
 */
export const PapelIcons: Record<Papel, string> = {
  [Papel.COORDENADOR]: 'star',
  [Papel.SUBCOORDENADOR]: 'star_half',
  [Papel.BOLSISTA]: 'school',
  [Papel.VOLUNTARIO]: 'volunteer_activism',
  [Papel.PARTICIPANTE]: 'person'
};

/**
 * Cores para cada papel
 */
export const PapelColors: Record<Papel, string> = {
  [Papel.COORDENADOR]: '#EF4444',      // Vermelho
  [Papel.SUBCOORDENADOR]: '#F59E0B',   // Laranja
  [Papel.BOLSISTA]: '#3B82F6',         // Azul
  [Papel.VOLUNTARIO]: '#10B981',       // Verde
  [Papel.PARTICIPANTE]: '#8B5CF6'      // Roxo
};

/**
 * Array com todos os papéis disponíveis para uso em selects/dropdowns
 */
export const PapeisDisponiveis = [
  { value: Papel.COORDENADOR, label: PapelLabels[Papel.COORDENADOR], icon: PapelIcons[Papel.COORDENADOR], color: PapelColors[Papel.COORDENADOR] },
  { value: Papel.SUBCOORDENADOR, label: PapelLabels[Papel.SUBCOORDENADOR], icon: PapelIcons[Papel.SUBCOORDENADOR], color: PapelColors[Papel.SUBCOORDENADOR] },
  { value: Papel.BOLSISTA, label: PapelLabels[Papel.BOLSISTA], icon: PapelIcons[Papel.BOLSISTA], color: PapelColors[Papel.BOLSISTA] },
  { value: Papel.VOLUNTARIO, label: PapelLabels[Papel.VOLUNTARIO], icon: PapelIcons[Papel.VOLUNTARIO], color: PapelColors[Papel.VOLUNTARIO] },
  { value: Papel.PARTICIPANTE, label: PapelLabels[Papel.PARTICIPANTE], icon: PapelIcons[Papel.PARTICIPANTE], color: PapelColors[Papel.PARTICIPANTE] }
];

/**
 * Funções auxiliares para trabalhar com papéis
 */
export class PapelUtils {
  /**
   * Retorna o label em português de um papel
   */
  static getLabel(papel: Papel | string): string {
    return PapelLabels[papel as Papel] || papel;
  }

  /**
   * Retorna o ícone de um papel
   */
  static getIcon(papel: Papel | string): string {
    return PapelIcons[papel as Papel] || 'person';
  }

  /**
   * Retorna a cor de um papel
   */
  static getColor(papel: Papel | string): string {
    return PapelColors[papel as Papel] || '#64748B';
  }

  /**
   * Verifica se um papel é válido
   */
  static isValid(papel: string): boolean {
    return Object.values(Papel).includes(papel as Papel);
  }

  /**
   * Retorna todos os papéis como array de strings
   */
  static getAllPapeis(): string[] {
    return Object.values(Papel);
  }
}

