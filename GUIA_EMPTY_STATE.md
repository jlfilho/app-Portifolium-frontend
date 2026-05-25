# 📭 Guia de Uso - EmptyStateComponent
## Portifólium - Componente de Estado Vazio

**Versão:** 1.0  
**Última Atualização:** 2024

---

## 📋 Sumário

Este guia documenta o uso do `EmptyStateComponent`, componente compartilhado para exibir estados vazios de forma consistente em toda a aplicação.

---

## 1. 🎯 Objetivo

O `EmptyStateComponent` padroniza a exibição de estados vazios, garantindo:
- ✅ Consistência visual
- ✅ Mensagens padronizadas
- ✅ Ícones apropriados
- ✅ Ações opcionais
- ✅ Responsividade

---

## 2. 📦 Importação

```typescript
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  imports: [
    EmptyStateComponent
  ]
})
```

---

## 3. 🚀 Uso Básico

### 3.1 Estado Vazio Padrão

```html
<app-empty-state
  type="no-data"
  title="Nenhum curso encontrado"
  message="Comece adicionando um novo curso.">
</app-empty-state>
```

### 3.2 Estado Vazio com Ação

```html
<app-empty-state
  type="no-data"
  title="Nenhum curso encontrado"
  message="Comece adicionando um novo curso."
  [showAction]="true"
  actionLabel="Novo Curso"
  [actionClick]="addCourse">
</app-empty-state>
```

### 3.3 Estado de Busca Vazia

```html
<app-empty-state
  type="search"
  title="Nenhum resultado encontrado"
  [message]="'Não encontramos cursos com \"' + searchTerm + '\"'">
</app-empty-state>
```

---

## 4. 📋 Tipos Disponíveis

| Tipo | Ícone Padrão | Título Padrão | Uso |
|------|--------------|---------------|-----|
| `default` | `inbox` | "Nenhum dado encontrado" | Estado vazio genérico |
| `search` | `search_off` | "Nenhum resultado encontrado" | Busca sem resultados |
| `no-data` | `folder_open` | "Nenhum registro encontrado" | Lista vazia |
| `error` | `error_outline` | "Erro ao carregar dados" | Erro ao carregar |
| `no-permission` | `lock` | "Acesso negado" | Sem permissão |

---

## 5. 🎨 Propriedades

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `type` | `EmptyStateType` | `'default'` | Tipo do estado vazio |
| `icon` | `string` | `''` | Ícone customizado (opcional) |
| `title` | `string` | `''` | Título customizado (opcional) |
| `message` | `string` | `''` | Mensagem customizada (opcional) |
| `actionLabel` | `string` | `''` | Texto do botão de ação |
| `showAction` | `boolean` | `false` | Mostrar botão de ação |
| `actionClick` | `() => void` | `undefined` | Função ao clicar no botão |

---

## 6. 📝 Exemplos Completos

### 6.1 Exemplo: Lista de Cursos Vazia

```html
<div *ngIf="!isLoading && cursos.length === 0">
  <app-empty-state
    type="no-data"
    title="Nenhum curso encontrado"
    message="Comece adicionando um novo curso."
    [showAction]="true"
    actionLabel="Novo Curso"
    [actionClick]="addCourse">
  </app-empty-state>
</div>
```

### 6.2 Exemplo: Busca Sem Resultados

```html
<div *ngIf="!isLoading && cursos.length === 0 && searchTerm">
  <app-empty-state
    type="search"
    [title]="'Nenhum resultado para \"' + searchTerm + '\"'"
    message="Tente ajustar os filtros de busca."
    [showAction]="true"
    actionLabel="Limpar Busca"
    [actionClick]="clearSearch">
  </app-empty-state>
</div>
```

### 6.3 Exemplo: Erro ao Carregar

```html
<div *ngIf="errorMessage">
  <app-empty-state
    type="error"
    title="Erro ao carregar cursos"
    [message]="errorMessage"
    [showAction]="true"
    actionLabel="Tentar Novamente"
    [actionClick]="loadCursos">
  </app-empty-state>
</div>
```

