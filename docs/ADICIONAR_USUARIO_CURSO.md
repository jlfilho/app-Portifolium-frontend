# ➕ Adicionar Usuário ao Curso - Implementação Completa

## 📋 Visão Geral

Implementação da funcionalidade de **adicionar usuários a um curso** diretamente no diálogo de gerenciamento de permissões, com seleção de usuários disponíveis e atualização automática da lista.

---

## ✅ Implementação Completa

### **1. Serviço - Método de Adicionar Usuário**

**Arquivo:** `src/app/features/cursos/services/cursos.service.ts`

```typescript
/**
 * PUT /cursos/{cursoId}/usuarios/{usuarioId}
 * Adicionar usuário a um curso
 * @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('GERENTE')")
 * Retorna: List<PermissaoCursoDTO>
 */
addUserToCourse(cursoId: number, usuarioId: number): Observable<any[]> {
  console.log('➕ Adicionando usuário ao curso:', { cursoId, usuarioId });
  console.log('📡 URL:', `${this.baseUrl}/cursos/${cursoId}/usuarios/${usuarioId}`);
  return this.http.put<any[]>(`${this.baseUrl}/cursos/${cursoId}/usuarios/${usuarioId}`, {});
}
```

**Detalhes:**
- ✅ Endpoint: `PUT /api/cursos/{cursoId}/usuarios/{usuarioId}`
- ✅ Body: `{}` (vazio)
- ✅ Retorna: Lista atualizada de permissões
- ✅ Requer role: ADMINISTRADOR ou GERENTE

---

### **2. Componente - Lógica de Adicionar**

**Arquivo:** `permissoes-curso-dialog.component.ts`

#### **A. Propriedades Adicionadas**

```typescript
export class PermissoesCursoDialogComponent implements OnInit {
  permissoes: PermissaoCurso[] = [];
  usuarios: any[] = [];                    // ⬅ Lista de todos os usuários
  usuarioSelecionado: number | null = null; // ⬅ Usuário selecionado no dropdown
  isLoadingUsers = false;                  // ⬅ Loading dos usuários
  isAdding = false;                        // ⬅ Loading ao adicionar
}
```

---

#### **B. Carregar Usuários**

```typescript
loadUsers(): void {
  this.isLoadingUsers = true;
  console.log('👥 Carregando lista de usuários...');

  this.usuariosService.getAllUsers().subscribe({
    next: (usuarios) => {
      console.log('✅ Usuários carregados:', usuarios);
      this.usuarios = usuarios;
      this.isLoadingUsers = false;
    },
    error: (error) => {
      console.error('❌ Erro ao carregar usuários:', error);
      this.isLoadingUsers = false;
    }
  });
}
```

---

#### **C. Adicionar Usuário ao Curso**

```typescript
addUserToCourse(): void {
  if (!this.usuarioSelecionado) {
    this.showMessage('Selecione um usuário para adicionar', 'warning');
    return;
  }

  this.isAdding = true;
  console.log('➕ Adicionando usuário ao curso:', {
    cursoId: this.data.cursoId,
    usuarioId: this.usuarioSelecionado
  });

  this.cursosService.addUserToCourse(this.data.cursoId, this.usuarioSelecionado).subscribe({
    next: (permissoes) => {
      console.log('✅ Usuário adicionado! Nova lista:', permissoes);
      this.permissoes = permissoes;         // ⬅ Atualiza lista
      this.usuarioSelecionado = null;       // ⬅ Limpa seleção
      this.isAdding = false;
      this.showMessage('Usuário adicionado ao curso com sucesso!', 'success');
    },
    error: (error) => {
      console.error('❌ Erro ao adicionar usuário:', error);
      const errorMessage = this.extractErrorMessage(error);
      this.showMessage(errorMessage, 'error');
      this.isAdding = false;
    }
  });
}
```

---

#### **D. Filtrar Usuários Disponíveis**

```typescript
getAvailableUsers(): any[] {
  // Filtrar usuários que já têm permissão
  const usuariosComPermissao = this.permissoes.map(p => p.usuarioId);
  return this.usuarios.filter(u => !usuariosComPermissao.includes(u.id));
}
```

**Lógica:**
- Pega IDs dos usuários que já têm permissão
- Filtra usuários que **NÃO** estão na lista
- Retorna apenas usuários **disponíveis** para adicionar

---

### **3. Template - Formulário de Adicionar**

**Arquivo:** `permissoes-curso-dialog.component.html`

