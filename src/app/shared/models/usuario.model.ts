import { Curso } from "./curso.model";

export interface Usuario {
  id: number;
  nome: string; // Campo obrigatório
  cpf?: string; // Campo opcional (não marcado como obrigatório no DTO original)
  email: string; // Campo obrigatório
  senha?: string; // Campo opcional
  role?: string; // Campo opcional
  cursos: Curso[]; // Lista de cursos
}
