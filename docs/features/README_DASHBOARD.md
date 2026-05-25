# 📊 Dashboard Acadêmico - AcadManage

## ✅ **DASHBOARD COMPLETO IMPLEMENTADO COM DADOS MOCKADOS**

---

## 🎯 **Visão Geral**

Dashboard moderno e interativo para visualização de métricas e dados do sistema acadêmico, incluindo:

- ✅ **6 Cards Estatísticos** com tendências
- ✅ **3 Gráficos visuais** (Pie Chart, Donut Chart, Bar Chart)
- ✅ **Cursos em Destaque** com estatísticas
- ✅ **Atividades Recentes** com timeline
- ✅ **Metas e Progresso** com barras de progresso
- ✅ **Ações Rápidas** para navegação
- ✅ **Design Responsivo** para mobile e desktop

---

## 📊 **Componentes do Dashboard**

### **1. Cards Estatísticos (6 cards)**

Exibem métricas principais do sistema:

```typescript
{
  title: 'Total de Cursos',
  value: 15,
  icon: 'school',
  color: '#3B82F6',
  trend: 12,  // +12% de crescimento
  description: '12% mais que o mês anterior'
}
```

**Cards Implementados:**
1. 📚 **Total de Cursos** - 15 cursos (+12%)
2. 📅 **Atividades Ativas** - 48 atividades (+8%)
3. 👥 **Usuários Cadastrados** - 234 usuários (+15%)
4. 💰 **Fontes Financiadoras** - 12 fontes (-5%)
5. 📝 **Publicações** - 89 publicações (+20%)
6. 📈 **Taxa de Conclusão** - 87% (+5%)

**Funcionalidades:**
- ✅ Ícone colorido
- ✅ Valor destacado
- ✅ Indicador de tendência (↑/↓)
- ✅ Descrição contextual
- ✅ Hover effect
- ✅ Border colorido à esquerda

---

### **2. Gráficos de Dados**

#### **2.1 Atividades por Categoria (Pie Chart)**
```typescript
atividadesPorCategoria = [
  { label: 'Ensino', value: 32, color: '#3B82F6' },
  { label: 'Pesquisa', value: 28, color: '#10B981' },
  { label: 'Extensão', value: 24, color: '#8B5CF6' },
  { label: 'Inovação', value: 16, color: '#F59E0B' }
];
```

**Visual:**
- Gráfico de pizza colorido
- Centro com total de atividades
- Legenda lateral com valores

#### **2.2 Status de Publicação (Donut Chart)**
```typescript
atividadesPorStatus = [
  { label: 'Publicadas', value: 65, color: '#10B981' },
  { label: 'Não Publicadas', value: 35, color: '#64748B' }
];
```

**Visual:**
- Gráfico em formato donut
- Percentual de publicadas
- Legenda com distribuição

#### **2.3 Distribuição de Usuários (Bar Chart)**
```typescript
usuariosPorRole = [
  { label: 'Alunos', value: 150, color: '#3B82F6' },
  { label: 'Professores', value: 45, color: '#10B981' },
  { label: 'Secretários', value: 25, color: '#8B5CF6' },
  { label: 'Gerentes', value: 10, color: '#F59E0B' },
  { label: 'Administradores', value: 4, color: '#EF4444' }
];
```

**Visual:**
- Barras horizontais coloridas
- Valores ao lado de cada barra
- Largura proporcional

---

### **3. Cursos em Destaque**

Lista os 4 cursos principais com:
- ✅ Nome do curso
- ✅ Número de atividades
- ✅ Número de usuários
- ✅ Status (Ativo/Inativo)
- ✅ Ícone colorido
- ✅ Hover effect

```typescript
{
  id: 1,
  nome: 'Engenharia de Software',
  atividades: 18,
  usuarios: 85,
  status: 'Ativo',
  color: '#3B82F6'
}
```

---

### **4. Atividades Recentes**

Timeline com as 6 últimas atividades do sistema:

```typescript
{
  id: 1,
  title: 'Nova atividade cadastrada: Workshop de IA',
  type: 'create',
  date: '2 horas atrás',
  status: 'success',
  icon: 'add_circle'
}
```

