# 📝 Guia de Cadastro de Usuário

## 🎯 Endpoint e Payload Correto

### **POST /api/usuarios**

---

## ✅ Payload Esperado pela API

```json
{
  "id": 0,
  "nome": "string",
  "cpf": "string",
  "email": "string",
  "senha": "string",
  "role": "string",
  "cursos": [
    {
      "id": 0,
      "nome": "string",
      "ativo": true
    }
  ]
}
```

---

## 🔧 Implementação Atual

### **Payload Gerado pelo Componente**

```typescript
// MODO CRIAÇÃO
usuarioData = {
  id: 0,                          // ✅ Sempre 0 para novo usuário
  nome: formValues.nome.trim(),   // ✅ Texto sem espaços extras
  cpf: formValues.cpf.trim(),     // ✅ Formato: 000.000.000-00
  email: formValues.email.trim(), // ✅ Email válido
  senha: formValues.senha.trim(), // ✅ Mínimo 6 caracteres
  role: formValues.role,          // ✅ ROLE_ADMINISTRADOR | ROLE_GERENTE | ROLE_SECRETARIO
  cursos: []                      // ✅ Array vazio (cursos gerenciados separadamente)
};
```

---

## 📋 Exemplos de Payloads Válidos

### **Exemplo 1: Criar Administrador**

```json
{
  "id": 0,
  "nome": "João Administrador Silva",
  "cpf": "123.456.789-00",
  "email": "joao.admin@empresa.com",
  "senha": "senhaSegura123",
  "role": "ROLE_ADMINISTRADOR",
  "cursos": []
}
```

**Response (200 OK):**
```json
{
  "id": 10,
  "nome": "João Administrador Silva",
  "cpf": "123.456.789-00",
  "email": "joao.admin@empresa.com",
  "senha": "******",
  "role": "ROLE_ADMINISTRADOR",
  "cursos": []
}
```

---

### **Exemplo 2: Criar Gerente**

```json
{
  "id": 0,
  "nome": "Maria Gerente Santos",
  "cpf": "987.654.321-00",
  "email": "maria.gerente@empresa.com",
  "senha": "senha456",
  "role": "ROLE_GERENTE",
  "cursos": []
}
```

---

### **Exemplo 3: Criar Secretário**

```json
{
  "id": 0,
  "nome": "Carlos Secretário Lima",
  "cpf": "111.222.333-44",
  "email": "carlos.sec@empresa.com",
  "senha": "senha789",
  "role": "ROLE_SECRETARIO",
  "cursos": []
}
```

---

## 🔍 Validações Aplicadas

### **Frontend (Antes de Enviar)**

| Campo | Validação | Mensagem de Erro |
|-------|-----------|------------------|
| **nome** | Obrigatório, 3-100 chars | "Nome é obrigatório" / "Mínimo 3 caracteres" |
| **email** | Obrigatório, formato email | "Email é obrigatório" / "Email inválido" |
| **cpf** | Obrigatório, formato 000.000.000-00 | "CPF é obrigatório" / "CPF inválido" |
| **senha** | Obrigatório, mínimo 6 chars | "Senha é obrigatória" / "Mínimo 6 caracteres" |
| **role** | Obrigatório | "Função é obrigatória" |

### **Limpeza de Dados**

```typescript
// Todos os campos de texto são limpos com .trim()
nome: formValues.nome.trim()    // Remove espaços extras
cpf: formValues.cpf.trim()
email: formValues.email.trim()
senha: formValues.senha.trim()
```

---

## 🧪 Como Testar Cadastro

### **Teste 1: Cadastro Completo**

```bash
# 1. Acessar
http://localhost:4200/usuarios/novo

# 2. Preencher formulário:
Nome:  "João Silva Santos"
Email: "joao@teste.com"
CPF:   123.456.789-00  (auto-formatado)
Senha: "senha123"
Role:  Gerente

# 3. Abrir DevTools (F12) → Aba Network
# 4. Clicar em "Cadastrar"

# 5. Verificar Request:
Method: POST
URL: http://localhost:8080/api/usuarios
Headers:
  Authorization: Bearer {JWT_TOKEN}
  Content-Type: application/json

Body:
{
  "id": 0,
  "nome": "João Silva Santos",
  "cpf": "123.456.789-00",
  "email": "joao@teste.com",
  "senha": "senha123",
  "role": "ROLE_GERENTE",
  "cursos": []
}

# 6. Verificar Console (F12 → Console):
=== PAYLOAD ENVIADO ===
Modo: CRIAÇÃO
Endpoint: POST /api/usuarios
Payload: { ... }

# 7. Se sucesso:
=== RESPOSTA DO SERVIDOR ===
Status: Sucesso
Response: { id: 10, nome: "João...", ... }

✅ Notificação verde: "Usuário cadastrado com sucesso!"
✅ Redireciona para /usuarios
✅ Novo usuário aparece na tabela
```

