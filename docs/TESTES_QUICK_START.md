# 🚀 Guia Rápido - Testes Unitários

## ⚡ Comandos Rápidos

### Executar Todos os Testes (com interface)
```bash
npm test
```

### Executar Todos os Testes (sem interface - mais rápido)
```bash
npm run test:headless
```

### Executar Testes com Relatório de Cobertura
```bash
npm run test:coverage
```

### Executar Apenas Testes de Tipos de Atividades
```bash
npm run test:categorias
```

### Executar em Modo CI/CD (para pipelines)
```bash
npm run test:ci
```

## 📊 Visualizar Relatório de Cobertura

Após executar `npm run test:coverage`:

**Windows:**
```bash
start coverage\app-portifolium-frontend\index.html
```

**Linux/Mac:**
```bash
open coverage/app-portifolium-frontend/index.html
```

**Ou navegue manualmente até:**
```
coverage/app-portifolium-frontend/index.html
```

## 📈 Resultado Esperado

```
✓ 68 testes executados com sucesso
✓ Cobertura > 80%
✓ Tempo de execução: ~10 segundos
```

## 🎯 Componentes Testados

### Tipos de Atividades (Categorias)

1. **ListaCategoriasComponent** - 19 testes
   - Carregamento paginado
   - Filtros e busca
   - CRUD (criar, editar, excluir)
   - Tratamento de erros
   - Permissões (admin)

2. **FormCategoriaComponent** - 26 testes
   - Validações de formulário
   - Modo criação/edição
   - Submissão e salvamento
   - Tratamento de erros
   - Estados de loading

3. **CursosService** - 23 testes
   - Requisições HTTP (GET, POST, PUT, DELETE)
   - Parâmetros de paginação
   - Tratamento de respostas
   - Tratamento de erros

## 🐛 Debug

### Executar Teste Específico

No arquivo `.spec.ts`, altere `it` para `fit`:

```typescript
fit('deve criar categoria com sucesso', () => {
  // Este teste será executado sozinho
});
```

### Pular Teste

No arquivo `.spec.ts`, altere `it` para `xit`:

```typescript
xit('teste temporariamente desabilitado', () => {
  // Este teste será pulado
});
```

## ✅ Verificação Rápida

Antes de fazer commit:

```bash
# 1. Executar todos os testes
npm run test:headless

# 2. Verificar cobertura
npm run test:coverage

# 3. Verificar se cobertura está > 80%
# Abrir o arquivo coverage/index.html
```

## 📝 Estrutura de Arquivos

```
src/app/features/cursos/
├── components/
│   ├── lista-categorias/
│   │   ├── lista-categorias.component.ts
│   │   └── lista-categorias.component.spec.ts ✅
│   └── form-categoria/
│       ├── form-categoria.component.ts
│       └── form-categoria.component.spec.ts ✅
└── services/
    ├── cursos.service.ts
    └── cursos.service.spec.ts ✅
```

## 🎨 Tipos de Testes

- ✅ **Unitários**: Testam componentes isoladamente
- ✅ **Integração**: Testam interação entre serviços
- ✅ **HTTP**: Testam requisições e respostas
- ✅ **Validações**: Testam formulários e regras de negócio
- ✅ **Erros**: Testam tratamento de exceções

## 📚 Recursos

- [Documentação Completa](src/app/features/cursos/components/README_TESTES.md)
- [Angular Testing Guide](https://angular.io/guide/testing)
- [Jasmine Documentation](https://jasmine.github.io/)

---

**Total**: 68 testes | **Cobertura**: >80% | **Tempo**: ~10s

