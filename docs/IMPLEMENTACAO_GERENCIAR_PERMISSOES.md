# 👥 Implementação de Gerenciar Permissões do Curso

## 📋 Visão Geral

Implementação completa da funcionalidade de **visualizar permissões de um curso**, exibindo lista de usuários com acesso e suas respectivas permissões (roles).

---

## ✅ Implementação Completa

### **1. Serviço - Buscar Permissões**

**Arquivo:** `src/app/features/cursos/services/cursos.service.ts`

```typescript
/**
 * GET /permissoes/{cursoId}
 * Buscar usuários com acesso ao curso e suas permissões
 * @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('GERENTE') or hasRole('SECRETARIO')")
 * Retorna: List<PermissaoCursoDTO>
 */
getCoursePermissions(cursoId: number): Observable<any[]> {
  console.log('👥 Buscando permissões do curso ID:', cursoId);
  return this.http.get<any[]>(`${this.baseUrl}/permissoes/${cursoId}`);
}
```

**Endpoint:** `GET /api/permissoes/{cursoId}`

---

### **2. Interface TypeScript**

```typescript
export interface PermissaoCurso {
  cursoId: number;
  usuarioId: number;
  usuarioNome: string;
  permissao: string;  // ADMINISTRADOR, GERENTE, SECRETARIO, etc.
}
```

---

### **3. Componente de Diálogo**

**Arquivo:** `src/app/features/cursos/components/permissoes-curso-dialog/permissoes-curso-dialog.component.ts`

#### **A. Carregamento de Permissões**

```typescript
ngOnInit(): void {
  this.loadPermissions();
}

loadPermissions(): void {
  this.isLoading = true;
  this.cursosService.getCoursePermissions(this.data.cursoId).subscribe({
    next: (permissoes) => {
      this.permissoes = permissoes;
      this.isLoading = false;
    },
    error: (error) => {
      this.errorMessage = this.extractErrorMessage(error);
      this.isLoading = false;
    }
  });
}
```

---

#### **B. Cores Dinâmicas por Permissão**

```typescript
getPermissionColor(permissao: string): string {
  const permissaoUpper = permissao.toUpperCase();
  switch (permissaoUpper) {
    case 'ADMINISTRADOR':
      return 'warn';      // Vermelho (mais crítico)
    case 'GERENTE':
      return 'primary';   // Azul
    case 'SECRETARIO':
      return 'accent';    // Lilás
    default:
      return '';
  }
}
```

**Visual:**
- 🔴 ADMINISTRADOR → Chip vermelho
- 🔵 GERENTE → Chip azul
- 💜 SECRETARIO → Chip lilás

---

#### **C. Extração de Mensagens de Erro**

```typescript
private extractErrorMessage(error: any): string {
  if (error.error) {
    if (typeof error.error === 'string') {
      return error.error;
    } else if (error.error.message) {
      return error.error.message;
    } else if (error.error.error) {
      return error.error.error;
    }
  } else if (error.message) {
    return error.message;
  }
  return 'Erro ao carregar permissões. Tente novamente.';
}
```

---

### **4. Template do Diálogo**

**Arquivo:** `permissoes-curso-dialog.component.html`

#### **A. Header com Informações do Curso**

```html
<div class="dialog-header">
  <div class="header-content">
    <mat-icon class="header-icon">manage_accounts</mat-icon>
    <div class="header-text">
      <h2 mat-dialog-title>Permissões do Curso</h2>
      <p class="curso-nome">{{ data.cursoNome }}</p>
    </div>
  </div>
  <button mat-icon-button class="close-button" (click)="close()">
    <mat-icon>close</mat-icon>
  </button>
</div>
```

---

#### **B. Estatísticas**

```html
<div class="stats-container">
  <div class="stat-card">
    <mat-icon>people</mat-icon>
    <div class="stat-info">
      <span class="stat-number">{{ permissoes.length }}</span>
      <span class="stat-label">Usuários com Acesso</span>
    </div>
  </div>
</div>
```

---

#### **C. Lista de Usuários e Permissões**

```html
<mat-list class="permissions-list">
  <mat-list-item *ngFor="let permissao of permissoes" class="permission-item">
    <mat-icon matListItemIcon class="user-icon">account_circle</mat-icon>
    <div matListItemTitle class="user-name">{{ permissao.usuarioNome }}</div>
    <div matListItemLine class="user-id">ID: {{ permissao.usuarioId }}</div>
    <div matListItemMeta>
      <mat-chip 
        [color]="getPermissionColor(permissao.permissao)"
        [highlighted]="true">
        {{ permissao.permissao }}
      </mat-chip>
    </div>
  </mat-list-item>
</mat-list>
```

---

#### **D. Estado Vazio**