---

### **Teste 2: Validações**

```bash
# Cenário 1: Nome muito curto
Nome: "AB"
✅ Erro: "Nome deve ter pelo menos 3 caracteres"

# Cenário 2: Email inválido
Email: "emailinvalido"
✅ Erro: "Email inválido"

# Cenário 3: CPF inválido
CPF: "123"
✅ Erro: "CPF inválido"

# Cenário 4: Senha curta
Senha: "123"
✅ Erro: "Senha deve ter pelo menos 6 caracteres"

# Cenário 5: Campos vazios
Deixar campos vazios
✅ Botão "Cadastrar" desabilitado
✅ Ao clicar: "Preencha todos os campos obrigatórios"
```

---

### **Teste 3: Erros do Backend**

```bash
# Cenário 1: CPF Duplicado
Criar com CPF já existente
Backend: 409 Conflict
✅ Frontend: "CPF ou email já cadastrado."

# Cenário 2: Email Duplicado
Criar com email já existente
Backend: 409 Conflict
✅ Frontend: "CPF ou email já cadastrado."

# Cenário 3: Dados Inválidos
Enviar dados fora do padrão
Backend: 400 Bad Request
✅ Frontend: "Dados inválidos. Verifique os campos."

# Cenário 4: Sem Permissão
Usuário não-admin tenta criar
Backend: 403 Forbidden
✅ Frontend: "Sem permissão para esta operação."
```

---

## 🔍 Debug e Logs

### **Console Logs Implementados**

#### **Antes de Enviar:**
```javascript
=== PAYLOAD ENVIADO ===
Modo: CRIAÇÃO
Endpoint: POST /api/usuarios
Payload: {
  "id": 0,
  "nome": "João Silva",
  "cpf": "123.456.789-00",
  "email": "joao@test.com",
  "senha": "senha123",
  "role": "ROLE_GERENTE",
  "cursos": []
}
```

#### **Em Sucesso:**
```javascript
=== RESPOSTA DO SERVIDOR ===
Status: Sucesso
Response: {
  "id": 10,
  "nome": "João Silva",
  ...
}
```

#### **Em Erro:**
```javascript
=== ERRO AO SALVAR USUÁRIO ===
Status: 409
Error: {...}
Error Message: "CPF já cadastrado"
```

---

## 📊 Estrutura de Dados

### **Campos Obrigatórios**

```typescript
interface Usuario {
  id: 0,              // ✅ Sempre 0 em criação
  nome: string,       // ✅ Obrigatório, 3-100 chars
  cpf: string,        // ✅ Obrigatório, formato 000.000.000-00
  email: string,      // ✅ Obrigatório, formato email válido
  senha: string,      // ✅ Obrigatório em criação, mínimo 6 chars
  role: string,       // ✅ Obrigatório (ROLE_ADMINISTRADOR | ROLE_GERENTE | ROLE_SECRETARIO)
  cursos: Curso[]     // ✅ Array vazio [] em criação
}
```

---

## ⚙️ Tratamento de Erros HTTP

| Status | Causa | Mensagem Frontend |
|--------|-------|-------------------|
| **200** | Sucesso | "Usuário cadastrado com sucesso!" |
| **400** | Dados inválidos | "Dados inválidos. Verifique os campos." |
| **403** | Sem permissão | "Sem permissão para esta operação." |
| **409** | CPF/email duplicado | "CPF ou email já cadastrado." |
| **500** | Erro no servidor | "Erro no servidor. Tente novamente mais tarde." |
| **Outros** | Erro desconhecido | "Erro ao salvar usuário. Tente novamente." |

---

## 🎯 Fluxo Completo de Cadastro

