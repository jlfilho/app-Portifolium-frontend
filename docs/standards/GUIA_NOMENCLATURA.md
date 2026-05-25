# 📝 Guia de Nomenclatura
## Portifólium - Padrões de Nomenclatura

**Versão:** 1.0  
**Última Atualização:** 2024

---

## 📋 Sumário

Este guia define os padrões de nomenclatura para métodos, variáveis, classes e outros elementos na aplicação Portifólium, garantindo consistência e facilidade de manutenção.

---

## 1. 🎯 Métodos

### 1.1 Métodos de Ação (CRUD)

**Padrão:** Verbo + Entidade (camelCase)

| Ação | Padrão | Exemplo |
|------|--------|---------|
| Carregar | `load*()` | `loadCursos()`, `loadUsuarios()`, `loadAtividades()` |
| Salvar | `save*()` | `saveCurso()`, `saveUsuario()` |
| Criar | `create*()` | `createAtividade()` |
| Atualizar | `update*()` | `updateCurso()` |
| Excluir | `delete*()` | `deleteUsuario()` |
| Buscar | `get*()` | `getCursoById()`, `getUsuario()` |
| Listar | `list*()` | `listCursos()` |

**Regras:**
- ✅ Sempre usar verbo no início
- ✅ Nome da entidade em singular para ações individuais
- ✅ Nome da entidade em plural para ações de lista

**Exemplos:**
```typescript
// ✅ Correto
loadCursos(): void { }
loadCurso(id: number): void { }
saveCurso(): void { }
deleteCurso(id: number): void { }

// ❌ Incorreto
fetchCursos(): void { }  // Usar loadCursos()
getCursos(): void { }     // Usar loadCursos() para listas
fetchData(): void { }     // Muito genérico
```

---

### 1.2 Métodos de Exibição

**Padrão:** `show*()` ou `display*()`

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Mensagens | `showMessage()` | `showMessage('Sucesso!', 'success')` |
| Diálogos | `showDialog()` | `showDialog(component)` |
| Snackbars | `showMessage()` | `showMessage()` (usar método unificado) |
| Notificações | `showNotification()` | `showNotification()` |

**Regras:**
- ✅ Sempre usar `showMessage()` para mensagens (snackbars)
- ✅ Não usar `showSnackBar()` ou `displayMessage()`
- ✅ Parâmetros: `showMessage(message: string, type: 'success' | 'error' | 'warning')`

**Exemplos:**
```typescript
// ✅ Correto
private showMessage(message: string, type: 'success' | 'error' | 'warning'): void {
  const panelClass = type === 'success' ? 'snackbar-success' :
                    type === 'error' ? 'snackbar-error' :
                    'snackbar-warning';
  
  this.snackBar.open(message, 'Fechar', {
    duration: 4000,
    horizontalPosition: 'end',
    verticalPosition: 'top',
    panelClass: [panelClass]
  });
}

// ❌ Incorreto
showSnackBar(message: string): void { }  // Usar showMessage()
displayMessage(message: string): void { } // Usar showMessage()
```

---

### 1.3 Métodos de Formulário

**Padrão:** `on*()` para eventos, `handle*()` para processamento

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Submit | `onSubmit()` | `onSubmit()` |
| Cancelar | `onCancel()` | `onCancel()` |
| Reset | `onReset()` | `onReset()` |
| Mudança | `on*Change()` | `onSearchChange()`, `onStatusChange()` |
| Seleção | `on*Select()` | `onUnidadeSelect()` |

**Regras:**
- ✅ Usar `on*()` para handlers de eventos do template
- ✅ Usar `handle*()` para lógica complexa de processamento
- ✅ Manter `onSubmit()` para submissão de formulários

**Exemplos:**
```typescript
// ✅ Correto
onSubmit(): void {
  if (this.form.valid) {
    this.saveCurso();
  }
}

onCancel(): void {
  this.router.navigate(['/admin/cursos']);
}

onSearchChange(term: string): void {
  this.searchTerm = term;
  this.loadCursos();
}

// ❌ Incorreto
submitForm(): void { }  // Usar onSubmit()
cancelForm(): void { }  // Usar onCancel()
```

---

### 1.4 Métodos de Navegação

**Padrão:** `navigateTo*()` ou `goTo*()`

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Navegar | `navigateTo*()` | `navigateToCursos()`, `navigateToEdit()` |
| Voltar | `goBack()` | `goBack()` |
| Redirecionar | `redirectTo*()` | `redirectToLogin()` |

**Exemplos:**
```typescript
// ✅ Correto
navigateToCursos(): void {
  this.router.navigate(['/admin/cursos']);
}

navigateToEdit(id: number): void {
  this.router.navigate(['/admin/cursos/editar', id]);
}

// ❌ Incorreto
goToCursos(): void { }  // Usar navigateToCursos()
```

