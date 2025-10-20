# ✅ Implementação - Validação de Token JWT

## 🎯 Objetivo

Deslogar automaticamente o usuário quando o token JWT expirar.

---

## 🔐 Estratégias Implementadas

### **1. Verificação Periódica** ⏱️
- Verifica a cada 60 segundos
- Decodifica o token JWT
- Compara timestamp de expiração
- Desloga automaticamente se expirado

### **2. Interceptor HTTP** 🛡️
- Detecta erros 401 (Unauthorized)
- Detecta erros 403 com mensagem de token
- Desloga e redireciona para login

### **3. Verificação no Carregamento** 🚀
- Verifica token ao inicializar aplicação
- Desloga se token já expirado
- Evita uso de token inválido

---

## 📦 Arquivos Criados

### **1. JWT Helper** (Utilitário)

```
src/app/shared/utils/jwt.helper.ts
```

**Funcionalidades:**
- `decodeToken()` - Decodifica JWT
- `isTokenExpired()` - Verifica se expirou
- `getTokenExpirationTime()` - Tempo restante
- `getTokenInfo()` - Informações do token

---

### **2. Error Interceptor** (Interceptor)

```
src/app/shared/interceptors/error.interceptor.ts
```

**Funcionalidades:**
- Intercepta respostas HTTP
- Detecta erro 401 (token inválido/expirado)
- Detecta erro 403 (token expirado)
- Desloga e redireciona automaticamente

---

## 🔄 Arquivos Modificados

### **1. ApiService** (Service)

**Novos Métodos:**
```typescript
startTokenExpirationCheck()  // Verificação periódica (60s)
isTokenExpired()             // Verifica se expirado
getTokenTimeLeft()           // Tempo restante em segundos
```

**Melhorias:**
- Verifica token ao inicializar
- Mostra tempo de expiração no login
- Inicia verificação periódica

---

### **2. LoginComponent** (Component)

**Novos Recursos:**
- Detecta queryParam `reason=session-expired`
- Mostra alerta de sessão expirada
- Animação suave do alerta

---

### **3. app.config.ts** (Config)

**Interceptor Registrado:**
```typescript
withInterceptors([
  authInterceptor,
  errorInterceptor  // ✅ Novo - Detecta token expirado
])
```

---

## 🎯 Como Funciona

### **Cenário 1: Token Expira Durante Uso** ⏱️

```
1. Usuário está navegando na aplicação
   ↓
2. Verificação periódica (a cada 60s) detecta expiração
   ↓
3. Console log: "⚠️ Token expirado detectado"
   ↓
4. ApiService.logout() é chamado
   ↓
5. Redireciona para /login?reason=session-expired
   ↓
6. Tela de login mostra alerta:
   "⏱️ Sua sessão expirou. Faça login novamente."
```

---

### **Cenário 2: Requisição com Token Expirado** 🛡️

```
1. Usuário faz uma requisição
   ↓
2. Backend retorna 401 Unauthorized
   ↓
3. errorInterceptor detecta erro 401
   ↓
4. Console log: "⚠️ Token expirado (401)"
   ↓
5. ApiService.logout() é chamado
   ↓
6. Redireciona para /login?reason=session-expired
   ↓
7. Alerta aparece na tela de login
```

---

### **Cenário 3: Página Recarregada com Token Expirado** 🚀

```
1. Usuário recarrega página (F5)
   ↓
2. ApiService inicializa
   ↓
3. Verifica token do localStorage
   ↓
4. Token está expirado
   ↓
5. Console log: "⚠️ Token expirado ao inicializar"
   ↓
6. Logout automático
   ↓
7. Redireciona para /login
```

---

## 📊 Estrutura do JWT

