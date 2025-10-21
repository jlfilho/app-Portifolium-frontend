# ➖ Remover Usuário do Curso - Implementação Completa

## 📋 Visão Geral

Implementação da funcionalidade de **remover usuários de um curso** com diálogo de confirmação, botão de ação em cada item da lista e atualização automática.

---

## ✅ Implementação Completa

### **1. Serviço - Método de Remover Usuário**

**Arquivo:** `src/app/features/cursos/services/cursos.service.ts`

```typescript
/**
 * DELETE /cursos/{cursoId}/usuarios/{usuarioId}
 * Remover usuário de um curso
 * @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('GERENTE')")
 * Retorna: List<PermissaoCursoDTO>
 */
removeUserFromCourse(cursoId: number, usuarioId: number): Observable<any[]> {
  console.log('➖ Removendo usuário do curso:', { cursoId, usuarioId });
  console.log('📡 URL:', `${this.baseUrl}/cursos/${cursoId}/usuarios/${usuarioId}`);
  return this.http.delete<any[]>(`${this.baseUrl}/cursos/${cursoId}/usuarios/${usuarioId}`);
}
```

**Detalhes:**
- ✅ Endpoint: `DELETE /api/cursos/{cursoId}/usuarios/{usuarioId}`
- ✅ Retorna: Lista atualizada de permissões
- ✅ Requer role: ADMINISTRADOR ou GERENTE

---

### **2. Componente - Lógica de Remover**

**Arquivo:** `permissoes-curso-dialog.component.ts`

#### **A. Método Principal com Confirmação**

```typescript
removeUserFromCourse(permissao: PermissaoCurso): void {
  console.log('➖ Remover usuário do curso:', permissao);

  const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '500px',
    data: {
      title: 'Remover Usuário',
      message: `Tem certeza que deseja remover "${permissao.usuarioNome}" deste curso?`,
      confirmText: 'Sim, Remover',
      cancelText: 'Cancelar',
      type: 'warning'  // ⬅ Diálogo laranja (warning)
    }
  });

  confirmDialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.performRemoval(permissao.usuarioId, permissao.usuarioNome);
    }
  });
}
```

---

#### **B. Método de Execução**

```typescript
private performRemoval(usuarioId: number, usuarioNome: string): void {
  console.log('📡 Chamando API para remover usuário...');

  this.cursosService.removeUserFromCourse(this.data.cursoId, usuarioId).subscribe({
    next: (permissoes) => {
      console.log('✅ Usuário removido! Nova lista:', permissoes);
      this.permissoes = permissoes;  // ⬅ Atualiza lista
      this.showMessage(`Usuário "${usuarioNome}" removido do curso com sucesso!`, 'success');
    },
    error: (error) => {
      console.error('❌ Erro ao remover usuário:', error);
      const errorMessage = this.extractErrorMessage(error);
      this.showMessage(errorMessage, 'error');
    }
  });
}
```

---

### **3. Template - Botão de Remover**

**Arquivo:** `permissoes-curso-dialog.component.html`

```html
<mat-list-item *ngFor="let permissao of permissoes">
  <mat-icon matListItemIcon>account_circle</mat-icon>
  <div matListItemTitle>{{ permissao.usuarioNome }}</div>
  <div matListItemLine>ID: {{ permissao.usuarioId }}</div>
  <div matListItemMeta class="item-actions">
    <!-- Chip de Permissão -->
    <mat-chip [color]="getPermissionColor(permissao.permissao)">
      {{ permissao.permissao }}
    </mat-chip>
    
    <!-- Botão de Remover -->
    <button
      mat-icon-button
      class="remove-button"
      matTooltip="Remover usuário do curso"
      (click)="removeUserFromCourse(permissao)">
      <mat-icon>person_remove</mat-icon>
    </button>
  </div>
</mat-list-item>
```

---

### **4. Estilos - Botão de Remover**

