# 🔄 Implementação do Toggle de Status de Curso

## 📋 Visão Geral

Implementação da funcionalidade de **ativar/desativar cursos** com diálogo de confirmação, substituindo o botão "Publicar curso" por um toggle dinâmico que mostra o status atual e permite alterá-lo.

---

## ✅ Implementação Completa

### **1. Serviço - Método de Atualização de Status**

**Arquivo:** `src/app/features/cursos/services/cursos.service.ts`

```typescript
/**
 * PUT /cursos/{cursoId}/status
 * Atualizar status (ativo/inativo) de um curso
 * @PreAuthorize("hasRole('ADMINISTRADOR')")
 * Body: { ativo: boolean }
 */
updateCourseStatus(id: number, ativo: boolean): Observable<any> {
  console.log('🔄 Atualizando status do curso:', id, 'Ativo:', ativo);
  return this.http.put(`${this.baseUrl}/cursos/${id}/status`, { ativo });
}
```

**Detalhes:**
- ✅ Endpoint: `PUT /api/cursos/{cursoId}/status`
- ✅ Body: `{ "ativo": true/false }`
- ✅ Requer role: `ADMINISTRADOR`
- ✅ Retorna: `CursoDTO` atualizado

---

### **2. Componente - Lógica de Toggle**

**Arquivo:** `src/app/features/cursos/components/cards-cursos/cards-cursos.component.ts`

#### **A. Método Principal**

```typescript
// Toggle status do curso (ativar/desativar) com confirmação
toggleCourseStatus(curso: any): void {
  const novoStatus = !curso.ativo;
  const acao = novoStatus ? 'ativar' : 'desativar';
  const acaoCapitalizada = novoStatus ? 'Ativar' : 'Desativar';

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '500px',
    panelClass: 'confirm-dialog-panel',
    data: {
      title: `${acaoCapitalizada} Curso`,
      message: `Tem certeza que deseja ${acao} o curso "${curso.nome}"?`,
      confirmText: `Sim, ${acaoCapitalizada}`,
      cancelText: 'Cancelar',
      type: novoStatus ? 'info' : 'warning'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.performStatusUpdate(curso.id, curso.nome, novoStatus);
    }
  });
}
```

**Características:**
- ✅ Inverte o status atual (`!curso.ativo`)
- ✅ Mensagem dinâmica (ativar/desativar)
- ✅ Tipo de diálogo dinâmico (info/warning)
- ✅ Confirmação obrigatória

---

#### **B. Método de Execução**

```typescript
// Executar a atualização de status
private performStatusUpdate(cursoId: number, cursoNome: string, novoStatus: boolean): void {
  this.cursosService.updateCourseStatus(cursoId, novoStatus).subscribe({
    next: () => {
      const statusTexto = novoStatus ? 'ativado' : 'desativado';
      this.showMessage(`Curso "${cursoNome}" ${statusTexto} com sucesso!`, 'success');
      this.loadCourses(); // Recarrega a lista
    },
    error: (error) => {
      console.error('Erro ao atualizar status do curso:', error);
      this.showMessage('Erro ao atualizar status do curso. Tente novamente.', 'error');
    }
  });
}
```

**Características:**
- ✅ Chama o serviço de atualização
- ✅ Mensagem de sucesso dinâmica
- ✅ Recarrega a lista após sucesso
- ✅ Tratamento de erros

---

### **3. Template - Botão Dinâmico**

**Arquivo:** `src/app/features/cursos/components/cards-cursos/cards-cursos.component.html`

#### **Antes:**
```html
<button
  mat-icon-button
  matTooltip="Publicar curso"
  matTooltipPosition="above">
  <mat-icon>visibility</mat-icon>
</button>
```

#### **Depois:**
```html
<button
  mat-icon-button
  [matTooltip]="curso.ativo ? 'Desativar curso' : 'Ativar curso'"
  matTooltipPosition="above"
  [class.status-active]="curso.ativo"
  [class.status-inactive]="!curso.ativo"
  (click)="toggleCourseStatus(curso); $event.stopPropagation()">
  <mat-icon>{{ curso.ativo ? 'visibility' : 'visibility_off' }}</mat-icon>
</button>
```