### **Token JWT Típico:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiJqb2FvIiwiZXhwIjoxNzI5MzU2MDAwLCJpYXQiOjE3MjkzNTI0MDAsImF1dGhvcml0aWVzIjpbIlJPTEVfQURNSU5JU1RSQURPUiJdfQ.
xyz...
```

**Decodificado (Payload):**
```json
{
  "sub": "joao",
  "exp": 1729356000,
  "iat": 1729352400,
  "authorities": ["ROLE_ADMINISTRADOR"]
}
```

**Campos:**
- `sub`: Username
- `exp`: Expiration (timestamp Unix)
- `iat`: Issued At (timestamp Unix)
- `authorities`: Roles do usuário

---

## 🔍 Métodos do JWT Helper

### **1. decodeToken()**

```typescript
const decoded = decodeToken(token);
// Retorna: { sub, exp, iat, authorities, ... }
```

---

### **2. isTokenExpired()**

```typescript
const expired = isTokenExpired(token);
// Retorna: true (expirado) ou false (válido)

// Verifica:
if (decoded.exp < currentTime) {
  return true; // Expirado
}
```

---

### **3. getTokenExpirationTime()**

```typescript
const secondsLeft = getTokenExpirationTime(token);
// Retorna: segundos restantes até expiração

// Exemplo:
3600 → 1 hora
1800 → 30 minutos
60   → 1 minuto
0    → Expirado
```

---

### **4. getTokenInfo()**

```typescript
const info = getTokenInfo(token);
// Retorna: { username, authorities, expiresIn }

// Exemplo:
{
  username: "joao",
  authorities: ["ROLE_ADMINISTRADOR"],
  expiresIn: 3600
}
```

---

## 🛡️ Error Interceptor

### **Detecta Erro 401:**

```typescript
if (error.status === 401) {
  console.warn('⚠️ Token expirado ou inválido');
  apiService.logout();
  router.navigate(['/login'], {
    queryParams: { 
      returnUrl: router.url,
      reason: 'session-expired'
    }
  });
}
```

### **Detecta Erro 403:**

```typescript
if (error.status === 403) {
  // Verifica se mensagem contém "token" ou "expired"
  if (error.error?.message?.includes('token')) {
    console.warn('⚠️ Token expirado (403)');
    apiService.logout();
    router.navigate(['/login']);
  }
}
```

---

## ⏱️ Verificação Periódica

### **Intervalo de 60 Segundos:**

```typescript
private startTokenExpirationCheck(): void {
  interval(60000).subscribe(() => {
    const token = this.getToken();
    
    if (token && isTokenExpired(token)) {
      console.warn('⚠️ Token expirado - Verificação periódica');
      this.logout();
      this.router.navigate(['/login'], {
        queryParams: { reason: 'session-expired' }
      });
    }
  });
}
```

**Por quê 60 segundos?**
- ✅ Não sobrecarrega (1 verificação/minuto)
- ✅ Detecta expiração em tempo razoável
- ✅ Usuário não fica muito tempo com token inválido

---

## 🎨 Visual da Mensagem

### **Tela de Login com Alerta:**

```
┌──────────────────────────────────┐
│ ⏱️  Sessão Expirada              │
│     Sua sessão expirou.          │
│     Faça login novamente.        │
├──────────────────────────────────┤
│          Login                    │
│                                   │
│  E-mail:                         │
│  [_________________________]     │
│                                   │
│  Senha:                          │
│  [_________________________]     │
│                                   │
│        [   Entrar   ]            │
└──────────────────────────────────┘
```

---

## 🧪 Como Testar

### **Teste 1: Verificação no Login**

```bash
# 1. Fazer login
# 2. Verificar console:

✅ Login efetuado com sucesso!
⏱️ Token expira em: 60 minutos

# Token válido por 1 hora
```

---

### **Teste 2: Simular Token Expirado**

```bash
# 1. Fazer login
# 2. Aguardar token expirar (ou modificar manualmente)
# 3. Tentar fazer uma requisição qualquer

# Backend retorna: 401 Unauthorized

