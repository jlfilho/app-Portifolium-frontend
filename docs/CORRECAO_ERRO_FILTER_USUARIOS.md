# Correção do Erro: TypeError: this.usuarios.filter is not a function

## Problema Identificado

**Erro:** `TypeError: this.usuarios.filter is not a function` em `permissoes-curso-form.component.ts:114:26`

**Causa Raiz:** O componente `PermissoesCursoFormComponent` estava usando o método `getAllUsers()` do `UsuariosService`, que está marcado como `@deprecated` e pode retornar dados inesperados ou falhar.

## Análise do Problema

1. **Método Deprecated:** O `getAllUsers()` está marcado como deprecated no `UsuariosService`
2. **Timing Issue:** O método `getAvailableUsers()` era chamado durante o template rendering antes de `loadUsers()` completar
3. **Tipo de Dados:** O método deprecated pode retornar dados não-array em caso de erro

## Solução Implementada

### 1. Substituição do Método Deprecated

**Antes:**
```typescript
this.usuariosService.getAllUsers().subscribe({
  next: (usuarios) => {
    this.usuarios = usuarios;
    // ...
  }
});
```

**Depois:**
```typescript
const pageRequest: PageRequest = {
  page: 0,
  size: 1000, // Buscar muitos usuários para o dropdown
  sortBy: 'nome',
  direction: 'ASC'
};

this.usuariosService.getAllUsersPaginado(pageRequest).subscribe({
  next: (page) => {
    this.usuarios = Array.isArray(page.content) ? page.content : [];
    // ...
  }
});
```

### 2. Proteção Contra Timing Issues

**Antes:**
```typescript
getAvailableUsers(): any[] {
  const usuariosComPermissao = this.permissoes.map(p => p.usuarioId);
  return this.usuarios.filter(u => !usuariosComPermissao.includes(u.id));
}
```

**Depois:**
```typescript
getAvailableUsers(): any[] {
  // Se ainda está carregando usuários, retornar array vazio
  if (this.isLoadingUsers) {
    return [];
  }
  
  // Verificar se this.usuarios é um array antes de usar filter
  if (!Array.isArray(this.usuarios)) {
    console.error('❌ this.usuarios não é um array!', this.usuarios);
    return [];
  }
  
  const usuariosComPermissao = this.permissoes.map(p => p.usuarioId);
  return this.usuarios.filter(u => !usuariosComPermissao.includes(u.id));
}
```

### 3. Melhorias na Interface

- Adicionado `mat-hint` para mostrar "Carregando usuários..." durante o carregamento
- Mantido o estado `isLoadingUsers` para controlar quando o dropdown está disponível

## Arquivos Modificados

1. **`src/app/features/cursos/components/permissoes-curso-form/permissoes-curso-form.component.ts`**
   - Substituído `getAllUsers()` por `getAllUsersPaginado()`
   - Adicionado import para `PageRequest`
   - Implementado proteção contra timing issues
   - Adicionado validação de tipo de dados

2. **`src/app/features/cursos/components/permissoes-curso-form/permissoes-curso-form.component.html`**
   - Adicionado `mat-hint` para feedback de carregamento

## Benefícios da Solução

1. **Estabilidade:** Usa método não-deprecated e mais confiável
2. **Performance:** Método paginado é mais eficiente
3. **Robustez:** Proteção contra timing issues e tipos de dados inesperados
4. **UX:** Feedback visual durante carregamento
5. **Manutenibilidade:** Código mais limpo e menos propenso a erros

## Teste da Solução

Para testar se a correção funcionou:

1. Navegar para "Cursos" → Selecionar um curso → "Gerenciar Permissões"
2. Verificar se o dropdown "Adicionar usuário ao curso" carrega corretamente
3. Verificar se não há erros no console do navegador
4. Verificar se a funcionalidade de adicionar usuários funciona

## Lições Aprendidas

1. **Sempre verificar métodos deprecated** antes de usar
2. **Implementar proteção contra timing issues** em métodos chamados pelo template
3. **Validar tipos de dados** antes de usar métodos de array
4. **Usar métodos paginados** para melhor performance e confiabilidade
