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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Services e Models
import { DashboardService } from '../services/dashboard.service';
import { DashboardDTO, MetricaDTO, ChartData } from '../models/dashboard.dto';
import { extractApiMessage } from '../../shared/utils/message.utils';
import { COLORS, CATEGORIA_COLORS, METRIC_COLORS, ROLE_COLORS, STATUS_COLORS } from '../../shared/constants/colors.constants';

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
    MatTabsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './graficos.component.html',
  styleUrl: './graficos.component.css'
})
export class GraficosComponent implements OnInit {
  dashboard: DashboardDTO | null = null;
  loading = true;
  error: string | null = null;

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

  // Cores para categorias (usando constantes centralizadas)
  private categoriaColors: { [key: string]: string } = CATEGORIA_COLORS;

  // Cores para métricas (usando constantes centralizadas)
  private metricColors: string[] = METRIC_COLORS;

  // Ícones para métricas
  private metricIcons: string[] = [
    'school',      // Total de Cursos
    'event',       // Atividades Ativas
    'people',      // Usuários Cadastrados
    'person',      // Pessoas Cadastradas
    'attach_money', // Fontes Financiadoras
    'publish'       // Publicações
  ];

  constructor(
    private dashboardService: DashboardService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carregarDashboard();
  }

  carregarDashboard(): void {
    this.loading = true;
    this.error = null;

    this.dashboardService.obterDadosDashboard().subscribe({
      next: (data) => {
        this.dashboard = data;
        this.processarDados();
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Erro ao carregar dashboard:', err);
        this.loading = false;

        if (err.status === 401) {
          this.error = 'Não autorizado. Faça login novamente.';
        } else if (err.status === 403) {
          this.error = 'Você não tem permissão para acessar o dashboard.';
        } else if (err.status === 500) {
          this.error = 'Erro no servidor. Tente novamente mais tarde.';
        } else {
          const apiMessage = extractApiMessage(err);
          this.error = apiMessage || 'Erro ao carregar dashboard. Tente novamente.';
        }

        this.showMessage(this.error, 'error');
      }
    });
  }

  private processarDados(): void {
    if (!this.dashboard) return;

    this.loadStatsCards();
    this.loadRecentActivities();
    this.loadChartData();
    this.loadTopCursos();
  }

  // Cards Estatísticos
  private loadStatsCards(): void {
    if (!this.dashboard) return;

    const metricas = this.dashboard.metricasGerais;
    const metricasArray: MetricaDTO[] = [
      metricas.totalCursos,
      metricas.atividadesAtivas,
      metricas.usuariosCadastrados,
      metricas.pessoasCadastradas,
      metricas.fontesFinanciadoras,
      metricas.publicacoes
    ];

    const titulos = [
      'Total de Cursos',
      'Atividades Ativas',
      'Usuários Cadastrados',
      'Pessoas Cadastradas',
      'Fontes Financiadoras',
      'Publicações'
    ];

    this.statsCards = metricasArray.map((metrica, index) => ({
      title: titulos[index],
      value: metrica.valor,
      icon: this.metricIcons[index],
      color: this.metricColors[index],
      trend: metrica.percentualCrescimento,
      description: metrica.descricaoCrescimento
    }));
  }

  // Atividades Recentes
  private loadRecentActivities(): void {
    if (!this.dashboard) return;

    this.recentActivities = this.dashboard.atividadesRecentes.map((item, index) => ({
      id: index + 1,
      title: item.descricao,
      type: item.tipo.toLowerCase(),
      date: item.tempoDecorrido,
      status: item.tipo === 'Publicação' ? 'info' : 'success' as 'success' | 'warning' | 'error' | 'info',
      icon: item.tipo === 'Publicação' ? 'publish' : 'info'
    }));
  }

