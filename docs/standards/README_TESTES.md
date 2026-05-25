# 🧪 Testes Unitários - Tipos de Atividades

Este documento descreve os testes unitários implementados para os componentes relacionados a **Tipos de Atividades (Categorias)** e como executá-los.

## 📋 Arquivos de Teste

### 1. **ListaCategoriasComponent**
- **Arquivo**: `lista-categorias.component.spec.ts`
- **Testes**: 19 casos de teste
- **Cobertura**:
  - ✅ Inicialização do componente
  - ✅ Carregamento de dados paginados
  - ✅ Tratamento de erros
  - ✅ Filtros de busca
  - ✅ Navegação (criar/editar)
  - ✅ Exclusão com confirmação
  - ✅ Tratamento de erros específicos (403, 404, 409)
  - ✅ Paginação (mudança de página/tamanho)
  - ✅ Verificação de permissões (admin)
  - ✅ Exibição de mensagens

### 2. **FormCategoriaComponent**
- **Arquivo**: `form-categoria.component.spec.ts`
- **Testes**: 26 casos de teste
- **Cobertura**:
  - ✅ Inicialização do formulário
  - ✅ Validações (required, minLength, maxLength)
  - ✅ Modo de criação
  - ✅ Modo de edição (carregamento de dados)
  - ✅ Submissão do formulário
  - ✅ Criação com sucesso
  - ✅ Atualização com sucesso
  - ✅ Tratamento de erros (403, 404, 409, 500)
  - ✅ Cancelamento
  - ✅ Trimagem de espaços
  - ✅ Estados de loading/saving
  - ✅ Mensagens (success, error, info)

### 3. **CursosService (Categorias)**
- **Arquivo**: `cursos.service.spec.ts`
- **Testes**: 23 casos de teste
- **Cobertura**:
  - ✅ Busca paginada (GET /categorias)
  - ✅ Busca por ID (GET /categorias/{id})
  - ✅ Criação (POST /categorias)
  - ✅ Atualização (PUT /categorias/{id})
  - ✅ Exclusão (DELETE /categorias/{id})
  - ✅ Parâmetros de requisição HTTP
  - ✅ Logs de debug
  - ✅ Tratamento de erros (403, 404, 409)

## 🚀 Como Executar os Testes

### Pré-requisitos
```bash
# Certifique-se de que as dependências estão instaladas
npm install
```

### Executar Todos os Testes

```bash
# Executar todos os testes do projeto
npm test

# Ou usar o comando do Angular CLI
ng test
```

### Executar Testes Específicos

#### 1. **Testes de Tipos de Atividades**
```bash
# Executar apenas testes de categorias
ng test --include='**/cursos/**/*.spec.ts'
```

#### 2. **Teste do Componente de Listagem**
```bash
# Executar apenas testes do componente de listagem
ng test --include='**/lista-categorias.component.spec.ts'
```

#### 3. **Teste do Componente de Formulário**
```bash
# Executar apenas testes do formulário
ng test --include='**/form-categoria.component.spec.ts'
```

#### 4. **Teste do Serviço**
```bash
# Executar apenas testes do serviço
ng test --include='**/cursos.service.spec.ts'
```

### Executar Testes com Cobertura

```bash
# Executar testes e gerar relatório de cobertura
ng test --code-coverage

# Ou usar o script npm
npm run test:coverage
```

O relatório de cobertura será gerado em: `coverage/app-portifolium-frontend/index.html`

### Executar Testes em Modo Headless (CI/CD)

```bash
# Executar testes sem interface gráfica
ng test --watch=false --browsers=ChromeHeadless

# Ou para CI/CD
npm run test:ci
```

### Executar Testes com Watch (Desenvolvimento)

```bash
# Executar testes e observar mudanças
ng test --watch=true

# Padrão do npm test já executa com watch
npm test
```

## 📊 Estrutura dos Testes

### Padrão AAA (Arrange, Act, Assert)

Todos os testes seguem o padrão AAA:

```typescript
it('deve criar categoria com sucesso', () => {
  // Arrange (Preparar)
  const mockResponse = { id: 1, nome: 'Extensão' };
  cursosService.createCategory.and.returnValue(of(mockResponse));
  component.categoriaForm.patchValue({ nome: 'Extensão' });

  // Act (Agir)
  component.onSubmit();

  // Assert (Afirmar)
  expect(cursosService.createCategory).toHaveBeenCalledWith({ nome: 'Extensão' });
  expect(snackBar.open).toHaveBeenCalled();
});
```

### Mocks e Spies

Os testes utilizam **Jasmine Spies** para simular dependências:

