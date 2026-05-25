# 👤 Exibição de Informações do Usuário - Token JWT

## 📋 Objetivo

Extrair informações do usuário diretamente do token JWT e exibir no menu "Usuário Logado" do dashboard, incluindo nome, email e role/permissão.

---

## ✅ Implementação

### **1. ApiService - Novos Métodos**

#### **Arquivo:** `src/app/shared/api.service.ts`

#### **Import Atualizado:**
```typescript
import { isTokenExpired, getTokenExpirationTime, decodeToken, JwtPayload } from './utils/jwt.helper';
```

#### **Método Principal - `getUserInfoFromToken()`:**
```typescript
/**
 * Obter informações do usuário do token JWT
 * Retorna: { username: string, email: string, authorities: string[], name?: string }
 */
getUserInfoFromToken(): { username: string; email: string; authorities: string[]; name?: string } | null {
  const token = this.getToken();
  if (!token) {
    console.warn('⚠️ Nenhum token encontrado');
    return null;
  }

  const decoded = decodeToken(token);
  if (!decoded) {
    console.error('❌ Erro ao decodificar token');
    return null;
  }

  console.log('🔍 Token decodificado:', decoded);

  // Extrair informações do token
  // O "sub" geralmente contém o username/email
  const username = decoded.sub || '';
  const email = decoded.email || decoded.sub || '';
  const authorities = decoded.authorities || this.getAuthorities();
  const name = decoded.name || decoded.nome || '';

  return {
    username,
    email,
    authorities,
    name
  };
}
```

**O que faz:**
- ✅ Obtém o token JWT do localStorage
- ✅ Decodifica o payload do token
- ✅ Extrai `sub` (username/email)
- ✅ Extrai `email` (se disponível)
- ✅ Extrai `authorities` (permissões/roles)
- ✅ Extrai `name` ou `nome` (se disponível)
- ✅ Retorna objeto com todas as informações

---

#### **Método Helper - `getUserName()`:**
```typescript
/**
 * Obter nome do usuário do token (se disponível)
 */
getUserName(): string {
  const userInfo = this.getUserInfoFromToken();
  if (!userInfo) return 'Usuário';
  
  // Priorizar o nome, senão username, senão email
  return userInfo.name || userInfo.username || userInfo.email || 'Usuário';
}
```

**Prioridade:**
1. `name` ou `nome` (se disponível no token)
2. `username` (geralmente o `sub`)
3. `email`
4. "Usuário" (fallback)

---

#### **Método Helper - `getUserEmail()`:**
```typescript
/**
 * Obter email do usuário do token
 */
getUserEmail(): string {
  const userInfo = this.getUserInfoFromToken();
  if (!userInfo) return '';
  
  return userInfo.email || userInfo.username || '';
}
```

**Prioridade:**
1. `email` (se disponível no token)
2. `username` (geralmente é o email)
3. String vazia (fallback)

---

### **2. HomeComponent - Atualizado**

#### **Arquivo:** `src/app/dashboard/home/home.component.ts`

#### **Novas Propriedades:**
```typescript
export class HomeComponent implements OnInit {
  isCollapsed = false;
  userName = 'Usuário';
  userEmail = 'usuario@email.com';
  userAuthorities: string[] = [];  // ⬅ NOVO
  
  // ...
}
```

---

#### **Método `loadUserInfo()` - Atualizado:**
```typescript
/**
 * Carrega informações do usuário do token JWT
 */
loadUserInfo(): void {
  console.log('📊 Carregando informações do usuário do token...');
  
  const userInfo = this.apiService.getUserInfoFromToken();
  
  if (userInfo) {
    console.log('✅ Informações extraídas do token:', userInfo);
    
    // Atualizar propriedades do componente
    this.userName = userInfo.name || userInfo.username || 'Usuário';
    this.userEmail = userInfo.email;
    this.userAuthorities = userInfo.authorities;
    
    console.log('👤 Nome do usuário:', this.userName);
    console.log('📧 Email do usuário:', this.userEmail);
    console.log('🔐 Permissões:', this.userAuthorities);
  } else {
    console.warn('⚠️ Não foi possível extrair informações do token');
    // Manter valores padrão
    this.userName = 'Usuário';
    this.userEmail = '';
  }
}
```

