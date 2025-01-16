export interface Evidencia {
  id: number | null; // O ID pode ser null (novo registro)
  atividadeId: number; // ID da atividade é obrigatório
  foto: string; // Caminho da foto obrigatório
  legenda: string; // Legenda obrigatória
  criadoPor?: string; // Campo opcional (pode ser null ou não enviado)
}