```typescript
const cursosServiceSpy = jasmine.createSpyObj('CursosService', [
  'getAllCategoriesPaginado',
  'createCategory',
  'updateCategory',
  'deleteCategory'
]);
```

### HTTP Testing

Os testes do serviço utilizam **HttpTestingController**:

```typescript
const req = httpMock.expectOne(`${baseUrl}/categorias?page=0&size=10`);
expect(req.request.method).toBe('GET');
req.flush(mockData);
```

## 🎯 Casos de Teste Implementados

### ✅ Casos de Sucesso
- [x] Carregamento de dados paginados
- [x] Criação de categoria
- [x] Edição de categoria
- [x] Exclusão de categoria
- [x] Filtros e busca
- [x] Navegação entre páginas
- [x] Validações de formulário

### ⚠️ Casos de Erro
- [x] 403 - Sem permissão (ADMINISTRADOR)
- [x] 404 - Não encontrado
- [x] 409 - Conflito (nome duplicado, vínculos)
- [x] 500 - Erro interno do servidor
- [x] Erros de rede

### 🔒 Casos de Segurança
- [x] Verificação de permissões (isAdmin)
- [x] Proteção de rotas (adminGuard)
- [x] Botões ocultos para não-admin

## 📈 Métricas de Cobertura

Objetivos de cobertura para o projeto:

- **Statements**: ≥ 80%
- **Branches**: ≥ 75%
- **Functions**: ≥ 80%
- **Lines**: ≥ 80%

### Verificar Cobertura

Após executar `ng test --code-coverage`, abra o relatório:

```bash
# Windows
start coverage/app-portifolium-frontend/index.html

# Linux/Mac
open coverage/app-portifolium-frontend/index.html
```

## 🛠️ Ferramentas Utilizadas

- **Jasmine**: Framework de testes
- **Karma**: Test runner
- **Angular Testing Utilities**: TestBed, ComponentFixture
- **HttpClientTestingModule**: Testes HTTP
- **NoopAnimationsModule**: Desabilita animações nos testes

## 📝 Boas Práticas Implementadas

1. ✅ **Isolamento**: Cada teste é independente
2. ✅ **Mocks**: Dependências externas são simuladas
3. ✅ **Nomenclatura Clara**: Descrições descritivas dos testes
4. ✅ **Cobertura Completa**: Casos de sucesso e erro
5. ✅ **Performance**: Testes rápidos com mocks
6. ✅ **Manutenibilidade**: Código limpo e organizado

## 🐛 Debugging de Testes

### Executar Teste Específico

```typescript
// Usar 'fit' ao invés de 'it' para executar apenas um teste
fit('deve criar categoria com sucesso', () => {
  // ...
});
```

### Pular Teste

```typescript
// Usar 'xit' ao invés de 'it' para pular um teste
xit('teste a ser implementado', () => {
  // ...
});
```

### Ver Logs no Console

Os testes exibem logs úteis durante a execução. Verifique o console do navegador de testes (Karma).

## 📚 Recursos Adicionais

- [Angular Testing Guide](https://angular.io/guide/testing)
- [Jasmine Documentation](https://jasmine.github.io/)
- [Karma Configuration](https://karma-runner.github.io/latest/config/configuration-file.html)

## ✅ Checklist de Qualidade

Antes de fazer commit:

- [ ] Todos os testes estão passando
- [ ] Cobertura de código ≥ 80%
- [ ] Nenhum console.error nos testes
- [ ] Testes não dependem de ordem de execução
- [ ] Mocks estão corretamente configurados
- [ ] Nomenclatura dos testes é clara e descritiva

## 🎉 Resultado Esperado

Ao executar `npm test`, você deve ver:

```
✓ ListaCategoriasComponent
  ✓ deve criar o componente
  ✓ deve inicializar com valores padrão
  ✓ deve carregar categorias ao inicializar
  ✓ deve exibir mensagem de erro ao falhar no carregamento
  ✓ deve aplicar filtro corretamente
  ... (19 testes)

✓ FormCategoriaComponent
  ✓ deve criar o componente
  ✓ deve inicializar formulário com validações
  ✓ deve inicializar em modo de criação
  ✓ deve carregar categoria em modo de edição
  ... (26 testes)

✓ CursosService (Categorias)
  ✓ deve ser criado
  ✓ deve buscar categorias paginadas
  ✓ deve criar nova categoria
  ✓ deve atualizar categoria existente
  ... (23 testes)

Total: 68 testes executados ✅
Tempo: ~10s
```

---

**Desenvolvido com 💜 seguindo as melhores práticas de testes do Angular**

