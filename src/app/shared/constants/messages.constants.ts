/**
 * Constantes de Mensagens Padronizadas
 * 
 * Este arquivo centraliza todas as mensagens exibidas ao usuário,
 * garantindo consistência e facilitando manutenção e tradução futura.
 */

export type EntityType = 
  | 'curso'
  | 'usuario'
  | 'atividade'
  | 'pessoa'
  | 'unidadeAcademica'
  | 'categoria'
  | 'tipoCurso'
  | 'tipoAtividade'
  | 'perfil'
  | 'senha'
  | 'evidencia'
  | 'permissao';

export type ActionType = 'created' | 'updated' | 'deleted' | 'saved' | 'loaded' | 'published' | 'unpublished';

/**
 * Nomes das entidades em português (singular e plural)
 */
export const ENTITY_NAMES: Record<EntityType, { singular: string; plural: string }> = {
  curso: { singular: 'Curso', plural: 'Cursos' },
  usuario: { singular: 'Usuário', plural: 'Usuários' },
  atividade: { singular: 'Atividade', plural: 'Atividades' },
  pessoa: { singular: 'Pessoa', plural: 'Pessoas' },
  unidadeAcademica: { singular: 'Unidade Acadêmica', plural: 'Unidades Acadêmicas' },
  categoria: { singular: 'Categoria', plural: 'Categorias' },
  tipoCurso: { singular: 'Tipo de Curso', plural: 'Tipos de Curso' },
  tipoAtividade: { singular: 'Tipo de Atividade', plural: 'Tipos de Atividade' },
  perfil: { singular: 'Perfil', plural: 'Perfis' },
  senha: { singular: 'Senha', plural: 'Senhas' },
  evidencia: { singular: 'Evidência', plural: 'Evidências' },
  permissao: { singular: 'Permissão', plural: 'Permissões' }
};

/**
 * Mensagens de sucesso padronizadas
 * Formato: "{Entidade} {ação} com sucesso!"
 */
export const SUCCESS_MESSAGES = {
  /**
   * Obtém mensagem de sucesso para criação
   */
  created: (entity: EntityType): string => {
    const name = ENTITY_NAMES[entity].singular;
    return `${name} cadastrado(a) com sucesso!`;
  },

  /**
   * Obtém mensagem de sucesso para atualização
   */
  updated: (entity: EntityType): string => {
    const name = ENTITY_NAMES[entity].singular;
    return `${name} atualizado(a) com sucesso!`;
  },

  /**
   * Obtém mensagem de sucesso para exclusão
   */
  deleted: (entity: EntityType): string => {
    const name = ENTITY_NAMES[entity].singular;
    return `${name} excluído(a) com sucesso!`;
  },

  /**
   * Obtém mensagem de sucesso para salvamento genérico
   */
  saved: (entity: EntityType): string => {
    const name = ENTITY_NAMES[entity].singular;
    return `${name} salvo(a) com sucesso!`;
  },

  /**
   * Obtém mensagem de sucesso para carregamento
   */
  loaded: (entity: EntityType): string => {
    const name = ENTITY_NAMES[entity].plural;
    return `${name} carregados(as) com sucesso!`;
  },

  /**
   * Obtém mensagem de sucesso para publicação
   */
  published: (entity: EntityType): string => {
    const name = ENTITY_NAMES[entity].singular;
    return `${name} publicado(a) com sucesso!`;
  },

  /**
   * Obtém mensagem de sucesso para despublicação
   */
  unpublished: (entity: EntityType): string => {
    const name = ENTITY_NAMES[entity].singular;
    return `${name} despublicado(a) com sucesso!`;
  },

  /**
   * Mensagens genéricas de sucesso
   */
  generic: {
    operation: 'Operação realizada com sucesso!',
    saved: 'Dados salvos com sucesso!',
    updated: 'Dados atualizados com sucesso!',
    deleted: 'Registro excluído com sucesso!',
    created: 'Registro criado com sucesso!'
  }
};

/**
 * Mensagens de erro padronizadas
 * Formato: Mensagens amigáveis, sem detalhes técnicos
 */