**Características:**
- ✅ **Tooltip dinâmico** conforme status
- ✅ **Ícone dinâmico** (`visibility` / `visibility_off`)
- ✅ **Classes dinâmicas** (`.status-active` / `.status-inactive`)
- ✅ **Evento de click** com confirmação
- ✅ **stopPropagation** para não expandir o card

---

### **4. Estilos - Estados Visuais**

**Arquivo:** `src/app/features/cursos/components/cards-cursos/cards-cursos.component.css`

```css
/* ========================================
   🔄 BOTÃO DE STATUS (ATIVAR/DESATIVAR)
   ======================================== */

/* Botão quando curso está ATIVO */
.status-active {
  color: var(--success-color) !important;
  background-color: rgba(16, 185, 129, 0.1) !important;
}

.status-active:hover {
  background-color: rgba(16, 185, 129, 0.2) !important;
  transform: scale(1.1);
}

.status-active mat-icon {
  color: var(--success-color) !important;
}

/* Botão quando curso está INATIVO */
.status-inactive {
  color: var(--text-medium) !important;
  background-color: rgba(100, 116, 139, 0.1) !important;
}

.status-inactive:hover {
  background-color: rgba(100, 116, 139, 0.2) !important;
  transform: scale(1.1);
}

.status-inactive mat-icon {
  color: var(--text-medium) !important;
}
```

---

## 🎨 **Estados Visuais**

### **Curso ATIVO:**
```
Ícone:      visibility (olho aberto)
Cor:        Verde (#10B981)
Background: Verde claro (rgba(16, 185, 129, 0.1))
Tooltip:    "Desativar curso"
Hover:      Verde mais intenso + scale(1.1)
```

### **Curso INATIVO:**
```
Ícone:      visibility_off (olho fechado)
Cor:        Cinza médio (#475569)
Background: Cinza claro (rgba(100, 116, 139, 0.1))
Tooltip:    "Ativar curso"
Hover:      Cinza mais intenso + scale(1.1)
```

---

## 🔔 **Fluxo de Confirmação**

### **1. Usuário clica no botão**
```
Curso ativo → Pergunta: "Deseja desativar?"
Curso inativo → Pergunta: "Deseja ativar?"
```

### **2. Diálogo de Confirmação**
```
Título:   "Ativar Curso" ou "Desativar Curso"
Mensagem: "Tem certeza que deseja [ação] o curso [nome]?"
Botões:   "Sim, Ativar/Desativar" | "Cancelar"
Tipo:     info (ativar) | warning (desativar)
```

### **3. Após Confirmação**
```
✅ Sim → Chama API → Sucesso → Recarrega lista → Snackbar verde
❌ Não → Fecha diálogo → Nada acontece
⚠️ Erro → Snackbar vermelho
```

---

## 📊 **Arquivos Modificados**

| Arquivo | Mudanças |
|---------|----------|
| **cursos.service.ts** | +11 linhas - Método `updateCourseStatus()` |
| **cards-cursos.component.ts** | +38 linhas - Métodos `toggleCourseStatus()` e `performStatusUpdate()` |
| **cards-cursos.component.html** | ~8 linhas - Botão dinâmico com binding |
| **cards-cursos.component.css** | +32 linhas - Estilos `.status-active` e `.status-inactive` |

---

## 🎯 **Integração com Backend**

### **Endpoint Usado:**
```
PUT /api/cursos/{cursoId}/status
```

### **Request Body:**
```json
{
  "ativo": true
}
```

### **Response:**
```json
{
  "id": 1,
  "nome": "Introdução ao Angular",
  "ativo": true,
  "categoria": { ... }
}
```

### **Autorização:**
```java
@PreAuthorize("hasRole('ADMINISTRADOR')")
```
✅ Apenas administradores podem alterar status

---

## 🎨 **Exemplos de Uso**

### **Cenário 1: Ativar Curso Inativo**

**Estado Inicial:**
```
Curso: "Introdução ao Angular"
Status: Inativo (ativo = false)
Ícone: visibility_off (olho fechado)
Cor: Cinza
```

**Usuário clica:**
```
Diálogo: "Tem certeza que deseja ativar o curso 'Introdução ao Angular'?"
Tipo: info (azul)
Botão: "Sim, Ativar"
```

