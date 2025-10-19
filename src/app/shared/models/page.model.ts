/**
 * Interface para paginação do Spring Boot (Page<T>)
 */
export interface Page<T> {
  content: T[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  empty: boolean;
}

export interface Pageable {
  sort: Sort;
  pageNumber: number;
  pageSize: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

/**
 * Parâmetros para requisição de paginação
 */
export interface PageRequest {
  page: number;           // Número da página (0-based)
  size: number;           // Tamanho da página
  sortBy: string;         // Campo para ordenar
  direction: 'ASC' | 'DESC'; // Direção da ordenação
}

