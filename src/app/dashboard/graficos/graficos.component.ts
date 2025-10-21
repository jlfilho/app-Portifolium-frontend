import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

interface StatCard {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  trend?: number;
  description?: string;
}

interface ActivityItem {
  id: number;
  title: string;
  type: string;
  date: string;
  status: 'success' | 'warning' | 'error' | 'info';
  icon: string;
}

interface ChartData {
  label: string;
  value: number;
  color: string;
}

@Component({
  selector: 'acadmanage-graficos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatTableModule,
    MatTabsModule
  ],
  templateUrl: './graficos.component.html',
  styleUrl: './graficos.component.css'
})
export class GraficosComponent implements OnInit {

  // Cards Estatísticos
  statsCards: StatCard[] = [];

  // Atividades Recentes
  recentActivities: ActivityItem[] = [];

  // Dados para Gráficos
  atividadesPorCategoria: ChartData[] = [];
  atividadesPorStatus: ChartData[] = [];
  usuariosPorRole: ChartData[] = [];

  // Cursos em Destaque
  topCursos: any[] = [];

  // Metas e Progresso
  metas: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.loadMockData();
  }

  loadMockData(): void {
    console.log('📊 Carregando dados mockados do dashboard...');

    // Carregar todos os dados mockados
    this.loadStatsCards();
    this.loadRecentActivities();
    this.loadChartData();
    this.loadTopCursos();
    this.loadMetas();
  }

  // Cards Estatísticos
  loadStatsCards(): void {
    this.statsCards = [
      {
        title: 'Total de Cursos',
        value: 15,
        icon: 'school',
        color: '#3B82F6',
        trend: 12,
        description: '12% mais que o mês anterior'
      },
      {
        title: 'Atividades Ativas',
        value: 48,
        icon: 'event',
        color: '#10B981',
        trend: 8,
        description: '8% de crescimento'
      },
      {
        title: 'Usuários Cadastrados',
        value: 234,
        icon: 'people',
        color: '#8B5CF6',
        trend: 15,
        description: '15% de aumento'
      },
      {
        title: 'Fontes Financiadoras',
        value: 12,
        icon: 'attach_money',
        color: '#F59E0B',
        trend: -5,
        description: '2 novas fontes este mês'
      },
      {
        title: 'Publicações',
        value: 89,
        icon: 'publish',
        color: '#EF4444',
        trend: 20,
        description: '20% mais publicações'
      },
      {
        title: 'Taxa de Conclusão',
        value: '87%',
        icon: 'analytics',
        color: '#06B6D4',
        trend: 5,
        description: '5% de melhoria'
      }
    ];
  }

  // Atividades Recentes
  loadRecentActivities(): void {
    this.recentActivities = [
      {
        id: 1,
        title: 'Nova atividade cadastrada: Workshop de IA',
        type: 'create',
        date: '2 horas atrás',
        status: 'success',
        icon: 'add_circle'
      },
      {
        id: 2,
        title: 'Curso de Engenharia de Software atualizado',
        type: 'update',
        date: '5 horas atrás',
        status: 'info',
        icon: 'update'
      },
      {
        id: 3,
        title: 'Novo usuário registrado: Maria Santos',
        type: 'user',
        date: '1 dia atrás',
        status: 'success',
        icon: 'person_add'
      },
      {
        id: 4,
        title: 'Atividade "Seminário de Pesquisa" publicada',
        type: 'publish',
        date: '1 dia atrás',
        status: 'info',
        icon: 'publish'
      },
      {
        id: 5,
        title: 'Prazo de inscrição se aproximando',
        type: 'warning',
        date: '2 dias atrás',
        status: 'warning',
        icon: 'warning'
      },
      {
        id: 6,
        title: 'Fonte financiadora CNPq adicionada',
        type: 'finance',
        date: '3 dias atrás',
        status: 'success',
        icon: 'attach_money'
      }
    ];
  }

  // Dados para Gráficos
  loadChartData(): void {
    // Atividades por Categoria
    this.atividadesPorCategoria = [
      { label: 'Ensino', value: 32, color: '#3B82F6' },
      { label: 'Pesquisa', value: 28, color: '#10B981' },
      { label: 'Extensão', value: 24, color: '#8B5CF6' },
      { label: 'Inovação', value: 16, color: '#F59E0B' }
    ];

    // Atividades por Status
    this.atividadesPorStatus = [
      { label: 'Publicadas', value: 65, color: '#10B981' },
      { label: 'Não Publicadas', value: 35, color: '#64748B' }
    ];

    // Usuários por Role
    this.usuariosPorRole = [
      { label: 'Alunos', value: 150, color: '#3B82F6' },
      { label: 'Professores', value: 45, color: '#10B981' },
      { label: 'Secretários', value: 25, color: '#8B5CF6' },
      { label: 'Gerentes', value: 10, color: '#F59E0B' },
      { label: 'Administradores', value: 4, color: '#EF4444' }
    ];
  }

  // Cursos em Destaque
  loadTopCursos(): void {
    this.topCursos = [
      {
        id: 1,
        nome: 'Engenharia de Software',
        atividades: 18,
        usuarios: 85,
        status: 'Ativo',
        color: '#3B82F6'
      },
      {
        id: 2,
        nome: 'Ciência da Computação',
        atividades: 15,
        usuarios: 72,
        status: 'Ativo',
        color: '#10B981'
      },
      {
        id: 3,
        nome: 'Sistemas de Informação',
        atividades: 12,
        usuarios: 64,
        status: 'Ativo',
        color: '#8B5CF6'
      },
      {
        id: 4,
        nome: 'Análise e Desenvolvimento',
        atividades: 10,
        usuarios: 58,
        status: 'Ativo',
        color: '#F59E0B'
      }
    ];
  }

  // Metas e Progresso
  loadMetas(): void {
    this.metas = [
      {
        titulo: 'Atividades de Extensão',
        atual: 24,
        meta: 30,
        unidade: 'atividades',
        progresso: 80,
        color: '#3B82F6'
      },
      {
        titulo: 'Projetos de Pesquisa',
        atual: 18,
        meta: 20,
        unidade: 'projetos',
        progresso: 90,
        color: '#10B981'
      },
      {
        titulo: 'Publicações Científicas',
        atual: 42,
        meta: 50,
        unidade: 'publicações',
        progresso: 84,
        color: '#8B5CF6'
      },
      {
        titulo: 'Captação de Recursos',
        atual: 350000,
        meta: 500000,
        unidade: 'R$',
        progresso: 70,
        color: '#F59E0B'
      }
    ];
  }

  // Métodos auxiliares
  getTotalAtividades(): number {
    return this.atividadesPorCategoria.reduce((sum, item) => sum + item.value, 0);
  }

  getPercentage(data: ChartData[]): number {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    return total > 0 ? 100 : 0;
  }

  getActivityIcon(status: string): string {
    const icons: any = {
      'success': 'check_circle',
      'warning': 'warning',
      'error': 'error',
      'info': 'info'
    };
    return icons[status] || 'info';
  }

  getActivityColor(status: string): string {
    const colors: any = {
      'success': '#10B981',
      'warning': '#F59E0B',
      'error': '#EF4444',
      'info': '#3B82F6'
    };
    return colors[status] || '#64748B';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('pt-BR').format(value);
  }

  // Navegação
  navigateTo(route: string): void {
    console.log('🔗 Navegando para:', route);
    // Implementar navegação conforme necessário
  }
}