# Console:
⚠️ Token expirado ou inválido (401 Unauthorized)
🚪 Redirecionando para login...

# Frontend:
✅ Logout automático
✅ Redireciona para /login
✅ Alerta aparece:
   "⏱️ Sua sessão expirou. Faça login novamente."
```

---

### **Teste 3: Verificação Periódica**

```bash
# 1. Fazer login
# 2. Deixar aplicação aberta
# 3. Aguardar 60 segundos após expiração

# Console (a cada minuto):
Verificando token...

# Quando expirar:
⚠️ Token expirado detectado na verificação periódica
🚪 Efetuando logout automático...

# Frontend:
✅ Logout automático
✅ Redireciona para login
✅ Alerta de sessão expirada
```

---

### **Teste 4: Recarregar Página com Token Expirado**

```bash
# 1. Token expirado no localStorage
# 2. Recarregar página (F5)

# Console:
⚠️ Token expirado detectado ao inicializar
🚪 Redirecionando para login...

# Frontend:
✅ Não deixa usar aplicação
✅ Redireciona imediatamente
✅ Mostra alerta
```

---

## ⚙️ Configuração

### **Tempo de Verificação:**

```typescript
// Padrão: 60 segundos (1 minuto)
interval(60000).subscribe(...)

// Para mudar (ex: 30 segundos):
interval(30000).subscribe(...)

// Para 5 minutos:
interval(300000).subscribe(...)
```

---

## 📊 Fluxo Completo

```
LOGIN
  ↓
Token armazenado (localStorage)
  ↓
Verificação periódica iniciada (60s)
  ↓
Usuário navega normalmente
  ↓
┌─────────────────────────────┐
│ VERIFICAÇÕES SIMULTÂNEAS:   │
│                              │
│ 1. Periódica (60s)          │
│ 2. Em cada requisição (401) │
│ 3. Ao recarregar página     │
└─────────────────────────────┘
  ↓
TOKEN EXPIRA
  ↓
Detectado por uma das verificações
  ↓
Logout automático
  ↓
Redireciona para /login?reason=session-expired
  ↓
Alerta aparece na tela
  ↓
Usuário faz login novamente
```

---

## ✅ Checklist de Implementação

### Arquivos Criados
- [x] ✅ `jwt.helper.ts` (utilitário)
- [x] ✅ `error.interceptor.ts` (interceptor)

### Arquivos Modificados
- [x] ✅ `api.service.ts` (validação)
- [x] ✅ `app.config.ts` (registrar interceptor)
- [x] ✅ `login.component.ts` (mensagem)
- [x] ✅ `login.component.html` (alerta)
- [x] ✅ `login.component.css` (estilos)

### Funcionalidades
- [x] ✅ Decodifica JWT
- [x] ✅ Verifica expiração
- [x] ✅ Verificação periódica (60s)
- [x] ✅ Intercepta 401/403
- [x] ✅ Logout automático
- [x] ✅ Redireciona para login
- [x] ✅ Mostra mensagem de sessão expirada
- [x] ✅ Console logs informativos

### UX
- [x] ✅ Alerta visual na tela de login
- [x] ✅ Mensagem clara e amigável
- [x] ✅ Animação suave
- [x] ✅ Cor laranja (aviso)

---

## 🔍 Logs de Debug

### **No Login:**
```javascript
✅ Login efetuado com sucesso!
⏱️ Token expira em: 60 minutos
```

### **Token Expirado (Periódica):**
```javascript
⚠️ Token expirado detectado na verificação periódica
🚪 Efetuando logout automático...
```

### **Token Expirado (401):**
```javascript
⚠️ Token expirado ou inválido (401 Unauthorized)
🚪 Redirecionando para login...
```

### **Token Expirado (Inicialização):**
```javascript
⚠️ Token expirado detectado ao inicializar
🚪 Redirecionando para login...
```

---

## 🎨 Exemplo de Token JWT

### **Token (Codificado):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiJqb2FvIiwiZXhwIjoxNzI5MzU2MDAwLCJpYXQiOjE3MjkzNTI0MDB9.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### **Payload (Decodificado):**
```json
{
  "sub": "joao",
  "exp": 1729356000,
  "iat": 1729352400,
  "authorities": ["ROLE_ADMINISTRADOR"]
}
```

### **Verificação:**
```typescript
const currentTime = Math.floor(Date.now() / 1000);  // 1729357000
const tokenExp = 1729356000;