**Arquivo:** `permissoes-curso-dialog.component.css`

```css
.item-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.remove-button {
  color: var(--error-color) !important;  /* Vermelho */
  transition: all 0.2s ease;
}

.remove-button:hover {
  background-color: rgba(239, 68, 68, 0.1) !important;  /* Fundo vermelho claro */
  transform: scale(1.1);
}
```

---

## 🎨 **Visual da Lista Atualizada**

```
┌────────────────────────────────────────────────┐
│  📋 Usuários e Permissões                     │
│  ───────────────────────────────────────────  │
│                                                │
│  👤 João Silva        [ADM] 🔴  [🗑️]          │
│     ID: 1                          ↑           │
│                              Botão remover     │
│                                                │
│  👤 Maria Santos      [GER] 🔵  [🗑️]          │
│     ID: 2                                      │
│                                                │
│  👤 Pedro Costa       [SEC] 💜  [🗑️]          │
│     ID: 3                                      │
│                                                │
└────────────────────────────────────────────────┘
```

---

## 🔔 **Fluxo Completo de Remoção**

### **1. Usuário Clica no Botão 🗑️ Vermelho**
```
Console: ➖ Remover usuário do curso: {usuarioId: 2, usuarioNome: "Maria", ...}
```

### **2. Diálogo de Confirmação Abre**
```
┌────────────────────────────────┐
│  ⚠️  Remover Usuário           │
├────────────────────────────────┤
│                                │
│  Tem certeza que deseja        │
│  remover "Maria Santos"        │
│  deste curso?                  │
│                                │
├────────────────────────────────┤
│      [Cancelar] [Sim, Remover] │
│                      ↑          │
│                   Laranja       │
└────────────────────────────────┘
```

### **3. Usuário Confirma "Sim, Remover"**
```
Console: 💬 Resultado do diálogo de remoção: true
Console: ✅ Confirmado! Executando remoção...
Console: 📡 Chamando API para remover usuário...
Console: ➖ Service: Removendo usuário do curso: {cursoId: 1, usuarioId: 2}
Console: 📡 URL: http://localhost:8080/api/cursos/1/usuarios/2
```

### **4. API Executa Remoção**
```http
DELETE /api/cursos/1/usuarios/2
Authorization: Bearer eyJ...

Response: [
  { cursoId: 1, usuarioId: 1, usuarioNome: "João", permissao: "ADMINISTRADOR" },
  { cursoId: 1, usuarioId: 3, usuarioNome: "Pedro", permissao: "SECRETARIO" }
]
```
**Maria Santos foi removida!**

### **5. Sucesso - Lista Atualiza**
```
Console: ✅ Usuário removido! Nova lista: [...]
Snackbar: "Usuário 'Maria Santos' removido do curso com sucesso!" 🟢
Lista: Agora mostra 2 usuários (João, Pedro)
Estatística: "2 Usuários com Acesso" (era 3)
Dropdown: Carlos, Ana E Maria agora aparecem como disponíveis
```

---

## 📊 **Integração com Backend**

### **Controller:**
```java
@DeleteMapping("/{cursoId}/usuarios/{usuarioId}")
@PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('GERENTE')")
public ResponseEntity<List<PermissaoCursoDTO>> excluirUsuarioCurso(
    @PathVariable Long cursoId, 
    @PathVariable Long usuarioId
) {
    List<PermissaoCursoDTO> permissaoCurso = cursoService.removerUsuarioCurso(cursoId, usuarioId);
    return ResponseEntity.ok(permissaoCurso);
}
```

### **Request:**
```http
DELETE /api/cursos/1/usuarios/2
Authorization: Bearer eyJ...
```

