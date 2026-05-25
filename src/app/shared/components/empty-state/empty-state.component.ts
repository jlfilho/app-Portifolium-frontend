import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export type EmptyStateType = 
  | 'default'
  | 'search'
  | 'no-data'
  | 'error'
  | 'no-permission';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.css'
})
export class EmptyStateComponent {
  @Input() type: EmptyStateType = 'default';
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() actionLabel: string = '';
  @Input() showAction: boolean = false;
  @Input() actionClick?: () => void;

  // Ícones padrão por tipo
  private readonly defaultIcons: Record<EmptyStateType, string> = {
    default: 'inbox',
    search: 'search_off',
    'no-data': 'folder_open',
    error: 'error_outline',
    'no-permission': 'lock'
  };

  // Títulos padrão por tipo
  private readonly defaultTitles: Record<EmptyStateType, string> = {
    default: 'Nenhum dado encontrado',
    search: 'Nenhum resultado encontrado',
    'no-data': 'Nenhum registro encontrado',
    error: 'Erro ao carregar dados',
    'no-permission': 'Acesso negado'
  };

  // Mensagens padrão por tipo
  private readonly defaultMessages: Record<EmptyStateType, string> = {
    default: 'Não há dados disponíveis no momento.',
    search: 'Tente ajustar os filtros de busca.',
    'no-data': 'Comece adicionando um novo registro.',
    error: 'Ocorreu um erro ao carregar os dados. Tente novamente.',
    'no-permission': 'Você não tem permissão para visualizar estes dados.'
  };

  get displayIcon(): string {
    return this.icon || this.defaultIcons[this.type];
  }

  get displayTitle(): string {
    return this.title || this.defaultTitles[this.type];
  }

  get displayMessage(): string {
    return this.message || this.defaultMessages[this.type];
  }

  onActionClick(): void {
    if (this.actionClick) {
      this.actionClick();
    }
  }
}

