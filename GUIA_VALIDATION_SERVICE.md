# ✅ Guia de Uso - ValidationService
## Portifólium - Serviço de Validação Compartilhado

**Versão:** 1.0  
**Última Atualização:** 2024

---

## 📋 Sumário

Este guia documenta o uso do `ValidationService`, serviço centralizado para validações e utilitários de formulários na aplicação Portifólium.

---

## 1. 🎯 Objetivo

O `ValidationService` centraliza:
- ✅ Métodos de validação de formulários
- ✅ Validadores customizados reutilizáveis
- ✅ Mensagens de erro padronizadas
- ✅ Utilitários de formatação

---

## 2. 📦 Importação

```typescript
import { ValidationService } from '../../shared/services/validation.service';

constructor(
  private validationService: ValidationService
) { }
```

---

## 3. 🚀 Uso Básico

### 3.1 Marcar Formulário como Touched

```typescript
onSubmit(): void {
  if (this.form.invalid) {
    this.validationService.markFormGroupTouched(this.form);
    return;
  }
  // Continuar com submit
}
```

### 3.2 Validar Formulário

```typescript
onSubmit(): void {
  if (!this.validationService.validateForm(this.form)) {
    return; // Formulário inválido, já foi marcado como touched
  }
  // Continuar com submit
}
```

### 3.3 Obter Mensagem de Erro

```html
<mat-error *ngIf="nome?.invalid && nome?.touched">
  {{ validationService.getErrorMessage(nome) }}
</mat-error>
```

---

## 4. ✅ Validadores Customizados

### 4.1 Validador de CPF

```typescript
import { Validators } from '@angular/forms';

this.form = this.fb.group({
  cpf: ['', [
    Validators.required,
    this.validationService.cpfValidator()
  ]]
});
```

### 4.2 Validador de Email

```typescript
this.form = this.fb.group({
  email: ['', [
    Validators.required,
    this.validationService.emailValidator()
  ]]
});
```

### 4.3 Validador de Tamanho de Texto

```typescript
this.form = this.fb.group({
  nome: ['', [
    Validators.required,
    this.validationService.textLengthValidator(3, 100)
  ]]
});
```

### 4.4 Validador de Campo Obrigatório Não Vazio

```typescript
this.form = this.fb.group({
  descricao: ['', [
    this.validationService.requiredNonEmptyValidator()
  ]]
});
```

### 4.5 Validador de Senha Forte

```typescript
this.form = this.fb.group({
  senha: ['', [
    Validators.required,
    this.validationService.strongPasswordValidator()
  ]]
});
```

**Requisitos da senha forte:**
- Mínimo 8 caracteres
- Pelo menos 1 letra maiúscula
- Pelo menos 1 letra minúscula
- Pelo menos 1 número
- Pelo menos 1 caractere especial

### 4.6 Validador de Confirmação de Senha

```typescript
this.form = this.fb.group({
  senha: ['', Validators.required],
  confirmarSenha: ['', [
    Validators.required,
    this.validationService.passwordMatchValidator('senha')
  ]]
});
```

### 4.7 Validador de URL

```typescript
this.form = this.fb.group({
  url: ['', [
    Validators.required,
    this.validationService.urlValidator()
  ]]
});
```

### 4.8 Validador de Número Positivo

```typescript
this.form = this.fb.group({
  quantidade: ['', [
    Validators.required,
    this.validationService.positiveNumberValidator()
  ]]
});
```

---

## 5. 🎨 Formatação

### 5.1 Formatar CPF

```typescript
onCPFInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/[^\d]/g, '');
  
  if (value.length <= 11) {
    value = this.validationService.formatCPF(value);
    input.value = value;
    this.form.get('cpf')?.setValue(value, { emitEvent: false });
  }
}
```

### 5.2 Formatar Telefone

```typescript
onPhoneInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/[^\d]/g, '');
  
  value = this.validationService.formatPhone(value);
  input.value = value;
  this.form.get('telefone')?.setValue(value, { emitEvent: false });
}
```

---

## 6. 📝 Exemplos Completos

### 6.1 Exemplo: Formulário com Validações

```typescript
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../shared/services/validation.service';

export class FormUsuarioComponent {
  usuarioForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService
  ) {
    this.usuarioForm = this.fb.group({
      nome: ['', [
        Validators.required,
        this.validationService.textLengthValidator(3, 100)
      ]],
      email: ['', [
        Validators.required,
        this.validationService.emailValidator()
      ]],
      cpf: ['', [
        Validators.required,
        this.validationService.cpfValidator()
      ]],
      senha: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });
  }

  onSubmit(): void {
    if (!this.validationService.validateForm(this.usuarioForm)) {
      return;
    }

    // Continuar com submit
    this.saveUsuario();
  }
}
```

### 6.2 Exemplo: Template com Mensagens de Erro

