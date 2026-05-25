# 🎨 Guia de Estilo - Botões e Ações
## Portifólium - Padrões de Design

**Versão:** 1.0  
**Última Atualização:** 2024

---

## 📋 Sumário

Este guia define os padrões de uso de botões e ações na aplicação Portifólium, garantindo consistência visual e de experiência do usuário.

---

## 1. 🎯 Tipos de Botões

### 1.1 Botão Primário (Ação Principal)

**Uso:** Ações principais como salvar, cadastrar, atualizar, confirmar.

**Sintaxe:**
```html
<button
  mat-raised-button
  color="primary"
  class="btn-primary"
  type="button"
  (click)="onSubmit()"
  [disabled]="isSaving || form.invalid">
  <mat-icon>{{ isEditMode ? 'save' : 'add' }}</mat-icon>
  {{ isEditMode ? 'Atualizar' : 'Cadastrar' }}
</button>
```

**Características:**
- ✅ Tipo: `mat-raised-button`
- ✅ Cor: `color="primary"`
- ✅ Classe: `class="btn-primary"`
- ✅ Estilo: Gradiente azul aplicado globalmente
- ✅ Ícone: Sempre antes do texto
- ✅ Estado disabled: Quando formulário inválido ou salvando

**Exemplos de Uso:**
- Salvar/Cadastrar/Atualizar formulários
- Confirmar ações importantes
- Adicionar novos itens
- Enviar dados

---

### 1.2 Botão Secundário (Ação Secundária)

**Uso:** Ações secundárias como cancelar, voltar, limpar.

**Sintaxe:**
```html
<button
  mat-stroked-button
  type="button"
  (click)="onCancel()"
  [disabled]="isSaving">
  <mat-icon>close</mat-icon>
  Cancelar
</button>
```

**Características:**
- ✅ Tipo: `mat-stroked-button`
- ✅ Sem cor específica (usa cor padrão)
- ✅ Sem classe customizada
- ✅ Ícone: Sempre antes do texto

**Exemplos de Uso:**
- Cancelar operações
- Voltar para lista
- Limpar formulário
- Fechar diálogos

---

### 1.3 Botão de Texto (Ações Terciárias)

**Uso:** Ações menos importantes ou em menus.

**Sintaxe:**
```html
<button
  mat-button
  type="button"
  (click)="onReset()"
  [disabled]="isSaving">
  <mat-icon>refresh</mat-icon>
  Limpar
</button>
```

**Características:**
- ✅ Tipo: `mat-button`
- ✅ Sem cor específica
- ✅ Sem classe customizada
- ✅ Ícone: Sempre antes do texto

**Exemplos de Uso:**
- Limpar campos
- Resetar formulário
- Ações em menus
- Links que parecem botões

---

### 1.4 Botão de Ícone (Ações Compactas)

**Uso:** Ações em tabelas, cards ou espaços reduzidos.

**Sintaxe:**
```html
<button
  mat-icon-button
  color="primary"
  matTooltip="Editar"
  (click)="editItem(item)">
  <mat-icon>edit</mat-icon>
</button>
```

**Características:**
- ✅ Tipo: `mat-icon-button`
- ✅ Cor: `color="primary"`, `color="accent"`, ou `color="warn"`
- ✅ Sempre com `matTooltip` para acessibilidade
- ✅ Apenas ícone, sem texto

**Exemplos de Uso:**
- Ações em tabelas (editar, excluir, visualizar)
- Ações em cards
- Botões de menu
- Ações compactas

---

## 2. 📐 Ordem de Elementos

### 2.1 Ícone e Texto

**Regra:** Ícone sempre antes do texto.

✅ **Correto:**
```html
<button mat-raised-button color="primary" class="btn-primary">
  <mat-icon>save</mat-icon>
  Salvar
</button>
```

❌ **Incorreto:**
```html
<button mat-raised-button color="primary" class="btn-primary">
  Salvar
  <mat-icon>save</mat-icon>
</button>
```

### 2.2 Estados de Loading

**Regra:** Mostrar spinner quando carregando, ícone quando não.

✅ **Correto:**
```html
<button mat-raised-button color="primary" class="btn-primary" [disabled]="isSaving">
  <mat-icon *ngIf="!isSaving">{{ isEditMode ? 'save' : 'add' }}</mat-icon>
  <mat-progress-spinner *ngIf="isSaving" diameter="20" mode="indeterminate"></mat-progress-spinner>
  {{ isSaving ? 'Salvando...' : (isEditMode ? 'Atualizar' : 'Cadastrar') }}
</button>
```

---

## 3. 🎨 Classes CSS

### 3.1 Classes Padronizadas

| Classe | Uso | Obrigatória |
|--------|-----|-------------|
| `btn-primary` | Botões primários (ações principais) | ✅ Sim |
| `add-button` | Botões de adicionar em listas | ✅ Sim |
| Nenhuma | Botões secundários/terciários | ✅ Sim |

### 3.2 Aplicação de Classes

**Botão Primário:**
```html
<button mat-raised-button color="primary" class="btn-primary">
```

**Botão Adicionar (em listas):**
```html
<button mat-raised-button color="primary" class="btn-primary add-button">
```

**Botão Secundário:**
```html
<button mat-stroked-button>
  <!-- Sem classe customizada -->
</button>
```

---

## 4. 📝 Textos Padronizados

### 4.1 Ações de Formulário

