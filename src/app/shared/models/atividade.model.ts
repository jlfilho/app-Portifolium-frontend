import { Categoria } from "./categoria.model";
import { Curso } from "./curso.model";
import { FonteFinanciadora } from "./fonte-financiadora.model"; // Certifique-se de criar ou importar o modelo de FonteFinanciadora
import { Integrante } from "./integrante.model";

export interface Atividade {
  id: number | null; // ID pode ser null se estiver criando uma nova atividade
  nome: string; // Nome obrigatório
  objetivo?: string; // Opcional, pois não há anotação @NotNull
  publicoAlvo?: string; // Opcional
  statusPublicacao?: boolean; // Obrigatório
  fotoCapa?: string; // Opcional
  coordenador?: string; // Opcional
  dataRealizacao?: string; // Obrigatório, representado como ISO string (ex.: "2025-01-01")
  curso?: Curso; // Obrigatório
  categoria?: Categoria; // Obrigatório
  fontesFinanciadora?: FonteFinanciadora[]; // Lista de fontes financiadoras
  integrantes?: Integrante[]; // Lista de integrantes
}