```html
<mat-form-field appearance="outline">
  <mat-label>Nome</mat-label>
  <input matInput formControlName="nome">
  <mat-error *ngIf="nome?.invalid && nome?.touched">
    {{ validationService.getErrorMessage(nome) }}
  </mat-error>
</mat-form-field>

<mat-form-field appearance="outline">
  <mat-label>CPF</mat-label>
  <input 
    matInput 
    formControlName="cpf"
    (input)="onCPFInput($event)"
    maxlength="14">
  <mat-error *ngIf="cpf?.invalid && cpf?.touched">
    {{ validationService.getErrorMessage(cpf) }}
  </mat-error>
</mat-form-field>
```

### 6.3 Exemplo: Formatação de CPF no Input

```typescript
onCPFInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/[^\d]/g, '');
  
  if (value.length <= 11) {
    value = this.validationService.formatCPF(value);
    input.value = value;
    this.usuarioForm.get('cpf')?.setValue(value, { emitEvent: false });
  } else {
    input.value = input.value.slice(0, 14); // Limita tamanho
  }
}

onCPFBlur(): void {
  const cpfControl = this.usuarioForm.get('cpf');
  if (cpfControl?.value) {
    const formatted = this.validationService.formatCPF(cpfControl.value);
    cpfControl.setValue(formatted);
  }
}
```

---

## 7. 🔄 Migração de Código Antigo

### Antes (Código Antigo):

```typescript
private markFormGroupTouched(formGroup: FormGroup): void {
  Object.keys(formGroup.controls).forEach(key => {
    const control = formGroup.get(key);
    control?.markAsTouched();
  });
}

onSubmit(): void {
  if (this.form.invalid) {
    this.markFormGroupTouched(this.form);
    return;
  }
  // ...
}
```

### Depois (Com ValidationService):

```typescript
// Remover método markFormGroupTouched() do componente
// Injetar ValidationService no construtor

constructor(
  private validationService: ValidationService
) { }

onSubmit(): void {
  if (!this.validationService.validateForm(this.form)) {
    return;
  }
  // ...
}
```

---

## 8. 📋 Métodos Disponíveis

| Método | Descrição | Retorno |
|--------|-----------|---------|
| `markFormGroupTouched()` | Marca todos os controles como touched | `void` |
| `markFormGroupUntouched()` | Marca todos os controles como untouched | `void` |
| `validateForm()` | Valida e marca como touched se inválido | `boolean` |
| `getErrorMessage()` | Obtém mensagem de erro padronizada | `string` |
| `cpfValidator()` | Validador de CPF | `ValidatorFn` |
| `emailValidator()` | Validador de email | `ValidatorFn` |
| `textLengthValidator()` | Validador de tamanho de texto | `ValidatorFn` |
| `requiredNonEmptyValidator()` | Validador obrigatório não vazio | `ValidatorFn` |
| `strongPasswordValidator()` | Validador de senha forte | `ValidatorFn` |
| `passwordMatchValidator()` | Validador de confirmação de senha | `ValidatorFn` |
| `urlValidator()` | Validador de URL | `ValidatorFn` |
| `positiveNumberValidator()` | Validador de número positivo | `ValidatorFn` |
| `formatCPF()` | Formata CPF | `string` |
| `unformatCPF()` | Remove formatação de CPF | `string` |
| `formatPhone()` | Formata telefone | `string` |
| `unformatPhone()` | Remove formatação de telefone | `string` |

---

## 9. ✅ Checklist de Uso

Antes de usar o ValidationService, verifique:

- [ ] `ValidationService` está injetado no construtor
- [ ] Usar `validateForm()` em vez de verificar `invalid` manualmente
- [ ] Usar `getErrorMessage()` para mensagens padronizadas
- [ ] Remover métodos `markFormGroupTouched()` duplicados dos componentes
- [ ] Usar validadores customizados quando apropriado

---

## 10. 🚫 Erros Comuns

### ❌ Não Fazer:

1. **Duplicar método markFormGroupTouched:**
```typescript
// ERRADO
private markFormGroupTouched(formGroup: FormGroup): void {
  // código duplicado
}

// CORRETO
this.validationService.markFormGroupTouched(this.form);
```

2. **Mensagens de erro hardcoded:**
```typescript
// ERRADO
<mat-error *ngIf="nome?.hasError('required')">
  Campo obrigatório
</mat-error>

// CORRETO
<mat-error *ngIf="nome?.invalid && nome?.touched">
  {{ validationService.getErrorMessage(nome) }}
</mat-error>
```

3. **Validação manual sem marcar touched:**
```typescript
// ERRADO
if (this.form.invalid) {
  return;
}

// CORRETO
if (!this.validationService.validateForm(this.form)) {
  return;
}
```

---

## 11. 🎯 Resumo Rápido

| Ação | Método | Exemplo |
|------|--------|---------|
| Validar formulário | `validateForm()` | `this.validationService.validateForm(this.form)` |
| Marcar touched | `markFormGroupTouched()` | `this.validationService.markFormGroupTouched(this.form)` |
| Mensagem de erro | `getErrorMessage()` | `this.validationService.getErrorMessage(control)` |
| Validador CPF | `cpfValidator()` | `this.validationService.cpfValidator()` |
| Formatar CPF | `formatCPF()` | `this.validationService.formatCPF(cpf)` |

---

**Última Revisão:** 2024  
**Mantido por:** Equipe de Desenvolvimento Portifólium

