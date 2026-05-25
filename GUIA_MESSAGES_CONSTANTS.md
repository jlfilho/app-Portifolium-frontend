# 📨 Guia de Uso - Messages Constants
## Portifólium - Constantes de Mensagens Padronizadas

**Versão:** 1.0  
**Última Atualização:** 2024

---

## 📋 Sumário

Este guia documenta o uso das constantes de mensagens padronizadas (`messages.constants.ts`), garantindo consistência em todas as mensagens exibidas ao usuário.

---

## 1. 🎯 Objetivo

O arquivo `messages.constants.ts` centraliza todas as mensagens, garantindo:
- ✅ Consistência em toda a aplicação
- ✅ Facilidade de manutenção
- ✅ Facilidade de tradução futura
- ✅ Mensagens amigáveis ao usuário
- ✅ Padrão: `"{Entidade} {ação} com sucesso!"`

---

## 2. 📦 Importação

```typescript
import { 
  getSuccessMessage, 
  getErrorMessage,
  EntityType,
  ActionType,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  WARNING_MESSAGES,
  VALIDATION_MESSAGES,
  CONFIRM_MESSAGES,
  INFO_MESSAGES
} from '../../shared/constants/messages.constants';
```

---

## 3. 🚀 Uso Básico

### 3.1 Mensagens de Sucesso

```typescript
import { getSuccessMessage, EntityType, ActionType } from '../../shared/constants/messages.constants';
import { MessageService } from '../../shared/services/message.service';

constructor(private messageService: MessageService) { }

// Após criar um curso
this.messageService.successEntity('curso', 'created');
// Exibe: "Curso cadastrado com sucesso!"

// Após atualizar um usuário
this.messageService.successEntity('usuario', 'updated');
// Exibe: "Usuário atualizado com sucesso!"

// Após excluir uma atividade
this.messageService.successEntity('atividade', 'deleted');
// Exibe: "Atividade excluída com sucesso!"
```

### 3.2 Mensagens de Erro

```typescript
// Erro ao criar curso
this.messageService.errorEntity('curso', 'created');
// Exibe: "Erro ao cadastrar curso. Tente novamente."

// Erro ao atualizar usuário
this.messageService.errorEntity('usuario', 'updated');
// Exibe: "Erro ao atualizar usuário. Tente novamente."
```

### 3.3 Usando Helpers Diretamente

```typescript
import { getSuccessMessage, getErrorMessage } from '../../shared/constants/messages.constants';

const successMsg = getSuccessMessage('curso', 'created');
// Retorna: "Curso cadastrado com sucesso!"

const errorMsg = getErrorMessage('usuario', 'updated');
// Retorna: "Erro ao atualizar usuário. Tente novamente."
```

---

## 4. 📝 Entidades Disponíveis

| Entidade | Singular | Plural |
|----------|----------|--------|
| `curso` | Curso | Cursos |
| `usuario` | Usuário | Usuários |
| `atividade` | Atividade | Atividades |
| `pessoa` | Pessoa | Pessoas |
| `unidadeAcademica` | Unidade Acadêmica | Unidades Acadêmicas |
| `categoria` | Categoria | Categorias |
| `tipoCurso` | Tipo de Curso | Tipos de Curso |
| `tipoAtividade` | Tipo de Atividade | Tipos de Atividade |
| `perfil` | Perfil | Perfis |
| `senha` | Senha | Senhas |
| `evidencia` | Evidência | Evidências |
| `permissao` | Permissão | Permissões |

---

## 5. ✅ Ações Disponíveis

| Ação | Descrição | Exemplo de Mensagem |
|------|-----------|---------------------|
| `created` | Criar novo registro | "Curso cadastrado com sucesso!" |
| `updated` | Atualizar registro | "Curso atualizado com sucesso!" |
| `deleted` | Excluir registro | "Curso excluído com sucesso!" |
| `saved` | Salvar genérico | "Curso salvo com sucesso!" |
| `loaded` | Carregar dados | "Cursos carregados com sucesso!" |
| `published` | Publicar | "Curso publicado com sucesso!" |
| `unpublished` | Despublicar | "Curso despublicado com sucesso!" |

---

## 6. 📋 Exemplos Completos

### 6.1 Exemplo: Salvar Curso

```typescript
import { MessageService } from '../../shared/services/message.service';

constructor(private messageService: MessageService) { }

saveCurso(): void {
  this.isSaving = true;
  
  this.cursosService.saveCurso(this.cursoForm.value).subscribe({
    next: () => {
      this.messageService.successEntity('curso', this.isEditMode ? 'updated' : 'created');
      this.isSaving = false;
      this.router.navigate(['/admin/cursos']);
    },
    error: (error) => {
      this.messageService.handleError(error, this.messageService.errorEntity('curso', this.isEditMode ? 'updated' : 'created'));
      this.isSaving = false;
    }
  });
}
```

### 6.2 Exemplo: Excluir Usuário

```typescript
deleteUsuario(usuario: Usuario): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: {
      title: 'Excluir Usuário',
      message: CONFIRM_MESSAGES.delete('usuario', usuario.nome),
      confirmText: 'Sim, Excluir',
      cancelText: 'Cancelar'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.usuariosService.deleteUsuario(usuario.id).subscribe({
        next: () => {
          this.messageService.successEntity('usuario', 'deleted');
          this.loadUsuarios();
        },
        error: (error) => {
          this.messageService.handleError(error);
        }
      });
    }
  });
}
```

### 6.3 Exemplo: Mensagens de Validação