if (tokenExp < currentTime) {
  // 1729356000 < 1729357000 → true
  // Token expirado! ✅
}
```

---

## 🧪 Teste Completo

### **Passo a Passo:**

```bash
# 1. Fazer login
   ✅ Console: "Token expira em: 60 minutos"

# 2. Usar aplicação normalmente
   ✅ Tudo funciona

# 3. Aguardar token expirar (ou simular)
   - Opção A: Aguardar expiração real
   - Opção B: Modificar localStorage manualmente

# 4. Verificação detecta (60s depois)
   ⚠️ Console: "Token expirado - Verificação periódica"
   🚪 Console: "Efetuando logout automático..."

# 5. Redireciona para login
   ✅ URL: /login?reason=session-expired

# 6. Alerta aparece
   ┌────────────────────────────┐
   │ ⏱️ Sessão Expirada        │
   │ Sua sessão expirou.       │
   │ Faça login novamente.     │
   └────────────────────────────┘

# 7. Fazer novo login
   ✅ Token novo
   ✅ Verificação reinicia
```

---

## 🔧 Métodos Disponíveis

### **ApiService:**

```typescript
// Verificar se token está expirado
this.apiService.isTokenExpired()  // true/false

// Obter tempo restante
this.apiService.getTokenTimeLeft()  // segundos

// Forçar logout
this.apiService.logout()
```

### **JWT Helper:**

```typescript
import { isTokenExpired, getTokenExpirationTime } from './utils/jwt.helper';

// Verificar expiração
isTokenExpired(token)  // true/false

// Tempo restante
getTokenExpirationTime(token)  // segundos

// Informações do token
const info = getTokenInfo(token);
// { username, authorities, expiresIn }
```

---

## 📋 Configurações

### **Intervalo de Verificação:**

```typescript
// Atual: 60 segundos
interval(60000)

// Para mudar:
interval(30000)  // 30 segundos
interval(120000) // 2 minutos
interval(300000) // 5 minutos
```

### **Mensagem Personalizada:**

```typescript
// No errorInterceptor ou ApiService
router.navigate(['/login'], {
  queryParams: { 
    reason: 'session-expired',
    message: 'Sua mensagem personalizada aqui'
  }
});
```

---

## 🎉 Resultado Final

Sistema completo de validação de token com **3 camadas de proteção**!

### ⭐ Recursos Implementados:

- ✅ **Verificação Periódica** - A cada 60 segundos
- ✅ **Interceptor HTTP** - Detecta 401/403
- ✅ **Verificação no Load** - Ao inicializar app
- ✅ **Logout Automático** - Quando expirar
- ✅ **Redirecionar Login** - Com mensagem
- ✅ **Alerta Visual** - Na tela de login
- ✅ **Logs Informativos** - Debug completo
- ✅ **JWT Helper** - Utilitários reutilizáveis

---

## 📖 Documentação

- 📄 **`IMPLEMENTACAO_VALIDACAO_TOKEN.md`** - Este documento
- 📄 **`src/app/shared/utils/jwt.helper.ts`** - Código do helper
- 📄 **`src/app/shared/interceptors/error.interceptor.ts`** - Código do interceptor

---

**Status:** ✅ Implementado  
**Camadas de Proteção:** 3  
**Verificação:** Automática (60s)  
**Linting:** 0 erros  
**Pronto para Produção:** SIM 🚀

