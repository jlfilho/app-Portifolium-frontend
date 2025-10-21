# Troubleshooting: Adicionar Permissões ao Curso

## Problema Reportado

**Sintomas:**
- O dropdown "Adicionar usuário ao curso" não mostra nomes de usuários
- O dropdown aparece como bloqueado/desabilitado
- Não é possível selecionar usuários para adicionar ao curso

## Diagnóstico

### 1. Verificar Console do Navegador

Abra o console do navegador (F12) e procure por:

#### **Logs de Carregamento de Usuários:**
```
📦 Resposta recebida: {...}
📦 Conteúdo (page.content): [...]
📦 Total de elementos: X
✅ Usuários carregados: X
✅ Primeiro usuário: {...}
```

#### **Logs de Usuários Disponíveis:**
```
📋 Total de usuários: X
📋 Usuários com permissão: [...]
📋 Usuários disponíveis: X
```

### 2. Possíveis Causas

#### **Causa 1: Erro de Permissão (401/403)**
```
❌ ERRO ao carregar usuários:
❌ Status: 403
❌ StatusText: Forbidden
```

**Solução:**
- O usuário logado não tem permissão de ADMINISTRADOR
- O endpoint `/api/usuarios` requer `@PreAuthorize("hasRole('ADMINISTRADOR')")`
- Entre em contato com o administrador do sistema para obter as permissões necessárias

#### **Causa 2: Endpoint Não Encontrado (404)**
```
❌ Status: 404
❌ StatusText: Not Found
```

**Solução:**
- Verificar se o backend está rodando
- Verificar se a URL da API está correta em `environment.development.ts`
- Verificar se o endpoint `/api/usuarios` está implementado no backend

#### **Causa 3: Todos os Usuários Já Têm Acesso**
```
✅ Usuários carregados: 10
📋 Usuários disponíveis: 0
```

**Solução:**
- Todos os usuários do sistema já têm acesso a este curso
- Isso é normal e não é um erro
- O dropdown mostrará a mensagem: "Todos os usuários já têm acesso a este curso"

#### **Causa 4: Nenhum Usuário Cadastrado**
```
✅ Usuários carregados: 0
```

**Solução:**
- Não há usuários cadastrados no sistema
- Cadastre novos usuários antes de adicionar permissões

#### **Causa 5: Erro de Rede**
```
❌ Status: 0
❌ StatusText: Unknown Error
```

**Solução:**
- Verificar conexão com a internet
- Verificar se o backend está acessível
- Verificar CORS no backend

#### **Causa 6: Erro 500 - PropertyReferenceException (sortBy inválido)**
```
❌ Status: 500
❌ Error body: {error: "Erro interno: No property 'nome' found for type 'Usuario'"}
```

**Solução:**
- O backend não reconhece o campo `sortBy` usado na requisição
- **CORREÇÃO APLICADA:** Mudado de `sortBy: 'nome'` para `sortBy: 'id'`
- Se o erro persistir, verificar quais campos a entidade `Usuario` possui no backend
- Campos comuns: `id`, `email`, `cpf`, `username`

### 3. Mensagens de Hint no Dropdown

O componente agora mostra mensagens informativas:

| Situação | Mensagem | Cor |
|----------|----------|-----|
| Carregando | ⏳ Carregando usuários... | Padrão |
| Sem usuários (erro) | ⚠️ Nenhum usuário disponível. Verifique suas permissões... | Vermelho |
| Todos têm acesso | ✅ Todos os usuários já têm acesso a este curso | Verde |
| Usuários disponíveis | X usuário(s) disponível(is) | Padrão |

### 4. Estado do Dropdown

O dropdown fica **desabilitado** quando:
- `isAdding = true` (adicionando usuário)
- `isLoadingUsers = true` (carregando lista de usuários)
- `usuarios.length === 0` (nenhum usuário carregado)

### 5. Estrutura de Dados Esperada

#### **Resposta da API (`getAllUsersPaginado`):**
```json
{
  "content": [
    {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@email.com",
      "cpf": "123.456.789-00",
      "role": "ROLE_GERENTE",
      "cursos": []
    }
  ],
  "totalElements": 10,
  "totalPages": 1,
  "size": 1000,
  "number": 0
}
```

#### **Permissões do Curso:**
```json
[
  {
    "cursoId": 3,
    "usuarioId": 1,
    "usuarioNome": "João Silva",
    "permissao": "GERENTE"
  }
]
```

## Passos para Resolução

### Passo 1: Verificar Permissões do Usuário
```typescript
// No console do navegador:
localStorage.getItem('token')
// Decodificar o token em jwt.io para ver as roles
```

### Passo 2: Verificar Logs no Console
1. Abrir DevTools (F12)
2. Ir para aba "Console"
3. Navegar para "Gerenciar Permissões"
4. Observar os logs iniciados com 📦, ✅, ❌

### Passo 3: Verificar Requisição HTTP
1. Abrir DevTools (F12)
2. Ir para aba "Network"
3. Filtrar por "usuarios"
4. Verificar:
   - Status Code (200, 403, 404, etc.)
   - Request URL
   - Response Body

### Passo 4: Testar com Usuário Administrador
- Fazer login com um usuário que tenha role `ROLE_ADMINISTRADOR`
- Tentar acessar "Gerenciar Permissões" novamente

## Solução Temporária

Se o problema persistir e for crítico, uma solução temporária seria usar o endpoint não-paginado:

```typescript
// Em permissoes-curso-form.component.ts
loadUsers(): void {
  this.isLoadingUsers = true;
  
  // Usar o método deprecated temporariamente
  this.usuariosService.getAllUsers().subscribe({
    next: (usuarios) => {
      this.usuarios = Array.isArray(usuarios) ? usuarios : [];
      this.isLoadingUsers = false;
      console.log('✅ Usuários carregados:', this.usuarios.length);
    },
    error: (error) => {
      console.error('❌ Erro:', error);
      this.showMessage('Erro ao carregar usuários.', 'error');
      this.usuarios = [];
      this.isLoadingUsers = false;
    }
  });
}
```

**⚠️ Nota:** Esta é uma solução temporária. O método `getAllUsers()` está deprecated.

## Checklist de Verificação

- [ ] Console mostra logs de carregamento de usuários?
- [ ] Há erros 401/403 no console?
- [ ] O backend está rodando?
- [ ] O usuário logado é ADMINISTRADOR?
- [ ] A API está retornando dados na aba Network?
- [ ] O array `usuarios` tem elementos?
- [ ] O método `getAvailableUsers()` retorna usuários?
- [ ] O dropdown mostra alguma mensagem de hint?

## Informações de Debug

Para obter informações detalhadas, execute no console do navegador:

```javascript
// Verificar estado do componente
angular.getComponent(document.querySelector('acadmanage-permissoes-curso-form'))

// Ou verificar diretamente no console os logs que já estão implementados
```

## Contato para Suporte

Se nenhuma das soluções acima resolver o problema:
1. Copiar todos os logs do console (📦, ✅, ❌)
2. Tirar screenshot da aba Network mostrando a requisição `/api/usuarios`
3. Informar o role do usuário logado
4. Reportar ao desenvolvedor ou equipe de suporte