```
1. Usuário acessa /usuarios/novo
   ↓
2. Formulário vazio carrega
   Role padrão: ROLE_SECRETARIO
   ↓
3. Usuário preenche dados
   - Nome, Email, CPF (auto-formatado), Senha, Role
   ↓
4. Frontend valida campos
   ✅ Todos válidos → Botão habilitado
   ❌ Algum inválido → Botão desabilitado
   ↓
5. Usuário clica em "Cadastrar"
   ↓
6. Payload montado:
   {
     id: 0,
     nome: "...",
     cpf: "...",
     email: "...",
     senha: "...",
     role: "ROLE_...",
     cursos: []
   }
   ↓
7. Console log do payload (debug)
   ↓
8. POST /api/usuarios
   Headers: Authorization: Bearer {JWT}
   Body: payload acima
   ↓
9a. SUCESSO (200)
   ↓
   Response com usuário criado
   ↓
   Console log da resposta
   ↓
   Notificação verde de sucesso
   ↓
   Redireciona para /usuarios
   ↓
   Usuário aparece na tabela

9b. ERRO (400/403/409/500)
   ↓
   Console log detalhado do erro
   ↓
   Notificação vermelha com mensagem específica
   ↓
   Usuário permanece no formulário
```

---

## 🧩 Exemplo de Código

### **Uso do Service**

```typescript
// Criar usuário
const novoUsuario = {
  id: 0,
  nome: "João Silva",
  cpf: "123.456.789-00",
  email: "joao@test.com",
  senha: "senha123",
  role: "ROLE_GERENTE",
  cursos: []
};

this.usuariosService.createUser(novoUsuario).subscribe({
  next: (response) => {
    console.log('Usuário criado:', response);
    // response.id será o ID gerado pelo backend
  },
  error: (error) => {
    console.error('Erro:', error);
  }
});
```

---

## 📸 Captura do Payload no Network

```
General:
Request URL: http://localhost:8080/api/usuarios
Request Method: POST
Status Code: 200 OK

Request Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
Content-Type: application/json

Request Payload:
{
  "id": 0,
  "nome": "João Silva Santos",
  "cpf": "123.456.789-00",
  "email": "joao@teste.com",
  "senha": "senha123",
  "role": "ROLE_GERENTE",
  "cursos": []
}

Response:
{
  "id": 10,
  "nome": "João Silva Santos",
  "cpf": "123.456.789-00",
  "email": "joao@teste.com",
  "senha": "******",
  "role": "ROLE_GERENTE",
  "cursos": []
}
```

---

## ✅ Checklist de Validação

### Antes de Enviar
- [x] ✅ Nome: 3-100 caracteres
- [x] ✅ Email: formato válido
- [x] ✅ CPF: formato 000.000.000-00
- [x] ✅ Senha: mínimo 6 caracteres
- [x] ✅ Role: uma das 3 opções
- [x] ✅ Todos campos preenchidos

### Payload
- [x] ✅ id: 0
- [x] ✅ nome: string não-vazia
- [x] ✅ cpf: string formatada
- [x] ✅ email: string válida
- [x] ✅ senha: string (mín 6)
- [x] ✅ role: ROLE_ADMINISTRADOR | ROLE_GERENTE | ROLE_SECRETARIO
- [x] ✅ cursos: array vazio []

### Request HTTP
- [x] ✅ Method: POST
- [x] ✅ URL: /api/usuarios
- [x] ✅ Header: Authorization com JWT
- [x] ✅ Content-Type: application/json
- [x] ✅ Body: JSON válido

### Response
- [x] ✅ Status 200: Sucesso
- [x] ✅ Notificação verde
- [x] ✅ Redireciona para /usuarios
- [x] ✅ Usuário aparece na lista

---

## 🐛 Troubleshooting

### **Problema 1: CPF já existe**

```
Sintoma: Erro 409
Causa: CPF já cadastrado
Solução: Usar CPF diferente

Console:
=== ERRO AO SALVAR USUÁRIO ===
Status: 409
Error Message: "CPF já cadastrado"

Frontend:
❌ "CPF ou email já cadastrado."
```

---

### **Problema 2: Email inválido**

```
Sintoma: Erro 400
Causa: Email fora do padrão
Solução: Verificar formato (usuario@dominio.com)

Console:
=== ERRO AO SALVAR USUÁRIO ===
Status: 400
Error Message: "Email inválido"

Frontend:
❌ "Dados inválidos. Verifique os campos."
```