**O que faz:**
- ✅ Chama `getUserInfoFromToken()` do service
- ✅ Atualiza `userName` com prioridade (name > username > email)
- ✅ Atualiza `userEmail`
- ✅ Armazena `userAuthorities` para verificações
- ✅ Logs detalhados para debug

---

#### **Novo Método - `getUserRole()`:**
```typescript
/**
 * Obtém a role mais relevante para exibir
 */
getUserRole(): string {
  if (this.userAuthorities.includes('ROLE_ADMINISTRADOR')) {
    return 'Administrador';
  } else if (this.userAuthorities.includes('ROLE_GERENTE')) {
    return 'Gerente';
  } else if (this.userAuthorities.includes('ROLE_PROFESSOR')) {
    return 'Professor';
  } else if (this.userAuthorities.includes('ROLE_SECRETARIO')) {
    return 'Secretário';
  } else if (this.userAuthorities.includes('ROLE_ALUNO')) {
    return 'Aluno';
  }
  return 'Usuário';
}
```

**Hierarquia de Roles:**
1. **Administrador** (maior permissão)
2. **Gerente**
3. **Professor**
4. **Secretário**
5. **Aluno**
6. **Usuário** (fallback)

---

### **3. Template HTML - Atualizado**

#### **Arquivo:** `src/app/dashboard/home/home.component.html`

#### **Menu Dropdown:**
```html
<!-- Menu Dropdown -->
<mat-menu #menu="matMenu" class="user-dropdown">
  <div class="menu-header">
    <mat-icon class="menu-avatar">account_circle</mat-icon>
    <div class="menu-user-info">
      <strong>{{ userName }}</strong>
      <small>{{ userEmail }}</small>
      <span class="user-role">{{ getUserRole() }}</span>  <!-- ⬅ NOVO -->
    </div>
  </div>
  <mat-divider></mat-divider>
  <button mat-menu-item (click)="goToProfile()">
    <mat-icon>person</mat-icon>
    <span>Meu Perfil</span>
  </button>
  <button mat-menu-item (click)="goToSettings()">
    <mat-icon>settings</mat-icon>
    <span>Configurações</span>
  </button>
  <mat-divider></mat-divider>
  <button mat-menu-item (click)="logout()" class="logout-item">
    <mat-icon>logout</mat-icon>
    <span>Sair</span>
  </button>
</mat-menu>
```

**Estrutura:**
```
┌─────────────────────────────┐
│  👤                         │
│  João Silva                 │  ← userName (do token)
│  joao.silva@email.com       │  ← userEmail (do token)
│  [ADMINISTRADOR]            │  ← getUserRole() (badge)
├─────────────────────────────┤
│  👤 Meu Perfil              │
│  ⚙️  Configurações          │
├─────────────────────────────┤
│  🚪 Sair                    │
└─────────────────────────────┘
```

---

### **4. Estilos CSS - Badge da Role**

#### **Arquivo:** `src/app/dashboard/home/home.component.css`

```css
.menu-user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-user-info strong {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-dark);
}

.menu-user-info small {
  font-size: 12px;
  color: var(--text-secondary);
  opacity: 0.9;
}

.menu-user-info .user-role {
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  color: white;
  display: inline-block;
  width: fit-content;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
```

**Visual da Badge:**
```
┌────────────────────┐
│  [ADMINISTRADOR]   │  ← Gradiente azul
│   Texto branco     │  ← Uppercase
│   Cantos redondos  │  ← Border-radius 12px
└────────────────────┘
```

**Características:**
- ✅ Gradiente azul (primary → accent)
- ✅ Texto branco em uppercase
- ✅ Padding ajustado (2px 8px)
- ✅ Border-radius arredondado
- ✅ Width fit-content (ajusta ao texto)
- ✅ Letter-spacing para melhor leitura

---

## 🔍 Como Funciona

