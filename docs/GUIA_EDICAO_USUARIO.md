# ✅ Guia de Edição de Usuário

## 🎯 Endpoint e Payload Correto

### **PUT /api/usuarios/{usuarioId}**

---

## ✅ Payload Correto para Edição

```json
{
  "nome": "João da Mata Atualizado",
  "cpf": "682.414.372.34",
  "email": "jlfilho.novo@uea.edu.br",
  "senha": "novaSenha123",         // Opcional
  "role": "ROLE_ADMINISTRADOR",
  "cursos": [
    { "id": 1 },                   // Apenas id
    { "id": 2 }
  ]
}
```

**IMPORTANTE:** O campo `id` do usuário **NÃO** vai no body, vai apenas na **URL**!

---

## 📊 Estrutura Correta

### **URL:**
```
PUT http://localhost:8080/api/usuarios/5
                                        ↑
                                        ID aqui
```

### **Body:**
```json
{
  // ✅ SEM campo "id" aqui
  "nome": "string",
  "cpf": "string",
  "email": "string",
  "senha": "string",      // Opcional
  "role": "string",
  "cursos": [
    { "id": 1 },          // Apenas id
    { "id": 2 }
  ]
}
```

---

## 🔄 Implementação Atual

### **Código do Componente**

```typescript
// MODO EDIÇÃO
if (this.isEditMode && this.usuarioOriginal) {
  usuarioData = {
    nome: formValues.nome.trim(),
    cpf: formValues.cpf.trim(),
    email: formValues.email.trim(),
    role: formValues.role,
    cursos: (this.usuarioOriginal.cursos || []).map(curso => ({ id: curso.id }))
    // ✅ Transforma: { id: 1, nome: "X", ativo: true } → { id: 1 }
  };

  // Senha opcional
  if (formValues.senha && formValues.senha.trim() !== '') {
    usuarioData.senha = formValues.senha.trim();
  }
}

// Chamada ao service
this.usuariosService.updateUser(this.usuarioId, usuarioData);
```

---

## 📝 Exemplos Práticos

### **Exemplo 1: Editar Nome e Email (Sem Alterar Senha)**

**Request:**
```
PUT http://localhost:8080/api/usuarios/5
```

**Body:**
```json
{
  "nome": "João da Mata Silva",
  "cpf": "682.414.372.34",
  "email": "joao.novo@uea.edu.br",
  "role": "ROLE_ADMINISTRADOR",
  "cursos": [
    { "id": 1 },
    { "id": 3 }
  ]
}
```

**Resultado:**
- ✅ Nome e email atualizados
- ✅ Senha mantida (não enviada)
- ✅ Cursos preservados

---

### **Exemplo 2: Editar e Alterar Senha**

**Request:**
```
PUT http://localhost:8080/api/usuarios/10
```

**Body:**
```json
{
  "nome": "Maria Gerente Santos",
  "cpf": "123.456.789-00",
  "email": "maria@empresa.com",
  "senha": "novaSenhaSegura123",
  "role": "ROLE_GERENTE",
  "cursos": []
}
```

**Resultado:**
- ✅ Todos os dados atualizados
- ✅ Senha alterada
- ✅ Cursos vazios (removidos)

---

### **Exemplo 3: Alterar Role e Manter Cursos**

**Request:**
```
PUT http://localhost:8080/api/usuarios/7
```

**Body:**
```json
{
  "nome": "Carlos Lima",
  "cpf": "999.888.777-66",
  "email": "carlos@empresa.com",
  "role": "ROLE_ADMINISTRADOR",
  "cursos": [
    { "id": 2 },
    { "id": 5 },
    { "id": 8 }
  ]
}
```

**Resultado:**
- ✅ Role alterada de SECRETARIO → ADMINISTRADOR
- ✅ Cursos preservados (3 cursos)
- ✅ Senha mantida (não enviada)

---

## 🔍 Detalhes Importantes

### **1. ID do Usuário**

```
❌ INCORRETO:
Body: { "id": 5, "nome": "João", ... }

✅ CORRETO:
URL: PUT /api/usuarios/5
Body: { "nome": "João", ... }
```

### **2. Senha Opcional**