**Após confirmar:**
```
API: PUT /api/cursos/1/status { "ativo": true }
Snackbar: "Curso 'Introdução ao Angular' ativado com sucesso!"
Lista: Recarregada
```

**Estado Final:**
```
Curso: "Introdução ao Angular"
Status: Ativo (ativo = true)
Ícone: visibility (olho aberto)
Cor: Verde
```

---

### **Cenário 2: Desativar Curso Ativo**

**Estado Inicial:**
```
Curso: "React Avançado"
Status: Ativo (ativo = true)
Ícone: visibility (olho aberto)
Cor: Verde
```

**Usuário clica:**
```
Diálogo: "Tem certeza que deseja desativar o curso 'React Avançado'?"
Tipo: warning (laranja)
Botão: "Sim, Desativar"
```

**Após confirmar:**
```
API: PUT /api/cursos/2/status { "ativo": false }
Snackbar: "Curso 'React Avançado' desativado com sucesso!"
Lista: Recarregada
```

**Estado Final:**
```
Curso: "React Avançado"
Status: Inativo (ativo = false)
Ícone: visibility_off (olho fechado)
Cor: Cinza
```

---

## ✅ **Benefícios da Implementação**

### **UX:**
- 🎯 **Feedback visual claro** do status atual
- ✅ **Confirmação obrigatória** evita erros
- 🎨 **Cores intuitivas** (verde = ativo, cinza = inativo)
- 💬 **Mensagens dinâmicas** e contextuais
- ⚡ **Atualização imediata** da lista

### **Segurança:**
- 🔐 **Autorização no backend** (ADMINISTRADOR)
- ⚠️ **Confirmação antes da ação**
- 🛡️ **Validação de dados**
- 📝 **Logs de ação**

### **Técnico:**
- 🔧 **Código limpo** e organizado
- 📦 **Reutiliza** ConfirmDialogComponent
- 🚀 **Performance** - apenas atualiza status
- 🧪 **Fácil de testar**

---

## 🔍 **Diferenças do Botão Original**

### **ANTES (Botão "Publicar"):**
```
Ícone:      visibility (fixo)
Tooltip:    "Publicar curso" (fixo)
Ação:       Nenhuma
Cor:        Padrão
```

### **DEPOIS (Toggle de Status):**
```
Ícone:      visibility / visibility_off (dinâmico)
Tooltip:    "Ativar/Desativar curso" (dinâmico)
Ação:       Altera status com confirmação
Cor:        Verde (ativo) / Cinza (inativo)
```

---

## 🎉 **Resultado Final**

**O botão de status agora:**

✅ **Mostra visualmente** se o curso está ativo ou inativo
✅ **Permite alternar** o status com um clique
✅ **Pede confirmação** antes de alterar
✅ **Usa cores intuitivas** (verde/cinza)
✅ **Ícone dinâmico** (olho aberto/fechado)
✅ **Tooltip dinâmico** conforme estado
✅ **Mensagens de sucesso** personalizadas
✅ **Tratamento de erros** completo
✅ **Recarrega a lista** automaticamente

**Funcionalidade de toggle de status implementada com sucesso!** 🚀✨

---

## 🚀 **Como Testar**

### **1. Ativar Curso Inativo:**
1. Localize um curso com ícone de olho fechado (cinza)
2. Clique no botão
3. Confirme "Sim, Ativar"
4. Veja o snackbar verde de sucesso
5. Veja o ícone mudar para olho aberto (verde)

### **2. Desativar Curso Ativo:**
1. Localize um curso com ícone de olho aberto (verde)
2. Clique no botão
3. Confirme "Sim, Desativar"
4. Veja o snackbar verde de sucesso
5. Veja o ícone mudar para olho fechado (cinza)

### **3. Cancelar Ação:**
1. Clique em qualquer botão de status
2. Clique em "Cancelar"
3. Nada deve acontecer
4. Status permanece inalterado

---

**Data da Implementação:** 20 de outubro de 2025
**Arquivos Modificados:** 4 arquivos
**Endpoint:** `PUT /api/cursos/{cursoId}/status`
**Status:** ✅ **CONCLUÍDO**