---

## 2. 📦 Variáveis

### 2.1 Variáveis Booleanas

**Padrão:** `is*` ou `has*` (sempre começar com verbo)

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Estado | `is*` | `isLoading`, `isEditMode`, `isSaving` |
| Propriedade | `has*` | `hasError`, `hasData`, `hasPermission` |
| Condição | `can*` | `canEdit`, `canDelete` |

**Regras:**
- ✅ Sempre usar prefixo `is*`, `has*`, ou `can*`
- ✅ Não usar apenas `loading`, `saving`, `error`
- ✅ Usar camelCase

**Exemplos:**
```typescript
// ✅ Correto
isLoading: boolean = false;
isEditMode: boolean = false;
isSaving: boolean = false;
hasError: boolean = false;
hasData: boolean = false;
canEdit: boolean = false;

// ❌ Incorreto
loading: boolean = false;      // Usar isLoading
saving: boolean = false;       // Usar isSaving
error: boolean = false;        // Usar hasError
isLoadingData: boolean = false; // Redundante, usar isLoading
```

---

### 2.2 Variáveis de Erro

**Padrão:** `errorMessage` (sempre)

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Mensagem de erro | `errorMessage` | `errorMessage: string = ''` |
| Objeto de erro | `error` | `error: HttpErrorResponse` |

**Regras:**
- ✅ Sempre usar `errorMessage` para strings de erro
- ✅ Usar `error` apenas para objetos de erro (HttpErrorResponse)
- ✅ Não usar `errorMsg`, `errMessage`, `errorText`

**Exemplos:**
```typescript
// ✅ Correto
errorMessage: string = '';
error: HttpErrorResponse | null = null;

// ❌ Incorreto
errorMsg: string = '';      // Usar errorMessage
errMessage: string = '';    // Usar errorMessage
errorText: string = '';     // Usar errorMessage
```

---

### 2.3 Variáveis de Dados

**Padrão:** Nome da entidade em plural ou singular

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Lista | Plural | `cursos: Curso[]`, `usuarios: Usuario[]` |
| Item único | Singular | `curso: Curso`, `usuario: Usuario` |
| Dados temporários | `*Data` | `cursoData: Partial<Curso>` |

**Regras:**
- ✅ Usar plural para arrays
- ✅ Usar singular para objetos únicos
- ✅ Usar `*Data` para dados temporários ou parciais

**Exemplos:**
```typescript
// ✅ Correto
cursos: Curso[] = [];
curso: Curso | null = null;
cursoData: Partial<Curso> = {};

// ❌ Incorreto
cursoList: Curso[] = [];    // Usar cursos
cursoItem: Curso | null = null; // Usar curso
```

---

### 2.4 Variáveis de Estado de Formulário

**Padrão:** `*Form` para FormGroup, `*FormValue` para valores

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| FormGroup | `*Form` | `cursoForm: FormGroup`, `usuarioForm: FormGroup` |
| Valores | `*FormValue` | `cursoFormValue: Partial<Curso>` |

**Exemplos:**
```typescript
// ✅ Correto
cursoForm: FormGroup;
usuarioForm: FormGroup;

// ❌ Incorreto
form: FormGroup;           // Muito genérico
cursoFormGroup: FormGroup; // Redundante
```

---

## 3. 🏷️ Classes e Interfaces

### 3.1 Classes de Componente

**Padrão:** `*Component` (PascalCase)

**Exemplos:**
```typescript
// ✅ Correto
export class FormCursoComponent { }
export class ListaCursosComponent { }
export class CardsCursosComponent { }
```

---

### 3.2 Interfaces e Models

**Padrão:** PascalCase, sem sufixo obrigatório

**Exemplos:**
```typescript
// ✅ Correto
export interface Curso { }
export interface Usuario { }
export class CursoModel { }
```

---

### 3.3 Services

**Padrão:** `*Service` (PascalCase)

**Exemplos:**
```typescript
// ✅ Correto
export class CursosService { }
export class UsuariosService { }
```

---

## 4. 🎨 Classes CSS

### 4.1 Classes de Componente

**Padrão:** kebab-case, prefixo do componente

**Exemplos:**
```css
/* ✅ Correto */
.curso-card { }
.curso-header { }
.curso-content { }
.usuario-form { }
.usuario-list { }
```

---

### 4.2 Classes Utilitárias

**Padrão:** kebab-case, descritivo

**Exemplos:**
```css
/* ✅ Correto */
.btn-primary { }
.add-button { }
.loading-overlay { }
.error-message { }
```

---

## 5. 📋 Seletores de Componente

**Padrão:** `acadmanage-*` (kebab-case)