```typescript
// Se senha está vazia
if (!formValues.senha || formValues.senha.trim() === '') {
  // ✅ NÃO adiciona campo senha ao payload
  usuarioData = { nome, cpf, email, role, cursos };
}

// Se senha foi preenchida
if (formValues.senha && formValues.senha.trim() !== '') {
  // ✅ Adiciona senha ao payload
  usuarioData.senha = formValues.senha.trim();
}
```

**Resultado:**
- Senha vazia → Backend mantém senha atual
- Senha preenchida → Backend atualiza senha

### **3. Cursos Simplificados**

```typescript
// Cursos originais (do backend)
cursos: [
  { id: 1, nome: "Angular Avançado", ativo: true },
  { id: 2, nome: "TypeScript Essencial", ativo: true }
]

// Transformação aplicada
cursos: (this.usuarioOriginal.cursos || []).map(curso => ({ id: curso.id }))

// Cursos enviados (simplificados)
cursos: [
  { id: 1 },
  { id: 2 }
]
```

---

## 🧪 Teste de Edição Completo

### **Passo a Passo**

```bash
# 1. Acessar listagem de usuários
http://localhost:4200/usuarios

# 2. Clicar no botão ✏️ (editar) de um usuário

# 3. Formulário carrega com dados preenchidos:
Nome: "João Silva"                 ✅ Preenchido
Email: "joao@test.com"             ✅ Preenchido
CPF: "123.456.789-00"              ✅ Preenchido
Senha: ""                          ✅ Vazio (opcional)
Role: "ROLE_GERENTE"               ✅ Preenchido

# 4. Modificar campos:
Nome: "João Silva Santos"          ← Alterado
Email: "joao.novo@test.com"        ← Alterado
Senha: [deixar vazio]              ← Não alterar senha

# 5. Abrir Console (F12)

# 6. Clicar em "Atualizar"

# 7. Verificar Console:
=== PAYLOAD ENVIADO ===
Modo: EDIÇÃO
Endpoint: PUT /api/usuarios/5
Payload: {
  "nome": "João Silva Santos",
  "cpf": "123.456.789-00",
  "email": "joao.novo@test.com",
  "role": "ROLE_GERENTE",
  "cursos": [
    { "id": 1 },
    { "id": 3 }
  ]
}

# 8. Verificar Network Tab:
Request URL: http://localhost:8080/api/usuarios/5
Request Method: PUT
Request Payload: { nome, cpf, email, role, cursos }
                 (SEM id, SEM senha)

# 9. Response esperado (200 OK):
{
  "id": 5,
  "nome": "João Silva Santos",
  "cpf": "123.456.789-00",
  "email": "joao.novo@test.com",
  "senha": "******",
  "role": "ROLE_GERENTE",
  "cursos": [
    { "id": 1, "nome": "Angular", "ativo": true },
    { "id": 3, "nome": "React", "ativo": true }
  ]
}

# 10. Frontend:
✅ Notificação verde: "Usuário atualizado com sucesso!"
✅ Redireciona para /usuarios
✅ Mudanças aparecem na tabela
```

---

## 🔄 Cenários de Edição

### **Cenário 1: Editar Apenas Nome**

```
Frontend Envia:
PUT /api/usuarios/5
{
  "nome": "João Silva ATUALIZADO",
  "cpf": "123.456.789-00",       // Mantido
  "email": "joao@test.com",      // Mantido
  "role": "ROLE_GERENTE",        // Mantido
  "cursos": [{ "id": 1 }]        // Mantido
}

Backend Atualiza:
✅ Nome → "João Silva ATUALIZADO"
✅ Demais campos mantidos
```

---

### **Cenário 2: Editar e Alterar Senha**

```
Frontend Envia:
PUT /api/usuarios/10
{
  "nome": "Maria Santos",
  "cpf": "987.654.321-00",
  "email": "maria@test.com",
  "senha": "novaSenha456",       // ✅ Incluída
  "role": "ROLE_SECRETARIO",
  "cursos": []
}

Backend Atualiza:
✅ Todos os campos
✅ Senha atualizada
```

---

### **Cenário 3: Editar Sem Alterar Senha**

