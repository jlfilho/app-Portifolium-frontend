# 📨 Guia de Uso - MessageService
## Portifólium - Serviço Centralizado de Mensagens

**Versão:** 1.0  
**Última Atualização:** 2024

---

## 📋 Sumário

Este guia documenta o uso do `MessageService`, serviço centralizado para exibição de mensagens (snackbars) na aplicação Portifólium.

---

## 1. 🎯 Objetivo

O `MessageService` centraliza a exibição de mensagens, garantindo:
- ✅ Consistência visual
- ✅ Duração padronizada (4000ms)
- ✅ Posicionamento padronizado
- ✅ Tratamento automático de erros HTTP
- ✅ Mensagens de fallback padronizadas

---

## 2. 📦 Importação

```typescript
import { MessageService } from '../../shared/services/message.service';

constructor(
  private messageService: MessageService
) { }
```

---

## 3. 🚀 Uso Básico

### 3.1 Mensagem de Sucesso

```typescript
this.messageService.success('Operação realizada com sucesso!');
```

### 3.2 Mensagem de Erro

```typescript
this.messageService.error('Erro ao realizar operação');
```

### 3.3 Mensagem de Aviso

```typescript
this.messageService.warning('Atenção: Verifique os dados');
```

### 3.4 Mensagem Informativa

```typescript
this.messageService.info('Informação importante');
```

---

## 4. 🔧 Tratamento de Erros HTTP

### 4.1 Tratamento Automático

O `MessageService` extrai automaticamente mensagens de erros HTTP usando `extractApiMessage()`:

```typescript
this.service.getData().subscribe({
  next: (data) => {
    // Sucesso
    this.messageService.success('Dados carregados com sucesso!');
  },
  error: (error) => {
    // Tratamento automático - extrai mensagem da API
    this.messageService.handleError(error);
  }
});
```

### 4.2 Com Mensagem de Fallback Customizada

```typescript
this.service.getData().subscribe({
  error: (error) => {
    this.messageService.handleError(
      error,
      'Erro ao carregar dados. Tente novamente.'
    );
  }
});
```

---

## 5. ✅ Mensagens de Sucesso Padronizadas

Use mensagens pré-definidas para ações comuns:

```typescript
// Após salvar
this.messageService.successAction('saved');
// Exibe: "Dados salvos com sucesso!"

// Após criar
this.messageService.successAction('created');
// Exibe: "Registro criado com sucesso!"

// Após atualizar
this.messageService.successAction('updated');
// Exibe: "Registro atualizado com sucesso!"

// Após excluir
this.messageService.successAction('deleted');
// Exibe: "Registro excluído com sucesso!"

// Genérico
this.messageService.successAction('generic');
// Exibe: "Operação realizada com sucesso!"
```

---

## 6. ⚙️ Configuração Customizada

Você pode customizar duração e posicionamento:

```typescript
// Mensagem com duração customizada
this.messageService.success('Mensagem importante', {
  duration: 6000 // 6 segundos
});

// Mensagem com posicionamento customizado
this.messageService.error('Erro crítico', {
  horizontalPosition: 'center',
  verticalPosition: 'bottom',
  duration: 5000
});
```

---

## 7. 📝 Exemplos Completos

### 7.1 Exemplo: Salvar Dados

```typescript
saveCurso(): void {
  this.isSaving = true;
  
  this.cursosService.saveCurso(this.cursoForm.value).subscribe({
    next: () => {
      this.messageService.successAction('saved');
      this.isSaving = false;
      this.router.navigate(['/admin/cursos']);
    },
    error: (error) => {
      this.messageService.handleError(error, 'Erro ao salvar curso');
      this.isSaving = false;
    }
  });
}
```

### 7.2 Exemplo: Carregar Dados

```typescript
loadCursos(): void {
  this.isLoading = true;
  
  this.cursosService.getCursos().subscribe({
    next: (cursos) => {
      this.cursos = cursos;
      this.isLoading = false;
    },
    error: (error) => {
      this.messageService.handleError(error, 'Erro ao carregar cursos');
      this.isLoading = false;
    }
  });
}
```

### 7.3 Exemplo: Excluir com Confirmação

```typescript
deleteCurso(curso: Curso): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: {
      title: 'Excluir Curso',
      message: `Tem certeza que deseja excluir "${curso.nome}"?`
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.cursosService.deleteCurso(curso.id).subscribe({
        next: () => {
          this.messageService.successAction('deleted');
          this.loadCursos(); // Recarregar lista
        },
        error: (error) => {
          this.messageService.handleError(error, 'Erro ao excluir curso');
        }
      });
    }
  });
}
```

---

## 8. 🔄 Migração de Código Antigo

### Antes (Código Antigo):

```typescript
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

// Uso
this.showMessage('Sucesso!', 'success');
this.showMessage('Erro!', 'error');
```

### Depois (Com MessageService):

```typescript
// Remover método showMessage() do componente
// Injetar MessageService no construtor

constructor(
  private messageService: MessageService
) { }

// Uso
this.messageService.success('Sucesso!');
this.messageService.error('Erro!');
```

---

## 9. 📋 Mensagens de Fallback

O `MessageService` possui mensagens de fallback automáticas baseadas no status HTTP:

| Status | Mensagem |
|--------|----------|
| 0 | "Erro de conexão. Verifique sua internet." |
| 400 | "Dados inválidos. Verifique os campos do formulário." |
| 401 | "Você não tem permissão para realizar esta ação." |
| 403 | "Acesso negado." |
| 404 | "Recurso não encontrado." |
| 408 | "Tempo de espera esgotado. Tente novamente." |
| 500-504 | "Erro no servidor. Tente novamente mais tarde." |
| Outros | "Ocorreu um erro. Tente novamente." |

---

## 10. ✅ Checklist de Uso

Antes de usar o MessageService, verifique:

- [ ] `MessageService` está injetado no construtor
- [ ] Para erros HTTP, usar `handleError()` em vez de `error()`
- [ ] Para sucesso após ações, considerar `successAction()`
- [ ] Mensagens são claras e amigáveis ao usuário
- [ ] Não usar `snackBar.open()` diretamente

---

## 11. 🚫 Erros Comuns

### ❌ Não Fazer:

1. **Usar snackBar diretamente:**
```typescript
// ERRADO
this.snackBar.open('Mensagem', 'Fechar', { duration: 3000 });

// CORRETO
this.messageService.success('Mensagem');
```

2. **Não tratar erros HTTP:**
```typescript
// ERRADO
error: (error) => {
  this.messageService.error('Erro');
}

// CORRETO
error: (error) => {
  this.messageService.handleError(error);
}
```

3. **Mensagens técnicas demais:**
```typescript
// ERRADO
this.messageService.error(`HTTP ${error.status}: ${error.message}`);

// CORRETO
this.messageService.handleError(error, 'Erro ao realizar operação');
```

---

## 12. 🎯 Resumo Rápido

| Ação | Método | Exemplo |
|------|--------|---------|
| Sucesso | `success()` | `this.messageService.success('Salvo!')` |
| Erro | `error()` | `this.messageService.error('Erro!')` |
| Aviso | `warning()` | `this.messageService.warning('Atenção!')` |
| Info | `info()` | `this.messageService.info('Info')` |
| Erro HTTP | `handleError()` | `this.messageService.handleError(error)` |
| Sucesso ação | `successAction()` | `this.messageService.successAction('saved')` |

---

**Última Revisão:** 2024  
**Mantido por:** Equipe de Desenvolvimento Portifólium