### **Fluxo de Dados:**

```
1. Login
   ↓
2. Token JWT salvo no localStorage
   ↓
3. HomeComponent.ngOnInit()
   ↓
4. loadUserInfo()
   ↓
5. ApiService.getUserInfoFromToken()
   ↓
6. decodeToken() (jwt.helper)
   ↓
7. Extrai: { sub, email, authorities, name }
   ↓
8. Atualiza: userName, userEmail, userAuthorities
   ↓
9. Template exibe informações
   ↓
10. getUserRole() retorna role formatada
   ↓
11. Badge colorida exibida
```

---

## 📊 Estrutura do Token JWT

### **Payload Típico:**
```json
{
  "sub": "joao.silva@email.com",
  "email": "joao.silva@email.com",
  "name": "João Silva",
  "authorities": [
    "ROLE_ADMINISTRADOR",
    "ROLE_USER"
  ],
  "iat": 1697812345,
  "exp": 1697898745
}
```

### **Campos Utilizados:**

| Campo | Descrição | Uso |
|-------|-----------|-----|
| `sub` | Subject (username/email) | Username principal |
| `email` | Email do usuário | Email de exibição |
| `name` ou `nome` | Nome completo | Nome de exibição |
| `authorities` | Lista de roles | Determinar permissões e badge |
| `exp` | Expiração | Validação de sessão |
| `iat` | Issued at | Data de emissão |

---

## 🎨 Visual do Menu Usuário

### **Antes (Valores Fixos):**
```
┌─────────────────────────────┐
│  👤                         │
│  Usuário                    │  ❌ Hardcoded
│  usuario@email.com          │  ❌ Hardcoded
├─────────────────────────────┤
│  👤 Meu Perfil              │
│  ⚙️  Configurações          │
├─────────────────────────────┤
│  🚪 Sair                    │
└─────────────────────────────┘
```

### **Depois (Do Token JWT):**
```
┌─────────────────────────────┐
│  👤                         │
│  João Silva                 │  ✅ Do token (name)
│  joao.silva@email.com       │  ✅ Do token (email)
│  [ADMINISTRADOR]            │  ✅ Do token (authorities)
│   ↑ Gradiente azul          │
├─────────────────────────────┤
│  👤 Meu Perfil              │
│  ⚙️  Configurações          │
├─────────────────────────────┤
│  🚪 Sair                    │
└─────────────────────────────┘
```

---

## 🧪 Logs de Debug

### **Console ao Carregar:**
```
📊 Carregando informações do usuário do token...
🔍 Token decodificado: {
  sub: "joao.silva@email.com",
  email: "joao.silva@email.com",
  name: "João Silva",
  authorities: ["ROLE_ADMINISTRADOR"],
  iat: 1697812345,
  exp: 1697898745
}
✅ Informações extraídas do token: {
  username: "joao.silva@email.com",
  email: "joao.silva@email.com",
  authorities: ["ROLE_ADMINISTRADOR"],
  name: "João Silva"
}
👤 Nome do usuário: João Silva
📧 Email do usuário: joao.silva@email.com
🔐 Permissões: ["ROLE_ADMINISTRADOR"]
```

---

## 📋 Casos de Uso

### **1. Token Completo (Melhor Caso):**
```json
{
  "sub": "maria.santos@email.com",
  "email": "maria.santos@email.com",
  "name": "Maria Santos",
  "authorities": ["ROLE_PROFESSOR"]
}
```
**Resultado:**
- Nome: "Maria Santos"
- Email: "maria.santos@email.com"
- Badge: "PROFESSOR"

---

### **2. Token Sem Nome:**
```json
{
  "sub": "pedro.costa@email.com",
  "email": "pedro.costa@email.com",
  "authorities": ["ROLE_ALUNO"]
}
```
**Resultado:**
- Nome: "pedro.costa@email.com" (usa email)
- Email: "pedro.costa@email.com"
- Badge: "ALUNO"

---

