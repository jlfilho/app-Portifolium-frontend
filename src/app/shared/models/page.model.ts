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

export function createEmptyPage<T>(): Page<T> {
  return {
    content: [],
    pageable: {
      sort: {
        sorted: false,
        unsorted: true,
        empty: true
      },
      pageNumber: 0,
      pageSize: 0,
      offset: 0,
      paged: true,
      unpaged: false
    },
    totalPages: 0,
    totalElements: 0,
    last: true,
    first: true,
    size: 0,
    number: 0,
    sort: {
      sorted: false,
      unsorted: true,
      empty: true
    },
    numberOfElements: 0,
    empty: true
  };
}


