export interface Curso {
  id: number; // O ID é obrigatório e não-null
  nome: string; // Nome obrigatório
  ativo?: boolean; // Ativo é um booleano
}
