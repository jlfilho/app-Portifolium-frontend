import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../environments/environment';
import { ActionLogFilter, AuditLogFilter } from '../models/log-filter.model';

@Injectable({
  providedIn: 'root'
})
export class LogExportService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  exportAuditLogs(filter: AuditLogFilter): Observable<Blob> {
    const params = this.buildAuditParams(filter);
    return this.http
      .get(`${this.apiUrl}/audit-logs/export/csv`, {
        params,
        observe: 'response',
        responseType: 'blob'
      })
      .pipe(map(response => this.handleDownload(response, 'audit-logs.csv')));
  }

  exportActionLogs(filter: ActionLogFilter): Observable<Blob> {
    const params = this.buildActionParams(filter);
    return this.http
      .get(`${this.apiUrl}/action-logs/export/csv`, {
        params,
        observe: 'response',
        responseType: 'blob'
      })
      .pipe(map(response => this.handleDownload(response, 'action-logs.csv')));
  }

  private buildAuditParams(filter: AuditLogFilter): HttpParams {
    let params = new HttpParams();
    if (filter.userEmail) params = params.set('userEmail', filter.userEmail);
    if (filter.action) params = params.set('action', filter.action);
    if (filter.entityName) params = params.set('entityName', filter.entityName);
    if (filter.entityId !== undefined && filter.entityId !== null) {
      params = params.set('entityId', filter.entityId.toString());
    }
    if (filter.startDate) params = params.set('startDate', filter.startDate);
    if (filter.endDate) params = params.set('endDate', filter.endDate);
    return params;
  }

  private buildActionParams(filter: ActionLogFilter): HttpParams {
    let params = new HttpParams();
    if (filter.userEmail) params = params.set('userEmail', filter.userEmail);
    if (filter.actionType) params = params.set('actionType', filter.actionType);
    if (filter.success !== undefined && filter.success !== null) {
      params = params.set('success', String(filter.success));
    }
    if (filter.startDate) params = params.set('startDate', filter.startDate);
    if (filter.endDate) params = params.set('endDate', filter.endDate);
    return params;
  }

  private handleDownload(
    response: HttpResponse<Blob>,
    fallbackFilename: string
  ): Blob {
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = fallbackFilename;

    if (contentDisposition) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
      if (matches?.[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }

    const blob = response.body ?? new Blob();
    this.downloadFile(blob, filename);
    return blob;
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

