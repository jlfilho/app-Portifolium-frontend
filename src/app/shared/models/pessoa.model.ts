import { Usuario } from "./usuario.model";

export interface Pessoa {
  id: number; // O ID é obrigatório e não-null
  nome: string; // Nome obrigatório
  cpf?: string; // CPF obrigatório
  usuario?: Usuario;
}