**Exemplos:**
```typescript
// ✅ Correto
@Component({
  selector: 'acadmanage-form-curso',
  // ...
})

@Component({
  selector: 'acadmanage-lista-cursos',
  // ...
})
```

---

## 6. ✅ Checklist de Validação

Antes de criar um método ou variável, verifique:

### Métodos:
- [ ] Nome começa com verbo (`load`, `save`, `show`, etc.)
- [ ] Nome é descritivo e específico
- [ ] Segue o padrão da categoria (ação, exibição, formulário)
- [ ] Não é genérico demais (`getData()` → `loadCursos()`)

### Variáveis:
- [ ] Booleanas começam com `is*`, `has*`, ou `can*`
- [ ] Variáveis de erro usam `errorMessage`
- [ ] Arrays usam plural (`cursos`, `usuarios`)
- [ ] Objetos únicos usam singular (`curso`, `usuario`)

### Classes CSS:
- [ ] Usa kebab-case
- [ ] Nome é descritivo
- [ ] Não usa nomes genéricos (`container`, `wrapper`)

---

## 7. 🚫 Erros Comuns

### ❌ Não Fazer:

1. **Métodos genéricos:**
```typescript
// ERRADO
getData(): void { }
fetchData(): void { }
loadData(): void { }

// CORRETO
loadCursos(): void { }
loadUsuarios(): void { }
```

2. **Variáveis booleanas sem prefixo:**
```typescript
// ERRADO
loading: boolean = false;
saving: boolean = false;

// CORRETO
isLoading: boolean = false;
isSaving: boolean = false;
```

3. **Mensagens inconsistentes:**
```typescript
// ERRADO
showSnackBar(message: string): void { }
displayMessage(message: string): void { }

// CORRETO
showMessage(message: string, type: 'success' | 'error' | 'warning'): void { }
```

4. **Variáveis de erro inconsistentes:**
```typescript
// ERRADO
errorMsg: string = '';
errMessage: string = '';

// CORRETO
errorMessage: string = '';
```

---

## 8. 📚 Exemplos Completos

### 8.1 Componente Completo

```typescript
export class FormCursoComponent implements OnInit {
  // Variáveis de estado
  isLoading: boolean = false;
  isSaving: boolean = false;
  isEditMode: boolean = false;
  errorMessage: string = '';
  
  // Dados
  curso: Curso | null = null;
  cursos: Curso[] = [];
  
  // Formulário
  cursoForm: FormGroup;
  
  constructor(
    private cursosService: CursosService,
    private snackBar: MatSnackBar
  ) { }
  
  ngOnInit(): void {
    this.loadCurso();
  }
  
  // Métodos de carregamento
  loadCurso(): void {
    this.isLoading = true;
    this.cursosService.getCursoById(this.cursoId).subscribe({
      next: (curso) => {
        this.curso = curso;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar curso';
        this.showMessage(this.errorMessage, 'error');
        this.isLoading = false;
      }
    });
  }
  
  // Métodos de ação
  saveCurso(): void {
    if (this.cursoForm.valid) {
      this.isSaving = true;
      this.cursosService.saveCurso(this.cursoForm.value).subscribe({
        next: () => {
          this.showMessage('Curso salvo com sucesso!', 'success');
          this.isSaving = false;
        },
        error: (error) => {
          this.errorMessage = 'Erro ao salvar curso';
          this.showMessage(this.errorMessage, 'error');
          this.isSaving = false;
        }
      });
    }
  }
  
  // Métodos de formulário
  onSubmit(): void {
    this.saveCurso();
  }
  
  onCancel(): void {
    this.router.navigate(['/admin/cursos']);
  }
  
  // Métodos de exibição
  private showMessage(message: string, type: 'success' | 'error' | 'warning'): void {
    const panelClass = type === 'success' ? 'snackbar-success' :
                      type === 'error' ? 'snackbar-error' :
                      'snackbar-warning';
    
    this.snackBar.open(message, 'Fechar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
}
```

---

## 9. 🎯 Resumo Rápido

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Carregar dados | `load*()` | `loadCursos()` |
| Salvar dados | `save*()` | `saveCurso()` |
| Exibir mensagem | `showMessage()` | `showMessage('Sucesso!', 'success')` |
| Submit formulário | `onSubmit()` | `onSubmit()` |
| Boolean | `is*` / `has*` | `isLoading`, `hasError` |
| Erro (string) | `errorMessage` | `errorMessage: string` |
| Lista | Plural | `cursos: Curso[]` |
| Item único | Singular | `curso: Curso` |
| FormGroup | `*Form` | `cursoForm: FormGroup` |

---

**Última Revisão:** 2024  
**Mantido por:** Equipe de Desenvolvimento Portifólium

