import { Atividade } from "./atividade.model";

export interface Categoria {
  id: number; // O ID é obrigatório e não-null
  nome: string; // Nome obrigatório
  atividades?: Atividade[]; // Lista de atividades
}
