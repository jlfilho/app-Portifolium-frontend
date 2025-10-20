# ✅ Atualização - Response JSON na Alteração de Senha

## 🔄 Mudança no Backend

O backend foi atualizado para retornar **JSON** em vez de texto puro.

---

## 📊 Response Antiga vs Nova

### **ANTES** (Texto Puro)

```java
return ResponseEntity.ok("Senha alterada com sucesso");
```

**Response:**
```
Status: 200 OK
Content-Type: text/plain
Body: "Senha alterada com sucesso"
```

---

### **DEPOIS** (JSON) ✅

```java
Map<String, String> response = new HashMap<>();
response.put("message", "Senha alterada com sucesso");
response.put("usuarioId", usuarioId.toString());
return ResponseEntity.ok(response);
```

**Response:**
```json
Status: 200 OK
Content-Type: application/json
Body: {
  "message": "Senha alterada com sucesso",
  "usuarioId": "1"
}
```

---

## ✅ Correção no Frontend

### **1. Nova Interface Criada**

```typescript
// usuario.model.ts

export interface ChangePasswordResponse {
  message: string;
  usuarioId: string;
}
```

---

### **2. Service Atualizado**

**ANTES:**
```typescript
changePassword(...): Observable<string> {
  return this.http.put(url, data, {
    responseType: 'text'  // ❌ Esperava texto
  });
}
```

**DEPOIS:**
```typescript
changePassword(...): Observable<ChangePasswordResponse> {
  return this.http.put<ChangePasswordResponse>(url, data);
  // ✅ Agora espera JSON
}
```

---

### **3. Componente Atualizado**

**ANTES:**
```typescript
next: (response) => {
  // response era string
  this.showMessage(
    typeof response === 'string' ? response : 'Senha alterada...',
    'success'
  );
}
```

**DEPOIS:**
```typescript
next: (response) => {
  // response é objeto: { message, usuarioId }
  console.log('Response:', response);
  console.log('Mensagem:', response.message);
  console.log('Usuário ID:', response.usuarioId);
  
  this.showMessage(response.message, 'success');
}
```

---

## 📝 Exemplo Completo

### **Request:**

```
PUT http://localhost:8080/api/usuarios/1/change-password

Headers:
  Authorization: Bearer {JWT_TOKEN}
  Content-Type: application/json

Body:
{
  "currentPassword": "senhaAtual123",
  "newPassword": "novaSenha456"
}
```

### **Response:**

```json
Status: 200 OK
Content-Type: application/json

{
  "message": "Senha alterada com sucesso",
  "usuarioId": "1"
}
```

### **Console Logs:**

```javascript
=== ALTERAÇÃO DE SENHA ===
Usuário ID: 1
Usuário Nome: João da Mata
Endpoint: PUT /api/usuarios/1/change-password
Payload: { currentPassword: '***', newPassword: '***' }

=== SENHA ALTERADA COM SUCESSO ===
Response: {
  message: "Senha alterada com sucesso",
  usuarioId: "1"
}
Mensagem: "Senha alterada com sucesso"
Usuário ID: "1"
```

### **Frontend:**

```
✅ Notificação verde: "Senha alterada com sucesso"
✅ Dialog fecha
✅ Volta para listagem
```

---

## 🧪 Como Testar

```bash
# 1. Acessar /usuarios
# 2. Clicar no botão 🔒 de um usuário
# 3. Preencher:
   Senha Atual: "joao123"
   Nova Senha: "novaSenha456"
   Confirmar: "novaSenha456"

# 4. F12 → Console e Network
# 5. Clicar em "Alterar Senha"

# 6. Verificar Network → Response:
{
  "message": "Senha alterada com sucesso",
  "usuarioId": "1"
}

# 7. Verificar Console:
=== SENHA ALTERADA COM SUCESSO ===
Response: { message: "...", usuarioId: "1" }
Mensagem: "Senha alterada com sucesso"
Usuário ID: "1"

# 8. Verificar Frontend:
✅ Notificação verde com mensagem do backend
✅ Dialog fecha
✅ Sem erros
```

---

## 📊 Estrutura de Dados

### **Request (Frontend → Backend)**

```typescript
interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
```

**Exemplo:**
```json
{
  "currentPassword": "senhaAtual",
  "newPassword": "novaSenha"
}
```

---

### **Response (Backend → Frontend)**

```typescript
interface ChangePasswordResponse {
  message: string;
  usuarioId: string;
}
```

**Exemplo:**
```json
{
  "message": "Senha alterada com sucesso",
  "usuarioId": "1"
}
```

---

## ✅ Arquivos Modificados

| Arquivo | Mudança |
|---------|---------|
| `usuario.model.ts` | ➕ Interface `ChangePasswordResponse` |
| `usuarios.service.ts` | 🔄 Observable\<ChangePasswordResponse\> |
| `change-password-dialog.component.ts` | 🔄 Usa `response.message` |

---

## 🎯 Benefícios da Mudança

### **Backend:**
- ✅ Response estruturada
- ✅ Retorna ID do usuário
- ✅ Formato consistente (JSON)
- ✅ Fácil adicionar mais campos

### **Frontend:**
- ✅ Tipagem TypeScript
- ✅ Acesso a múltiplos campos
- ✅ IntelliSense funciona
- ✅ Type safety

---

## 📋 Checklist de Validação

- [x] ✅ Interface ChangePasswordResponse criada
- [x] ✅ Service usa Observable\<ChangePasswordResponse\>
- [x] ✅ Component usa response.message
- [x] ✅ Console logs atualizados
- [x] ✅ Sem responseType: 'text'
- [x] ✅ Parse JSON automático
- [x] ✅ 0 erros de linting

---

## 🎉 Resultado Final

Alteração de senha **100% funcional** com resposta JSON!

### ⭐ Melhorias:

- ✅ **Response JSON** - Estruturada
- ✅ **Tipagem** - ChangePasswordResponse
- ✅ **Mensagem Backend** - Exibida diretamente
- ✅ **Logs Detalhados** - message + usuarioId
- ✅ **Type Safe** - IntelliSense

---

## 📖 Documentação

📄 **`ATUALIZACAO_RESPONSE_JSON_SENHA.md`** - Este documento

---

**Status:** ✅ Atualizado  
**Response Type:** JSON ✅  
**Linting:** 0 erros  
**Pronto para Uso:** SIM 🚀

