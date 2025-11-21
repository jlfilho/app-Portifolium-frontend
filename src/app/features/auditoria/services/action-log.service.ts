import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ActionLog, ActionLogFilters, ActionType } from '../models/action-log.interface';
import { ActionLogPage } from '../models/page-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ActionLogService {
  private readonly baseUrl = `${environment.apiUrl}/action-logs`;

  constructor(private http: HttpClient) {}

  /**
   * Lista todos os logs de ação (paginado)
   */
  getAllLogs(page: number = 0, size: number = 20, sort: string = 'timestamp,DESC'): Observable<ActionLogPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    return this.http.get<ActionLogPage>(this.baseUrl, { params });
  }

  /**
   * Logs por usuário (paginado)
   */
  getLogsByUser(email: string, page: number = 0, size: number = 20): Observable<ActionLogPage> {
    const params = new HttpParams()
      .set('userEmail', email)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ActionLogPage>(this.baseUrl, { params });
  }

  /**
   * Logs por tipo de ação (paginado)
   */
  getLogsByType(actionType: ActionType, page: number = 0, size: number = 20): Observable<ActionLogPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ActionLogPage>(
      `${this.baseUrl}/type/${actionType}`,
      { params }
    );
  }

  /**
   * Logs por sucesso/falha (paginado)
   */
  getLogsBySuccess(success: boolean, page: number = 0, size: number = 20): Observable<ActionLogPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ActionLogPage>(
      `${this.baseUrl}/success/${success}`,
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
  ): Observable<ActionLogPage> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString())
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ActionLogPage>(
      `${this.baseUrl}/date-range`,
      { params }
    );
  }

  /**
   * Buscar logs com filtros
   */
  searchLogs(filters: ActionLogFilters): Observable<ActionLogPage> {
    let params = new HttpParams()
      .set('page', (filters.page || 0).toString())
      .set('size', (filters.size || 20).toString())
      .set('sort', filters.sort || 'timestamp,DESC');

    if (filters.userEmail) {
      params = params.set('userEmail', filters.userEmail);
    }
    if (filters.actionType) {
      params = params.set('actionType', filters.actionType);
    }
    if (filters.success !== undefined) {
      params = params.set('success', filters.success.toString());
    }
    if (filters.startDate) {
      params = params.set('startDate', filters.startDate.toISOString());
    }
    if (filters.endDate) {
      params = params.set('endDate', filters.endDate.toISOString());
    }

    return this.http.get<ActionLogPage>(this.baseUrl, { params });
  }
}