### 6.4 Exemplo: Sem Permissão

```html
<div *ngIf="!hasPermission">
  <app-empty-state
    type="no-permission"
    title="Acesso negado"
    message="Você não tem permissão para visualizar estes dados.">
  </app-empty-state>
</div>
```

### 6.5 Exemplo: Customizado

```html
<app-empty-state
  icon="school_off"
  title="Nenhum curso disponível"
  message="Entre em contato com o administrador para adicionar cursos."
  [showAction]="true"
  actionLabel="Solicitar Acesso"
  [actionClick]="requestAccess">
</app-empty-state>
```

---

## 7. 🔄 Migração de Código Antigo

### Antes (Código Antigo):

```html
<div class="empty-state" *ngIf="!isLoading && cursos.length === 0">
  <mat-icon class="empty-icon">school_outlined</mat-icon>
  <h3>Nenhum curso encontrado</h3>
  <p>No momento não há cursos disponíveis</p>
  <button mat-raised-button color="primary" (click)="addCourse()">
    <mat-icon>add</mat-icon>
    Novo Curso
  </button>
</div>
```

### Depois (Com EmptyStateComponent):

```html
<app-empty-state
  *ngIf="!isLoading && cursos.length === 0"
  type="no-data"
  title="Nenhum curso encontrado"
  message="No momento não há cursos disponíveis"
  [showAction]="true"
  actionLabel="Novo Curso"
  [actionClick]="addCourse">
</app-empty-state>
```

---

## 8. 🎨 Estilização

O componente usa variáveis CSS globais:
- `--text-dark` - Cor do título
- `--text-medium` - Cor da mensagem
- `--text-light` - Cor do ícone
- `--primary-color` - Cor do botão
- `--error-color` - Cor para tipo error
- `--warning-color` - Cor para tipo search

---

## 9. ✅ Checklist de Uso

Antes de usar o EmptyStateComponent, verifique:

- [ ] `EmptyStateComponent` está importado
- [ ] Tipo apropriado selecionado (`no-data`, `search`, `error`, etc.)
- [ ] Título e mensagem são claros e amigáveis
- [ ] Ação é fornecida quando apropriado
- [ ] Ícone customizado usado apenas quando necessário
- [ ] Mensagens seguem padrão das constants quando possível

---

## 10. 🚫 Erros Comuns

### ❌ Não Fazer:

1. **Criar empty states customizados:**
```html
<!-- ERRADO -->
<div class="empty-state">
  <mat-icon>inbox</mat-icon>
  <p>Nenhum dado</p>
</div>

<!-- CORRETO -->
<app-empty-state type="no-data"></app-empty-state>
```

2. **Mensagens técnicas:**
```html
<!-- ERRADO -->
<app-empty-state
  title="HTTP 404"
  message="Resource not found">
</app-empty-state>

<!-- CORRETO -->
<app-empty-state
  type="error"
  title="Recurso não encontrado"
  message="O item que você procura não existe.">
</app-empty-state>
```

3. **Ícones inconsistentes:**
```html
<!-- ERRADO -->
<app-empty-state icon="warning" type="no-data"></app-empty-state>

<!-- CORRETO -->
<app-empty-state type="no-data"></app-empty-state>
```

---

## 11. 🎯 Resumo Rápido

| Cenário | Tipo | Exemplo |
|---------|------|---------|
| Lista vazia | `no-data` | `<app-empty-state type="no-data">` |
| Busca sem resultado | `search` | `<app-empty-state type="search">` |
| Erro ao carregar | `error` | `<app-empty-state type="error">` |
| Sem permissão | `no-permission` | `<app-empty-state type="no-permission">` |
| Com ação | `[showAction]="true"` | Adicionar botão de ação |

---

**Última Revisão:** 2024  
**Mantido por:** Equipe de Desenvolvimento Portifólium