| Contexto | Texto | Ícone |
|----------|-------|-------|
| Criar novo | "Cadastrar" | `add` |
| Editar existente | "Atualizar" | `save` |
| Salvando | "Salvando..." | `hourglass_empty` |
| Cancelar | "Cancelar" | `close` |
| Voltar | "Voltar" | `arrow_back` |
| Limpar | "Limpar" | `refresh` |

### 4.2 Ações de Lista

| Ação | Texto | Ícone |
|------|-------|-------|
| Adicionar | "Novo [Entidade]" | `add` |
| Editar | Tooltip: "Editar" | `edit` |
| Excluir | Tooltip: "Excluir" | `delete` |
| Visualizar | Tooltip: "Visualizar" | `visibility` |

---

## 5. 🔄 Estados dos Botões

### 5.1 Estado Disabled

**Regras:**
- ✅ Sempre desabilitar durante operações assíncronas (`isSaving`, `isLoading`)
- ✅ Desabilitar quando formulário inválido (`form.invalid`)
- ✅ Mostrar feedback visual (spinner ou texto alterado)

**Exemplo:**
```html
<button
  mat-raised-button
  color="primary"
  class="btn-primary"
  [disabled]="isSaving || form.invalid">
  <!-- Conteúdo do botão -->
</button>
```

### 5.2 Estado Loading

**Regras:**
- ✅ Substituir ícone por spinner quando carregando
- ✅ Alterar texto para indicar ação em progresso
- ✅ Manter botão desabilitado

**Exemplo:**
```html
<button mat-raised-button color="primary" class="btn-primary" [disabled]="isSaving">
  <mat-icon *ngIf="!isSaving">save</mat-icon>
  <mat-progress-spinner *ngIf="isSaving" diameter="20" mode="indeterminate"></mat-progress-spinner>
  {{ isSaving ? 'Salvando...' : 'Atualizar' }}
</button>
```

---

## 6. 📍 Posicionamento

### 6.1 Formulários

**Regra:** Botões sempre no final do formulário, alinhados à direita.

```html
<mat-card-actions align="end">
  <button mat-stroked-button (click)="onCancel()">Cancelar</button>
  <button mat-raised-button color="primary" class="btn-primary" (click)="onSubmit()">
    Salvar
  </button>
</mat-card-actions>
```

### 6.2 Listas

**Regra:** Botão de adicionar no topo, à direita do cabeçalho.

```html
<div class="header-actions">
  <button mat-raised-button color="primary" class="btn-primary add-button" (click)="addItem()">
    <mat-icon>add</mat-icon>
    Novo Item
  </button>
</div>
```

---

## 7. ✅ Checklist de Validação

Antes de criar um botão, verifique:

- [ ] Tipo correto (`mat-raised-button` para primários)
- [ ] Classe `btn-primary` em botões primários
- [ ] Ícone antes do texto
- [ ] Texto padronizado conforme contexto
- [ ] Estado `disabled` configurado corretamente
- [ ] Feedback de loading implementado
- [ ] Tooltip em botões de ícone
- [ ] Alinhamento correto (end para formulários)

---

## 8. 🚫 Erros Comuns

### ❌ Não Fazer:

1. **Misturar classes:**
```html
<!-- ERRADO -->
<button mat-raised-button color="primary" class="submit-button">
```

2. **Ícone depois do texto:**
```html
<!-- ERRADO -->
<button>Salvar <mat-icon>save</mat-icon></button>
```

3. **Falta de classe em botão primário:**
```html
<!-- ERRADO -->
<button mat-raised-button color="primary">
```

4. **Texto não padronizado:**
```html
<!-- ERRADO -->
<button>Salvar alterações</button>
<!-- CORRETO -->
<button>Atualizar</button>
```

---

## 9. 📚 Exemplos Completos

### 9.1 Botão Primário Completo

```html
<button
  mat-raised-button
  color="primary"
  class="btn-primary"
  type="button"
  (click)="onSubmit()"
  [disabled]="isSaving || form.invalid"
  matTooltip="Salvar dados">
  <mat-icon *ngIf="!isSaving">{{ isEditMode ? 'save' : 'add' }}</mat-icon>
  <mat-progress-spinner
    *ngIf="isSaving"
    diameter="20"
    mode="indeterminate">
  </mat-progress-spinner>
  {{ isSaving ? 'Salvando...' : (isEditMode ? 'Atualizar' : 'Cadastrar') }}
</button>
```

### 9.2 Botão Secundário Completo

```html
<button
  mat-stroked-button
  type="button"
  (click)="onCancel()"
  [disabled]="isSaving">
  <mat-icon>close</mat-icon>
  Cancelar
</button>
```

### 9.3 Botão de Ícone Completo

```html
<button
  mat-icon-button
  color="primary"
  matTooltip="Editar item"
  (click)="editItem(item)">
  <mat-icon>edit</mat-icon>
</button>
```

---

## 10. 🎯 Resumo Rápido

| Tipo | Componente | Classe | Ícone |
|------|------------|--------|-------|
| Primário | `mat-raised-button color="primary"` | `btn-primary` | Antes do texto |
| Secundário | `mat-stroked-button` | Nenhuma | Antes do texto |
| Texto | `mat-button` | Nenhuma | Antes do texto |
| Ícone | `mat-icon-button` | Nenhuma | Apenas ícone |

---

**Última Revisão:** 2024  
**Mantido por:** Equipe de Desenvolvimento Portifólium