```
Frontend Envia:
PUT /api/usuarios/7
{
  "nome": "Carlos Lima",
  "cpf": "111.222.333-44",
  "email": "carlos@empresa.com",
  "role": "ROLE_ADMINISTRADOR",
  "cursos": [{ "id": 2 }, { "id": 4 }]
}
// ✅ SEM campo senha

Backend Atualiza:
✅ Nome, CPF, Email, Role, Cursos
✅ Senha MANTIDA (não alterada)
```

---

## ⚠️ Pontos Críticos

### **1. ID vai na URL, não no Body**

```
❌ INCORRETO:
PUT /api/usuarios/5
Body: { "id": 5, "nome": "João", ... }

✅ CORRETO:
PUT /api/usuarios/5
Body: { "nome": "João", ... }
```

### **2. Cursos: Apenas IDs**

```
❌ INCORRETO:
"cursos": [
  { "id": 1, "nome": "Angular", "ativo": true }
]

✅ CORRETO:
"cursos": [
  { "id": 1 }
]
```

### **3. Senha Opcional**

```typescript
// ✅ Senha vazia → NÃO envia campo senha
usuarioData = { nome, cpf, email, role, cursos };

// ✅ Senha preenchida → Envia campo senha
usuarioData = { nome, cpf, email, senha, role, cursos };
```

---

## 🧪 Teste de Edição

### **Teste 1: Editar Sem Senha**

```bash
# 1. Listar usuários → Clicar ✏️ no usuário ID 5
# 2. Modificar nome: "João ATUALIZADO"
# 3. Deixar senha VAZIA
# 4. Clicar "Atualizar"

Console:
PUT /api/usuarios/5
{
  "nome": "João ATUALIZADO",
  "cpf": "123.456.789-00",
  "email": "joao@test.com",
  "role": "ROLE_GERENTE",
  "cursos": [{ "id": 1 }]
}
// ✅ SEM campo senha

Resultado:
✅ Nome atualizado
✅ Senha mantida
```

---

### **Teste 2: Editar Com Senha**

```bash
# 1. Editar usuário ID 10
# 2. Modificar email: "maria.novo@test.com"
# 3. Preencher senha: "novaSenha789"
# 4. Clicar "Atualizar"

Console:
PUT /api/usuarios/10
{
  "nome": "Maria Santos",
  "cpf": "987.654.321-00",
  "email": "maria.novo@test.com",
  "senha": "novaSenha789",      // ✅ Incluída
  "role": "ROLE_SECRETARIO",
  "cursos": []
}

Resultado:
✅ Email atualizado
✅ Senha atualizada
```

---

### **Teste 3: Alterar Role**

```bash
# 1. Editar usuário ID 7
# 2. Mudar role de SECRETARIO → ADMINISTRADOR
# 3. Clicar "Atualizar"

Console:
PUT /api/usuarios/7
{
  "nome": "Carlos Lima",
  "cpf": "111.222.333-44",
  "email": "carlos@test.com",
  "role": "ROLE_ADMINISTRADOR",  // ✅ Alterada
  "cursos": [{ "id": 2 }]
}

Resultado:
✅ Role atualizada
✅ Chip na tabela muda de cor
```

---

## 🔍 Verificação no DevTools

### **Network Tab**

```
Request Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
Content-Type: application/json

Request URL:
http://localhost:8080/api/usuarios/5
                                   ↑
                                   ID aqui

Request Method:
PUT

Request Payload:
{
  "nome": "João Silva Santos",
  "cpf": "123.456.789-00",
  "email": "joao@test.com",
  "role": "ROLE_GERENTE",
  "cursos": [
    { "id": 1 }
  ]
}
// ✅ Sem campo "id" no body
// ✅ Cursos com apenas { id }
```

---

## 📊 Comparação Criação vs Edição

### **POST (Criar)** vs **PUT (Editar)**

| Aspecto | POST /api/usuarios | PUT /api/usuarios/{id} |
|---------|-------------------|------------------------|
| **ID na URL** | ❌ Não | ✅ Sim |
| **ID no Body** | ❌ Não | ❌ Não |
| **Senha** | ✅ Obrigatória | ⚠️ Opcional |
| **Cursos** | `[]` vazio | Apenas `[{ id }]` |

### **Payloads Lado a Lado**