**Status Visuais:**
- 🟢 **Success:** Verde (#10B981)
- 🟡 **Warning:** Amarelo (#F59E0B)
- 🔴 **Error:** Vermelho (#EF4444)
- 🔵 **Info:** Azul (#3B82F6)

---

### **5. Metas e Progresso**

Acompanhamento de metas institucionais:

```typescript
{
  titulo: 'Atividades de Extensão',
  atual: 24,
  meta: 30,
  unidade: 'atividades',
  progresso: 80,
  color: '#3B82F6'
}
```

**Metas Mockadas:**
1. 📚 **Atividades de Extensão** - 24/30 (80%)
2. 🔬 **Projetos de Pesquisa** - 18/20 (90%)
3. 📝 **Publicações Científicas** - 42/50 (84%)
4. 💰 **Captação de Recursos** - R$ 350.000/R$ 500.000 (70%)

**Funcionalidades:**
- ✅ Barra de progresso colorida
- ✅ Percentual destacado
- ✅ Valor atual vs meta
- ✅ Formatação de moeda

---

### **6. Ações Rápidas**

Botões para navegação rápida:

- ➕ **Nova Atividade**
- 🎓 **Gerenciar Cursos**
- 👥 **Gerenciar Usuários**
- 📊 **Relatórios**

---

## 🎨 **Design e UX**

### **Paleta de Cores:**
```css
Azul Principal:   #3B82F6
Verde Sucesso:    #10B981
Roxo Destaque:    #8B5CF6
Laranja Alerta:   #F59E0B
Vermelho Erro:    #EF4444
Ciano Info:       #06B6D4
Cinza Neutro:     #64748B
```

### **Recursos Visuais:**
- ✅ **Gradiente** no header
- ✅ **Sombras** suaves nos cards
- ✅ **Hover effects** com transformação
- ✅ **Animações** de fade-in
- ✅ **Ícones** coloridos e contextuais
- ✅ **Bordas** coloridas nos cards
- ✅ **Scrollbar** customizado

### **Responsividade:**
- ✅ **Desktop:** Grid de 3 colunas
- ✅ **Tablet:** Grid de 2 colunas
- ✅ **Mobile:** 1 coluna

---

## 📁 **Estrutura de Arquivos**

```
dashboard/
├── graficos/
│   ├── graficos.component.ts       # Componente principal
│   ├── graficos.component.html     # Template
│   ├── graficos.component.css      # Estilos
│   └── graficos.component.spec.ts  # Testes
├── home/
│   └── home.component.ts           # Layout principal (sidebar)
├── dashboard.routes.ts             # Rotas
└── README_DASHBOARD.md             # Documentação
```

---

## 🚀 **Como Acessar**

### **URL:**
```
http://localhost:4200/dashboard
```

### **Navegação:**
1. Faça login no sistema
2. No menu lateral, clique em **"Dashboard"**
3. Ou acesse diretamente via URL

---

## 💻 **Código Principal**

### **Interfaces TypeScript:**
```typescript
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
```

### **Dados Mockados:**
```typescript
ngOnInit(): void {
  this.loadMockData();
}

loadMockData(): void {
  this.loadStatsCards();
  this.loadRecentActivities();
  this.loadChartData();
  this.loadTopCursos();
  this.loadMetas();
}
```

---

## 🔧 **Funcionalidades Implementadas**

### **Métodos Auxiliares:**

#### **1. getTotalAtividades()**
Calcula o total de atividades de todas as categorias:
```typescript
getTotalAtividades(): number {
  return this.atividadesPorCategoria.reduce((sum, item) => sum + item.value, 0);
}
```

#### **2. formatCurrency()**
Formata valores monetários em R$:
```typescript
formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}
```

#### **3. formatNumber()**
Formata números com separador de milhares:
```typescript
formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}
```

#### **4. getActivityColor()**
Retorna cor baseada no status:
```typescript
getActivityColor(status: string): string {
  const colors: any = {
    'success': '#10B981',
    'warning': '#F59E0B',
    'error': '#EF4444',
    'info': '#3B82F6'
  };
  return colors[status] || '#64748B';
}
```

---

## 🔄 **Próximos Passos (Integração Real)**

Para conectar com dados reais:

### **1. Criar Serviço de Dashboard:**
```typescript
@Injectable({ providedIn: 'root' })
export class DashboardService {
  getStats(): Observable<StatCard[]> { ... }
  getRecentActivities(): Observable<ActivityItem[]> { ... }
  getChartData(): Observable<any> { ... }
}
```

### **2. Substituir Dados Mockados:**
```typescript
ngOnInit(): void {
  this.dashboardService.getStats().subscribe(stats => {
    this.statsCards = stats;
  });
}
```

### **3. Adicionar Filtros:**
- Período (última semana, mês, ano)
- Curso específico
- Categoria específica

### **4. Implementar Gráficos Reais:**
- Bibliotecas: Chart.js, NgxCharts, ApexCharts
- Animações e interatividade
- Export de dados

---

## 🎨 **Layout Visual**

```
┌────────────────────────────────────────────────────────────┐
│ 📊 Dashboard Acadêmico                        🔄            │
│ Visão geral do sistema AcadManage                          │
├────────────────────────────────────────────────────────────┤
│ ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐│
│ │ 📚15 │  │ 📅48 │  │ 👥234│  │ 💰12 │  │ 📝89 │  │📈87%││
│ │↑12% │  │↑ 8% │  │↑15% │  │↓-5% │  │↑20% │  │↑ 5% ││
│ └──────┘  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘│
├────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐│
│ │🥧 Atividades   │  │🍩 Status       │  │📊 Usuários   ││
│ │  por Categoria │  │  Publicação    │  │  por Role    ││
│ └─────────────────┘  └─────────────────┘  └──────────────┘│
├────────────────────────────────────────────────────────────┤
│ ┌───────────────────┐  ┌─────────────────────────────────┐│
│ │⭐ Cursos          │  │🕒 Atividades Recentes           ││
│ │  em Destaque      │  │                                 ││
│ └───────────────────┘  └─────────────────────────────────┘│
├────────────────────────────────────────────────────────────┤
│ 🎯 Metas e Progresso                                       │
│ ████████████████░░░░ 80% Atividades de Extensão (24/30)   │
│ ██████████████████░░ 90% Projetos de Pesquisa (18/20)     │
│ ████████████████░░░░ 84% Publicações (42/50)              │
│ ██████████████░░░░░░ 70% Captação (R$ 350k/500k)          │
├────────────────────────────────────────────────────────────┤
│ ⚡ Ações Rápidas                                           │
│ [+ Nova Atividade] [🎓 Cursos] [👥 Usuários] [📊 Relatórios]│
└────────────────────────────────────────────────────────────┘
```

---

## 📊 **Dados Mockados Detalhados**

### **Stats Cards:**
```typescript
statsCards = [
  {
    title: 'Total de Cursos',
    value: 15,
    icon: 'school',
    color: '#3B82F6',
    trend: 12,
    description: '12% mais que o mês anterior'
  },
  // ... 5 cards adicionais
];
```

### **Atividades Recentes:**
```typescript
recentActivities = [
  {
    id: 1,
    title: 'Nova atividade cadastrada: Workshop de IA',
    type: 'create',
    date: '2 horas atrás',
    status: 'success',
    icon: 'add_circle'
  },
  // ... 5 atividades adicionais
];
```

### **Cursos em Destaque:**
```typescript
topCursos = [
  {
    id: 1,
    nome: 'Engenharia de Software',
    atividades: 18,
    usuarios: 85,
    status: 'Ativo',
    color: '#3B82F6'
  },
  // ... 3 cursos adicionais
];
```

### **Metas:**
```typescript
metas = [
  {
    titulo: 'Atividades de Extensão',
    atual: 24,
    meta: 30,
    unidade: 'atividades',
    progresso: 80,
    color: '#3B82F6'
  },
  // ... 3 metas adicionais
];
```

---

## 🎨 **Estilos e Temas**

### **Header Gradiente:**
```css
background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
```

### **Cards com Border Colorido:**
```css
.stat-card {
  border-left: 4px solid;  /* Cor dinâmica */
}
```

### **Hover Effects:**
```css
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}
```

### **Animações:**
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 📱 **Responsividade**

### **Desktop (>1200px):**
- Stats: 3 colunas
- Charts: 2-3 colunas
- Content: 2 colunas

### **Tablet (768px - 1200px):**
- Stats: 2 colunas
- Charts: 1-2 colunas
- Content: 1 coluna

### **Mobile (<768px):**
- Tudo em 1 coluna
- Header centralizado
- Botões em coluna

---

## 🔧 **Tecnologias Utilizadas**

- ✅ **Angular 18+** (Standalone Components)
- ✅ **Angular Material** (Cards, Icons, Buttons, etc.)
- ✅ **TypeScript** (Interfaces tipadas)
- ✅ **CSS Grid** (Layout responsivo)
- ✅ **Flexbox** (Alinhamento)
- ✅ **CSS Animations** (Fade-in)

---

## 📝 **Exemplo de Uso**

### **No Template:**
```html
<!-- Card Estatístico -->
<mat-card *ngFor="let card of statsCards" class="stat-card">
  <mat-card-content>
    <div class="stat-icon" [style.background-color]="card.color + '20'">
      <mat-icon [style.color]="card.color">{{ card.icon }}</mat-icon>
    </div>
    <h2 class="stat-value">{{ card.value }}</h2>
    <p class="stat-title">{{ card.title }}</p>
  </mat-card-content>
</mat-card>
```

### **No Componente:**
```typescript
loadStatsCards(): void {
  this.statsCards = [
    {
      title: 'Total de Cursos',
      value: 15,
      icon: 'school',
      color: '#3B82F6',
      trend: 12
    }
  ];
}
```

---

## 🎯 **Métricas Exibidas**

| Métrica | Valor Mock | Tendência | Cor |
|---------|-----------|-----------|-----|
| Cursos | 15 | +12% | Azul |
| Atividades | 48 | +8% | Verde |
| Usuários | 234 | +15% | Roxo |
| Fontes | 12 | -5% | Laranja |
| Publicações | 89 | +20% | Vermelho |
| Taxa Conclusão | 87% | +5% | Ciano |

---

## ✨ **Features Especiais**

### **1. Indicadores de Tendência:**
- ⬆️ Verde para crescimento positivo
- ⬇️ Vermelho para crescimento negativo
- Percentual ao lado

### **2. Gráficos CSS Puros:**
- Pie Chart com `conic-gradient`
- Donut Chart com `conic-gradient`
- Bar Chart com divs animadas

### **3. Cards Interativos:**
- Hover com elevação
- Cursor pointer
- Border colorido

### **4. Timeline de Atividades:**
- Ícones contextuais
- Cores por status
- Timestamps relativos

---

## 🚀 **Status**

- ✅ **Implementação:** Completa
- ✅ **Dados Mockados:** 100%
- ✅ **Design:** Moderno e profissional
- ✅ **Responsivo:** Mobile-friendly
- ✅ **Animações:** Implementadas
- ✅ **Acessibilidade:** Tooltips e labels

---

## 📊 **Próximas Melhorias Sugeridas**

1. **Gráficos Interativos:**
   - Usar Chart.js ou ApexCharts
   - Adicionar tooltips
   - Permitir drill-down

2. **Filtros:**
   - Período (dia, semana, mês, ano)
   - Por curso
   - Por categoria

3. **Export:**
   - PDF de relatórios
   - Excel com dados
   - Imagens dos gráficos

4. **Refresh Automático:**
   - Atualizar dados a cada X minutos
   - Indicador de última atualização

5. **Comparativos:**
   - Mês atual vs anterior
   - Ano atual vs anterior
   - Tendências históricas

---

**Data de Implementação:** 2024  
**Versão:** 1.0  
**Status:** ✅ **PRONTO PARA USO**