### **Response:**
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
    "usuarioId": 3,
    "usuarioNome": "Pedro Costa",
    "permissao": "SECRETARIO"
  }
]
```

---

## ✅ **Funcionalidades Implementadas**

### **No Diálogo de Permissões:**

**Adicionar Usuário:**
- ✅ Dropdown com usuários disponíveis
- ✅ Filtro automático (apenas sem acesso)
- ✅ Botão "Adicionar"
- ✅ Mensagem de sucesso

**Remover Usuário:**
- ✅ Botão vermelho em cada item
- ✅ Ícone `person_remove`
- ✅ Diálogo de confirmação laranja
- ✅ Mensagem personalizada com nome
- ✅ Atualização automática da lista
- ✅ Mensagem de sucesso
- ✅ Mensagens de erro do servidor

**Atualização Automática:**
- ✅ Lista de permissões recarrega
- ✅ Estatística atualiza
- ✅ Dropdown de adicionar atualiza
- ✅ Usuário removido volta para disponíveis

---

## 🎯 **Exemplo Completo**

### **Situação Inicial:**
```
Curso: "Introdução ao Angular"
Usuários com acesso: 3
├─ João Silva (ADMINISTRADOR)
├─ Maria Santos (GERENTE)
└─ Pedro Costa (SECRETARIO)

Usuários disponíveis: 2
├─ Carlos Oliveira
└─ Ana Paula
```

### **Remover Maria Santos:**
```
1. Clica em 🗑️ ao lado de "Maria Santos"
2. Confirma: "Sim, Remover"
3. API: DELETE /cursos/1/usuarios/2
4. Sucesso: "Maria Santos removida..."
```

### **Situação Final:**
```
Curso: "Introdução ao Angular"
Usuários com acesso: 2  ⬅ Era 3
├─ João Silva (ADMINISTRADOR)
└─ Pedro Costa (SECRETARIO)

Usuários disponíveis: 3  ⬅ Era 2
├─ Carlos Oliveira
├─ Ana Paula
└─ Maria Santos  ⬅ VOLTOU!
```

---

## 🎉 **Resultado Final**

**O diálogo de permissões agora é completo:**

✅ **Visualizar** usuários com acesso  
✅ **Adicionar** novos usuários  
✅ **Remover** usuários existentes  
✅ **Filtro automático** de disponíveis  
✅ **Confirmação** ao remover  
✅ **Atualização automática** em tudo  
✅ **Chips coloridos** por permissão  
✅ **Estatísticas** em tempo real  
✅ **Mensagens de erro** do servidor  
✅ **Logs detalhados** para debug  
✅ **Visual moderno** e intuitivo  

**CRUD completo de permissões implementado!** 🚀✨

---

## 🧪 **Como Testar**

### **Teste 1: Adicionar Usuário**
```
1. Abra diálogo de permissões
2. Selecione usuário no dropdown
3. Clique em "Adicionar"
4. Veja usuário aparecer na lista
5. Veja estatística aumentar
6. Veja usuário sumir do dropdown
```

### **Teste 2: Remover Usuário**
```
1. Clique no botão 🗑️ de um usuário
2. Confirme "Sim, Remover"
3. Veja usuário sumir da lista
4. Veja estatística diminuir
5. Veja usuário voltar para dropdown
```

### **Teste 3: Fluxo Completo**
```
1. Remova 2 usuários
2. Adicione 3 usuários
3. Veja tudo atualizando automaticamente
```

---

## 📚 **Arquivos Modificados**

| Arquivo | Mudanças |
|---------|----------|
| `cursos.service.ts` | +11 linhas - Método `removeUserFromCourse()` |
| `permissoes-curso-dialog.component.ts` | +44 linhas - Métodos de remoção |
| `permissoes-curso-dialog.component.html` | +10 linhas - Botão de remover |
| `permissoes-curso-dialog.component.css` | +22 linhas - Estilos do botão |

---

**Data da Implementação:** 20 de outubro de 2025  
**Endpoint:** `DELETE /api/cursos/{cursoId}/usuarios/{usuarioId}`  
**Status:** ✅ **CONCLUÍDO**