export const ERROR_MESSAGES = {
  /**
   * Obtém mensagem de erro para criação
   */
  createFailed: (entity: EntityType): string => {
    const name = ENTITY_NAMES[entity].singular;
    return `Erro ao cadastrar ${name.toLowerCase()}. Tente novamente.`;
  },

  /**
   * Obtém mensagem de erro para atualização
   */
  updateFailed: (entity: EntityType): string => {
    const name = ENTITY_NAMES[entity].singular;
    return `Erro ao atualizar ${name.toLowerCase()}. Tente novamente.`;
  },

  /**
   * Obtém mensagem de erro para exclusão
   */
  deleteFailed: (entity: EntityType): string => {
    const name = ENTITY_NAMES[entity].singular;
    return `Erro ao excluir ${name.toLowerCase()}. Tente novamente.`;
  },

  /**
   * Obtém mensagem de erro para carregamento
   */
  loadFailed: (entity: EntityType): string => {
    const name = ENTITY_NAMES[entity].plural;
    return `Erro ao carregar ${name.toLowerCase()}. Tente novamente.`;
  },

  /**
   * Obtém mensagem de erro para não encontrado
   */
  notFound: (entity: EntityType): string => {
    const name = ENTITY_NAMES[entity].singular;
    return `${name} não encontrado(a).`;
  },

  /**
   * Mensagens genéricas de erro
   */
  generic: {
    operation: 'Ocorreu um erro. Tente novamente.',
    save: 'Erro ao salvar dados. Tente novamente.',
    update: 'Erro ao atualizar dados. Tente novamente.',
    delete: 'Erro ao excluir registro. Tente novamente.',
    load: 'Erro ao carregar dados. Tente novamente.',
    network: 'Erro de conexão. Verifique sua internet.',
    server: 'Erro no servidor. Tente novamente mais tarde.',
    unauthorized: 'Você não tem permissão para realizar esta ação.',
    forbidden: 'Acesso negado.',
    validation: 'Dados inválidos. Verifique os campos do formulário.',
    timeout: 'Tempo de espera esgotado. Tente novamente.',
    unknown: 'Erro desconhecido. Entre em contato com o suporte.'
  },

  /**
   * Mensagens de erro específicas por status HTTP
   */
  byStatus: {
    0: 'Erro de conexão. Verifique sua internet.',
    400: 'Dados inválidos. Verifique os campos do formulário.',
    401: 'Você não tem permissão para realizar esta ação.',
    403: 'Acesso negado.',
    404: 'Recurso não encontrado.',
    409: 'Já existe um registro com estes dados.',
    408: 'Tempo de espera esgotado. Tente novamente.',
    500: 'Erro no servidor. Tente novamente mais tarde.',
    502: 'Servidor temporariamente indisponível.',
    503: 'Serviço temporariamente indisponível.',
    504: 'Tempo de espera esgotado no servidor.'
  }
};

/**
 * Mensagens de aviso padronizadas
 */
export const WARNING_MESSAGES = {
  /**
   * Obtém mensagem de aviso para campos obrigatórios
   */
  requiredFields: 'Por favor, preencha todos os campos obrigatórios.',

  /**
   * Obtém mensagem de aviso para alterações não salvas
   */
  unsavedChanges: 'Você tem alterações não salvas. Deseja continuar?',

  /**
   * Mensagens genéricas de aviso
   */
  generic: {
    attention: 'Atenção: Verifique as informações.',
    warning: 'Atenção!',
    confirm: 'Confirme a ação antes de continuar.'
  }
};

/**
 * Mensagens de validação padronizadas por campo
 */
export const VALIDATION_MESSAGES = {
  required: (fieldName?: string): string => {
    return fieldName ? `${fieldName} é obrigatório(a).` : 'Este campo é obrigatório.';
  },

  email: (fieldName?: string): string => {
    return fieldName ? `${fieldName} deve ser um e-mail válido.` : 'E-mail inválido.';
  },

  minLength: (min: number, fieldName?: string): string => {
    return fieldName 
      ? `${fieldName} deve ter no mínimo ${min} caracteres.`
      : `Mínimo de ${min} caracteres.`;
  },

  maxLength: (max: number, fieldName?: string): string => {
    return fieldName
      ? `${fieldName} deve ter no máximo ${max} caracteres.`
      : `Máximo de ${max} caracteres.`;
  },

  pattern: (fieldName?: string): string => {
    return fieldName ? `${fieldName} está em formato inválido.` : 'Formato inválido.';
  },

  cpf: 'CPF inválido. Use o formato: 000.000.000-00',
  phone: 'Telefone inválido. Use o formato: (00) 00000-0000',
  url: 'URL inválida.',
  positiveNumber: 'O valor deve ser um número positivo.',
  passwordMismatch: 'As senhas não coincidem.',
  passwordWeak: 'A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.'
};