```json
// CRIAR (POST)
{
  "nome": "João",
  "cpf": "123...",
  "email": "joao@...",
  "senha": "senha123",      // Obrigatória
  "role": "ROLE_GERENTE",
  "cursos": []              // Vazio
}

// EDITAR (PUT /api/usuarios/5)
{
  "nome": "João Silva",
  "cpf": "123...",
  "email": "joao@...",
  "senha": "nova123",       // Opcional
  "role": "ROLE_ADMIN",
  "cursos": [               // Preservados
    { "id": 1 },
    { "id": 2 }
  ]
}
```

---

## ✅ Checklist de Validação

### Antes de Enviar
- [x] ✅ Usuário carregado do backend
- [x] ✅ Dados originais armazenados
- [x] ✅ Formulário preenchido
- [x] ✅ Validações passam

### Payload
- [x] ✅ SEM campo "id" no body
- [x] ✅ ID apenas na URL
- [x] ✅ Cursos: [{ id }] (simplificados)
- [x] ✅ Senha: apenas se preenchida
- [x] ✅ Trim aplicado em todos campos

### Request
- [x] ✅ Method: PUT
- [x] ✅ URL: /api/usuarios/{id}
- [x] ✅ Header: Authorization
- [x] ✅ Body: JSON correto

### Response
- [x] ✅ Status 200
- [x] ✅ Notificação verde
- [x] ✅ Redireciona
- [x] ✅ Mudanças na tabela

---

## 🐛 Troubleshooting

### **Problema: "Usuário não encontrado"**

```
Sintoma: Erro 404
Causa: ID não existe
Solução: Verificar se usuário existe

Console:
=== ERRO AO SALVAR USUÁRIO ===
Status: 404
```

---

### **Problema: "CPF já cadastrado"**

```
Sintoma: Erro 409
Causa: Tentou mudar CPF para um já existente
Solução: Usar CPF único

Frontend:
❌ "CPF ou email já cadastrado."
```

---

### **Problema: Senha não atualiza**

```
Causa: Campo senha deixado vazio
Resultado: ✅ Esperado! Senha vazia = manter atual
Solução: Preencher campo senha se quiser alterar
```

---

### **Problema: Cursos perdidos**

```
Sintoma: Após editar, cursos somem
Causa: usuarioOriginal.cursos não preservado
Solução: ✅ JÁ CORRIGIDO

Código:
cursos: (this.usuarioOriginal.cursos || []).map(curso => ({ id: curso.id }))
```

---

## 📋 Fluxo Completo de Edição

```
1. Usuário clica em ✏️ na lista
   ↓
2. GET /api/usuarios/5
   ↓
3. Dados carregados e armazenados
   usuarioOriginal = { id: 5, nome: "João", cursos: [...] }
   ↓
4. Formulário preenchido
   ↓
5. Usuário modifica campos
   ↓
6. Clicar "Atualizar"
   ↓
7. Payload montado:
   {
     nome: "João Silva Santos",
     cpf: "...",
     email: "...",
     senha: "..." (se preenchida),
     role: "...",
     cursos: [{ id: 1 }, { id: 2 }]
   }
   ↓
8. PUT /api/usuarios/5
   Body: payload acima
   URL: /5 (ID na URL)
   ↓
9. Backend atualiza
   ↓
10. Response com dados atualizados
   ↓
11. Notificação verde
   ↓
12. Redireciona para /usuarios
   ↓
13. Tabela atualizada
```

---

## ✅ Checklist Final

- [x] ✅ ID do usuário na URL (não no body)
- [x] ✅ Cursos simplificados [{ id }]
- [x] ✅ Senha opcional (não enviada se vazia)
- [x] ✅ Dados originais preservados
- [x] ✅ Trim aplicado
- [x] ✅ Console logs detalhados
- [x] ✅ Erros específicos
- [x] ✅ 0 erros de linting

---

## 🎉 Resultado Final

Edição de usuário **100% funcional** e **compatível com API**!

### ⭐ Funciona Corretamente:

- ✅ **ID na URL** - Não no body
- ✅ **Cursos Preservados** - Mantém associações
- ✅ **Senha Opcional** - Pode deixar vazio
- ✅ **Dados Originais** - Não perdidos
- ✅ **Payload Limpo** - Apenas campos necessários

---

**Endpoint:** PUT http://localhost:8080/api/usuarios/{id}  
**Payload:** ✅ Correto  
**Status:** ✅ Funcional  
**Pronto para Uso:** SIM 🚀

