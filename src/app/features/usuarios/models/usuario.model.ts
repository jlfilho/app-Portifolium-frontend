export interface Usuario {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  senha?: string; // Opcional, não deve ser exibida
  role: string;
  cursos: Curso[];
}

export interface Curso {
  id: number;
  nome: string;
  ativo: boolean;
}

export enum UserRole {
  ADMINISTRADOR = 'ADMINISTRADOR',
  PROFESSOR = 'PROFESSOR',
  ALUNO = 'ALUNO'
}

// Request para mudança de senha
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Response do checkAuthorities
export interface AuthoritiesResponse {
  username: string;
  authorities: string[];
}

