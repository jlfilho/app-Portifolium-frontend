// Re-export dos modelos existentes para facilitar imports
export type { Curso } from '../../features/cursos/models/curso.model';
export type { AtividadeDTO } from '../../features/atividades/models/atividade.model';
export type { EvidenciaDTO } from '../../features/evidencias/models/evidencia.model';
export type { Page } from '../../shared/models/page.model';

// Import dos tipos para usar nas interfaces
import type { Curso } from '../../features/cursos/models/curso.model';
import type { AtividadeDTO } from '../../features/atividades/models/atividade.model';
import type { EvidenciaDTO } from '../../features/evidencias/models/evidencia.model';

// Interfaces específicas para páginas públicas
export interface PublicCurso extends Curso {
  // Pode adicionar campos específicos para visualização pública
}

export interface PublicAtividade extends AtividadeDTO {
  // Pode adicionar campos específicos para visualização pública
}

export interface PublicEvidencia extends EvidenciaDTO {
  // Pode adicionar campos específicos para visualização pública
}