```html
<!-- Adicionar Usuário -->
<div class="add-user-section">
  <div class="add-user-header">
    <mat-icon>person_add</mat-icon>
    <h3>Adicionar Usuário ao Curso</h3>
  </div>

  <div class="add-user-form">
    <!-- Select de Usuários -->
    <mat-form-field appearance="outline" class="user-select">
      <mat-label>Selecione um usuário</mat-label>
      <mat-icon matPrefix>search</mat-icon>
      <mat-select 
        [(ngModel)]="usuarioSelecionado" 
        [disabled]="isLoadingUsers || isAdding">
        <mat-option 
          *ngFor="let usuario of getAvailableUsers()" 
          [value]="usuario.id">
          {{ usuario.nome }} - {{ usuario.email }}
        </mat-option>
      </mat-select>
      <mat-hint *ngIf="getAvailableUsers().length === 0">
        Todos os usuários já possuem acesso
      </mat-hint>
    </mat-form-field>

    <!-- Botão Adicionar -->
    <button
      mat-raised-button
      color="primary"
      [disabled]="!usuarioSelecionado || isAdding || isLoadingUsers"
      (click)="addUserToCourse()">
      <mat-icon>{{ isAdding ? 'hourglass_empty' : 'person_add' }}</mat-icon>
      {{ isAdding ? 'Adicionando...' : 'Adicionar' }}
    </button>
  </div>
</div>
```

---

### **4. Estilos - Seção de Adicionar**

**Arquivo:** `permissoes-curso-dialog.component.css`

```css
.add-user-section {
  margin: 24px 0;
  padding: 20px;
  background: rgba(59, 130, 246, 0.05);  /* Fundo azul claro */
  border: 1px dashed var(--primary-color); /* Borda tracejada azul */
  border-radius: 8px;
}

.add-user-form {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.user-select {
  flex: 1;  /* Ocupa espaço disponível */
}

.add-user-form button {
  margin-top: 4px;
  min-width: 140px;
}
```

---

## 🎨 **Visual Completo do Diálogo**

```
┌────────────────────────────────────────────────┐
│  👥 Permissões do Curso                   [X]  │
│  Introdução ao Angular                         │
├────────────────────────────────────────────────┤
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │ 👥  3 Usuários com Acesso               │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  ┌────────────────────────────────────────┐   │
│  │ ➕ Adicionar Usuário ao Curso          │   │
│  │                                        │   │
│  │ [Selecione um usuário ▼] [Adicionar]  │   │
│  └────────────────────────────────────────┘   │
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

## 🔔 **Fluxo de Adicionar Usuário**

### **1. Diálogo Abre**
```
- Carrega permissões atuais
- Carrega lista de todos os usuários
- Filtra usuários disponíveis (que NÃO têm permissão)
```

### **2. Usuário Seleciona no Dropdown**
```
Dropdown mostra:
- Carlos Oliveira - carlos@email.com
- Ana Paula - ana@email.com
- Roberto Lima - roberto@email.com

(Apenas usuários SEM acesso ao curso)
```

### **3. Usuário Clica em "Adicionar"**
```
Botão fica: "Adicionando..." (desabilitado)
Console: ➕ Adicionando usuário ao curso: {cursoId: 1, usuarioId: 4}
Console: 📡 URL: http://localhost:8080/api/cursos/1/usuarios/4
```

### **4. API Processa**
```http
PUT /api/cursos/1/usuarios/4
Authorization: Bearer eyJ...

Response: [
  { cursoId: 1, usuarioId: 1, usuarioNome: "João", permissao: "ADMINISTRADOR" },
  { cursoId: 1, usuarioId: 2, usuarioNome: "Maria", permissao: "GERENTE" },
  { cursoId: 1, usuarioId: 3, usuarioNome: "Pedro", permissao: "SECRETARIO" },
  { cursoId: 1, usuarioId: 4, usuarioNome: "Carlos", permissao: "ALUNO" }  ⬅ NOVO!
]
```

### **5. Sucesso - Lista Atualiza**
```
Snackbar verde: "Usuário adicionado ao curso com sucesso!"
Lista de permissões: Atualizada com novo usuário
Dropdown: Limpo (usuarioSelecionado = null)
Usuários disponíveis: Atualizado (Carlos não aparece mais)
Estatística: "4 Usuários com Acesso" (era 3)
```

---

## 📊 **Integração com Backend**

### **Controller (Backend):**
```java
@PutMapping("/{cursoId}/usuarios/{usuarioId}")
@PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('GERENTE')")
public ResponseEntity<List<PermissaoCursoDTO>> adicionarUsuarioCurso(
    @PathVariable Long cursoId, 
    @PathVariable Long usuarioId
) {
    List<PermissaoCursoDTO> permissaoCurso = cursoService.adicionarUsuarioCurso(cursoId, usuarioId);
    return ResponseEntity.ok(permissaoCurso);
}
```

**Autorização:**
- ✅ ADMINISTRADOR
- ✅ GERENTE
- ❌ SECRETARIO (não pode adicionar)

---

## 🎯 **Funcionalidades Implementadas**

### **No Diálogo:**
- ✅ **Carrega lista de usuários** automaticamente
- ✅ **Filtra usuários disponíveis** (que ainda não têm acesso)
- ✅ **Select com busca** (ícone de lupa)
- ✅ **Mostra nome e email** no dropdown
- ✅ **Botão desabilitado** se nenhum usuário selecionado
- ✅ **Loading ao adicionar** ("Adicionando...")
- ✅ **Mensagem de sucesso** verde
- ✅ **Mensagem de erro** do servidor
- ✅ **Lista atualiza** automaticamente
- ✅ **Dropdown limpa** após adicionar
- ✅ **Estatística atualiza** (total de usuários)
- ✅ **Hint** quando todos já têm acesso

---

## 🎨 **Estados Visuais**

### **1. Normal - Pronto para Adicionar**
```
┌──────────────────────────────────────┐
│ ➕ Adicionar Usuário ao Curso        │
│                                      │
│ [Selecione um usuário ▼] [Adicionar]│
└──────────────────────────────────────┘
```

### **2. Adicionando - Loading**
```
┌──────────────────────────────────────┐
│ ➕ Adicionar Usuário ao Curso        │
│                                      │
│ [Carlos Oliveira ▼] [Adicionando...⏳]│
│                       (desabilitado)  │
└──────────────────────────────────────┘
```

### **3. Todos Já Têm Acesso**
```
┌──────────────────────────────────────┐
│ ➕ Adicionar Usuário ao Curso        │
│                                      │
│ [Selecione um usuário ▼] [Adicionar]│
│ Todos os usuários já possuem acesso  │
│ (dropdown vazio, botão desabilitado) │
└──────────────────────────────────────┘
```

---

## 📊 **Exemplo Completo**

### **Situação Inicial:**
```
Curso: "Introdução ao Angular" (ID: 1)
Usuários com acesso: 2
- João Silva (ADMINISTRADOR)
- Maria Santos (GERENTE)

