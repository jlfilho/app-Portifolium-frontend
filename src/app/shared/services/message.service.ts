import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { extractApiMessage } from '../utils/message.utils';
import { 
  getSuccessMessage, 
  getErrorMessage, 
  getErrorMessageByStatus,
  EntityType, 
  ActionType,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  WARNING_MESSAGES,
  INFO_MESSAGES
} from '../constants/messages.constants';

export type MessageType = 'success' | 'error' | 'warning' | 'info';

export interface MessageConfig {
  duration?: number;
  horizontalPosition?: 'start' | 'center' | 'end' | 'left' | 'right';
  verticalPosition?: 'top' | 'bottom';
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly DEFAULT_DURATION = 4000; // 4 segundos
  private readonly DEFAULT_HORIZONTAL_POSITION: 'start' | 'center' | 'end' | 'left' | 'right' = 'end';
  private readonly DEFAULT_VERTICAL_POSITION: 'top' | 'bottom' = 'top';

  // Mensagens de fallback padronizadas
  private readonly FALLBACK_MESSAGES = {
    error: {
      generic: 'Ocorreu um erro. Tente novamente.',
      network: 'Erro de conexão. Verifique sua internet.',
      server: 'Erro no servidor. Tente novamente mais tarde.',
      notFound: 'Recurso não encontrado.',
      unauthorized: 'Você não tem permissão para realizar esta ação.',
      forbidden: 'Acesso negado.',
      validation: 'Dados inválidos. Verifique os campos do formulário.',
      timeout: 'Tempo de espera esgotado. Tente novamente.',
      unknown: 'Erro desconhecido. Entre em contato com o suporte.'
    },
    success: {
      saved: 'Dados salvos com sucesso!',
      created: 'Registro criado com sucesso!',
      updated: 'Registro atualizado com sucesso!',
      deleted: 'Registro excluído com sucesso!',
      generic: 'Operação realizada com sucesso!'
    },
    warning: {
      generic: 'Atenção: Verifique as informações.',
      unsaved: 'Você tem alterações não salvas.',
      attention: 'Atenção!'
    }
  };

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Exibe uma mensagem de sucesso
   */
  success(message: string, config?: MessageConfig): void {
    this.show(message, 'success', config);
  }

  /**
   * Exibe uma mensagem de erro
   */
  error(message: string, config?: MessageConfig): void {
    this.show(message, 'error', config);
  }

  /**
   * Exibe uma mensagem de aviso
   */
  warning(message: string, config?: MessageConfig): void {
    this.show(message, 'warning', config);
  }

  /**
   * Exibe uma mensagem informativa
   */
  info(message: string, config?: MessageConfig): void {
    this.show(message, 'info', config);
  }

  /**
   * Trata e exibe erro HTTP com mensagem extraída da API
   */
  handleError(error: HttpErrorResponse | any, fallbackMessage?: string): void {
    const apiMessage = extractApiMessage(error);
    
    if (apiMessage) {
      this.error(apiMessage);
      return;
    }

    // Se não houver mensagem da API, usar mensagem de fallback ou padrão baseado no status
    const message = fallbackMessage || this.getFallbackErrorMessage(error);
    this.error(message);
  }

  /**
   * Exibe mensagem de sucesso padronizada baseada na ação
   * @deprecated Use successEntity() em vez disso
   */
  successAction(action: 'saved' | 'created' | 'updated' | 'deleted' | 'generic'): void {
    const message = this.FALLBACK_MESSAGES.success[action];
    this.success(message);
  }

  /**
   * Exibe mensagem de sucesso padronizada para uma entidade e ação específica
   */
  successEntity(entity: EntityType, action: ActionType): void {
    const message = getSuccessMessage(entity, action);
    this.success(message);
  }

  /**
   * Exibe mensagem de erro padronizada para uma entidade e ação específica
   */
  errorEntity(entity: EntityType, action: ActionType): void {
    const message = getErrorMessage(entity, action);
    this.error(message);
  }

  /**
   * Método principal para exibir mensagens
   */
  private show(
    message: string,
    type: MessageType,
    config?: MessageConfig
  ): void {
    if (!message || message.trim() === '') {
      console.warn('MessageService: Tentativa de exibir mensagem vazia');
      return;
    }

    const panelClass = this.getPanelClass(type);
    const snackBarConfig: MatSnackBarConfig = {
      duration: config?.duration ?? this.DEFAULT_DURATION,
      horizontalPosition: config?.horizontalPosition ?? this.DEFAULT_HORIZONTAL_POSITION,
      verticalPosition: config?.verticalPosition ?? this.DEFAULT_VERTICAL_POSITION,
      panelClass: [panelClass]
    };

    this.snackBar.open(message, 'Fechar', snackBarConfig);
  }

  /**
   * Obtém a classe CSS do painel baseado no tipo
   */
  private getPanelClass(type: MessageType): string {
    switch (type) {
      case 'success':
        return 'snackbar-success';
      case 'error':
        return 'snackbar-error';
      case 'warning':
        return 'snackbar-warning';
      case 'info':
        return 'info-snackbar';
      default:
        return 'info-snackbar';
    }
  }

  /**
   * Obtém mensagem de fallback baseada no status HTTP do erro
   */
  private getFallbackErrorMessage(error: HttpErrorResponse | any): string {
    if (!error || !(error instanceof HttpErrorResponse)) {
      return ERROR_MESSAGES.generic.unknown;
    }

    return getErrorMessageByStatus(error.status) || ERROR_MESSAGES.generic.unknown;
  }

  /**
   * Mensagens de informação padronizadas
   */
  get infoMessages() {
    return INFO_MESSAGES;
  }

  /**
   * Mensagens de aviso padronizadas
   */
  get warningMessages() {
    return WARNING_MESSAGES;
  }
}

