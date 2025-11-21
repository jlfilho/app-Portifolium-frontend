import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  /**
   * Marca todos os controles de um FormGroup como touched
   * Útil para exibir erros de validação após tentativa de submit
   */
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      // Se o controle for um FormGroup aninhado, marcar recursivamente
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Marca todos os controles de um FormGroup como untouched
   * Útil para resetar estado de validação
   */
  markFormGroupUntouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsUntouched();

      if (control instanceof FormGroup) {
        this.markFormGroupUntouched(control);
      }
    });
  }

  /**
   * Verifica se o formulário tem erros e marca como touched
   * Retorna true se o formulário é inválido
   */
  validateForm(formGroup: FormGroup): boolean {
    if (formGroup.invalid) {
      this.markFormGroupTouched(formGroup);
      return false;
    }
    return true;
  }

  /**
   * Obtém mensagem de erro padronizada para um controle
   */
  getErrorMessage(control: AbstractControl | null): string {
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.errors['required']) {
      return 'Este campo é obrigatório';
    }

    if (control.errors['email']) {
      return 'E-mail inválido';
    }

    if (control.errors['minlength']) {
      const requiredLength = control.errors['minlength'].requiredLength;
      return `Mínimo de ${requiredLength} caracteres`;
    }

    if (control.errors['maxlength']) {
      const requiredLength = control.errors['maxlength'].requiredLength;
      return `Máximo de ${requiredLength} caracteres`;
    }

    if (control.errors['pattern']) {
      return 'Formato inválido';
    }

    if (control.errors['min']) {
      const min = control.errors['min'].min;
      return `Valor mínimo: ${min}`;
    }

    if (control.errors['max']) {
      const max = control.errors['max'].max;
      return `Valor máximo: ${max}`;
    }

    // Erro customizado
    if (control.errors['custom']) {
      return control.errors['custom'];
    }

    return 'Campo inválido';
  }

  /**
   * Validador customizado para CPF
   */
  cpfValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Se vazio, deixar required validator tratar
      }

      const cpf = control.value.replace(/[^\d]/g, ''); // Remove formatação

      if (cpf.length !== 11) {
        return { cpf: true };
      }

      // Verifica se todos os dígitos são iguais
      if (/^(\d)\1{10}$/.test(cpf)) {
        return { cpf: true };
      }

      // Validação dos dígitos verificadores
      let sum = 0;
      let remainder: number;

      // Valida primeiro dígito
      for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
      }
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(cpf.substring(9, 10))) {
        return { cpf: true };
      }

      // Valida segundo dígito
      sum = 0;
      for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
      }
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(cpf.substring(10, 11))) {
        return { cpf: true };
      }

      return null; // CPF válido
    };
  }

  /**
   * Validador customizado para email
   */
  emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Se vazio, deixar required validator tratar
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const isValid = emailRegex.test(control.value);

      return isValid ? null : { email: true };
    };
  }

  /**
   * Validador para campos de texto com tamanho mínimo e máximo
   */
  textLengthValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const value = control.value.trim();
      const length = value.length;

      if (min && length < min) {
        return { minlength: { requiredLength: min, actualLength: length } };
      }

      if (max && length > max) {
        return { maxlength: { requiredLength: max, actualLength: length } };
      }

      return null;
    };
  }

  /**
   * Validador para campos obrigatórios não vazios (trim)
   */
  requiredNonEmptyValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || control.value.trim() === '') {
        return { required: true };
      }
      return null;
    };
  }

  /**
   * Validador para senha forte
   */
  strongPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Se vazio, deixar required validator tratar
      }

      const value = control.value;
      const errors: ValidationErrors = {};

      if (value.length < 8) {
        errors['minlength'] = { requiredLength: 8, actualLength: value.length };
      }

      if (!/[A-Z]/.test(value)) {
        errors['uppercase'] = true;
      }

      if (!/[a-z]/.test(value)) {
        errors['lowercase'] = true;
      }

      if (!/[0-9]/.test(value)) {
        errors['number'] = true;
      }

      if (!/[^A-Za-z0-9]/.test(value)) {
        errors['special'] = true;
      }

      return Object.keys(errors).length > 0 ? errors : null;
    };
  }

  /**
   * Validador para confirmação de senha
   */
  passwordMatchValidator(passwordControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) {
        return null;
      }

      const password = control.parent.get(passwordControlName);
      const confirmPassword = control;

      if (!password || !confirmPassword) {
        return null;
      }

      if (password.value !== confirmPassword.value) {
        return { passwordMismatch: true };
      }

      return null;
    };
  }

  /**
   * Validador para URL
   */
  urlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      try {
        new URL(control.value);
        return null;
      } catch {
        return { url: true };
      }
    };
  }

  /**
   * Validador para número positivo
   */
  positiveNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const value = Number(control.value);
      if (isNaN(value) || value <= 0) {
        return { positiveNumber: true };
      }

      return null;
    };
  }

  /**
   * Formata CPF (000.000.000-00)
   */
  formatCPF(cpf: string): string {
    const numbers = cpf.replace(/[^\d]/g, '');
    if (numbers.length !== 11) {
      return cpf;
    }
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  /**
   * Remove formatação de CPF
   */
  unformatCPF(cpf: string): string {
    return cpf.replace(/[^\d]/g, '');
  }

  /**
   * Formata telefone (00) 00000-0000 ou (00) 0000-0000
   */
  formatPhone(phone: string): string {
    const numbers = phone.replace(/[^\d]/g, '');
    if (numbers.length === 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  }

  /**
   * Remove formatação de telefone
   */
  unformatPhone(phone: string): string {
    return phone.replace(/[^\d]/g, '');
  }
}