### **3. Token Minimalista:**
```json
{
  "sub": "ana.paula@email.com",
  "authorities": ["ROLE_SECRETARIO"]
}
```
**Resultado:**
- Nome: "ana.paula@email.com" (usa sub)
- Email: "ana.paula@email.com" (usa sub)
- Badge: "SECRETÁRIO"

---

### **4. Múltiplas Roles (Prioridade):**
```json
{
  "sub": "carlos.admin@email.com",
  "name": "Carlos Admin",
  "authorities": [
    "ROLE_ADMINISTRADOR",
    "ROLE_GERENTE",
    "ROLE_PROFESSOR"
  ]
}
```
**Resultado:**
- Nome: "Carlos Admin"
- Email: "carlos.admin@email.com"
- Badge: "ADMINISTRADOR" (maior prioridade)

---

## ✅ Benefícios

### **1. Sem Chamadas à API:**
- ✅ Informações já estão no token
- ✅ Carregamento instantâneo
- ✅ Funciona offline (até expirar)
- ✅ Reduz latência

### **2. Segurança:**
- ✅ Token JWT assinado
- ✅ Não pode ser adulterado
- ✅ Expira automaticamente
- ✅ Validado no backend

### **3. Performance:**
- ✅ Zero requisições extras
- ✅ Decodificação local (rápida)
- ✅ Cache automático no localStorage

### **4. UX:**
- ✅ Informações aparecem imediatamente
- ✅ Badge visual para role
- ✅ Identifica o usuário claramente
- ✅ Profissional e moderno

---

## 🔧 Fallbacks e Tratamento de Erros

### **Token Inválido:**
```typescript
if (!token) {
  console.warn('⚠️ Nenhum token encontrado');
  return null;
}
```
**Resultado:** Exibe valores padrão

### **Decodificação Falha:**
```typescript
const decoded = decodeToken(token);
if (!decoded) {
  console.error('❌ Erro ao decodificar token');
  return null;
}
```
**Resultado:** Exibe valores padrão

### **Campos Faltando:**
```typescript
const name = decoded.name || decoded.nome || '';
const email = decoded.email || decoded.sub || '';
```
**Resultado:** Usa fallbacks em cascata

---

## 📝 Estrutura de Arquivos Modificados

```
src/
├── app/
│   ├── shared/
│   │   ├── api.service.ts                    ✅ Modificado
│   │   └── utils/
│   │       └── jwt.helper.ts                 ✅ Já existia
│   └── dashboard/
│       └── home/
│           ├── home.component.ts             ✅ Modificado
│           ├── home.component.html           ✅ Modificado
│           └── home.component.css            ✅ Modificado
└── docs/
    └── EXIBICAO_INFO_USUARIO_TOKEN.md        ✅ Novo
```

---

## 🎉 Resultado Final

### **Menu "Usuário Logado" Agora Exibe:**

✅ **Nome Real** do usuário (do token)  
✅ **Email** do usuário (do token)  
✅ **Role/Permissão** em badge colorida (do token)  
✅ **Sem chamadas à API** (instantâneo)  
✅ **Visual moderno** com gradiente azul  
✅ **Logs detalhados** para debug  

---

## 🚀 Como Testar

### **1. Fazer Login:**
```
1. Acesse /login
2. Digite credenciais válidas
3. Clique em "Entrar"
```

### **2. Verificar Menu:**
```
1. Vá para /dashboard
2. Clique no botão do usuário (topo direito)
3. Veja o menu dropdown abrir
4. Observe:
   ✅ Nome do usuário (real)
   ✅ Email do usuário (real)
   ✅ Badge com a role (colorida)
```

### **3. Verificar Console:**
```
📊 Carregando informações do usuário do token...
🔍 Token decodificado: {...}
✅ Informações extraídas do token: {...}
👤 Nome do usuário: [Nome Real]
📧 Email do usuário: [Email Real]
🔐 Permissões: [Array de Roles]
```

---

**Data de Implementação:** 20 de outubro de 2025  
**Arquivos Modificados:** 4 arquivos  
**Status:** ✅ **CONCLUÍDO**  
**Funcionalidade:** ✅ **FUNCIONANDO**

