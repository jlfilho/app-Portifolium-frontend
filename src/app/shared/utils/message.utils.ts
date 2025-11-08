import { HttpErrorResponse } from '@angular/common/http';

export function extractApiMessage(error: HttpErrorResponse | any): string | null {
  if (!error) return null;

  const primary = error instanceof HttpErrorResponse ? (error.error ?? error) : error;

  const isHttpFailure = (value: string) => value.toLowerCase().startsWith('http failure response');

  const sanitize = (value: unknown): string | null => {
    if (typeof value !== 'string') {
      return null;
    }
    const trimmed = value.trim();
    if (!trimmed || isHttpFailure(trimmed)) {
      return null;
    }
    return trimmed;
  };

  const fromErrorsArray = (input: any): string | null => {
    if (!Array.isArray(input)) return null;
    for (const entry of input) {
      const direct = sanitize(entry);
      if (direct) return direct;
      if (entry && typeof entry === 'object') {
        const nested = sanitize(entry.message) || sanitize(entry.mensagem) || sanitize(entry.detail) || sanitize(entry.detalhe) || sanitize(entry.descricao);
        if (nested) return nested;
      }
    }
    return null;
  };

  const tryExtractFromObject = (obj: any): string | null => {
    if (!obj || typeof obj !== 'object') return null;

    const direct = sanitize(obj.message) || sanitize(obj.mensagem) || sanitize(obj.detail) || sanitize(obj.detalhe) || sanitize(obj.descricao);
    if (direct) return direct;

    const fromErrors = fromErrorsArray(obj.errors) || fromErrorsArray(obj.erros) || fromErrorsArray(obj.mensagens);
    if (fromErrors) return fromErrors;

    if (obj.error && obj.error !== obj) {
      const nested = tryExtractFromObject(obj.error);
      if (nested) return nested;
    }

    return null;
  };

  const rootDirect = sanitize(primary);
  if (rootDirect) return rootDirect;

  const nestedFromRoot = tryExtractFromObject(primary);
  if (nestedFromRoot) return nestedFromRoot;

  const errorProperty = (primary as any)?.error;
  const errorPropertyDirect = sanitize(errorProperty);
  if (errorPropertyDirect) return errorPropertyDirect;

  if (errorProperty && typeof errorProperty === 'object') {
    const nestedFromErrorProp = tryExtractFromObject(errorProperty);
    if (nestedFromErrorProp) return nestedFromErrorProp;
  }

  const fallbackRoot = tryExtractFromObject(error);
  if (fallbackRoot) return fallbackRoot;

  return sanitize((error as any)?.message) || sanitize((error as any)?.mensagem) || null;
}