```html
<div *ngIf="permissoes.length === 0" class="no-permissions">
  <mat-icon>lock</mat-icon>
  <p>Nenhum usuário com acesso a este curso</p>
  <small>Este curso ainda não possui usuários com permissão de acesso</small>
</div>
```

---

### **5. Botão para Abrir Diálogo**

**Arquivo:** `cards-cursos.component.html`

**ANTES:**
```html
<button
  mat-icon-button
  matTooltip="Gerenciar permissões"
  matTooltipPosition="above">
  <mat-icon>manage_accounts</mat-icon>
</button>
```

**DEPOIS:**
```html
<button
  mat-icon-button
  matTooltip="Gerenciar permissões"
  matTooltipPosition="above"
  (click)="managePermissions(curso); $event.stopPropagation()">
  <mat-icon>manage_accounts</mat-icon>
</button>
```

---

### **6. Método no Componente**

**Arquivo:** `cards-cursos.component.ts`

```typescript
// Abrir diálogo de gerenciar permissões
managePermissions(curso: any): void {
  console.log('👥 Gerenciar permissões para curso:', curso);
  
  this.dialog.open(PermissoesCursoDialogComponent, {
    width: '700px',
    maxWidth: '90vw',
    panelClass: 'permissions-dialog-panel',
    data: {
      cursoId: curso.id,
      cursoNome: curso.nome
    }
  });
}
```

---

## 🎨 **Visual do Diálogo**

```
┌────────────────────────────────────────────────┐
│  👥 Permissões do Curso                   [X]  │
│  Introdução ao Angular                         │
├────────────────────────────────────────────────┤
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │ 👥  5 Usuários com Acesso               │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  📋 Usuários e Permissões                     │
│  ───────────────────────────────────────────  │
│                                                │
│  👤 João Silva                [ADMINISTRADOR]  │
│     ID: 1                                      │
│                                                │
│  👤 Maria Santos              [GERENTE]        │
│     ID: 2                                      │
│                                                │
│  👤 Pedro Costa               [SECRETARIO]     │
│     ID: 3                                      │
│                                                │
├────────────────────────────────────────────────┤
│                                    [Fechar]    │
└────────────────────────────────────────────────┘
```

---

## 🎨 **Cores dos Chips de Permissão**

| Permissão | Cor | Código | Visual |
|-----------|-----|--------|--------|
| **ADMINISTRADOR** | Vermelho | `warn` | 🔴 Alto nível |
| **GERENTE** | Azul | `primary` | 🔵 Gerencial |
| **SECRETARIO** | Lilás | `accent` | 💜 Operacional |
| **Outros** | Padrão | - | ⚪ Não definido |

---

## 🔔 **Fluxo de Uso**

### **1. Usuário Clica no Botão de Permissões**
```
Card do curso → Botão 👥 "Gerenciar permissões"
Console: 👥 Gerenciar permissões para curso: {id: 1, nome: "..."}
```

### **2. Diálogo Abre com Loading**
```
┌─────────────────────────┐
│  Permissões do Curso    │
├─────────────────────────┤
│                         │
│     ⭕ Carregando       │
│   permissões...         │
│                         │
└─────────────────────────┘
```

### **3. API Busca Permissões**
```http
GET /api/permissoes/1
Authorization: Bearer eyJ...

Response: [
  {
    "cursoId": 1,
    "usuarioId": 1,
    "usuarioNome": "João Silva",
    "permissao": "ADMINISTRADOR"
  },
  {
    "cursoId": 1,
    "usuarioId": 2,
    "usuarioNome": "Maria Santos",
    "permissao": "GERENTE"
  }
]
```

### **4. Lista de Usuários é Exibida**
```
┌────────────────────────────────┐
│  👥 Permissões do Curso   [X]  │
│  Introdução ao Angular         │
├────────────────────────────────┤
│  👥  2 Usuários com Acesso     │
├────────────────────────────────┤
│  👤 João Silva  [ADMINISTRADOR]│
│  👤 Maria Santos  [GERENTE]    │
├────────────────────────────────┤
│                     [Fechar]   │
└────────────────────────────────┘
```

---

## 📊 **Arquivos Criados/Modificados**

| Arquivo | Tipo | Mudanças |
|---------|------|----------|
| `cursos.service.ts` | Service | +7 linhas - Método `getCoursePermissions()` |
| `permissoes-curso-dialog.component.ts` | Component | +105 linhas - Novo componente |
| `permissoes-curso-dialog.component.html` | Template | +88 linhas - Template completo |
| `permissoes-curso-dialog.component.css` | Styles | +269 linhas - Estilos completos |
| `cards-cursos.component.ts` | Component | +14 linhas - Método `managePermissions()` |
| `cards-cursos.component.html` | Template | +1 linha - Evento (click) |

---

## 🎯 **Funcionalidades Implementadas**

