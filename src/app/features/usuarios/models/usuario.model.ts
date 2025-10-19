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
  ADMINISTRADOR = 'ROLE_ADMINISTRADOR',
  GERENTE = 'ROLE_GERENTE',
  SECRETARIO = 'ROLE_SECRETARIO'
}

// Request para mudança de senha
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Response da mudança de senha
export interface ChangePasswordResponse {
  message: string;
  usuarioId: string;
}

// Response do checkAuthorities
export interface AuthoritiesResponse {
  username: string;
  authorities: string[];
}

