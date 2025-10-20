# ✅ Atualização das Roles de Usuários

## 🎯 Correção Aplicada

Atualização das roles de usuários para corresponder exatamente ao backend.

---

## 🔄 O Que Mudou?

### **Roles ANTES** ❌ (Incorretas)

```typescript
ADMINISTRADOR = 'ADMINISTRADOR'
PROFESSOR = 'PROFESSOR'
ALUNO = 'ALUNO'
```

### **Roles DEPOIS** ✅ (Corretas)

```typescript
ROLE_ADMINISTRADOR = 'ROLE_ADMINISTRADOR'  // ID: 1
ROLE_GERENTE = 'ROLE_GERENTE'              // ID: 2
ROLE_SECRETARIO = 'ROLE_SECRETARIO'        // ID: 3
```

---

## 📊 Nova Estrutura de Roles

### **Tabela de Roles do Backend**

| ID | Role | Label | Ícone | Cor |
|----|------|-------|-------|-----|
| 1 | `ROLE_ADMINISTRADOR` | Administrador | `admin_panel_settings` | 🔴 Vermelho (warn) |
| 2 | `ROLE_GERENTE` | Gerente | `manage_accounts` | 🟣 Azul Violeta (primary) |
| 3 | `ROLE_SECRETARIO` | Secretário(a) | `assignment_ind` | 🔵 Azul Ciano (accent) |

---

## 📁 Arquivos Modificados

### **1. Models** (1 arquivo)

```typescript
// src/app/features/usuarios/models/usuario.model.ts

// ANTES
export enum UserRole {
  ADMINISTRADOR = 'ADMINISTRADOR',
  PROFESSOR = 'PROFESSOR',
  ALUNO = 'ALUNO'
}

// DEPOIS
export enum UserRole {
  ADMINISTRADOR = 'ROLE_ADMINISTRADOR',
  GERENTE = 'ROLE_GERENTE',
  SECRETARIO = 'ROLE_SECRETARIO'
}
```

---

### **2. Formulário de Usuário** (2 arquivos)

```typescript
// form-usuario.component.ts

// ANTES
roles = [
  { value: 'ADMINISTRADOR', label: 'Administrador', icon: 'admin_panel_settings' },
  { value: 'PROFESSOR', label: 'Professor', icon: 'school' },
  { value: 'ALUNO', label: 'Aluno', icon: 'person' }
];

// DEPOIS
roles = [
  { value: 'ROLE_ADMINISTRADOR', label: 'Administrador', icon: 'admin_panel_settings' },
  { value: 'ROLE_GERENTE', label: 'Gerente', icon: 'manage_accounts' },
  { value: 'ROLE_SECRETARIO', label: 'Secretário(a)', icon: 'assignment_ind' }
];

// Role padrão
// ANTES: 'ALUNO'
// DEPOIS: 'ROLE_SECRETARIO'
```

---

### **3. Listagem de Usuários** (1 arquivo)

```typescript
// lista-usuarios.component.ts

// Métodos getRoleColor() e getRoleIcon() atualizados
getRoleColor(role: string): string {
  const roleUpper = role.toUpperCase();
  if (roleUpper.includes('ADMINISTRADOR')) return 'warn';
  if (roleUpper.includes('GERENTE')) return 'primary';
  if (roleUpper.includes('SECRETARIO')) return 'accent';
  return '';
}
```

---

### **4. Testes Unitários** (2 arquivos)

- `form-usuario.component.spec.ts` - Roles atualizadas
- `cursos-usuario-dialog.component.spec.ts` - Role de teste atualizada

---

## 🎨 Visualização das Novas Roles

### **Dropdown de Seleção** (Formulário)

