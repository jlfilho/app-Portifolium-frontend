import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuditLog, AuditLogFilters, AuditAction } from '../models/audit-log.interface';
import { AuditLogPage } from '../models/page-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  private readonly baseUrl = `${environment.apiUrl}/audit-logs`;

  constructor(private http: HttpClient) {}

  /**
   * Lista todos os logs de auditoria (paginado)
   */
  getAllLogs(page: number = 0, size: number = 20, sort: string = 'timestamp,DESC'): Observable<AuditLogPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    return this.http.get<AuditLogPage>(this.baseUrl, { params });
  }

  /**
   * Logs por entidade (paginado)
   */
  getLogsByEntity(entityName: string, entityId: number, page: number = 0, size: number = 20): Observable<AuditLogPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<AuditLogPage>(
      `${this.baseUrl}/entity/${entityName}/${entityId}`,
      { params }
    );
  }

  /**
   * Histórico completo de uma entidade (sem paginação)
   */
  getHistoryByEntity(entityName: string, entityId: number): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(
      `${this.baseUrl}/entity/${entityName}/${entityId}/history`
    );
  }

  /**
   * Logs por usuário (paginado)
   */
  getLogsByUser(email: string, page: number = 0, size: number = 20): Observable<AuditLogPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<AuditLogPage>(
      `${this.baseUrl}/user/${encodeURIComponent(email)}`,
      { params }
    );
  }

  /**
   * Logs por ação (paginado)
   */
  getLogsByAction(action: AuditAction, page: number = 0, size: number = 20): Observable<AuditLogPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<AuditLogPage>(
      `${this.baseUrl}/action/${action}`,
      { params }
    );
  }

  /**
   * Logs por período (paginado)
   */
  getLogsByDateRange(
    startDate: Date,
    endDate: Date,
    page: number = 0,
    size: number = 20
  ): Observable<AuditLogPage> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString())
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<AuditLogPage>(
      `${this.baseUrl}/date-range`,
      { params }
    );
  }

  /**
   * Buscar logs com filtros
   */
  searchLogs(filters: AuditLogFilters): Observable<AuditLogPage> {
    let params = new HttpParams()
      .set('page', (filters.page || 0).toString())
      .set('size', (filters.size || 20).toString())
      .set('sort', filters.sort || 'timestamp,DESC');

    if (filters.entityName) {
      params = params.set('entityName', filters.entityName);
    }
    if (filters.entityId !== undefined) {
      params = params.set('entityId', filters.entityId.toString());
    }
    if (filters.userEmail) {
      params = params.set('userEmail', filters.userEmail);
    }
    if (filters.action) {
      params = params.set('action', filters.action);
    }
    if (filters.startDate) {
      params = params.set('startDate', filters.startDate.toISOString());
    }
    if (filters.endDate) {
      params = params.set('endDate', filters.endDate.toISOString());
    }

    return this.http.get<AuditLogPage>(this.baseUrl, { params });
  }
}

