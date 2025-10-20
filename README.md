# 🎓 AcadManage Frontend

Sistema de gerenciamento acadêmico desenvolvido com **Angular 19** seguindo as melhores práticas e arquitetura moderna.

## 🚀 Características

- ✅ **100% Standalone Components** - Sem NgModules
- ⚡ **Lazy Loading** - Carregamento sob demanda
- 🔐 **HTTP Interceptor** - Autenticação automática
- 🎨 **Angular Material** - UI moderna e responsiva
- 🌐 **SSR (Server-Side Rendering)** - Melhor SEO e performance
- 📦 **Environment Configuration** - Configuração centralizada
- 🛡️ **TypeScript Strict Mode** - Maior segurança de tipos

## 📋 Pré-requisitos

- **Node.js** 18+ e npm
- Angular CLI 19+ (opcional, mas recomendado)

## 🔧 Instalação

```bash
# Instalar dependências
npm install

# Instalar Angular CLI globalmente (opcional)
npm install -g @angular/cli
```

## 💻 Servidor de Desenvolvimento

Para iniciar o servidor local de desenvolvimento:

```bash
npm start
# ou
ng serve
```

Acesse `http://localhost:4200/` no navegador. A aplicação recarrega automaticamente ao modificar os arquivos.

## 🏗️ Estrutura do Projeto

```
src/app/
├── auth/                    # Módulo de autenticação
│   └── login/
├── dashboard/               # Dashboard principal
│   ├── dashboard.routes.ts # Rotas do dashboard (lazy loading)
│   ├── home/               # Layout principal
│   └── graficos/           # Componente de gráficos
├── features/               # Features da aplicação
│   ├── cursos/            # Gestão de cursos
│   │   ├── cursos.routes.ts
│   │   ├── components/
│   │   └── services/
│   └── usuarios/          # Gestão de usuários
│       ├── usuarios.routes.ts
│       ├── components/
│       └── services/
├── shared/                # Recursos compartilhados
│   ├── interceptors/      # HTTP Interceptors
│   ├── api.service.ts     # Serviço de API
│   └── auth.guard.ts      # Guard de autenticação
└── environments/          # Configurações por ambiente
    ├── environment.ts
    └── environment.development.ts
```

## ⚙️ Configuração

### API URL

Configure a URL da API nos arquivos de environment:

**Desenvolvimento:** `src/environments/environment.development.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

**Produção:** `src/environments/environment.ts`
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.seudominio.com/api'
};
```

## 🔐 Autenticação

O projeto usa **JWT (JSON Web Token)** para autenticação. O token é automaticamente adicionado a todas as requisições HTTP através do `authInterceptor`.

**Não é necessário** adicionar headers manualmente nos services:

```typescript
// ✅ Correto - Token adicionado automaticamente
this.http.get(`${this.baseUrl}/cursos`);

// ❌ Não é mais necessário
const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
this.http.get(`${this.baseUrl}/cursos`, { headers });
```

## 📦 Build

### Build de Desenvolvimento
```bash
npm run build
```

### Build de Produção
```bash
ng build --configuration production
```

Os arquivos de build serão armazenados em `dist/`.

## 🧪 Testes

```bash
# Executar testes unitários
npm test

# Executar testes com coverage
ng test --code-coverage
```

## 🚀 Comandos Úteis

```bash
# Criar novo componente standalone
ng generate component nome-componente --standalone

# Criar novo serviço
ng generate service services/nome-servico

# Criar novo guard
ng generate guard guards/nome-guard --functional

# Servidor com watch mode
npm run watch
```

## 📚 Documentação Adicional

### **Documentação Completa:**
📁 **[Acesse a pasta `docs/`](./docs/)** - Toda a documentação técnica organizada

**Documentos principais:**
- 📖 **[INDEX.md](./docs/INDEX.md)** - Índice categorizado de toda a documentação
- 🔄 **[REFACTORING_SUMMARY.md](./docs/REFACTORING_SUMMARY.md)** - Resumo da refatoração
- 🎨 **[APLICACAO_PALETA_MINIMAL_TECH_LIGHT_PLUS.md](./docs/APLICACAO_PALETA_MINIMAL_TECH_LIGHT_PLUS.md)** - Paleta de cores atual
- 👥 **[IMPLEMENTACAO_USUARIOS_COMPLETA.md](./docs/IMPLEMENTACAO_USUARIOS_COMPLETA.md)** - Módulo de usuários
- 📚 **[FORM_CURSO_IMPLEMENTATION.md](./docs/FORM_CURSO_IMPLEMENTATION.md)** - Formulário de curso

### **Links Úteis:**
- 🔗 [Angular CLI Documentation](https://angular.dev/tools/cli)
- 🔗 [Angular Material Components](https://material.angular.io/components)

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

---

**Versão Angular:** 19.0.x  
**Última Atualização:** 2025
