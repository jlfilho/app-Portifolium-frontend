/**
 * Interface para DTO de Evidência
 */
export interface EvidenciaDTO {
  id?: number;
  atividadeId: number;
  foto: string;
  legenda: string;
  criadoPor?: string;
  ordem?: number;
  urlFoto?: string;
}

/**
 * Interface para criar uma nova evidência
 */
export interface EvidenciaCreateDTO {
  atividadeId: number;
  legenda: string;
  file: File;
}

/**
 * Interface para atualizar uma evidência
 */
export interface EvidenciaUpdateDTO {
  evidenciaId: number;
  legenda: string;
  file?: File; // Arquivo opcional ao atualizar
}

