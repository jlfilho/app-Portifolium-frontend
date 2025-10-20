# 📝 Formulário de Cadastro de Curso

Componente standalone para cadastro e edição de cursos usando Angular Material.

## 🎨 Componentes Angular Material Utilizados

### Campos de Formulário
- **MatFormField** - Container para campos de entrada
- **MatInput** - Campos de texto e textarea
- **MatSelect** - Dropdown para seleção de categoria
- **MatDatepicker** - Seletor de datas (início e fim)
- **MatSlideToggle** - Toggle para ativar/desativar curso

### Visuais
- **MatCard** - Card principal do formulário
- **MatIcon** - Ícones em botões e campos
- **MatButton** - Botões de ação
- **MatTooltip** - Dicas de uso
- **MatProgressSpinner** - Loading indicator
- **MatSnackBar** - Notificações de sucesso/erro

## ✨ Funcionalidades

### ✅ Validações Implementadas

| Campo | Validações |
|-------|-----------|
| Nome | Obrigatório, mín. 3 caracteres, máx. 100 |
| Descrição | Obrigatório, mín. 10 caracteres, máx. 500 |
| Categoria | Obrigatório |
| Carga Horária | Obrigatório, mín. 1 hora, máx. 10000 |
| Data Início | Opcional |
| Data Fim | Opcional |
| Quantidade Alunos | Opcional, mín. 0 |
| Ativo | Toggle (padrão: true) |

### 🔄 Modos de Operação

#### Modo Criação
- Rota: `/cursos/novo`
- Formulário vazio com valores padrão
- Botão: "Cadastrar"

#### Modo Edição
- Rota: `/cursos/editar/:id`
- Formulário preenchido com dados existentes
- Botão: "Atualizar"

### 🎯 Ações Disponíveis

1. **Salvar** - Valida e envia dados ao backend
2. **Cancelar** - Retorna para listagem sem salvar
3. **Limpar** - Reseta o formulário para valores padrão

### 📱 Notificações

O componente usa `MatSnackBar` para feedback:
- ✅ **Sucesso** - Verde
- ❌ **Erro** - Vermelho  
- ⚠️ **Aviso** - Laranja

## 🎨 Design

### Paleta de Cores
- **Gradiente Principal**: `#667eea` → `#764ba2`
- **Ícones**: `#667eea`
- **Fundo Toggle**: `#f5f5f5`
- **Info Box**: `#e3f2fd` (border: `#2196f3`)

### Responsividade
- Desktop: 2 colunas para datas e campos relacionados
- Mobile: 1 coluna (empilhamento automático)

### Animações
- **Fade In**: Entrada suave do card
- **Hover**: Elevação de botões
- **Focus**: Escala de ícones ao focar campos

## 🔗 Integração

### Service
```typescript
CursosService
├── getAllCategories() - Carrega categorias
├── createCourse(data) - Cria novo curso
├── updateCourse(id, data) - Atualiza curso
└── getUserCourses() - Lista cursos (para edição)
```

### Rotas
```typescript
{
  path: 'cursos/novo',
  component: FormCursoComponent
},
{
  path: 'cursos/editar/:id',
  component: FormCursoComponent
}
```

## 📊 Modelo de Dados

```typescript
interface Curso {
  id?: number;
  nome: string;
  descricao: string;
  categoriaId: number;
  cargaHoraria: number;
  dataInicio?: Date;
  dataFim?: Date;
  ativo?: boolean;
  quantidadeAlunos?: number;
}
```

## 🚀 Como Usar

### Adicionar Novo Curso
```typescript
// No componente de listagem
addCourse() {
  this.router.navigate(['/cursos/novo']);
}
```

### Editar Curso
```typescript
editCourse(id: number) {
  this.router.navigate(['/cursos/editar', id]);
}
```

## 📝 Exemplo de Uso

```html
<!-- Navegação programática -->
<button (click)="router.navigate(['/cursos/novo'])">
  Novo Curso
</button>

<!-- Link direto -->
<a routerLink="/cursos/novo">Novo Curso</a>
```

## ✅ Checklist de Recursos

- [x] Formulário reativo com validações
- [x] Integração com Angular Material
- [x] Modo criação e edição
- [x] Loading states
- [x] Mensagens de feedback
- [x] Design responsivo
- [x] Ícones personalizados
- [x] Tooltips informativos
- [x] Animações suaves
- [x] Standalone component
- [x] TypeScript strict mode
- [x] Testes unitários básicos

## 🎓 Boas Práticas Aplicadas

1. **Standalone Component** - Sem dependência de NgModules
2. **Reactive Forms** - Validação robusta e reativa
3. **Type Safety** - Interfaces TypeScript definidas
4. **Separation of Concerns** - Lógica separada da apresentação
5. **User Feedback** - Loading, validações e notificações
6. **Accessibility** - Labels, hints e tooltips
7. **Responsive Design** - Mobile-first approach
8. **Reusabilidade** - Mesmo componente para criar e editar

## 🔧 Customização

### Adicionar Nova Validação
```typescript
// form-curso.component.ts
this.cursoForm = this.fb.group({
  nome: ['', [
    Validators.required,
    Validators.minLength(3),
    // Adicione aqui
    Validators.pattern(/^[a-zA-Z\s]+$/)
  ]]
});
```

### Modificar Cores
```css
/* form-curso.component.css */
mat-card-header {
  background: linear-gradient(135deg, #SEU_COR_1 0%, #SEU_COR_2 100%);
}
```

---

**Desenvolvido com** ❤️ **usando Angular 19 + Material Design**