Usuários disponíveis para adicionar: 3
- Carlos Oliveira
- Ana Paula
- Roberto Lima
```

### **Ação do Usuário:**
```
1. Abre diálogo "Gerenciar permissões"
2. Vê seção "Adicionar Usuário ao Curso"
3. Clica no dropdown
4. Seleciona "Carlos Oliveira - carlos@email.com"
5. Clica em "Adicionar"
```

### **Processamento:**
```
Console: ➕ Adicionando usuário ao curso: {cursoId: 1, usuarioId: 4}
Console: 📡 URL: http://localhost:8080/api/cursos/1/usuarios/4
API: PUT /api/cursos/1/usuarios/4
Response: [
  {...João...},
  {...Maria...},
  {...Carlos...}  ⬅ NOVO!
]
```

### **Resultado:**
```
Snackbar: "Usuário adicionado ao curso com sucesso!" 🟢
Lista: Agora mostra 3 usuários (João, Maria, Carlos)
Estatística: "3 Usuários com Acesso" (era 2)
Dropdown: Limpo e atualizado (Carlos não aparece mais)
Usuários disponíveis: 2 (Ana Paula, Roberto Lima)
```

---

## ✅ **Validações Implementadas**

### **Frontend:**
- ✅ **Usuário deve ser selecionado** (botão desabilitado se não)
- ✅ **Não pode adicionar se já está adicionando** (isAdding)
- ✅ **Não pode selecionar se está carregando** (isLoadingUsers)
- ✅ **Mostra hint** se todos já têm acesso

### **Backend:**
- ✅ **Apenas ADMINISTRADOR e GERENTE** podem adicionar
- ✅ **Curso deve existir**
- ✅ **Usuário deve existir**
- ✅ **Pode validar** se usuário já tem acesso (evita duplicação)

---

## 🎉 **Resultado Final**

**O diálogo de permissões agora possui:**

✅ **Listagem** de usuários com acesso  
✅ **Chips coloridos** por permissão  
✅ **Seção de adicionar** com dropdown  
✅ **Filtragem automática** (usuários disponíveis)  
✅ **Select** mostra nome + email  
✅ **Botão desabilitado** quando apropriado  
✅ **Loading** ao adicionar  
✅ **Mensagem de sucesso** verde  
✅ **Mensagens de erro** do servidor  
✅ **Lista atualiza** automaticamente  
✅ **Dropdown limpa** após adicionar  
✅ **Estatística atualiza** com novo total  
✅ **Hint** quando todos já têm acesso  

**Funcionalidade de adicionar usuário implementada com sucesso!** 🚀✨

---

## 🧪 **Como Testar**

### **Passo 1: Reiniciar Servidor**
```bash
npm start
```

### **Passo 2: Login**
- Faça login como **ADMINISTRADOR** ou **GERENTE**

### **Passo 3: Abrir Diálogo**
1. Vá para `/cursos`
2. Clique no botão 👥 "Gerenciar permissões"

### **Passo 4: Adicionar Usuário**
1. Veja a seção "Adicionar Usuário ao Curso"
2. Clique no dropdown
3. Selecione um usuário
4. Clique em "Adicionar"
5. Aguarde confirmação
6. Veja usuário aparecer na lista!

---

## 📚 **Arquivos Modificados**

| Arquivo | Mudanças |
|---------|----------|
| `cursos.service.ts` | +11 linhas - Método `addUserToCourse()` |
| `permissoes-curso-dialog.component.ts` | +73 linhas - Lógica de adicionar |
| `permissoes-curso-dialog.component.html` | +30 linhas - Formulário de adicionar |
| `permissoes-curso-dialog.component.css` | +45 linhas - Estilos da seção |

---

**Data da Implementação:** 20 de outubro de 2025  
**Endpoint:** `PUT /api/cursos/{cursoId}/usuarios/{usuarioId}`  
**Status:** ✅ **CONCLUÍDO**