---

### **Problema 3: CPF sem formatação**

```
Sintoma: CPF não aceito
Causa: Falta de pontos e traço
Solução: Use a máscara automática

Digite: 12345678900
Resultado: 123.456.789-00 ✅
```

---

### **Problema 4: Sem permissão**

```
Sintoma: Erro 403
Causa: Usuário não é ADMINISTRADOR
Solução: Login como ADMINISTRADOR

Console:
=== ERRO AO SALVAR USUÁRIO ===
Status: 403

Frontend:
❌ "Sem permissão para esta operação."
```

---

## 📝 Passo a Passo Detalhado

### **Cadastrar Novo Usuário**

#### **Passo 1: Acessar Formulário**
```
1. Login como ADMINISTRADOR
2. Ir para /usuarios
3. Clicar em "Adicionar Usuário"
4. Formulário abre vazio
```

#### **Passo 2: Preencher Dados**
```
Nome Completo: "Maria Gerente Silva"
Email: "maria@teste.com"
CPF: 111.222.333-44 → 111.222.333-44 (auto-formata)
Nova Senha: "senha123456"
Função: Gerente (dropdown)
```

#### **Passo 3: Validar Preview**
```
✅ Função selecionada: [🟣 ROLE_GERENTE]
```

#### **Passo 4: Enviar**
```
1. Clicar em "Cadastrar"
2. Botão muda para "Salvando..."
3. Botão fica desabilitado
4. Loading spinner no ícone
```

#### **Passo 5: Aguardar Resposta**
```
SUCESSO:
✅ Notificação verde
✅ "Usuário cadastrado com sucesso!"
✅ Redireciona para /usuarios
✅ Novo usuário na tabela

ERRO:
❌ Notificação vermelha
❌ Mensagem específica do erro
❌ Permanece no formulário
❌ Campos mantêm valores
```

---

## 🔧 Configuração do Service

```typescript
// usuarios.service.ts

createUser(userData: Partial<Usuario>): Observable<Usuario> {
  return this.http.post<Usuario>(`${this.baseUrl}/usuarios`, userData);
}

// environment.development.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

**URL Final:**
```
http://localhost:8080/api/usuarios
```

---

## ✅ Checklist de Teste Final

### Funcional
- [ ] Formulário abre vazio
- [ ] Validações funcionam
- [ ] Máscara de CPF funciona
- [ ] Dropdown de roles tem 3 opções
- [ ] Preview da role aparece
- [ ] Botão desabilita quando inválido

### Envio
- [ ] Console mostra payload
- [ ] POST enviado para /api/usuarios
- [ ] Header Authorization presente
- [ ] Body está completo (7 campos)
- [ ] cursos é array vazio []

### Resposta
- [ ] Sucesso: Notificação verde
- [ ] Sucesso: Redireciona
- [ ] Sucesso: Usuário na lista
- [ ] Erro 409: Mensagem de duplicação
- [ ] Erro 400: Mensagem de validação
- [ ] Erro 403: Mensagem de permissão

### Console
- [ ] Payload logado antes de enviar
- [ ] Response logado em sucesso
- [ ] Error logado em erro
- [ ] Mensagens claras e formatadas

---

## 🎉 Resultado Esperado

### **Sucesso:**
```
POST /api/usuarios → 200 OK

Response:
{
  "id": 10,
  "nome": "João Silva",
  "cpf": "123.456.789-00",
  "email": "joao@test.com",
  "senha": "******",
  "role": "ROLE_GERENTE",
  "cursos": []
}

Frontend:
✅ Notificação verde
✅ Redireciona para /usuarios
✅ Usuário ID 10 aparece na tabela
```

---

## 📖 Referências

- 📄 Endpoint: `POST /api/usuarios`
- 📄 Service: `usuarios.service.ts → createUser()`
- 📄 Component: `form-usuario.component.ts → onSubmit()`
- 📄 Interceptor: Adiciona JWT automaticamente
- 📄 Environment: Define baseUrl da API

---

**Data:** 19/10/2025  
**Status:** ✅ Funcional  
**Payload:** 100% Correto  
**Debug:** Console logs completos  
**Pronto para Uso:** SIM 🚀