  // Dados para Gráficos
  private loadChartData(): void {
    if (!this.dashboard) return;

    // Atividades por Categoria
    this.atividadesPorCategoria = this.dashboard.atividadesPorCategoria.map(item => ({
      label: item.categoria,
      value: item.quantidade,
      color: this.categoriaColors[item.categoria] || this.categoriaColors['Outros']
    }));

    // Atividades por Status
    const status = this.dashboard.statusPublicacao;
    this.atividadesPorStatus = [
      { label: 'Publicadas', value: status.publicadas, color: COLORS.SUCCESS },
      { label: 'Não Publicadas', value: status.naoPublicadas, color: COLORS.GRAY_500 }
    ];

    // Usuários por Role (apenas para admin)
    // Usar dados diretamente do endpoint de estatísticas do dashboard
    if (!this.dashboard.distribuicaoUsuarios || this.dashboard.distribuicaoUsuarios.length === 0) {
      this.usuariosPorRole = [];
      return;
    }

    // Log para debug - verificar dados recebidos do endpoint
    console.log('📊 Dados de distribuição recebidos do endpoint:', this.dashboard.distribuicaoUsuarios);

    // Mapear tipos do backend para nomes padronizados (case-insensitive)
    const normalizarTipo = (tipo: string): string => {
      const tipoLower = tipo.toLowerCase().trim();

      // Mapeamento completo de possíveis variações
      if (tipoLower.includes('administrador')) {
        return 'Administradores';
      }
      if (tipoLower.includes('gerente')) {
        return 'Gerentes';
      }
      if (tipoLower.includes('secretário') || tipoLower.includes('secretario')) {
        return 'Secretários';
      }
      if (tipoLower.includes('coordenador') && tipoLower.includes('atividade')) {
        return 'Coordenador de atividades';
      }

      // Se não mapeou, retorna o original
      return tipo;
    };

    // Filtrar e mapear tipos permitidos (remover Alunos e Professores)
    const tiposPermitidos = ['Administradores', 'Gerentes', 'Secretários', 'Coordenador de atividades'];
    const distribuicaoProcessada = this.dashboard.distribuicaoUsuarios
      .map(item => {
        // Normalizar o tipo
        const tipoNormalizado = normalizarTipo(item.tipo);
        return {
          tipo: tipoNormalizado,
          quantidade: item.quantidade,
          tipoOriginal: item.tipo // Para debug
        };
      })
      .filter(item => tiposPermitidos.includes(item.tipo))
      // Agrupar por tipo normalizado e somar quantidades
      .reduce((acc, item) => {
        const existente = acc.find(x => x.tipo === item.tipo);
        if (existente) {
          existente.quantidade += item.quantidade;
        } else {
          acc.push({ tipo: item.tipo, quantidade: item.quantidade });
        }
        return acc;
      }, [] as { tipo: string; quantidade: number }[]);

    // Log para debug - verificar dados processados
    console.log('📊 Dados processados:', distribuicaoProcessada);

    // Verificar se "Coordenador de atividades" existe, se não, adicionar com valor 0
    const temCoordenador = distribuicaoProcessada.some(item => item.tipo === 'Coordenador de atividades');
    if (!temCoordenador) {
      distribuicaoProcessada.push({
        tipo: 'Coordenador de atividades',
        quantidade: 0
      });
    }

    // Ordenar para garantir ordem: Administradores, Gerentes, Secretários, Coordenador de atividades
    const ordem = ['Administradores', 'Gerentes', 'Secretários', 'Coordenador de atividades'];
    distribuicaoProcessada.sort((a, b) => {
      const indexA = ordem.indexOf(a.tipo);
      const indexB = ordem.indexOf(b.tipo);
      // Se não encontrar na ordem, coloca no final
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    // Mapear para ChartData com cores específicas (usando constantes centralizadas)
    this.usuariosPorRole = distribuicaoProcessada.map((item) => ({
      label: item.tipo,
      value: item.quantidade,
      color: ROLE_COLORS[item.tipo] || COLORS.GRAY_500
    }));

    // Log final para debug
    console.log('📊 Distribuição de usuários final:', this.usuariosPorRole);
  }

  // Cursos em Destaque
  private loadTopCursos(): void {
    if (!this.dashboard) return;

    const colors = [COLORS.PRIMARY, COLORS.SUCCESS, COLORS.SECONDARY, COLORS.ACCENT];
    this.topCursos = this.dashboard.cursosDestaque.map((curso, index) => ({
      id: index + 1,
      nome: curso.nome,
      atividades: curso.quantidadeAtividades,
      usuarios: curso.quantidadeUsuarios,
      status: 'Ativo',
      color: colors[index % colors.length]
    }));
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
    return STATUS_COLORS[status] || COLORS.GRAY_500;
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

  // Formatação de percentual de crescimento
  formatarPercentualCrescimento(percentual: number): string {
    if (percentual > 0) {
      return `+${percentual.toFixed(1)}%`;
    } else if (percentual < 0) {
      return `${percentual.toFixed(1)}%`;
    }
    return '0%';
  }

  // Verificar se é crescimento
  ehCrescimento(percentual: number): boolean {
    return percentual > 0;
  }

  // Verificar se tem dados
  temDados(): boolean {
    return this.dashboard !== null &&
           this.dashboard.metricasGerais.totalCursos.valor > 0;
  }

  // Verificar se é admin (tem distribuição de usuários)
  ehAdmin(): boolean {
    return this.dashboard !== null &&
           this.dashboard.distribuicaoUsuarios.length > 0;
  }

  // Obter percentual de publicadas
  getPercentualPublicadas(): number {
    if (!this.dashboard) return 0;
    return this.dashboard.statusPublicacao.percentualPublicadas;
  }

  // Obter total de usuários para cálculo de percentual
  getTotalUsuarios(): number {
    if (!this.dashboard) return 1;
    return this.usuariosPorRole.reduce((sum, item) => sum + item.value, 0) || 1;
  }

  // Navegação
  navigateTo(route: string): void {
    console.log('🔗 Navegando para:', route);
  }

  // Mostrar mensagem
  private showMessage(message: string, type: 'success' | 'error' | 'warning'): void {
    const panelClass = type === 'success' ? 'snackbar-success' :
                      type === 'error' ? 'snackbar-error' :
                      'snackbar-warning';

    this.snackBar.open(message, 'Fechar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
}