### **No Diálogo:**
- ✅ **Header** com gradiente azul → lilás
- ✅ **Nome do curso** no header
- ✅ **Botão fechar** no canto superior direito
- ✅ **Card de estatística** com total de usuários
- ✅ **Lista de usuários** com ícones
- ✅ **Chips coloridos** por tipo de permissão
- ✅ **Estado de loading** com spinner
- ✅ **Estado de erro** com mensagem e botão "Tentar Novamente"
- ✅ **Estado vazio** quando não há usuários
- ✅ **Scrollbar customizada**
- ✅ **Responsivo** para mobile

---

## 🔐 **Segurança e Autorização**

### **Backend:**
```java
@GetMapping("/permissoes/{cursoId}")
@PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('GERENTE') or hasRole('SECRETARIO')")
public ResponseEntity<List<PermissaoCursoDTO>> getAllUsuarioByCurso(
    @PathVariable Long cursoId,
    @AuthenticationPrincipal Usuario userDetails
) {
    // ...
}
```

**Acesso:**
- ✅ ADMINISTRADOR
- ✅ GERENTE
- ✅ SECRETARIO
- ❌ Alunos não têm acesso

---

## 📊 **Response do Backend**

```json
[
  {
    "cursoId": 1,
    "usuarioId": 1,
    "usuarioNome": "João Silva",
    "permissao": "ADMINISTRADOR"
  },
  {
    "cursoId": 1,
    "usuarioId": 2,
    "usuarioNome": "Maria Santos",
    "permissao": "GERENTE"
  },
  {
    "cursoId": 1,
    "usuarioId": 3,
    "usuarioNome": "Pedro Costa",
    "permissao": "SECRETARIO"
  }
]
```

---

## 🎨 **Estados do Diálogo**

### **1. Loading**
```
┌─────────────────────────┐
│  👥 Permissões do Curso │
├─────────────────────────┤
│         ⭕              │
│  Carregando permissões  │
└─────────────────────────┘
```

### **2. Com Dados**
```
┌─────────────────────────────┐
│  👥 Permissões do Curso     │
│  Introdução ao Angular      │
├─────────────────────────────┤
│  👥  3 Usuários com Acesso  │
├─────────────────────────────┤
│  👤 João Silva  [ADM] 🔴    │
│  👤 Maria Santos [GER] 🔵   │
│  👤 Pedro Costa [SEC] 💜    │
├─────────────────────────────┤
│                  [Fechar]   │
└─────────────────────────────┘
```

### **3. Vazio**
```
┌─────────────────────────┐
│  👥 Permissões do Curso │
├─────────────────────────┤
│         🔒              │
│  Nenhum usuário com     │
│  acesso a este curso    │
└─────────────────────────┘
```

### **4. Erro**
```
┌─────────────────────────┐
│  👥 Permissões do Curso │
├─────────────────────────┤
│         ⚠️              │
│  Erro ao carregar       │
│  [Tentar Novamente]     │
└─────────────────────────┘
```

---

## 🎉 **Resultado Final**

**O botão "Gerenciar permissões" agora:**

✅ **Abre diálogo** ao clicar  
✅ **Busca permissões** da API  
✅ **Exibe lista** de usuários  
✅ **Mostra permissões** com chips coloridos  
✅ **Chip vermelho** para ADMINISTRADOR  
✅ **Chip azul** para GERENTE  
✅ **Chip lilás** para SECRETARIO  
✅ **Estatística** de total de usuários  
✅ **Loading** durante carregamento  
✅ **Mensagem de erro** específica  
✅ **Estado vazio** quando não há usuários  
✅ **Botão "Tentar Novamente"** se houver erro  
✅ **Scrollbar customizada**  
✅ **Responsivo** para mobile  

**Funcionalidade de gerenciar permissões implementada com sucesso!** 🚀✨

---

## 🧪 **Como Testar**

### **Passo 1: Reiniciar Servidor**
```bash
npm start
```

### **Passo 2: Login**
- Faça login como ADMINISTRADOR, GERENTE ou SECRETARIO

### **Passo 3: Ir para /cursos**

### **Passo 4: Clicar no Botão 👥**
- Localize um curso
- Clique no botão "Gerenciar permissões"

### **Passo 5: Verificar Diálogo**
- ✅ Diálogo abre
- ✅ Loading aparece
- ✅ Lista de usuários carrega
- ✅ Chips coloridos aparecem

---

## 📚 **Documentação Criada**

Criei `docs/IMPLEMENTACAO_GERENCIAR_PERMISSOES.md` com:
- ✅ Implementação completa
- ✅ Estrutura do diálogo
- ✅ Estados visuais
- ✅ Como testar

---

**Data da Implementação:** 20 de outubro de 2025  
**Arquivos Criados:** 3 (TS + HTML + CSS)  
**Arquivos Modificados:** 3 (Service + Component + Template)  
**Endpoint:** `GET /api/permissoes/{cursoId}`  
**Status:** ✅ **CONCLUÍDO**