/**
 * Mensagens de confirmação padronizadas
 */
export const CONFIRM_MESSAGES = {
  /**
   * Obtém mensagem de confirmação para exclusão
   */
  delete: (entity: EntityType, name?: string): string => {
    const entityName = ENTITY_NAMES[entity].singular;
    if (name) {
      return `Tem certeza que deseja excluir ${entityName.toLowerCase()} "${name}"? Esta ação não pode ser desfeita.`;
    }
    return `Tem certeza que deseja excluir este(a) ${entityName.toLowerCase()}? Esta ação não pode ser desfeita.`;
  },

  /**
   * Obtém mensagem de confirmação para publicação
   */
  publish: (entity: EntityType): string => {
    const entityName = ENTITY_NAMES[entity].singular;
    return `Deseja publicar este(a) ${entityName.toLowerCase()}?`;
  },

  /**
   * Obtém mensagem de confirmação para despublicação
   */
  unpublish: (entity: EntityType): string => {
    const entityName = ENTITY_NAMES[entity].singular;
    return `Deseja despublicar este(a) ${entityName.toLowerCase()}?`;
  },

  /**
   * Mensagens genéricas de confirmação
   */
  generic: {
    action: 'Tem certeza que deseja realizar esta ação?',
    cancel: 'Deseja cancelar esta operação?',
    save: 'Deseja salvar as alterações?'
  }
};

/**
 * Mensagens informativas padronizadas
 */
export const INFO_MESSAGES = {
  loading: 'Carregando...',
  saving: 'Salvando...',
  deleting: 'Excluindo...',
  processing: 'Processando...',
  noData: (entity: EntityType): string => {
    const name = ENTITY_NAMES[entity].plural;
    return `Nenhum(a) ${name.toLowerCase()} encontrado(a).`;
  },
  noResults: 'Nenhum resultado encontrado.',
  selectItem: 'Selecione um item para continuar.',
  emptyForm: 'Preencha o formulário para continuar.'
};

/**
 * Helper function para obter mensagem de sucesso baseada em ação e entidade
 */
export function getSuccessMessage(entity: EntityType, action: ActionType): string {
  switch (action) {
    case 'created':
      return SUCCESS_MESSAGES.created(entity);
    case 'updated':
      return SUCCESS_MESSAGES.updated(entity);
    case 'deleted':
      return SUCCESS_MESSAGES.deleted(entity);
    case 'saved':
      return SUCCESS_MESSAGES.saved(entity);
    case 'loaded':
      return SUCCESS_MESSAGES.loaded(entity);
    case 'published':
      return SUCCESS_MESSAGES.published(entity);
    case 'unpublished':
      return SUCCESS_MESSAGES.unpublished(entity);
    default:
      return SUCCESS_MESSAGES.generic.operation;
  }
}

/**
 * Helper function para obter mensagem de erro baseada em ação e entidade
 */
export function getErrorMessage(entity: EntityType, action: ActionType): string {
  switch (action) {
    case 'created':
      return ERROR_MESSAGES.createFailed(entity);
    case 'updated':
      return ERROR_MESSAGES.updateFailed(entity);
    case 'deleted':
      return ERROR_MESSAGES.deleteFailed(entity);
    case 'loaded':
      return ERROR_MESSAGES.loadFailed(entity);
    default:
      return ERROR_MESSAGES.generic.operation;
  }
}

/**
 * Helper function para obter mensagem de erro baseada em status HTTP
 */
export function getErrorMessageByStatus(status: number): string {
  return ERROR_MESSAGES.byStatus[status as keyof typeof ERROR_MESSAGES.byStatus] 
    || ERROR_MESSAGES.generic.unknown;
}