```
┌─────────────────────────────┐
│ 💼 Função                   │
│ ┌─────────────────────────┐ │
│ │ Selecione a função ▼    │ │
│ └─────────────────────────┘ │
│                              │
│ Opções:                      │
│ ┌─────────────────────────┐ │
│ │ 🛡️ Administrador        │ │
│ │ 👔 Gerente              │ │
│ │ 📋 Secretário(a)        │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

### **Chips na Tabela** (Listagem)

```
┌────────────────────────────────────┐
│ Função                              │
├────────────────────────────────────┤
│ [🔴 🛡️ ROLE_ADMINISTRADOR]        │
│ [🟣 👔 ROLE_GERENTE]               │
│ [🔵 📋 ROLE_SECRETARIO]            │
└────────────────────────────────────┘
```

---

## 🎨 Cores e Ícones das Roles

### **1. ROLE_ADMINISTRADOR**
```
Cor: 🔴 Vermelho (#EF4444)
Tipo Material: warn
Ícone: admin_panel_settings
Label: "Administrador"
```

### **2. ROLE_GERENTE**
```
Cor: 🟣 Azul Violeta (#5B5BEA)
Tipo Material: primary
Ícone: manage_accounts
Label: "Gerente"
```

### **3. ROLE_SECRETARIO**
```
Cor: 🔵 Azul Ciano (#38BDF8)
Tipo Material: accent
Ícone: assignment_ind
Label: "Secretário(a)"
```

---

## 🔌 Payload Correto para API

### **POST /api/usuarios** (Criar)

```json
{
  "id": 0,
  "nome": "Maria Santos",
  "cpf": "987.654.321-00",
  "email": "maria@example.com",
  "senha": "senha123",
  "role": "ROLE_GERENTE",        // ✅ Formato correto
  "cursos": []
}
```

### **PUT /api/usuarios/{usuarioId}** (Atualizar)

```json
{
  "id": 5,
  "nome": "João Silva",
  "cpf": "123.456.789-00",
  "email": "joao@example.com",
  "senha": "novaSenha",
  "role": "ROLE_ADMINISTRADOR",   // ✅ Formato correto
  "cursos": [
    {
      "id": 1,
      "nome": "Angular Avançado",
      "ativo": true
    }
  ]
}
```

---

## 🛡️ Impacto na Segurança

### **AdminGuard Atualizado**

```typescript
// Já funciona com as novas roles
hasRole('ADMINISTRADOR'): boolean {
  const authorities = this.authoritiesSubject.value;
  return authorities.includes('ROLE_ADMINISTRADOR') || 
         authorities.includes('ADMINISTRADOR');
}
```

**Como funciona:**
- Backend retorna: `['ROLE_ADMINISTRADOR']`
- Guard verifica: `hasRole('ADMINISTRADOR')` ou `hasRole('ROLE_ADMINISTRADOR')`
- ✅ Ambos funcionam (flexível)

---

## 📊 Comparação Visual

### **Dropdown de Roles**

**ANTES** ❌
```
┌─────────────────┐
│ Administrador   │
│ Professor       │ ← Removido
│ Aluno          │ ← Removido
└─────────────────┘
```

**DEPOIS** ✅
```
┌─────────────────┐
│ Administrador   │
│ Gerente        │ ← Adicionado
│ Secretário(a)  │ ← Adicionado
└─────────────────┘
```

---

### **Chips na Listagem**

**ANTES** ❌
```
🔴 ADMINISTRADOR
🔵 PROFESSOR
⚫ ALUNO
```

**DEPOIS** ✅
```
🔴 ROLE_ADMINISTRADOR
🟣 ROLE_GERENTE
🔵 ROLE_SECRETARIO
```

---

## ✅ Checklist de Mudanças

### Enum e Constantes
- [x] ✅ UserRole enum atualizado
- [x] ✅ Array de roles no formulário atualizado
- [x] ✅ Role padrão alterada (ALUNO → ROLE_SECRETARIO)

### Métodos
- [x] ✅ getRoleColor() atualizado (3 roles)
- [x] ✅ getRoleIcon() atualizado (3 roles)
- [x] ✅ Usa .includes() para flexibilidade

### Componentes
- [x] ✅ Formulário de usuário
- [x] ✅ Listagem de usuários
- [x] ✅ Diálogo de cursos (testes)

### Testes
- [x] ✅ form-usuario.component.spec.ts
- [x] ✅ cursos-usuario-dialog.component.spec.ts
- [x] ✅ Todos passando

### Compatibilidade
- [x] ✅ Payload POST correto
- [x] ✅ Payload PUT correto
- [x] ✅ Guards funcionam
- [x] ✅ Backend @PreAuthorize compatível

---

## 🧪 Como Testar

### **Teste 1: Criar Usuário com Nova Role**

```bash
# 1. Acessar /usuarios/novo
# 2. Preencher:
   - Nome: "Carlos Gerente"
   - Email: "carlos@test.com"
   - CPF: 111.222.333-44
   - Senha: senha123
   - Role: "Gerente"  ← Nova role

# 3. DevTools → Network → POST /api/usuarios
# 4. Verificar Request Body:
{
  "id": 0,
  "nome": "Carlos Gerente",
  "cpf": "111.222.333-44",
  "email": "carlos@test.com",
  "senha": "senha123",
  "role": "ROLE_GERENTE",  // ✅ Formato correto
  "cursos": []
}

# 5. Verificar:
✅ Usuário criado
✅ Chip aparece com cor azul violeta (primary)
✅ Ícone manage_accounts
```

---

### **Teste 2: Dropdown de Roles**

```bash
# 1. Abrir formulário de usuário
# 2. Clicar no dropdown "Função"
# 3. Verificar opções:
✅ 🛡️ Administrador
✅ 👔 Gerente
✅ 📋 Secretário(a)

# 4. Selecionar cada uma
✅ Preview atualiza com chip correto
✅ Cor correta aparece
✅ Ícone correto aparece
```

---

### **Teste 3: Editar e Manter Role**

```bash
# 1. Editar usuário ROLE_GERENTE
# 2. Modificar apenas nome
# 3. Verificar que role permanece ROLE_GERENTE
# 4. Salvar

# 5. DevTools → Network → PUT
{
  "id": 5,
  "role": "ROLE_GERENTE",  // ✅ Mantido
  ...
}
```

---

### **Teste 4: Visualização na Tabela**

```bash
# 1. Acessar /usuarios
# 2. Verificar chips de role:

✅ ROLE_ADMINISTRADOR:
   - Cor: Vermelho
   - Ícone: admin_panel_settings

✅ ROLE_GERENTE:
   - Cor: Azul Violeta (primary)
   - Ícone: manage_accounts

✅ ROLE_SECRETARIO:
   - Cor: Azul Ciano (accent)
   - Ícone: assignment_ind
```

---

## 📊 Mapeamento Completo

### **Role → Cor → Ícone**

| Role | Material Color | Hex | Ícone |
|------|---------------|-----|-------|
| ROLE_ADMINISTRADOR | `warn` | #EF4444 | `admin_panel_settings` |
| ROLE_GERENTE | `primary` | #5B5BEA | `manage_accounts` |
| ROLE_SECRETARIO | `accent` | #38BDF8 | `assignment_ind` |

---

## 🎯 Exemplo de Payload Completo

### **Criar Usuário Gerente**

```json
{
  "id": 0,
  "nome": "Carlos Gerente Silva",
  "cpf": "111.222.333-44",
  "email": "carlos.gerente@empresa.com",
  "senha": "senhaSegura123",
  "role": "ROLE_GERENTE",
  "cursos": []
}
```

### **Criar Usuário Secretário**

```json
{
  "id": 0,
  "nome": "Ana Secretária Santos",
  "cpf": "555.666.777-88",
  "email": "ana.secretaria@empresa.com",
  "senha": "senhaSegura456",
  "role": "ROLE_SECRETARIO",
  "cursos": []
}
```

### **Editar Usuário Administrador**

```json
{
  "id": 1,
  "nome": "João Administrador",
  "cpf": "123.456.789-00",
  "email": "joao.admin@empresa.com",
  "senha": "novaSenha789",
  "role": "ROLE_ADMINISTRADOR",
  "cursos": [
    {
      "id": 1,
      "nome": "Gestão Avançada",
      "ativo": true
    }
  ]
}
```

---

## ✅ Checklist de Atualização

### Código
- [x] ✅ Enum UserRole atualizado
- [x] ✅ Array de roles atualizado (3 opções)
- [x] ✅ Role padrão: ROLE_SECRETARIO
- [x] ✅ getRoleColor() atualizado
- [x] ✅ getRoleIcon() atualizado
- [x] ✅ Labels descritivos

### Componentes Atualizados
- [x] ✅ form-usuario.component.ts
- [x] ✅ lista-usuarios.component.ts

### Testes
- [x] ✅ form-usuario.component.spec.ts
- [x] ✅ cursos-usuario-dialog.component.spec.ts
- [x] ✅ Todos passando

### Validação
- [x] ✅ Payload POST correto
- [x] ✅ Payload PUT correto
- [x] ✅ Dropdown mostra 3 roles
- [x] ✅ Chips coloridos corretamente
- [x] ✅ Ícones apropriados

---

## 🎨 Visual Atualizado

### **Formulário**

```
┌────────────────────────────────────┐
│ 💼 Função                          │
│ ┌────────────────────────────────┐ │
│ │ Secretário(a) ▼                │ │ ← Padrão
│ └────────────────────────────────┘ │
│                                     │
│ Opções:                            │
│ ┌────────────────────────────────┐ │
│ │ 🛡️ Administrador               │ │
│ │ 👔 Gerente                     │ │
│ │ 📋 Secretário(a)               │ │
│ └────────────────────────────────┘ │
└────────────────────────────────────┘

Preview:
[🔴 ROLE_ADMINISTRADOR]
[🟣 ROLE_GERENTE]
[🔵 ROLE_SECRETARIO]
```

---

### **Listagem**

```
┌─────────────────────────────────────────┐
│ ID │ Nome  │ Email │ Função            │
├─────────────────────────────────────────┤
│ 1  │ João  │ ...   │🔴 ROLE_ADMIN...  │
│ 2  │ Maria │ ...   │🟣 ROLE_GERENTE   │
│ 3  │ Ana   │ ...   │🔵 ROLE_SECRET... │
└─────────────────────────────────────────┘
```

---

## 🔍 Diferenças Importantes

### **1. Prefixo ROLE_**

```
ANTES: 'ADMINISTRADOR'
DEPOIS: 'ROLE_ADMINISTRADOR'
```

**Por quê?**
- Backend usa prefixo `ROLE_`
- Spring Security padrão
- Consistência com banco de dados

---

### **2. Mudança de Roles**

```
ANTES:
- ADMINISTRADOR
- PROFESSOR  ← Removido
- ALUNO      ← Removido

DEPOIS:
- ROLE_ADMINISTRADOR
- ROLE_GERENTE      ← Novo
- ROLE_SECRETARIO   ← Novo
```

**Por quê?**
- Reflete estrutura real do backend
- Adequado ao contexto da aplicação
- IDs 1, 2, 3 do banco

---

### **3. Ícones Atualizados**

| Role | Ícone Antes | Ícone Depois |
|------|-------------|--------------|
| ADMINISTRADOR | `admin_panel_settings` | `admin_panel_settings` ✅ |
| ~PROFESSOR~ | `school` | - |
| ~ALUNO~ | `person` | - |
| GERENTE | - | `manage_accounts` ✨ |
| SECRETARIO | - | `assignment_ind` ✨ |

---

## 🧪 Exemplo de Teste Completo

```bash
# 1. Criar Usuário Gerente
POST /api/usuarios
{
  "id": 0,
  "nome": "Carlos Silva",
  "cpf": "111.222.333-44",
  "email": "carlos@test.com",
  "senha": "senha123",
  "role": "ROLE_GERENTE",
  "cursos": []
}

Response 200:
{
  "id": 10,
  "nome": "Carlos Silva",
  "cpf": "111.222.333-44",
  "email": "carlos@test.com",
  "role": "ROLE_GERENTE",
  "cursos": []
}

# 2. Verificar na listagem
✅ Chip azul violeta (primary)
✅ Ícone manage_accounts
✅ Texto "ROLE_GERENTE"

# 3. Editar usuário
✅ Dropdown mostra "Gerente" selecionado
✅ Preview mostra chip correto
```

---

## 🎉 Resultado Final

Formulário e listagem **100% compatíveis** com o backend!

### ⭐ Principais Mudanças:

- ✅ **Roles Corretas** - ROLE_ADMINISTRADOR, ROLE_GERENTE, ROLE_SECRETARIO
- ✅ **Prefixo ROLE_** - Conforme backend
- ✅ **Ícones Apropriados** - manage_accounts, assignment_ind
- ✅ **Cores Corretas** - Vermelho, Azul Violeta, Azul Ciano
- ✅ **Payload Completo** - Todos campos necessários
- ✅ **Testes Atualizados** - Todas roles corretas
- ✅ **Labels Descritivos** - Gerente, Secretário(a)

---

## 📖 Documentação

- 📄 **`ATUALIZACAO_ROLES_USUARIOS.md`** - Este documento
- 📄 **`CORRECOES_FORM_USUARIO.md`** - Correções do formulário
- 📄 **`IMPLEMENTACAO_USUARIOS_COMPLETA.md`** - Guia geral

---

**Data da Atualização:** 19/10/2025  
**Status:** ✅ Corrigido  
**Roles:** ROLE_ADMINISTRADOR, ROLE_GERENTE, ROLE_SECRETARIO  
**Linting:** 0 erros  
**Compatibilidade Backend:** 100% ✅