```typescript
import { VALIDATION_MESSAGES } from '../../shared/constants/messages.constants';

// No template
<mat-error *ngIf="nome?.hasError('required')">
  {{ VALIDATION_MESSAGES.required('Nome') }}
</mat-error>

<mat-error *ngIf="email?.hasError('email')">
  {{ VALIDATION_MESSAGES.email('E-mail') }}
</mat-error>

<mat-error *ngIf="cpf?.hasError('cpf')">
  {{ VALIDATION_MESSAGES.cpf }}
</mat-error>
```

### 6.4 Exemplo: Mensagens de Aviso

```typescript
import { WARNING_MESSAGES } from '../../shared/constants/messages.constants';

onSubmit(): void {
  if (this.form.invalid) {
    this.messageService.warning(WARNING_MESSAGES.requiredFields);
    this.validationService.markFormGroupTouched(this.form);
    return;
  }
  // ...
}
```

---

## 7. 🔄 Migração de Código Antigo

### Antes (Código Antigo):

```typescript
this.showMessage('Curso cadastrado com sucesso!', 'success');
this.showMessage('Erro ao salvar curso', 'error');
this.showMessage('Usuário atualizado com sucesso!', 'success');
```

### Depois (Com Constants):

```typescript
// Usando MessageService com constants
this.messageService.successEntity('curso', 'created');
this.messageService.errorEntity('curso', 'created');
this.messageService.successEntity('usuario', 'updated');
```

---

## 8. 📊 Estrutura das Constantes

### 8.1 SUCCESS_MESSAGES

```typescript
SUCCESS_MESSAGES.created('curso')    // "Curso cadastrado com sucesso!"
SUCCESS_MESSAGES.updated('usuario')  // "Usuário atualizado com sucesso!"
SUCCESS_MESSAGES.deleted('atividade') // "Atividade excluída com sucesso!"
SUCCESS_MESSAGES.generic.operation   // "Operação realizada com sucesso!"
```

### 8.2 ERROR_MESSAGES

```typescript
ERROR_MESSAGES.createFailed('curso')  // "Erro ao cadastrar curso. Tente novamente."
ERROR_MESSAGES.updateFailed('usuario') // "Erro ao atualizar usuário. Tente novamente."
ERROR_MESSAGES.notFound('atividade')   // "Atividade não encontrada."
ERROR_MESSAGES.byStatus[404]           // "Recurso não encontrado."
```

### 8.3 WARNING_MESSAGES

```typescript
WARNING_MESSAGES.requiredFields      // "Por favor, preencha todos os campos obrigatórios."
WARNING_MESSAGES.unsavedChanges      // "Você tem alterações não salvas. Deseja continuar?"
```

### 8.4 VALIDATION_MESSAGES

```typescript
VALIDATION_MESSAGES.required('Nome')           // "Nome é obrigatório(a)."
VALIDATION_MESSAGES.email('E-mail')             // "E-mail deve ser um e-mail válido."
VALIDATION_MESSAGES.minLength(3, 'Nome')       // "Nome deve ter no mínimo 3 caracteres."
VALIDATION_MESSAGES.cpf                        // "CPF inválido. Use o formato: 000.000.000-00"
```

### 8.5 CONFIRM_MESSAGES

```typescript
CONFIRM_MESSAGES.delete('usuario', 'João Silva') 
// "Tem certeza que deseja excluir usuário "João Silva"? Esta ação não pode ser desfeita."

CONFIRM_MESSAGES.publish('atividade')
// "Deseja publicar esta atividade?"
```

### 8.6 INFO_MESSAGES

```typescript
INFO_MESSAGES.loading              // "Carregando..."
INFO_MESSAGES.saving               // "Salvando..."
INFO_MESSAGES.noData('curso')      // "Nenhum(a) cursos encontrado(a)."
```

---

## 9. ✅ Checklist de Uso

Antes de criar uma mensagem, verifique:

- [ ] Usar constantes de `messages.constants.ts` quando possível
- [ ] Usar `MessageService.successEntity()` para sucesso
- [ ] Usar `MessageService.errorEntity()` para erros
- [ ] Mensagens são amigáveis (sem detalhes técnicos)
- [ ] Formato: `"{Entidade} {ação} com sucesso!"`
- [ ] Não hardcodar mensagens nos componentes

---

## 10. 🚫 Erros Comuns

### ❌ Não Fazer:

1. **Mensagens hardcoded:**
```typescript
// ERRADO
this.messageService.success('Curso salvo com sucesso!');

// CORRETO
this.messageService.successEntity('curso', 'created');
```

2. **Mensagens técnicas:**
```typescript
// ERRADO
this.messageService.error(`HTTP ${error.status}: ${error.message}`);

// CORRETO
this.messageService.handleError(error);
```

3. **Mensagens inconsistentes:**
```typescript
// ERRADO
this.messageService.success('Dados salvos com sucesso');
this.messageService.success('Operação realizada com sucesso!');

// CORRETO
this.messageService.successEntity('curso', 'saved');
```

---

## 11. 🎯 Resumo Rápido

| Ação | Método | Exemplo |
|------|--------|---------|
| Sucesso criar | `successEntity('curso', 'created')` | "Curso cadastrado com sucesso!" |
| Sucesso atualizar | `successEntity('usuario', 'updated')` | "Usuário atualizado com sucesso!" |
| Sucesso excluir | `successEntity('atividade', 'deleted')` | "Atividade excluída com sucesso!" |
| Erro criar | `errorEntity('curso', 'created')` | "Erro ao cadastrar curso. Tente novamente." |
| Erro atualizar | `errorEntity('usuario', 'updated')` | "Erro ao atualizar usuário. Tente novamente." |

---

**Última Revisão:** 2024  
**Mantido por:** Equipe de Desenvolvimento Portifólium

