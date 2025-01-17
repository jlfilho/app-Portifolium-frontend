export interface Integrante {
  id: number; // O ID é obrigatório e não-null
  nome?: string; // Nome obrigatório
  cpf?: string; // CPF obrigatório
  papel?: string; // Papel obrigatório
}
