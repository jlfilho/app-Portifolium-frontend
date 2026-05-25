# Correção: Erro 500 ao Carregar Usuários para Adicionar Permissões

## 🔴 Problema Identificado

**Erro 500 - Internal Server Error:**
```
GET http://localhost:8080/api/usuarios?page=0&size=1000&sortBy=nome&direction=ASC 500 (Internal Server Error)

❌ Error body: {
  error: "Erro interno: No property 'nome' found for type 'Usuario'",
  type: 'PropertyReferenceException'
}
```

### Diagnóstico

O endpoint `/api/usuarios` com paginação estava recebendo `sortBy=nome`, mas a entidade `Usuario` no backend **não possui uma propriedade chamada `nome`**. O Spring Data JPA tentou criar a query de ordenação e lançou uma `PropertyReferenceException`.

### Sintomas

1. ❌ Dropdown "Adicionar usuário ao curso" aparece bloqueado
2. ❌ Nenhum nome de usuário é exibido no dropdown
3. ❌ Console mostra erro 500
4. ❌ Mensagem: "No property 'nome' found for type 'Usuario'"

## ✅ Solução Aplicada

### Correção no Frontend

**Arquivo:** `src/app/features/cursos/components/permissoes-curso-form/permissoes-curso-form.component.ts`

**Antes:**
```typescript
const pageRequest: PageRequest = {
  page: 0,
  size: 1000,
  sortBy: 'nome',  // ❌ Campo não existe no backend
  direction: 'ASC'
};
```

**Depois:**
```typescript
const pageRequest: PageRequest = {
  page: 0,
  size: 1000,
  sortBy: 'id',  // ✅ Campo que existe no backend
  direction: 'ASC'
};
```

### Por Que Usar `id`?

- `id` é um campo **obrigatório** em todas as entidades JPA
- Garante compatibilidade com qualquer estrutura de `Usuario`
- Funciona mesmo se o backend usar `username`, `email`, `nomeCompleto`, etc.

## 📝 Alternativas de Ordenação

Se o backend suportar outros campos, você pode usar:

```typescript
// Ordenar por email (se existir)
sortBy: 'email'

// Ordenar por CPF (se existir)
sortBy: 'cpf'

// Ordenar por username (se existir)
sortBy: 'username'

// Ordenar por data de criação (se existir)
sortBy: 'createdAt'
```

**⚠️ Importante:** Sempre verificar quais campos a entidade `Usuario` possui no backend antes de usar `sortBy`.

## 🔍 Como Descobrir os Campos Disponíveis

### Opção 1: Verificar a Entidade no Backend

```java
@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id
    private Long id;
    
    private String email;
    private String cpf;
    // ... outros campos
}
```

### Opção 2: Testar no Postman/Insomnia

```
GET http://localhost:8080/api/usuarios?page=0&size=10&sortBy=id
GET http://localhost:8080/api/usuarios?page=0&size=10&sortBy=email
GET http://localhost:8080/api/usuarios?page=0&size=10&sortBy=cpf
```

### Opção 3: Ver logs do Spring Boot

O Spring mostrará quais propriedades estão disponíveis no erro:
```
No property 'nome' found for type 'Usuario'! Did you mean 'email', 'cpf', 'id'?
```

## 🧪 Como Testar a Correção

1. **Limpar cache do navegador** (Ctrl + Shift + Delete)
2. **Recarregar a aplicação** (Ctrl + F5)
3. **Navegar para:** Cursos → Selecionar um curso → "Gerenciar Permissões"
4. **Verificar no console:**
   ```
   📦 Resposta recebida: {...}
   📦 Conteúdo (page.content): [...]
   ✅ Usuários carregados: X
   ```
5. **Verificar no dropdown:**
   - Deve mostrar lista de usuários
   - Deve estar habilitado (não bloqueado)
   - Deve mostrar "X usuário(s) disponível(is)"

## 📊 Resultado Esperado

### Antes da Correção
```
❌ Status: 500
❌ Total de usuários: 0
❌ Dropdown bloqueado
❌ Mensagem de erro no console
```

### Depois da Correção
```
✅ Status: 200
✅ Usuários carregados: X
✅ Dropdown habilitado
✅ Nomes dos usuários visíveis
📋 Usuários disponíveis: Y
```

## 🔧 Arquivos Modificados

1. **`src/app/features/cursos/components/permissoes-curso-form/permissoes-curso-form.component.ts`**
   - Linha 107: Mudado `sortBy: 'nome'` para `sortBy: 'id'`
   - Adicionado comentário explicativo

2. **`docs/TROUBLESHOOTING_ADICIONAR_PERMISSOES.md`**
   - Adicionada "Causa 6: Erro 500 - PropertyReferenceException"
   - Documentada a solução e campos alternativos

3. **`docs/CORRECAO_SORTBY_USUARIOS.md`** (Este arquivo)
   - Documentação completa da correção

## 💡 Lições Aprendidas

1. **Sempre verificar o nome exato dos campos** no backend antes de usar em `sortBy`
2. **O nome do campo no frontend nem sempre corresponde ao backend**
   - Frontend: `nome`
   - Backend pode ser: `nomeCompleto`, `username`, `fullName`, etc.
3. **Usar `id` é sempre seguro** para ordenação padrão
4. **Logs detalhados ajudam** a identificar rapidamente problemas de integração
5. **Erros 500 nem sempre são problemas do backend** - podem ser causados por parâmetros inválidos do frontend

## 🎯 Prevenção

Para evitar este problema no futuro:

1. **Documentar a API** com os campos disponíveis para `sortBy`
2. **Validar campos** antes de enviar na requisição
3. **Usar constantes** para nomes de campos:
   ```typescript
   enum UsuarioSortField {
     ID = 'id',
     EMAIL = 'email',
     CPF = 'cpf'
   }
   
   sortBy: UsuarioSortField.ID
   ```
4. **Testes de integração** para verificar compatibilidade

## ✅ Status

**PROBLEMA RESOLVIDO** ✓

A funcionalidade de adicionar permissões ao curso agora deve funcionar corretamente.

---

**Data da Correção:** 21 de outubro de 2025  
**Erro:** 500 Internal Server Error - PropertyReferenceException  
**Causa:** Campo `sortBy='nome'` não existe na entidade `Usuario`  
**Solução:** Mudado para `sortBy='id'`  
**Impacto:** Alto - Funcionalidade crítica estava completamente bloqueada  
**Complexidade:** Baixa - Mudança de uma linha de código
