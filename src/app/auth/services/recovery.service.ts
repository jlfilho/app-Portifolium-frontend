import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';

export interface GenerateRecoveryCodeRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  recoveryCode: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecoveryService {
  private baseUrl = `${environment.apiUrl}/recovery`;

  constructor(private http: HttpClient) {}

  /**
   * POST /api/recovery/generate?email=usuario@example.com
   * Gera código de recuperação e envia por email
   * 
   * Respostas:
   * - 200 OK: "Código de recuperação enviado para o email."
   * - 400 Bad Request: "Email é obrigatório"
   * - 401 Unauthorized: {"error": "Sessão inválida: usuário não encontrado."}
   * - 503 Service Unavailable: {"error": "Erro ao enviar e-mail", "message": "...", "status": "SERVICE_UNAVAILABLE"}
   */
  generateRecoveryCode(email: string): Observable<string> {
    const params = new HttpParams().set('email', email);
    
    console.log('📧 Solicitando código de recuperação para:', email);
    console.log('📡 URL:', `${this.baseUrl}/generate`);
    console.log('📡 Params:', params.toString());
    
    return this.http.post(`${this.baseUrl}/generate`, null, { 
      params,
      responseType: 'text'
    }).pipe(
      tap((response: string) => {
        console.log('✅ Código de recuperação solicitado com sucesso');
        console.log('📊 Resposta:', response);
      })
    );
  }

  /**
   * POST /api/recovery/reset-password
   * Redefine a senha usando o código de recuperação
   * 
   * Aceita query parameters OU body JSON
   * 
   * Respostas:
   * - 200 OK: "Senha redefinida com sucesso"
   * - 400 Bad Request: "Email, código de recuperação e nova senha são obrigatórios"
   * - 403 Forbidden: {"error": "Código de recuperação inválido ou expirado"} ou {"error": "Usuário com email ... não encontrado"}
   */
  resetPassword(email: string, recoveryCode: string, newPassword: string): Observable<string> {
    // Usar query parameters conforme documentação
    const params = new HttpParams()
      .set('email', email)
      .set('recoveryCode', recoveryCode)
      .set('newPassword', newPassword);
    
    console.log('🔐 Redefinindo senha para:', email);
    console.log('📡 URL:', `${this.baseUrl}/reset-password`);
    console.log('📡 Params:', params.toString());
    
    return this.http.post(`${this.baseUrl}/reset-password`, null, { 
      params,
      responseType: 'text'
    }).pipe(
      tap((response: string) => {
        console.log('✅ Senha redefinida com sucesso');
        console.log('📊 Resposta:', response);
      })
    );
  }
}

